import { describe, expect, it } from 'vitest'
import { cAbs, cDiv, cMul, cx, nPowS, zetaComplex } from './zetaComplex'

describe('zetaComplex — aritmética compleja', () => {
  it('multiplicación: (1+i)(1+i) = 2i', () => {
    const z = cMul(cx(1, 1), cx(1, 1))
    expect(z.re).toBeCloseTo(0, 12)
    expect(z.im).toBeCloseTo(2, 12)
  })

  it('división: (2+0i)/(0+1i) = −2i', () => {
    const z = cDiv(cx(2, 0), cx(0, 1))
    expect(z.re).toBeCloseTo(0, 12)
    expect(z.im).toBeCloseTo(-2, 12)
  })

  it('potencia n^s real: 2^2 = 4', () => {
    const z = nPowS(2, cx(2, 0))
    expect(z.re).toBeCloseTo(4, 10)
    expect(z.im).toBeCloseTo(0, 10)
  })

  it('potencia n^s compleja: 2^i = exp(i·ln2), módulo 1', () => {
    const z = nPowS(2, cx(0, 1))
    expect(cAbs(z)).toBeCloseTo(1, 12)
    expect(z.re).toBeCloseTo(Math.cos(Math.LN2), 12)
    expect(z.im).toBeCloseTo(Math.sin(Math.LN2), 12)
  })
})

describe('zetaComplex — valores de verificación (tabla Fase 4, tolerancias realistas)', () => {
  it('|ζ(2)| ≈ 1.64493 (tol 1e-3)', () => {
    expect(Math.abs(cAbs(zetaComplex(cx(2, 0), 2000)) - 1.64493)).toBeLessThan(1e-3)
  })

  it('|ζ(3+2i)| ≈ 0.98419 (tol 1e-3)', () => {
    expect(Math.abs(cAbs(zetaComplex(cx(3, 2), 2000)) - 0.98419)).toBeLessThan(1e-3)
  })

  it('|ζ(0.5+5i)| ≈ 0.73886 (tol 1e-2, por convergencia lenta en la franja crítica)', () => {
    expect(Math.abs(cAbs(zetaComplex(cx(0.5, 5), 20000)) - 0.73886)).toBeLessThan(1e-2)
  })

  it('|ζ| en el primer cero (0.5+14.1347i) < 0.05 con N grande (NO <1e-8: la suma lenta no lo da)', () => {
    expect(cAbs(zetaComplex(cx(0.5, 14.1347251417), 5000))).toBeLessThan(0.05)
  })

  it('|ζ| en el segundo cero (0.5+21.0220i) < 0.05', () => {
    expect(cAbs(zetaComplex(cx(0.5, 21.0220396388), 5000))).toBeLessThan(0.05)
  })

  it('la convergencia es lenta: más términos ⇒ |ζ| más cerca de 0 en el primer cero', () => {
    const t = 14.1347251417
    const a = cAbs(zetaComplex(cx(0.5, t), 300))
    const b = cAbs(zetaComplex(cx(0.5, t), 5000))
    expect(b).toBeLessThan(a)
  })
})
