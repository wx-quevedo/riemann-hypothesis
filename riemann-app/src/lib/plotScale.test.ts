import { describe, expect, it } from 'vitest'
import { linearScale, sampleRange } from './plotScale'

describe('plotScale (lógica pura de muestreo/escalado)', () => {
  it('sampleRange devuelve count puntos equiespaciados e inclusivos', () => {
    expect(sampleRange(0, 10, 5)).toEqual([0, 2.5, 5, 7.5, 10])
    expect(sampleRange(2, 30, 2)).toEqual([2, 30])
    expect(sampleRange(2, 30, 1)).toEqual([2])
  })

  it('linearScale mapea dominio→rango, incluido el rango invertido del eje Y', () => {
    const s = linearScale(0, 10, 0, 100)
    expect(s(0)).toBe(0)
    expect(s(5)).toBe(50)
    expect(s(10)).toBe(100)
    // Y de pantalla: dominio [0,33] → rango [alto−margen, margen] (invertido)
    const yScreen = linearScale(0, 33, 300, 12)
    expect(yScreen(0)).toBe(300)
    expect(yScreen(33)).toBe(12)
  })
})
