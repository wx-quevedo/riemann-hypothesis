import { describe, expect, it } from 'vitest'
import { MAX_ZEROS, psiChebyshev, psiExplicit, psiMainTerm, waveOfZero } from './explicitFormula'

describe('explicitFormula — ψ de Chebyshev (escalera real)', () => {
  it('ψ(10)=7.832, ψ(20)=19.266, ψ(30)=28.476 (tol 1e-2)', () => {
    expect(Math.abs(psiChebyshev(10) - 7.832)).toBeLessThan(1e-2)
    expect(Math.abs(psiChebyshev(20) - 19.266)).toBeLessThan(1e-2)
    expect(Math.abs(psiChebyshev(30) - 28.476)).toBeLessThan(1e-2)
  })
})

describe('explicitFormula — fórmula explícita y convergencia', () => {
  it('psiExplicit(10, 100) ≈ ψ(10) (tol 0.05)', () => {
    expect(Math.abs(psiExplicit(10, 100) - psiChebyshev(10))).toBeLessThan(0.05)
  })

  it('el error con 100 ceros < error con 1 cero (en varios x)', () => {
    for (const x of [15, 20, 30]) {
      const real = psiChebyshev(x)
      const err1 = Math.abs(psiExplicit(x, 1) - real)
      const err100 = Math.abs(psiExplicit(x, 100) - real)
      expect(err100).toBeLessThan(err1)
    }
  })

  it('N=0 da el término principal (sin ondas)', () => {
    expect(psiExplicit(10, 0)).toBeCloseTo(psiMainTerm(10), 10)
  })
})

describe('explicitFormula — onda real del cero', () => {
  it('waveOfZero produce un real finito y la suma de ondas reproduce −Σ x^ρ/ρ', () => {
    const w1 = waveOfZero(10, 1)
    expect(Number.isFinite(w1)).toBe(true)
    // ψExplicit(x,N) = término principal − Σ_{k=1}^{N} onda_k
    let sum = 0
    for (let k = 1; k <= 5; k++) sum += waveOfZero(10, k)
    expect(psiExplicit(10, 5)).toBeCloseTo(psiMainTerm(10) - sum, 10)
  })

  it('k fuera de rango devuelve 0', () => {
    expect(waveOfZero(10, 0)).toBe(0)
    expect(waveOfZero(10, MAX_ZEROS + 1)).toBe(0)
  })
})
