import { describe, expect, it } from 'vitest'
import { INITIAL_VIEW, REFERENCE_CANVAS, isotropicViewForSize } from './domainColoring'

describe('domainColoring — INITIAL_VIEW isotrópico (Parte 0 de Fase 5)', () => {
  it('la proporción σ:t de INITIAL_VIEW coincide con la del canvas de referencia', () => {
    const sigmaSpan = INITIAL_VIEW.sigmaMax - INITIAL_VIEW.sigmaMin
    const tSpan = INITIAL_VIEW.tMax - INITIAL_VIEW.tMin
    const viewAspect = sigmaSpan / tSpan
    const canvasAspect = REFERENCE_CANVAS.width / REFERENCE_CANVAS.height
    expect(viewAspect).toBeCloseTo(canvasAspect, 6)
  })

  it('isotropicViewForSize produce proporción σ:t = ancho:alto para cualquier tamaño', () => {
    const v1 = isotropicViewForSize(800, 400) // 2:1
    expect((v1.sigmaMax - v1.sigmaMin) / (v1.tMax - v1.tMin)).toBeCloseTo(2, 6)
    const v2 = isotropicViewForSize(300, 600) // 1:2
    expect((v2.sigmaMax - v2.sigmaMin) / (v2.tMax - v2.tMin)).toBeCloseTo(0.5, 6)
  })

  it('está centrada en la zona de los primeros ceros + el polo', () => {
    expect(INITIAL_VIEW.tMin).toBeLessThanOrEqual(0) // incluye el polo (t=0)
    expect(INITIAL_VIEW.tMax).toBeGreaterThanOrEqual(14.2) // incluye el primer cero (t≈14.13)
  })
})
