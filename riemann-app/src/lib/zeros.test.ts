import { describe, expect, it } from 'vitest'
import { CRITICAL_RE, ZERO_COUNT, ZEROS, firstZeros, getZero } from './zeros'

describe('zeros.ts (carga de ceros precalculados)', () => {
  it('carga los 1000 ceros con objetos bien tipados', () => {
    expect(ZERO_COUNT).toBe(1000)
    expect(ZEROS).toHaveLength(1000)
    const z = ZEROS[0]
    expect(typeof z.n).toBe('number')
    expect(typeof z.t).toBe('number')
  })

  it('el primer cero tiene n=1 y t≈14.1347 (float64, tolerancia 1e-4)', () => {
    const first = getZero(1)
    expect(first).toBeDefined()
    expect(first?.n).toBe(1)
    // toBeCloseTo(_, 4) ⇒ |Δ| < 5e-5; el t guardado dista ~2.5e-5 de 14.1347.
    expect(first?.t).toBeCloseTo(14.1347, 4)
  })

  it('firstZeros(k) devuelve la cantidad correcta y consecutiva, acotando k', () => {
    const five = firstZeros(5)
    expect(five).toHaveLength(5)
    expect(five.map((z) => z.n)).toEqual([1, 2, 3, 4, 5])
    expect(five[4].t).toBeGreaterThan(five[0].t) // t creciente

    // Acotación a [0, ZERO_COUNT].
    expect(firstZeros(0)).toHaveLength(0)
    expect(firstZeros(99999)).toHaveLength(1000)
  })

  it('getZero fuera de rango devuelve undefined; la parte real es 1/2', () => {
    expect(getZero(0)).toBeUndefined()
    expect(getZero(1001)).toBeUndefined()
    expect(CRITICAL_RE).toBe(0.5)
  })
})
