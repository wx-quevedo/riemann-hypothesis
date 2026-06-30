// ζ(s) para s REAL, calculada en el cliente (float64). Módulo 1 (gráfica G2, ejercicios).
//
// Esta fase trabaja SOLO sobre el eje real s > 1. El plano complejo, la continuación
// analítica y los ceros llegan en fases posteriores (road map §10).
import { primesUpTo } from './primes'

/** ζ(2) = π²/6 (problema de Basilea). Valor de referencia para comparar sumas parciales. */
export const BASEL = Math.PI ** 2 / 6

/**
 * ζ(s) por SUMA DIRECTA de la serie de Dirichlet: Σ_{n=1}^{terms} 1/n^s, para s > 1.
 *
 * ── LÍMITE CONOCIDO (no prometer precisión que la suma no da) ───────────────────────────
 * La cola de la serie es ~ N^{1-s}/(s-1): decae rápido para s grande, pero LENTÍSIMO cerca
 * de s = 1. Valores de referencia verificados:
 *     zetaReal(2,   10000) → 1.6448340   (err ~1e-4 vs π²/6 = 1.6449341)
 *     zetaReal(1.5, 10000) → ~2.592      (err ~2e-2, ¡todavía un 2%!)
 * Por eso el Módulo 1 acota el slider de G2 a s ∈ [1.2, 8] y la UI deja claro que la curva
 * es una APROXIMACIÓN por suma parcial; cerca de s = 1 subestima visiblemente. La forma
 * correcta de evaluar ζ para s ≤ 1 (continuación analítica) llega en fases posteriores.
 *
 * Detalle numérico: se suma de n grande a n pequeño (la cola primero) para minimizar el
 * error de redondeo en float64 al acumular muchos sumandos pequeños.
 */
export function zetaReal(s: number, terms = 10000): number {
  let sum = 0
  for (let n = terms; n >= 1; n--) {
    sum += Math.pow(n, -s)
  }
  return sum
}

/**
 * Producto de Euler TRUNCADO: Π_{p primo ≤ primeLimit} 1 / (1 − p^{−s}).
 *
 * Converge a ζ(s) al subir primeLimit (caso modelo del Módulo 1). Referencia verificada:
 *     eulerProductPartial(2, 29) → 1.6330705   (→ 1.6449341 = π²/6 al añadir más primos)
 */
export function eulerProductPartial(s: number, primeLimit: number): number {
  const primes = primesUpTo(primeLimit)
  let product = 1
  for (const p of primes) {
    product *= 1 / (1 - Math.pow(p, -s))
  }
  return product
}
