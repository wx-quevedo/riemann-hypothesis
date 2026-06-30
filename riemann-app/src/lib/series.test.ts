import { describe, expect, it } from 'vitest'
import { partialSeries } from './series'

// Tests numéricos en el espíritu de M9: validar contra valores conocidos a mano.
describe('partialSeries (términos 1/n^s)', () => {
  it('s = 1 da la serie armónica: 1, 1/2, 1/3, 1/4', () => {
    const pts = partialSeries(1, 4)
    expect(pts.map((p) => p.n)).toEqual([1, 2, 3, 4])
    expect(pts[0].term).toBeCloseTo(1, 12)
    expect(pts[1].term).toBeCloseTo(0.5, 12)
    expect(pts[2].term).toBeCloseTo(1 / 3, 12)
    expect(pts[3].term).toBeCloseTo(0.25, 12)
  })

  it('s = 2 da 1, 1/4, 1/9 (los términos cuya suma es ζ(2) = π²/6)', () => {
    const pts = partialSeries(2, 3)
    expect(pts[0].term).toBeCloseTo(1, 12)
    expect(pts[1].term).toBeCloseTo(0.25, 12)
    expect(pts[2].term).toBeCloseTo(1 / 9, 12)
  })

  it('produce exactamente nMax puntos', () => {
    expect(partialSeries(2, 12)).toHaveLength(12)
  })
})
