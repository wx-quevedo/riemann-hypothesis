import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { MAX_ZEROS, psiChebyshev, psiExplicit, psiMainTerm } from '../../lib/explicitFormula'
import { linearScale, sampleRange } from '../../lib/plotScale'
import { GRAPH } from '../../lib/colors'
import { usePrefersReducedMotion } from '../usePrefersReducedMotion'

// G6 — animación de la fórmula explícita de ψ(x) (Canvas2D). Se dibuja en capas:
//   1. escalera real ψ de Chebyshev (objetivo, tenue),
//   2. término principal x − log(2π) − ½log(1−x⁻²) (tendencia suave),
//   3. aproximación ψExplicit(x, N) con N ondas, que converge a la escalera al subir N.
// Sigue el patrón de canvas de Fase 4: NO inicializar/dibujar sin canvas dimensionado y loguear
// fallos (evita el bug de timing de G3). Canvas2D basta para curvas de línea.

const X_MIN = 2
const X_MAX = 30
const Y_MIN = -1
const Y_MAX = 33
const SAMPLES = 360
const N_MAX = 200 // tope del slider (la fórmula usa hasta MAX_ZEROS = 1000 si hiciera falta)

const COL_STAIR = GRAPH.faint // escalera ψ objetivo
const COL_MAIN = GRAPH.reference // término principal
const COL_APPROX = GRAPH.accent // aproximación con N ondas — acento teal
const COL_PREV = 'rgba(13,148,136,0.35)' // aporte de la última onda (curva con N−1) — acento translúcido
const AXIS = GRAPH.muted

type Size = { width: number; height: number }

const DPR = () => Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1)

function drawPolyline(ctx: CanvasRenderingContext2D, pxs: number[], pys: number[]) {
  ctx.beginPath()
  for (let i = 0; i < pxs.length; i++) {
    if (i === 0) ctx.moveTo(pxs[i], pys[i])
    else ctx.lineTo(pxs[i], pys[i])
  }
  ctx.stroke()
}

/**
 * G6 — la animación estrella. Slider de N (número de ceros, 0–200) + botón play: al subir N la
 * aproximación gana ondas y se ciñe a la escalera ψ (el momento "ajá"). La lógica pura de
 * muestreo/escalado vive en plotScale.ts; la matemática en explicitFormula.ts (testeables aparte).
 */
