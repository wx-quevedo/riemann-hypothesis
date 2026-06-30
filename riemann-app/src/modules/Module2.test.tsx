import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, screen } from '@testing-library/react'
import { renderWithProviders } from '../test/utils'
import Module2 from './Module2'

beforeEach(() => {
  window.localStorage.clear()
})

describe('Módulo 2 (Plano complejo y continuación analítica)', () => {
  it('renderiza las tres capas', () => {
    renderWithProviders(<Module2 />)
    expect(screen.getByRole('region', { name: /capa intuición/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /capa formal/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /capa avanzada/i })).toBeInTheDocument()
  })

  it('el acordeón de la continuación analítica vía η abre y muestra la derivación paso a paso', () => {
    renderWithProviders(<Module2 />)
    // Cerrado por defecto.
    expect(screen.queryByText(/IMPARES se cancelan/i)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Continuación analítica vía η/i }))
    expect(screen.getByText(/IMPARES se cancelan/i)).toBeInTheDocument()
  })
})
