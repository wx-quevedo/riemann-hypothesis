import { useCallback, useEffect, useRef, useState } from 'react'
import {
  CRITICAL_LINE_COLOR,
  INITIAL_VIEW,
  distance,
  inView,
  isotropicViewForSize,
  panViewByPixels,
  pinchZoomFactor,
  planeToScreen,
  screenToPlane,
  zoomViewAt,
  type View,
} from '../../lib/domainColoring'
import { cAbs, cx, zetaComplex } from '../../lib/zetaComplex'
import { firstZeros } from '../../lib/zeros'

// Pocos términos en el shader: basta para VER los ceros como vórtices; la velocidad manda
// (ver límite documentado en zetaComplex.ts). Las posiciones exactas vienen de zeros.json.
const SHADER_TERMS = 200
const CURSOR_TERMS = 400 // para el |ζ| aproximado del lector de cursor (rápido)
const ZERO_MARKERS = firstZeros(40) // marcamos hasta 40; solo se dibujan los visibles

const VERT_SRC = `
attribute vec2 aPos;
varying vec2 vUv;
void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }
`

const FRAG_SRC = `
precision highp float;
varying vec2 vUv;
uniform vec4 uBounds; // sigmaMin, sigmaMax, tMin, tMax
#define NTERMS ${SHADER_TERMS}
vec2 cdiv(vec2 a, vec2 b){ float d = dot(b, b); return vec2(a.x*b.x + a.y*b.y, a.y*b.x - a.x*b.y) / d; }
vec2 cexp(vec2 z){ float e = exp(z.x); return vec2(e*cos(z.y), e*sin(z.y)); }
vec3 hsv2rgb(vec3 c){
  vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
void main(){
  float sigma = mix(uBounds.x, uBounds.y, vUv.x);
  float t = mix(uBounds.z, uBounds.w, vUv.y);
  // eta(s) = sum_{n=1}^{N} (-1)^{n-1} exp(-s ln n)
  vec2 eta = vec2(0.0);
  for(int n = 1; n <= NTERMS; n++){
    float fn = float(n);
    float lnn = log(fn);
    vec2 term = cexp(vec2(-sigma*lnn, -t*lnn));
    float sign = mod(fn, 2.0) < 0.5 ? -1.0 : 1.0; // (-1)^{n-1}
    eta += sign * term;
  }
  // zeta = eta / (1 - 2^{1-s})
  float ln2 = 0.6931471805599453;
  vec2 k = cexp(vec2((1.0 - sigma) * ln2, -t * ln2));
  vec2 denom = vec2(1.0 - k.x, -k.y);
  vec2 zeta = cdiv(eta, denom);
  float phase = atan(zeta.y, zeta.x);          // -pi..pi  -> matiz
  float hue = phase / 6.2831853 + 0.5;
  float mag = length(zeta);
  float L = mag / (mag + 1.0);                  // brillo: oscuro en los ceros
  float band = 0.9 + 0.1 * fract(log2(mag + 1e-6)); // contornos sutiles por módulo
  vec3 col = hsv2rgb(vec3(hue, 0.65, (0.12 + 0.76 * L) * band));
  gl_FragColor = vec4(col, 1.0);
}
`

type GLState = {
  gl: WebGLRenderingContext
  program: WebGLProgram
  uBounds: WebGLUniformLocation | null
}

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const sh = gl.createShader(type)
  if (!sh) return null
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error('DomainColoring: error al compilar el shader:', gl.getShaderInfoLog(sh))
    gl.deleteShader(sh)
    return null
  }
  return sh
}

function initGL(canvas: HTMLCanvasElement): GLState | null {
  let gl: WebGLRenderingContext | null = null
  try {
    gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
  } catch {
    return null
  }
  if (!gl) return null

  const vs = compile(gl, gl.VERTEX_SHADER, VERT_SRC)
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG_SRC)
  if (!vs || !fs) return null
  const program = gl.createProgram()
  if (!program) return null
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('DomainColoring: error al enlazar el programa:', gl.getProgramInfoLog(program))
    return null
  }

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  // Dos triángulos que cubren el clip-space.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)
  const aPos = gl.getAttribLocation(program, 'aPos')
  gl.enableVertexAttribArray(aPos)
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

  return { gl, program, uBounds: gl.getUniformLocation(program, 'uBounds') }
}

const DPR = () => Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1)

type Size = { width: number; height: number }
type Cursor = { sigma: number; t: number; absZeta: number }

