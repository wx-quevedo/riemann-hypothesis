import { describe, expect, it } from 'vitest'
import { liApprox, primePi, primesUpTo, xOverLnx } from './primes'

// Tests contra el GROUND TRUTH verificado de la tabla de la Fase 3.
describe('primes.ts', () => {
  it('primePi exacto: 4, 25, 168, 1229', () => {
    expect(primePi(10)).toBe(4)
    expect(primePi(100)).toBe(25)
    expect(primePi(1000)).toBe(168)
    expect(primePi(10000)).toBe(1229)
    expect(primePi(30)).toBe(10)
  })

  it('primesUpTo empieza bien y coincide con primePi', () => {
    expect(primesUpTo(10)).toEqual([2, 3, 5, 7])
    expect(primesUpTo(1)).toEqual([])
    expect(primesUpTo(1000)).toHaveLength(168)
  })

  it('xOverLnx: 21.71 en 100, 144.76 en 1000 (tol 0.1)', () => {
    expect(Math.abs(xOverLnx(100) - 21.71)).toBeLessThan(0.1)
    expect(Math.abs(xOverLnx(1000) - 144.76)).toBeLessThan(0.1)
  })

  it('liApprox: 30.13 en 100, 177.61 en 1000 (tol 0.5)', () => {
    expect(Math.abs(liApprox(100) - 30.13)).toBeLessThan(0.5)
    expect(Math.abs(liApprox(1000) - 177.61)).toBeLessThan(0.5)
  })
})
