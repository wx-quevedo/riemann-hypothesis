import { describe, expect, it } from 'vitest'
import { histogram, meanSpacing, unfoldedSpacings, wignerGUE } from './spacingStats'

describe('spacingStats — espaciados normalizados de los ceros', () => {
  it('el espaciado medio normalizado de los primeros N ceros ≈ 1', () => {
    expect(Math.abs(meanSpacing(100) - 1)).toBeLessThan(0.05)
    expect(Math.abs(meanSpacing(500) - 1)).toBeLessThan(0.02)
    expect(Math.abs(meanSpacing(1000) - 1)).toBeLessThan(0.01)
  })

  it('unfoldedSpacings(N) tiene N−1 valores positivos', () => {
    const s = unfoldedSpacings(100)
    expect(s).toHaveLength(99)
    expect(s.every((v) => v > 0)).toBe(true)
  })
})

describe('spacingStats — curva GUE (Wigner)', () => {
  it('p(0)=0, máximo cerca de s≈0.886, y → 0 para s grande', () => {
    expect(wignerGUE(0)).toBe(0)
    expect(wignerGUE(3)).toBeLessThan(0.01)
    // máximo numérico en [0,3]
    let bestS = 0
    let bestV = -1
    for (let s = 0; s <= 3; s += 0.001) {
      const v = wignerGUE(s)
      if (v > bestV) {
        bestV = v
        bestS = s
      }
    }
    expect(bestS).toBeGreaterThan(0.8)
    expect(bestS).toBeLessThan(0.95)
  })

  it('la curva GUE está normalizada (área ≈ 1) y tiene media ≈ 1', () => {
    let area = 0
    let mean = 0
    const ds = 0.001
    for (let s = 0; s < 6; s += ds) {
      area += wignerGUE(s) * ds
      mean += s * wignerGUE(s) * ds
    }
    expect(Math.abs(area - 1)).toBeLessThan(1e-2)
    expect(Math.abs(mean - 1)).toBeLessThan(1e-2)
  })
})

describe('spacingStats — histograma', () => {
  it('el histograma de densidad tiene área ≈ 1', () => {
    const h = histogram(unfoldedSpacings(1000), 0, 3, 30)
    const area = h.density.reduce((a, d) => a + d * h.binWidth, 0)
    expect(Math.abs(area - 1)).toBeLessThan(0.05) // casi todos los espaciados caen en [0,3]
    expect(h.centers).toHaveLength(30)
  })
})