export default function ExplicitFormula() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const sizeRef = useRef<Size>({ width: 0, height: 0 })

  const [size, setSize] = useState<Size>({ width: 0, height: 0 })
  const [ready, setReady] = useState<boolean | null>(null)
  const [n, setN] = useState(20)
  const [playing, setPlaying] = useState(false)
  const [showPrev, setShowPrev] = useState(false)
  const sliderId = useId()
  const reducedMotion = usePrefersReducedMotion()

  // Inicializa el contexto 2D SOLO cuando el contenedor ya tiene tamaño (patrón de Fase 4: no
  // dibujar sobre un canvas 0×0). No reinicializa si ya hay contexto; loguea el fallo.
  useEffect(() => {
    if (ctxRef.current) return
    const canvas = canvasRef.current
    if (!canvas || size.width === 0 || size.height === 0) return
    let ctx: CanvasRenderingContext2D | null = null
    try {
      ctx = canvas.getContext('2d')
    } catch {
      ctx = null
    }
    if (!ctx) {
      console.error('ExplicitFormula: no se pudo obtener el contexto 2D del canvas.')
    }
    ctxRef.current = ctx
    setReady(ctx !== null)
  }, [size])

  // Mide el contenedor y se reajusta (ResizeObserver; fallback a window resize).
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => {
      const next = { width: el.clientWidth, height: el.clientHeight }
      sizeRef.current = next
      setSize(next)
    }
    measure()
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(measure)
      ro.observe(el)
      return () => ro.disconnect()
    }
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Dibuja cuando cambian N, el tamaño, el estado del contexto o la opción de última onda.
  const draw = useCallback(() => {
    const ctx = ctxRef.current
    const canvas = canvasRef.current
    const { width, height } = sizeRef.current
    if (!ctx || !canvas || width === 0 || height === 0) return

    const dpr = DPR()
    canvas.width = Math.max(1, Math.round(width * dpr))
    canvas.height = Math.max(1, Math.round(height * dpr))
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, width, height)

    const padL = 44
    const padR = 14
    const padT = 12
    const padB = 28
    const sx = linearScale(X_MIN, X_MAX, padL, width - padR)
    const sy = linearScale(Y_MIN, Y_MAX, height - padB, padT)

    // Ejes y rejilla.
    ctx.font = '11px Inter, sans-serif'
    ctx.fillStyle = AXIS
    ctx.strokeStyle = 'rgba(100,116,139,0.18)'
    ctx.lineWidth = 1
    ctx.setLineDash([])
    for (const yt of [0, 10, 20, 30]) {
      const py = sy(yt)
      ctx.beginPath()
      ctx.moveTo(padL, py)
      ctx.lineTo(width - padR, py)
      ctx.stroke()
      ctx.fillText(String(yt), 8, py + 3)
    }
    for (const xt of [5, 10, 15, 20, 25, 30]) {
      const px = sx(xt)
      ctx.fillText(String(xt), px - 5, height - 10)
    }
    ctx.fillText('ψ(x)', 8, padT + 2)
    ctx.fillText('x', width - padR - 6, height - 10)

    const xs = sampleRange(X_MIN, X_MAX, SAMPLES)
    const pxs = xs.map(sx)

    // 1) escalera real ψ (objetivo, tenue).
    ctx.strokeStyle = COL_STAIR
    ctx.lineWidth = 1.5
    drawPolyline(ctx, pxs, xs.map((x) => sy(psiChebyshev(x))))

    // 2) término principal (tendencia suave, a trazos).
    ctx.strokeStyle = COL_MAIN
    ctx.lineWidth = 1.5
    ctx.setLineDash([5, 4])
    drawPolyline(ctx, pxs, xs.map((x) => sy(psiMainTerm(x))))
    ctx.setLineDash([])

    // 2b) aporte de la última onda: curva con N−1 (tenue), si se pide y N≥1.
    if (showPrev && n >= 1) {
      ctx.strokeStyle = COL_PREV
      ctx.lineWidth = 1.5
      drawPolyline(ctx, pxs, xs.map((x) => sy(psiExplicit(x, n - 1))))
    }

    // 3) aproximación con N ondas (protagonista).
    ctx.strokeStyle = COL_APPROX
    ctx.lineWidth = 2.5
    drawPolyline(ctx, pxs, xs.map((x) => sy(psiExplicit(x, n))))
  }, [n, showPrev])

  useEffect(() => {
    draw()
  }, [draw, size, ready])

  // Animación (play): incrementa N hasta N_MAX con setInterval (testeable con fake timers). Respeta
  // prefers-reduced-motion: si el usuario pide movimiento reducido, no se autoanima (B).
  useEffect(() => {
    if (!playing || reducedMotion) return
    const id = setInterval(() => setN((v) => Math.min(N_MAX, v + 2)), 40)
    return () => clearInterval(id)
  }, [playing, reducedMotion])

  // Para la animación al llegar al tope.
  useEffect(() => {
    if (playing && n >= N_MAX) setPlaying(false)
  }, [playing, n])

  const togglePlay = () => {
    if (playing) {
      setPlaying(false)
    } else {
      if (n >= N_MAX) setN(0)
      setPlaying(true)
    }
  }

  return (
    <figure className="m-0">
      <div
        ref={containerRef}
        data-testid="explicit-formula"
        className="relative h-[380px] w-full overflow-hidden rounded-xl border border-slate-200 bg-white/40 dark:border-slate-800 dark:bg-slate-900/30"
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" role="img" aria-label={`Fórmula explícita de ψ(x) con ${n} ceros`} />
        {ready === false && (
          <div
            data-testid="canvas-fallback"
            className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-slate-500 dark:text-slate-300"
          >
            <p>Tu navegador no pudo crear un lienzo 2D, así que no se puede animar la fórmula explícita.</p>
          </div>
        )}
      </div>

      <figcaption className="mt-3 space-y-2">
        <div className="flex flex-wrap items-center gap-4 rounded-lg border border-slate-200 bg-white/60 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200">
          {reducedMotion ? (
            <span className="text-xs text-slate-500 dark:text-slate-400">Movimiento reducido: usa el slider para sumar ceros.</span>
          ) : (
            <button
              type="button"
              onClick={togglePlay}
              className="touch-target rounded-md border border-accent-500 bg-accent-50 px-3 py-1.5 text-sm font-medium text-accent-700 transition-colors hover:bg-accent-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:border-accent-500/40 dark:bg-accent-500/10 dark:text-accent-200 dark:hover:bg-accent-500/20"
            >
              {playing ? 'Pausa' : 'Reproducir'}
            </button>
          )}
          <label htmlFor={sliderId} className="font-medium">
            ceros N
          </label>
          <input
            id={sliderId}
            type="range"
            min={0}
            max={N_MAX}
            step={1}
            value={n}
            onChange={(e) => {
              setPlaying(false)
              setN(Number(e.target.value))
            }}
            aria-valuetext={`${n} ceros`}
            className="h-1 flex-1 cursor-pointer accent-accent-600"
          />
          <output className="w-24 text-right font-medium tabular-nums text-accent-700 dark:text-accent-300">N = {n}</output>
        </div>
        <label className="touch-target flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <input type="checkbox" checked={showPrev} onChange={(e) => setShowPrev(e.target.checked)} className="accent-accent-600" />
          Resaltar el aporte de la última onda (curva con N−1)
        </label>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Escalera gris = ψ(x) real; trazos indigo = tendencia suave; teal = aproximación con N ondas. Sube N (o pulsa
          reproducir) y verás emerger los escalones. Hasta {MAX_ZEROS} ceros disponibles. Junto a un salto (p. ej. x=25)
          la aproximación oscila aunque suba N: es el fenómeno de Gibbs, esperable en una suma de ondas.
        </p>
      </figcaption>
    </figure>
  )
}
