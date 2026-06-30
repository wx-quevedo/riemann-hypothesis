import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { renderWithProviders } from '../test/utils'

// G7 usa Plotly (vía LinePlot); lo espiamos para verificar montaje/respuesta.
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

import Module5 from './Module5'

beforeEach(() => {
  window.localStorage.clear()
  reactSpy.mockClear()
})

describe('Módulo 5 (estado del arte)', () => {
  it('renderiza las tres capas y la gráfica G7', () => {
    renderWithProviders(<Module5 />)
    expect(screen.getByRole('region', { name: /capa intuición/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /capa formal/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /capa avanzada/i })).toBeInTheDocument()
    expect(reactSpy).toHaveBeenCalled() // G7 montó
  })

  it('M6: la lección "evidencia ≠ prueba" y las pruebas "no validadas" aparecen; la HR NO se presenta como resuelta', () => {
    const { container } = renderWithProviders(<Module5 />)
    const text = container.textContent || ''

    // La lección de honestidad está presente (visible, no oculta en acordeón).
    expect(text).toMatch(/evidencia ≠ prueba/i)
    expect(text).toMatch(/no es una prueba/i)
    expect(text).toMatch(/no est[áa]n validad/i)

    // El estado de la HR: conjetura, no demostrada.
    const hr = screen.getByTestId('hr-status')
    expect(hr.textContent).toMatch(/conjetura|no está demostrada/i)

    // NO se afirma (en ningún sitio) que la HR esté resuelta / quede demostrada.
    expect(hr.textContent).not.toMatch(/resuelt|queda demostrad|ya (está )?demostrad|por fin demostrad/i)
    expect(text).not.toMatch(/(?:la HR|hip[oó]tesis de riemann)[^.]{0,60}(?:resuelt|queda demostrad|por fin demostrad|ya demostrad)/i)
  })

  it('el comprobador del ejercicio de espaciado medio marca correcto', () => {
    renderWithProviders(<Module5 />)
    const input = screen.getByLabelText('espaciado medio =')
    const form = input.closest('form') as HTMLFormElement
    const exercise = input.closest('[data-testid="exercise"]') as HTMLElement

    fireEvent.change(input, { target: { value: '1.00' } })
    fireEvent.click(within(form).getByRole('button', { name: /comprobar/i }))
    expect(exercise).toHaveAttribute('data-status', 'correct')
  })
})
