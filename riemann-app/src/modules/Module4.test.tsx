import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { renderWithProviders } from '../test/utils'
import Module4 from './Module4'
import { psiChebyshev } from '../lib/explicitFormula'

beforeEach(() => {
  window.localStorage.clear()
})

describe('Módulo 4 (la fórmula explícita)', () => {
  it('renderiza las tres capas y la animación G6', () => {
    renderWithProviders(<Module4 />)
    expect(screen.getByRole('region', { name: /capa intuición/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /capa formal/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /capa avanzada/i })).toBeInTheDocument()
    expect(screen.getByTestId('explicit-formula')).toBeInTheDocument()
  })

  it('el acordeón de la derivación de la onda real abre y muestra los pasos', () => {
    renderWithProviders(<Module4 />)
    expect(screen.queryByText(/parte imaginaria se cancela/i)).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Derivación de la onda real/i }))
    expect(screen.getByText(/parte imaginaria se cancela/i)).toBeInTheDocument()
  })

  it('muestra la nota M6 sobre la importancia de la HR sin afirmar que está probada', () => {
    renderWithProviders(<Module4 />)
    expect(screen.getByText(/honestidad M6/i)).toBeInTheDocument()
    expect(screen.getByText(/no está demostrada/i)).toBeInTheDocument()
  })

  it('el comprobador del ejercicio ψ(20) marca correcto', () => {
    renderWithProviders(<Module4 />)
    const input = screen.getByLabelText('ψ(20) =')
    const form = input.closest('form') as HTMLFormElement
    const exercise = input.closest('[data-testid="exercise"]') as HTMLElement

    fireEvent.change(input, { target: { value: psiChebyshev(20).toFixed(3) } })
    fireEvent.click(within(form).getByRole('button', { name: /comprobar/i }))
    expect(exercise).toHaveAttribute('data-status', 'correct')
  })
})
