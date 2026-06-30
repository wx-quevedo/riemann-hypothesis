import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { renderWithProviders } from '../test/utils'

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

import Module1 from './Module1'

beforeEach(() => {
  window.localStorage.clear()
  reactSpy.mockClear()
})

describe('Módulo 1 (Zeta de Euler real)', () => {
  it('renderiza las tres capas', () => {
    renderWithProviders(<Module1 />)
    expect(screen.getByRole('region', { name: /capa intuición/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /capa formal/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /capa avanzada/i })).toBeInTheDocument()
  })

  it('el acordeón del producto de Euler abre y muestra la derivación (TFA)', () => {
    renderWithProviders(<Module1 />)
    // Cerrado por defecto: la derivación no está presente.
    expect(screen.queryByText(/Teorema Fundamental de la Aritmética/i)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /producto de euler — derivación completa/i }))
    expect(screen.getByText(/Teorema Fundamental de la Aritmética/i)).toBeInTheDocument()
  })

  it('monta G2 y responde al slider (Plotly recibe datos nuevos)', () => {
    renderWithProviders(<Module1 />)
    expect(reactSpy).toHaveBeenCalled()

    const before = reactSpy.mock.calls.length
    fireEvent.change(screen.getByRole('slider'), { target: { value: '3' } })
    expect(reactSpy.mock.calls.length).toBeGreaterThan(before)
  })

  it('el comprobador del ejercicio del producto de Euler marca correcto', () => {
    renderWithProviders(<Module1 />)
    const input = screen.getByLabelText('producto parcial ≈')
    const form = input.closest('form') as HTMLFormElement
    const exercise = input.closest('[data-testid="exercise"]') as HTMLElement

    fireEvent.change(input, { target: { value: '1.6331' } })
    fireEvent.click(within(form).getByRole('button', { name: /comprobar/i }))
    expect(exercise).toHaveAttribute('data-status', 'correct')
  })
})
