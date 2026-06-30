// Muestreo de ζ sobre la línea crítica para G4 (|ζ(½+it)|) y G5 (Z de Hardy).
// Calcula ζ(½+it) UNA vez por punto y deriva |ζ| y Z; cachea el resultado (lo comparten ambas
// gráficas). Inserta los t EXACTOS de los ceros (zeros.json) en la malla para que la curva
// realmente toque/cruce el cero ahí (división de trabajo del stack híbrido: el dato marca el punto).
import { cAbs, cx, hardyTheta, zetaComplex } from './zetaComplex'
import { firstZeros } from './zeros'

export interface CriticalLineSamples {
  ts: number[]
  abs: number[] // |ζ(½+it)|
  Z: number[] // función Z de Hardy
}

const cache = new Map<string, CriticalLineSamples>()

/**
 * Muestrea t ∈ [tMin, tMax] con paso `step`, más los ceros exactos de zeros.json en ese rango.
 * `terms` = términos de η para la curva (pocos: la velocidad manda; los ceros se ven igual).
 */
export function sampleCriticalLine(tMin: number, tMax: number, step: number, terms: number): CriticalLineSamples {
  const key = `${tMin}|${tMax}|${step}|${terms}`
  const hit = cache.get(key)
  if (hit) return hit

  const grid: number[] = []
  const n = Math.round((tMax - tMin) / step)
  for (let i = 0; i <= n; i++) grid.push(tMin + i * step)
  const zerosT = firstZeros(60)
    .map((z) => z.t)
    .filter((t) => t >= tMin && t <= tMax)
  const ts = [...grid, ...zerosT].sort((a, b) => a - b)

  const abs: number[] = []
  const Z: number[] = []
  for (const t of ts) {
    const z = zetaComplex(cx(0.5, t), terms)
    abs.push(cAbs(z))
    const th = hardyTheta(t)
    Z.push(Math.cos(th) * z.re - Math.sin(th) * z.im)
  }

  const result: CriticalLineSamples = { ts, abs, Z }
  cache.set(key, result)
  return result
}

/** Recorta las muestras a t ≤ tMax (el slider mueve este límite; no recalcula). */
export function sliceUpTo(samples: CriticalLineSamples, tMax: number): CriticalLineSamples {
  let end = samples.ts.length
  for (let i = 0; i < samples.ts.length; i++) {
    if (samples.ts[i] > tMax) {
      end = i
      break
    }
  }
  return { ts: samples.ts.slice(0, end), abs: samples.abs.slice(0, end), Z: samples.Z.slice(0, end) }
}
