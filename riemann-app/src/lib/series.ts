/**
 * Serie de demostración para el "hola mundo" de Fase 0.
 *
 * Devuelve los TÉRMINOS a_n = 1/n^s = n^(−s) para n = 1..nMax. NO es ζ(s) (que es la
 * SUMA de estos términos): aquí solo graficamos cada término para ver, moviendo el
 * exponente s con el slider, cómo decaen (patrón "toda gráfica es interactiva", M3).
 *
 * La implementación real de ζ(s) en JavaScript (vía η de Dirichlet) llega en Fase 3+;
 * vive en src/lib/zeta.ts y se validará contra valores conocidos (M9).
 */
export type SeriesPoint = { n: number; term: number }

export function partialSeries(s: number, nMax: number): SeriesPoint[] {
  const points: SeriesPoint[] = []
  for (let n = 1; n <= nMax; n++) {
    points.push({ n, term: Math.pow(n, -s) })
  }
  return points
}
