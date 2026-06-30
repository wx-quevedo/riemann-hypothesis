import { describe, expect, it } from 'vitest'
import { BASEL, eulerProductPartial, zetaReal } from './zeta'

// Tests contra el GROUND TRUTH verificado de la tabla de la Fase 3.
describe('zeta.ts', () => {
  it('zetaReal(2, 10000) ≈ 1.64483 (tol 1e-3)', () => {
    expect(Math.abs(zetaReal(2, 10000) - 1.64483)).toBeLessThan(1e-3)
  })

  it('zetaReal(4, 10000) ≈ π⁴/90 (tol 1e-3)', () => {
    expect(Math.abs(zetaReal(4, 10000) - Math.PI ** 4 / 90)).toBeLessThan(1e-3)
  })

  it('eulerProductPartial(2, 29) ≈ 1.6330705 (tol 1e-5)', () => {
    expect(Math.abs(eulerProductPartial(2, 29) - 1.6330705)).toBeLessThan(1e-5)
  })

  it('el producto de Euler converge hacia ζ(2)=π²/6 al añadir primos', () => {
    const p29 = eulerProductPartial(2, 29)
    const p200 = eulerProductPartial(2, 200)
    // más primos ⇒ más cerca de π²/6
    expect(Math.abs(p200 - BASEL)).toBeLessThan(Math.abs(p29 - BASEL))
  })

  it('BASEL = π²/6 ≈ 1.64493', () => {
    expect(BASEL).toBeCloseTo(1.6449340668, 8)
  })
})
