import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { renderWithProviders } from '../test/utils'

// Espía de Plotly para comprobar que G4/G5 montan y responden al rango de t (el dato cambia).
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

import Module3 from './Module3'

beforeEach(() => {
  window.localStorage.clear()
  reactSpy.mockClear()
})

describe('Módulo 3 (Ceros + enunciado de la HR)', () => {
  it('renderiza las tres capas', () => {
    renderWithProviders(<Module3 />)
    expect(screen.getByRole('region', { name: /capa intuición/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /capa formal/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /capa avanzada/i })).toBeInTheDocument()
  })

  it('muestra el enunciado de la HR con la nota de honestidad (M6: no demostrada)', () => {
    renderWithProviders(<Module3 />)
    expect(screen.getByText(/Todos los ceros no triviales/i)).toBeInTheDocument()
    expect(screen.getByText(/no está demostrada/i)).toBeInTheDocument()
    expect(screen.getByText(/conjetura/i)).toBeInTheDocument()
  })

  it('el acordeón de la ecuación funcional abre y explica los factores', () => {
    renderWithProviders(<Module3 />)
    expect(screen.queryByText(/GENERA los ceros triviales/i)).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /ecuación funcional, factor a factor/i }))
    expect(screen.getByText(/GENERA los ceros triviales/i)).toBeInTheDocument()
  })

  it('G4 y G5 montan y responden al rango de t (Plotly recibe datos nuevos)', () => {
    renderWithProviders(<Module3 />)
    expect(reactSpy).toHaveBeenCalled()
    const before = reactSpy.mock.calls.length
    const sliders = screen.getAllByRole('slider')
    expect(sliders.length).toBeGreaterThanOrEqual(2) // G4 y G5
    fireEvent.change(sliders[0], { target: { value: '32' } })
    expect(reactSpy.mock.calls.length).toBeGreaterThan(before)
  })

  it('el comprobador del ejercicio ζ(−2)=0 marca correcto', () => {
    renderWithProviders(<Module3 />)
    const input = screen.getByLabelText('ζ(−2) =')
    const form = input.closest('form') as HTMLFormElement
    const exercise = input.closest('[data-testid="exercise"]') as HTMLElement

    fireEvent.change(input, { target: { value: '0' } })
    fireEvent.click(within(form).getByRole('button', { name: /comprobar/i }))
    expect(exercise).toHaveAttribute('data-status', 'correct')
  })
})
