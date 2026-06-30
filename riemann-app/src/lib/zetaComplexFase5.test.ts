import { describe, expect, it } from 'vitest'
import {
  absZetaOnCriticalLine,
  cAbs,
  cMul,
  cSub,
  chi,
  cx,
  gammaComplex,
  hardyZ,
  zetaComplexFull,
} from './zetaComplex'

describe('gammaComplex (Lanczos)', () => {
  it('Γ(3)=2 y Γ(½)=√π', () => {
    expect(gammaComplex(cx(3, 0)).re).toBeCloseTo(2, 6)
    expect(gammaComplex(cx(0.5, 0)).re).toBeCloseTo(Math.sqrt(Math.PI), 6)
  })

  it('|Γ(½+5i)| = √(π/cosh(5π))', () => {
    const expected = Math.sqrt(Math.PI / Math.cosh(5 * Math.PI))
    expect(Math.abs(cAbs(gammaComplex(cx(0.5, 5))) - expected)).toBeLessThan(1e-8)
  })
})

describe('ecuación funcional ζ(s) = χ(s)·ζ(1−s)', () => {
  // En un punto sin polos y con Re∈(0,1) (ambos lados vía η, sin reflexión tautológica).
  // NO se usa s entero (Γ(1−s) tendría polo) ni Re(s)>1 (η divergiría para ζ(1−s)).
  it('se cumple en s = 0.5 + 3i (tol 1e-3)', () => {
    const s = cx(0.5, 3)
    const lhs = zetaComplexFull(s, 100000)
    const rhs = cMul(chi(s), zetaComplexFull(cSub(cx(1), s), 100000))
    expect(Math.abs(lhs.re - rhs.re)).toBeLessThan(1e-3)
    expect(Math.abs(lhs.im - rhs.im)).toBeLessThan(1e-3)
  })

  it('χ(s)·χ(1−s) = 1 (invariante de la reflexión)', () => {
    const s = cx(0.5, 3)
    const p = cMul(chi(s), chi(cSub(cx(1), s)))
    expect(p.re).toBeCloseTo(1, 6)
    expect(p.im).toBeCloseTo(0, 6)
  })
})

describe('ceros triviales (vía ecuación funcional)', () => {
  it('|ζ(−2)| < 1e-6 y |ζ(−4)| < 1e-6', () => {
    expect(cAbs(zetaComplexFull(cx(-2, 0), 5000))).toBeLessThan(1e-6)
    expect(cAbs(zetaComplexFull(cx(-4, 0), 5000))).toBeLessThan(1e-6)
  })
})

describe('|ζ(½+it)| (G4) y función Z de Hardy (G5)', () => {
  it('|ζ(½+it)| coincide con la tabla (tol 1e-2; ceros < 0.05)', () => {
    expect(Math.abs(absZetaOnCriticalLine(5) - 0.73886)).toBeLessThan(1e-2)
    expect(Math.abs(absZetaOnCriticalLine(10) - 1.54919)).toBeLessThan(1e-2)
    expect(Math.abs(absZetaOnCriticalLine(18) - 2.3368)).toBeLessThan(1e-2)
    expect(absZetaOnCriticalLine(14.1347)).toBeLessThan(0.05) // ρ1
    expect(absZetaOnCriticalLine(21.022)).toBeLessThan(0.05) // ρ2
  })

  it('Z(t) coincide con la tabla (tol 1e-2)', () => {
    expect(Math.abs(hardyZ(5) - -0.73886)).toBeLessThan(1e-2)
    expect(Math.abs(hardyZ(18) - 2.3368)).toBeLessThan(1e-2)
    expect(Math.abs(hardyZ(23) - -1.45463)).toBeLessThan(1e-2)
  })

  it('Z cambia de signo en ρ1 (entre 14 y 15) y en ρ2 (entre 20.5 y 21.5)', () => {
    expect(hardyZ(14) * hardyZ(15)).toBeLessThan(0)
    expect(hardyZ(20.5) * hardyZ(21.5)).toBeLessThan(0)
  })
})
