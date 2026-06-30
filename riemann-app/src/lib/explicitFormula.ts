// La fórmula explícita de Riemann/von Mangoldt para ψ(x) (Módulo 4, gráfica G6).
// Animamos ψ(x) de Chebyshev (NO π(x)): su fórmula explícita tiene término principal = x,
// la más limpia para ver cómo las ondas de los ceros reconstruyen la escalera de los primos.
import { primesUpTo } from './primes'
import { ZEROS } from './zeros'

/**
 * Función de Chebyshev ψ(x) = Σ_{p^k ≤ x} log p (suma de log p sobre primos y sus potencias).
 * Es la "escalera" objetivo: salta log p en cada potencia de primo. Verificada:
 * ψ(10)=7.832, ψ(20)=19.266, ψ(30)=28.476.
 */
export function psiChebyshev(x: number): number {
  let sum = 0
  for (const p of primesUpTo(x)) {
    let pk = p
    while (pk <= x) {
      sum += Math.log(p)
      pk *= p
    }
  }
  return sum
}

/**
 * Término principal (suave) de la fórmula explícita: x − log(2π) − ½·log(1 − x^{−2}).
 * Es la tendencia sobre la que oscilan las ondas. Válido para x > 1 (en x→1⁺ diverge).
 */
export function psiMainTerm(x: number): number {
  return x - Math.log(2 * Math.PI) - 0.5 * Math.log(1 - Math.pow(x, -2))
}

/**
 * Onda real del k-ésimo cero (k 1-based), contribución del PAR CONJUGADO ρ_k = ½ ± iγ_k:
 *     x^ρ/ρ + x^ρ̄/ρ̄ = 2√x · [½·cos(γ ln x) + γ·sin(γ ln x)] / |ρ|²,   |ρ|² = ¼ + γ².
 * Amplitud ~ √x/|ρ| (consecuencia de Re(ρ)=½: la línea crítica). Devuelve 0 si k fuera de rango.
 */
export function waveOfZero(x: number, k: number): number {
  if (k < 1 || k > ZEROS.length) return 0
  const gamma = ZEROS[k - 1].t
  const lnx = Math.log(x)
  const rhoAbs2 = 0.25 + gamma * gamma
  return (2 * Math.sqrt(x) * (0.5 * Math.cos(gamma * lnx) + gamma * Math.sin(gamma * lnx))) / rhoAbs2
}

/**
 * Fórmula explícita truncada a `numZeros` ondas:
 *     ψ(x) ≈ [término principal] − Σ_{k=1}^{numZeros} (onda del cero k).
 * Al subir numZeros, la aproximación gana ondas y converge a la escalera ψ de Chebyshev.
 * Verificada: psiExplicit(10, 100) ≈ 7.83 (ψ real = 7.832).
 */
export function psiExplicit(x: number, numZeros: number): number {
  const n = Math.max(0, Math.min(Math.floor(numZeros), ZEROS.length))
  let waves = 0
  for (let k = 1; k <= n; k++) waves += waveOfZero(x, k)
  return psiMainTerm(x) - waves
}

/** Número de ceros disponibles para la fórmula explícita (= los de zeros.json). */
export const MAX_ZEROS = ZEROS.length
