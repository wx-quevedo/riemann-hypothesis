// Estadística de espaciados de los ceros de ζ vs ley GUE (Módulo 5, gráfica G7).
// La densidad de ceros crece con la altura t, así que los espaciados crudos se encogen: hay que
// "desplegarlos" (unfolding) dividiendo por el espaciado medio local antes de comparar con GUE.
import { ZEROS } from './zeros'

const TWO_PI = 2 * Math.PI

/**
 * Parte suave de la función contadora de ceros (Riemann–von Mangoldt):
 *     N̄(t) = (t/2π)·ln(t/2π) − t/2π + 7/8.
 * N̄(γ_n) ≈ n, así que las diferencias N̄(γ_{n+1})−N̄(γ_n) tienen media 1 ("unfolding").
 */
export function smoothCount(t: number): number {
  return (t / TWO_PI) * Math.log(t / TWO_PI) - t / TWO_PI + 7 / 8
}

/**
 * Espaciados NORMALIZADOS (unfolded) de los primeros `numZeros` ceros:
 *     s_n = N̄(γ_{n+1}) − N̄(γ_n).
 * Su media tiende a 1 (verificado: ≈1.000 con 1000 ceros). Es lo que se compara con GUE.
 */
export function unfoldedSpacings(numZeros: number): number[] {
  const n = Math.max(2, Math.min(Math.floor(numZeros), ZEROS.length))
  const out: number[] = []
  for (let i = 0; i < n - 1; i++) {
    out.push(smoothCount(ZEROS[i + 1].t) - smoothCount(ZEROS[i].t))
  }
  return out
}

/** Media de los espaciados normalizados de los primeros `numZeros` ceros (≈ 1). */
export function meanSpacing(numZeros: number): number {
  const s = unfoldedSpacings(numZeros)
  return s.reduce((a, b) => a + b, 0) / s.length
}

/**
 * Conjetura de Wigner para el GUE (β=2), aproximación a la distribución de espaciados a primer
 * vecino: p(s) = (32/π²)·s²·exp(−4s²/π). Normalizada (área 1, media 1), p(0)=0, máximo en
 * s = √π/2 ≈ 0.886, → 0 cuando s → ∞. La "repulsión de niveles" (p(0)=0) es lo característico.
 */
export function wignerGUE(s: number): number {
  return (32 / (Math.PI * Math.PI)) * s * s * Math.exp((-4 * s * s) / Math.PI)
}

export interface Histogram {
  centers: number[]
  density: number[]
  binWidth: number
}

/** Histograma de densidad (área ≈ 1) de `values` en [min, max] con `bins` cajas. */
export function histogram(values: number[], min: number, max: number, bins: number): Histogram {
  const binWidth = (max - min) / bins
  const counts = new Array<number>(bins).fill(0)
  let total = 0
  for (const v of values) {
    if (v < min || v >= max) continue
    const b = Math.min(bins - 1, Math.floor((v - min) / binWidth))
    counts[b] += 1
    total += 1
  }
  const safeTotal = total || 1
  const centers: number[] = []
  const density: number[] = []
  for (let i = 0; i < bins; i++) {
    centers.push(min + (i + 0.5) * binWidth)
    density.push(counts[i] / (safeTotal * binWidth)) // densidad: Σ density·binWidth ≈ 1
  }
  return { centers, density, binWidth }
}
