import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

// Plotly usa canvas/WebGL, que jsdom no implementa: lo mockeamos para poder observar
// QUÉ datos recibe la gráfica sin renderizar de verdad (el plan de Fase 0 lo recomienda).
const { reactSpy } = vi.hoisted(() => ({ reactSpy: vi.fn() }))

vi.mock('plotly.js-basic-dist-min', () => ({
  default: {
    react: (...args: unknown[]) => {
      reactSpy(...args)
      return Promise.resolve()
    },
    newPlot: () => Promise.resolve(),
    purge: () => {},
    Plots: { resize: () => {} },
  },
}))

import ZetaSeriesDemo from './ZetaSeriesDemo'

type Trace = { y: number[] }

beforeEach(() => {
  reactSpy.mockClear()
})

describe('ZetaSeriesDemo (gráfica interactiva, M3)', () => {
  it('monta la gráfica Plotly y el slider actualiza el dato que la alimenta', () => {
    render(<ZetaSeriesDemo />)

    // Monta: Plotly.react recibió las trazas al menos una vez.
    expect(reactSpy).toHaveBeenCalled()
    // Estado inicial s = 2 visible junto al control.
    expect(screen.getByText('s = 2.0')).toBeInTheDocument()

    const slider = screen.getByRole('slider')
    const callsBefore = reactSpy.mock.calls.length

    // Mover el slider a s = 3.
    fireEvent.change(slider, { target: { value: '3' } })

    // 1) El valor mostrado (estado) cambió en vivo.
    expect(screen.getByText('s = 3.0')).toBeInTheDocument()
    // 2) La gráfica se volvió a alimentar.
    expect(reactSpy.mock.calls.length).toBeGreaterThan(callsBefore)
    // 3) Los datos nuevos reflejan s = 3: el término n = 2 es 1/2^3 = 0.125.
    const lastCall = reactSpy.mock.calls.at(-1) as unknown[]
    const traces = lastCall[1] as Trace[]
    expect(traces[0].y[1]).toBeCloseTo(0.125, 6)
  })
})
