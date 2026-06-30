// Carga y tipado de los ceros no triviales de ζ precalculados (Fase 2).
//
// Los datos vienen del precálculo offline (scripts/precompute_zeros.py, mpmath) y viven en
// public/data/zeros.json. En runtime la app SOLO lee estos datos; NO calcula ζ ni los ceros
// (eso es Fase 3+, road map §6). Aquí: importar, tipar y exponer helpers de acceso.
import zerosData from '../../public/data/zeros.json'

/** Un cero no trivial de ζ: índice n (1-based) y parte imaginaria t. La parte real es 1/2. */
export interface Zero {
  n: number
  t: number
}

interface ZerosFile {
  count: number
  precision_dps: number
  re: number
  zeros: Zero[]
}

const file = zerosData as ZerosFile

// Robustez (Fase 8): si los datos llegaran vacíos/malformados, fallar con un mensaje claro en vez
// de errores crípticos aguas abajo. Los ceros se IMPORTAN (van en el bundle, ~62 KB) en lugar de
// hacer fetch: pasar a fetch obligaría a volver async a TODOS los consumidores (explicitFormula,
// spacingStats, criticalLine, G3/G4/G5) — un refactor grande con riesgo de regresión, fuera del
// alcance del pulido quirúrgico. Por ser un import, el dato está garantizado en runtime.
if (!Array.isArray(file?.zeros) || file.zeros.length === 0) {
  throw new Error('zeros.json no contiene ceros válidos (Fase 2). Regenéralo con scripts/precompute_zeros.py.')
}

/** Parte real de todos los ceros no triviales: 1/2 (línea crítica; hipótesis de Riemann). */
export const CRITICAL_RE: number = file.re

/** Cantidad de ceros precalculados disponibles. */
export const ZERO_COUNT: number = file.count

/** Lista completa de los ceros precalculados (solo lectura), ordenados por t creciente. */
export const ZEROS: readonly Zero[] = file.zeros

/** Precisión (dps) con la que se calcularon los ceros offline. Informativo. */
export const PRECISION_DPS: number = file.precision_dps

/** Devuelve los primeros `k` ceros (k se acota a [0, ZERO_COUNT]). */
export function firstZeros(k: number): Zero[] {
  const bounded = Math.max(0, Math.min(Math.floor(k), ZEROS.length))
  return ZEROS.slice(0, bounded)
}

/** Devuelve el cero de índice `n` (1-based), o undefined si está fuera de rango. */
export function getZero(n: number): Zero | undefined {
  return ZEROS[n - 1]
}
