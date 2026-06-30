// Lógica PURA del domain coloring (G3), separada del shader para que sea testeable sin WebGL
// (jsdom no da GL). Aquí viven: el modelo de vista (rectángulo del plano complejo visible),
// el mapeo pantalla↔plano, el zoom/pan y la conversión ζ(s)→color. El shader es una capa fina
// que reusa estas mismas reglas en GLSL.
import { GRAPH } from './colors'

/** Rectángulo del plano complejo visible: σ ∈ [sigmaMin, sigmaMax], t ∈ [tMin, tMax]. */
export interface View {
  sigmaMin: number
  sigmaMax: number
  tMin: number
  tMax: number
}

// Centro de interés: la línea crítica, el polo (s=1, t=0) y los primeros ceros (t≈14, 21).
const FOCUS_SIGMA = 0.5
const FOCUS_T = 7
const INITIAL_T_SPAN = 20

/** Tamaño de referencia del canvas (≈ el aside de ModuleLayout a 1280px) para INITIAL_VIEW. */
export const REFERENCE_CANVAS = { width: 452, height: 560 }

/**
 * Vista inicial ISOTRÓPICA para un canvas de tamaño dado (Parte 0 de Fase 5): la proporción
 * σ:t del rectángulo coincide con la proporción ancho:alto del canvas, de modo que los ceros
 * se ven como vórtices CIRCULARES (no bandas horizontales). Centrada en los primeros ceros + el polo.
 */
export function isotropicViewForSize(width: number, height: number): View {
  const aspect = width > 0 && height > 0 ? width / height : REFERENCE_CANVAS.width / REFERENCE_CANVAS.height
  const tSpanV = INITIAL_T_SPAN
  const sigmaSpanV = tSpanV * aspect // σ-span : t-span = width : height ⇒ isótropo
  return {
    sigmaMin: FOCUS_SIGMA - sigmaSpanV / 2,
    sigmaMax: FOCUS_SIGMA + sigmaSpanV / 2,
    tMin: FOCUS_T - tSpanV / 2,
    tMax: FOCUS_T + tSpanV / 2,
  }
}

/** Vista inicial por defecto (isotrópica para el canvas de referencia). */
export const INITIAL_VIEW: View = isotropicViewForSize(REFERENCE_CANVAS.width, REFERENCE_CANVAS.height)

/** Color consistente de la línea crítica Re(s)=½ en TODA la app (skill §3). Centralizado en colors.ts. */
export const CRITICAL_LINE_COLOR = GRAPH.criticalLine

const sigmaSpan = (v: View) => v.sigmaMax - v.sigmaMin
const tSpan = (v: View) => v.tMax - v.tMin

/** Pixel de pantalla → punto del plano (σ + it). (0,0) es la esquina superior izquierda. */
export function screenToPlane(px: number, py: number, width: number, height: number, v: View): { sigma: number; t: number } {
  const sigma = v.sigmaMin + (px / width) * sigmaSpan(v)
  const t = v.tMax - (py / height) * tSpan(v) // y hacia abajo, t hacia arriba
  return { sigma, t }
}

/** Punto del plano (σ, t) → pixel de pantalla. */
export function planeToScreen(sigma: number, t: number, width: number, height: number, v: View): { x: number; y: number } {
  const x = ((sigma - v.sigmaMin) / sigmaSpan(v)) * width
  const y = ((v.tMax - t) / tSpan(v)) * height
  return { x, y }
}

/**
 * Zoom manteniendo FIJO el punto del plano bajo (px, py): multiplica los spans por `factor`
 * (factor < 1 acerca, > 1 aleja). Así el zoom con rueda "tira" del punto bajo el cursor.
 */
export function zoomViewAt(v: View, px: number, py: number, width: number, height: number, factor: number): View {
  const focus = screenToPlane(px, py, width, height, v)
  const newSigmaSpan = sigmaSpan(v) * factor
  const newTSpan = tSpan(v) * factor
  const fx = px / width
  const fy = py / height
  const sigmaMin = focus.sigma - fx * newSigmaSpan
  const tMax = focus.t + fy * newTSpan
  return { sigmaMin, sigmaMax: sigmaMin + newSigmaSpan, tMin: tMax - newTSpan, tMax }
}

/** Pan por un desplazamiento en píxeles (arrastre): el contenido sigue al cursor. */
export function panViewByPixels(v: View, dxPx: number, dyPx: number, width: number, height: number): View {
  const dSigma = (dxPx / width) * sigmaSpan(v)
  const dT = (dyPx / height) * tSpan(v)
  return {
    sigmaMin: v.sigmaMin - dSigma,
    sigmaMax: v.sigmaMax - dSigma,
    tMin: v.tMin + dT,
    tMax: v.tMax + dT,
  }
}

/** ¿Está el punto (σ, t) dentro de la vista? */
export function inView(sigma: number, t: number, v: View): boolean {
  return sigma >= v.sigmaMin && sigma <= v.sigmaMax && t >= v.tMin && t <= v.tMax
}

// --- Gestos táctiles (Fase 9): lógica pura del pinch para poder testearla sin Pointer Events --

/** Distancia euclídea entre dos puntos de pantalla (separación de los dos dedos en un pinch). */
export function distance(ax: number, ay: number, bx: number, by: number): number {
  return Math.hypot(ax - bx, ay - by)
}

/**
 * Factor de zoom de un pinch: los spans de la vista se multiplican por este factor (ver zoomViewAt).
 * Dedos que se SEPARAN (newDist > prevDist) → factor < 1 → acercar; que se JUNTAN → factor > 1 → alejar.
 * Es prevDist/newDist (con guarda ante newDist=0).
 */
export function pinchZoomFactor(prevDist: number, newDist: number): number {
  return newDist > 0 ? prevDist / newDist : 1
}

// --- Color: ζ(s) → RGB (espejo en JS de lo que hace el shader) ----------------------------

/** HSL (h,s,l en 0..1) → RGB (0..255 enteros). */
export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const hue = ((h % 1) + 1) % 1
  if (s === 0) {
    const g = Math.round(l * 255)
    return [g, g, g]
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const hk = (tc: number) => {
    let t = tc
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  return [Math.round(hk(hue + 1 / 3) * 255), Math.round(hk(hue) * 255), Math.round(hk(hue - 1 / 3) * 255)]
}

/**
 * Color de domain coloring para ζ(s) = re + i·im: matiz = fase (argumento), luminosidad =
 * módulo (oscuro en los ceros, más claro al crecer |ζ|). Espejo testeable del shader.
 */
export function domainColor(re: number, im: number): [number, number, number] {
  const phase = Math.atan2(im, re) // −π..π
  const hue = phase / (2 * Math.PI) + 0.5 // 0..1
  const mag = Math.hypot(re, im)
  const L = mag === Infinity ? 0.95 : mag / (mag + 1) // 0 en ceros, →1 al crecer
  return hslToRgb(hue, 0.65, 0.12 + 0.76 * L)
}
