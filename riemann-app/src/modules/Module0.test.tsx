import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { renderWithProviders } from '../test/utils'

// Espiamos Plotly.react para comprobar que G1 monta y responde al slider (el dato cambia).
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

import Module0 from './Module0'

beforeEach(() => {
  window.localStorage.clear()
  reactSpy.mockClear()
})

describe('Módulo 0 (Primos y el porqué)', () => {
  it('renderiza las tres capas (intuición, formal, avanzada)', () => {
    renderWithProviders(<Module0 />)
    expect(screen.getByRole('region', { name: /capa intuición/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /capa formal/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /capa avanzada/i })).toBeInTheDocument()
  })

  it('monta G1 y responde al slider (Plotly recibe datos nuevos)', () => {
    renderWithProviders(<Module0 />)
    expect(reactSpy).toHaveBeenCalled()

    const before = reactSpy.mock.calls.length
    fireEvent.change(screen.getByRole('slider'), { target: { value: '500' } })
    expect(reactSpy.mock.calls.length).toBeGreaterThan(before)
  })

  it('el comprobador del ejercicio π(30) marca correcto y error', () => {
    renderWithProviders(<Module0 />)
    const input = screen.getByLabelText('π(30) =')
    const form = input.closest('form') as HTMLFormElement
    const exercise = input.closest('[data-testid="exercise"]') as HTMLElement

    fireEvent.change(input, { target: { value: '10' } })
    fireEvent.click(within(form).getByRole('button', { name: /comprobar/i }))
    expect(exercise).toHaveAttribute('data-status', 'correct')

    fireEvent.change(input, { target: { value: '7' } })
    fireEvent.click(within(form).getByRole('button', { name: /comprobar/i }))
    expect(exercise).toHaveAttribute('data-status', 'error')
  })
})