/**
 * G3 — Domain coloring de ζ(s) en el plano complejo (WebGL). El shader pinta el campo (matiz =
 * fase, brillo = módulo): los ceros aparecen como vórtices y el polo s=1 como un punto brillante.
 * Zoom (rueda) y pan (arrastre) recalculan en tiempo real (M3). La línea crítica y los primeros
 * ceros (de zeros.json, posiciones exactas) se marcan en una capa superpuesta. Fallback claro
 * si no hay WebGL.
 */
export default function DomainColoring() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glRef = useRef<GLState | null>(null)
  const viewRef = useRef<View>(INITIAL_VIEW)
  const sizeRef = useRef<Size>({ width: 0, height: 0 })
  const dragRef = useRef<{ active: boolean; x: number; y: number }>({ active: false, x: 0, y: 0 })
  const viewInitializedRef = useRef(false)
  // Punteros táctiles activos (Fase 9): un dedo = pan; dos dedos = pinch (zoom).
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map())
  const pinchDistRef = useRef<number | null>(null)

  const [view, setViewState] = useState<View>(INITIAL_VIEW)
  const [size, setSize] = useState<Size>({ width: 0, height: 0 })
  const [glReady, setGlReady] = useState<boolean | null>(null)
  const [cursor, setCursor] = useState<Cursor | null>(null)
  const [showStrip, setShowStrip] = useState(true)

  const setView = useCallback((next: View | ((v: View) => View)) => {
    setViewState((prev) => {
      const v = typeof next === 'function' ? (next as (v: View) => View)(prev) : next
      viewRef.current = v
      return v
    })
  }, [])

  // Inicializa WebGL cuando el contenedor YA tiene tamaño. Inicializar GL sobre un canvas 0×0
  // (antes de que el ResizeObserver mida el contenedor) deja el estado inválido en drivers
  // ANGLE/Windows: initGL devuelve null y el fallback quedaría permanente. Por eso esperamos a
  // tener dimensiones y dependemos de `size`; y no reinicializamos si ya hay contexto.
  useEffect(() => {
    if (glRef.current) return
    const canvas = canvasRef.current
    if (!canvas || size.width === 0 || size.height === 0) return
    const state = initGL(canvas)
    glRef.current = state
    setGlReady(state !== null)
  }, [size])

  // Limpieza del contexto GL: solo al desmontar.
  useEffect(() => {
    return () => {
      const s = glRef.current
      if (s) s.gl.getExtension('WEBGL_lose_context')?.loseContext()
      glRef.current = null
    }
  }, [])

  // Mide el contenedor y se reajusta al cambiar de tamaño.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => {
      const next = { width: el.clientWidth, height: el.clientHeight }
      sizeRef.current = next
      setSize(next)
      // En la primera medición con tamaño real, fija la vista isotrópica para ESTE canvas
      // (vórtices circulares); luego no la pisamos (el usuario puede haber hecho zoom/pan).
      if (!viewInitializedRef.current && next.width > 0 && next.height > 0) {
        viewInitializedRef.current = true
        setView(isotropicViewForSize(next.width, next.height))
      }
    }
    measure()
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(measure)
      ro.observe(el)
      return () => ro.disconnect()
    }
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [setView])

  // Dibuja el shader cuando cambian la vista, el tamaño o el estado de GL.
  useEffect(() => {
    const state = glRef.current
    const canvas = canvasRef.current
    if (!state || !canvas || size.width === 0 || size.height === 0) return
    const { gl, program, uBounds } = state
    const dpr = DPR()
    canvas.width = Math.max(1, Math.round(size.width * dpr))
    canvas.height = Math.max(1, Math.round(size.height * dpr))
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.useProgram(program)
    gl.uniform4f(uBounds, view.sigmaMin, view.sigmaMax, view.tMin, view.tMax)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }, [view, size, glReady])

  // Zoom con rueda (listener nativo no-pasivo para poder preventDefault).
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const { width, height } = sizeRef.current
      if (!width || !height) return
      const rect = canvas.getBoundingClientRect()
      const px = e.clientX - rect.left
      const py = e.clientY - rect.top
      const factor = e.deltaY > 0 ? 1.12 : 1 / 1.12 // abajo = alejar, arriba = acercar
      setView((v) => zoomViewAt(v, px, py, width, height, factor))
    }
    canvas.addEventListener('wheel', onWheel, { passive: false })
    return () => canvas.removeEventListener('wheel', onWheel)
  }, [setView])

  const onMouseDown = (e: React.MouseEvent) => {
    dragRef.current = { active: true, x: e.clientX, y: e.clientY }
  }
  const endDrag = () => {
    dragRef.current.active = false
  }
  const onMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    const { width, height } = sizeRef.current
    if (!canvas || !width || !height) return
    if (dragRef.current.active) {
      const dx = e.clientX - dragRef.current.x
      const dy = e.clientY - dragRef.current.y
      dragRef.current.x = e.clientX
      dragRef.current.y = e.clientY
      setView((v) => panViewByPixels(v, dx, dy, width, height))
    }
    const rect = canvas.getBoundingClientRect()
    const { sigma, t } = screenToPlane(e.clientX - rect.left, e.clientY - rect.top, width, height, viewRef.current)
    const absZeta = cAbs(zetaComplex(cx(sigma, t), CURSOR_TERMS))
    setCursor({ sigma, t, absZeta })
  }

  // --- Gestos táctiles (Fase 9): Pointer Events. Ignoramos pointerType 'mouse' para NO duplicar
  // el manejo de ratón (que sigue por onMouse*/wheel, intacto en desktop). Un dedo = pan; dos = pinch.
  const readCursor = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    const { width, height } = sizeRef.current
    if (!canvas || !width || !height) return
    const rect = canvas.getBoundingClientRect()
    const { sigma, t } = screenToPlane(clientX - rect.left, clientY - rect.top, width, height, viewRef.current)
    const absZeta = cAbs(zetaComplex(cx(sigma, t), CURSOR_TERMS))
    setCursor({ sigma, t, absZeta })
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') return
    const el = e.currentTarget
    if (typeof el.setPointerCapture === 'function') {
      try {
        el.setPointerCapture(e.pointerId)
      } catch {
        /* jsdom u otros sin captura: ignorable */
      }
    }
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointersRef.current.size === 2) {
      const pts = [...pointersRef.current.values()]
      pinchDistRef.current = distance(pts[0].x, pts[0].y, pts[1].x, pts[1].y)
    }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') return
    const canvas = canvasRef.current
    const { width, height } = sizeRef.current
    const prev = pointersRef.current.get(e.pointerId)
    if (!canvas || !width || !height || !prev) return
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    if (pointersRef.current.size >= 2 && pinchDistRef.current != null) {
      // Pinch: zoom centrado en el punto medio de los dos dedos.
      const pts = [...pointersRef.current.values()]
      const newDist = distance(pts[0].x, pts[0].y, pts[1].x, pts[1].y)
      const rect = canvas.getBoundingClientRect()
      const mx = (pts[0].x + pts[1].x) / 2 - rect.left
      const my = (pts[0].y + pts[1].y) / 2 - rect.top
      const factor = pinchZoomFactor(pinchDistRef.current, newDist)
      setView((v) => zoomViewAt(v, mx, my, width, height, factor))
      pinchDistRef.current = newDist
      return
    }

    // Un dedo: pan (el contenido sigue al dedo) + lectura de coordenadas en el punto tocado.
    const dx = e.clientX - prev.x
    const dy = e.clientY - prev.y
    setView((v) => panViewByPixels(v, dx, dy, width, height))
    readCursor(e.clientX, e.clientY)
  }

  const onPointerUp = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') return
    pointersRef.current.delete(e.pointerId)
    if (pointersRef.current.size < 2) pinchDistRef.current = null
  }

  const zoomButton = (factor: number) => () => {
    const { width, height } = sizeRef.current
    if (!width || !height) return
    setView((v) => zoomViewAt(v, width / 2, height / 2, width, height, factor))
  }
  const resetView = () => {
    const { width, height } = sizeRef.current
    setView(width > 0 && height > 0 ? isotropicViewForSize(width, height) : INITIAL_VIEW)
  }

  // --- Overlay: línea crítica + ceros (posiciones exactas de zeros.json). -------------------
  const { width, height } = size
  const hasSize = width > 0 && height > 0
  const criticalX = hasSize ? planeToScreen(0.5, 0, width, height, view).x : 0
  const stripX0 = hasSize ? planeToScreen(0, 0, width, height, view).x : 0
  const stripX1 = hasSize ? planeToScreen(1, 0, width, height, view).x : 0
  const poleVisible = inView(1, 0, view)
  const polePos = hasSize ? planeToScreen(1, 0, width, height, view) : { x: 0, y: 0 }

  return (
    <figure className="m-0">
      <div
        ref={containerRef}
        data-testid="domain-coloring"
        className="relative h-[380px] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-900 sm:h-[460px] lg:h-[560px] dark:border-slate-800"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={() => {
          endDrag()
          setCursor(null)
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        // touch-action: none → el lienzo captura el gesto (pan/pinch) sin pelear con el scroll de la
        // página; fuera del lienzo el scroll normal sigue funcionando (Fase 9, C).
        style={{ cursor: 'grab', touchAction: 'none' }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="Domain coloring de la función zeta en el plano complejo"
        />

        {/* Capa de anotaciones (línea crítica, franja, ceros, polo). No depende del shader. */}
        {hasSize && glReady && (
          <svg className="pointer-events-none absolute inset-0 h-full w-full" width={width} height={height}>
            {showStrip && stripX1 > stripX0 && (
              <rect x={stripX0} y={0} width={stripX1 - stripX0} height={height} fill="rgba(255,255,255,0.08)" />
            )}
            <line
              x1={criticalX}
              y1={0}
              x2={criticalX}
              y2={height}
              stroke={CRITICAL_LINE_COLOR}
              strokeWidth={1.5}
              strokeDasharray="5 4"
              opacity={0.85}
            />
            {ZERO_MARKERS.filter((z) => inView(0.5, z.t, view)).map((z) => {
              const p = planeToScreen(0.5, z.t, width, height, view)
              return (
                <g key={z.n}>
                  <circle cx={p.x} cy={p.y} r={5} fill="none" stroke="#ffffff" strokeWidth={1.5} />
                  <circle cx={p.x} cy={p.y} r={1.5} fill="#ffffff" />
                  {z.n <= 6 && (
                    <text x={p.x + 9} y={p.y + 4} fill="#ffffff" fontSize={11} opacity={0.9}>
                      ρ{z.n}
                    </text>
                  )}
                </g>
              )
            })}
            {poleVisible && (
              <g>
                <circle cx={polePos.x} cy={polePos.y} r={4} fill="#ffffff" />
                <text x={polePos.x + 9} y={polePos.y + 4} fill="#ffffff" fontSize={11} opacity={0.9}>
                  polo s=1
                </text>
              </g>
            )}
          </svg>
        )}

        {/* Lector de coordenadas (σ + it) y |ζ| aproximado. Con WebGL se muestra siempre (como antes);
            sin WebGL, solo cuando hay una lectura (al tocar/arrastrar en móvil). */}
        {(glReady || cursor) && (
          <div className="pointer-events-none absolute left-2 top-2 rounded-md bg-slate-950/70 px-2.5 py-1.5 text-xs font-medium tabular-nums text-slate-100">
            {cursor ? (
              <>
                s = {cursor.sigma.toFixed(3)} {cursor.t >= 0 ? '+' : '−'} {Math.abs(cursor.t).toFixed(3)}i
                <span className="ml-2 text-slate-300">|ζ| ≈ {cursor.absZeta.toFixed(3)}</span>
              </>
            ) : (
              <span className="text-slate-300">mueve el cursor sobre el plano</span>
            )}
          </div>
        )}

        {/* Fallback si no hay WebGL. */}
        {glReady === false && (
          <div
            data-testid="webgl-fallback"
            className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-slate-200"
          >
            <p>
              Tu navegador no tiene WebGL disponible, así que no se puede pintar el domain coloring. La línea crítica
              Re(s)=½ y los primeros ceros siguen descritos en el texto; activa WebGL para ver el campo de color.
            </p>
          </div>
        )}
      </div>

      {/* Controles agrupados junto a la gráfica (skill §3). */}
      <figcaption className="mt-3 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={zoomButton(1 / 1.3)}
            className="touch-target rounded-md border border-slate-300 px-2.5 py-1 text-sm text-slate-700 hover:border-accent-500 hover:text-accent-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:border-slate-700 dark:text-slate-200"
          >
            Acercar
          </button>
          <button
            type="button"
            onClick={zoomButton(1.3)}
            className="touch-target rounded-md border border-slate-300 px-2.5 py-1 text-sm text-slate-700 hover:border-accent-500 hover:text-accent-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:border-slate-700 dark:text-slate-200"
          >
            Alejar
          </button>
          <button
            type="button"
            onClick={resetView}
            className="touch-target rounded-md border border-slate-300 px-2.5 py-1 text-sm text-slate-700 hover:border-accent-500 hover:text-accent-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:border-slate-700 dark:text-slate-200"
          >
            Reiniciar vista
          </button>
          <label className="touch-target ml-1 inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <input type="checkbox" checked={showStrip} onChange={(e) => setShowStrip(e.target.checked)} className="accent-accent-600" />
            Franja crítica 0 &lt; Re(s) &lt; 1
          </label>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Matiz = fase de ζ(s); brillo = |ζ(s)|. Los ceros son los vórtices donde convergen todos los colores. Línea
          crítica Re(s)=½ a trazos; ceros (ρₙ) y polo marcados con datos exactos. Con ratón: rueda para zoom, arrastra
          para mover. En pantalla táctil: un dedo para mover, dos dedos (pellizco) para hacer zoom; o usa los botones.
        </p>
      </figcaption>
    </figure>
  )
}
