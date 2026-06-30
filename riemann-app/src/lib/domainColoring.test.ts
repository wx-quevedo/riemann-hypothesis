import { describe, expect, it } from 'vitest'
import {
  INITIAL_VIEW,
  distance,
  domainColor,
  hslToRgb,
  inView,
  panViewByPixels,
  pinchZoomFactor,
  planeToScreen,
  screenToPlane,
  zoomViewAt,
} from './domainColoring'
import { firstZeros } from './zeros'

const W = 400
const H = 600

describe('domainColoring — gestos táctiles (lógica pura del pinch, Fase 9)', () => {
  it('distance es la euclídea entre dos puntos', () => {
    expect(distance(0, 0, 3, 4)).toBeCloseTo(5, 10)
    expect(distance(10, 10, 10, 10)).toBe(0)
  })

  it('separar los dedos (newDist > prevDist) da factor < 1 → acerca', () => {
    const factor = pinchZoomFactor(100, 200) // dedos se separan al doble
    expect(factor).toBeCloseTo(0.5, 10)
    // Aplicado en zoomViewAt sobre el centro, los spans se reducen a la mitad (zoom in).
    const before = INITIAL_VIEW
    const after = zoomViewAt(before, W / 2, H / 2, W, H, factor)
    expect(after.sigmaMax - after.sigmaMin).toBeCloseTo((before.sigmaMax - before.sigmaMin) * 0.5, 6)
    expect(after.tMax - after.tMin).toBeCloseTo((before.tMax - before.tMin) * 0.5, 6)
  })

  it('juntar los dedos (newDist < prevDist) da factor > 1 → aleja', () => {
    expect(pinchZoomFactor(200, 100)).toBeCloseTo(2, 10)
  })

  it('guarda ante newDist = 0 (no divide por cero): factor neutro 1', () => {
    expect(pinchZoomFactor(150, 0)).toBe(1)
  })
})

describe('domainColoring — mapeo pantalla↔plano', () => {
  it('round-trip plano → pantalla → plano', () => {
    const p = planeToScreen(0.5, 14.1347, W, H, INITIAL_VIEW)
    const back = screenToPlane(p.x, p.y, W, H, INITIAL_VIEW)
    expect(back.sigma).toBeCloseTo(0.5, 9)
    expect(back.t).toBeCloseTo(14.1347, 9)
  })

  it('esquinas: (0,0)→(σmin, tmax) y (W,H)→(σmax, tmin)', () => {
    const tl = screenToPlane(0, 0, W, H, INITIAL_VIEW)
    expect(tl.sigma).toBeCloseTo(INITIAL_VIEW.sigmaMin)
    expect(tl.t).toBeCloseTo(INITIAL_VIEW.tMax)
    const br = screenToPlane(W, H, W, H, INITIAL_VIEW)
    expect(br.sigma).toBeCloseTo(INITIAL_VIEW.sigmaMax)
    expect(br.t).toBeCloseTo(INITIAL_VIEW.tMin)
  })

  it('zoom mantiene fijo el punto bajo el cursor y reduce el span', () => {
    const px = 123
    const py = 456
    const before = screenToPlane(px, py, W, H, INITIAL_VIEW)
    const zv = zoomViewAt(INITIAL_VIEW, px, py, W, H, 0.5)
    const after = screenToPlane(px, py, W, H, zv)
    expect(after.sigma).toBeCloseTo(before.sigma, 9)
    expect(after.t).toBeCloseTo(before.t, 9)
    expect(zv.sigmaMax - zv.sigmaMin).toBeCloseTo((INITIAL_VIEW.sigmaMax - INITIAL_VIEW.sigmaMin) * 0.5, 9)
  })

  it('pan por píxeles: arrastrar a la derecha mueve la vista a la izquierda', () => {
    const pv = panViewByPixels(INITIAL_VIEW, 40, 0, W, H)
    expect(pv.sigmaMin).toBeLessThan(INITIAL_VIEW.sigmaMin)
  })
})

describe('domainColoring — overlay de ceros (posiciones desde zeros.json)', () => {
  it('los ceros se mapean sobre la línea crítica (misma x) y en orden de t (y decreciente)', () => {
    const zeros = firstZeros(3)
    const pts = zeros.map((z) => planeToScreen(0.5, z.t, W, H, INITIAL_VIEW))

    // σ = 0.5 para todos → misma x (la de la línea crítica).
    const expectedX = ((0.5 - INITIAL_VIEW.sigmaMin) / (INITIAL_VIEW.sigmaMax - INITIAL_VIEW.sigmaMin)) * W
    expect(pts[0].x).toBeCloseTo(expectedX, 9)
    expect(pts[1].x).toBeCloseTo(expectedX, 9)
    expect(pts[2].x).toBeCloseTo(expectedX, 9)

    // t creciente → y decreciente (t hacia arriba).
    expect(pts[0].y).toBeGreaterThan(pts[1].y)
    expect(pts[1].y).toBeGreaterThan(pts[2].y)
  })

  it('el primer cero (t≈14.13) cae dentro de la vista inicial', () => {
    expect(inView(0.5, firstZeros(1)[0].t, INITIAL_VIEW)).toBe(true)
  })
})

describe('domainColoring — color', () => {
  it('módulo 0 (cero) da color oscuro; módulo grande, claro', () => {
    const dark = Math.max(...domainColor(0, 0))
    const bright = Math.max(...domainColor(50, 0))
    expect(bright).toBeGreaterThan(dark)
  })

  it('fases distintas dan matices distintos', () => {
    expect(domainColor(1, 0)).not.toEqual(domainColor(-1, 0))
  })

  it('hslToRgb: rojo puro y gris', () => {
    expect(hslToRgb(0, 1, 0.5)).toEqual([255, 0, 0])
    const g = hslToRgb(0, 0, 0.5)
    expect(g[0]).toBe(g[1])
    expect(g[1]).toBe(g[2])
  })
})
