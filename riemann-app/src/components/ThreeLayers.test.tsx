import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import ThreeLayers from './ThreeLayers'

describe('ThreeLayers (las tres capas)', () => {
  it('intuición y formal visibles; avanzado oculto hasta desplegar', () => {
    render(
      <ThreeLayers
        intuicion={<p>texto de intuición</p>}
        formal={<p>texto formal</p>}
        avanzado={<p>texto avanzado</p>}
      />,
    )

    // Capas 1 y 2 visibles de entrada.
    expect(screen.getByText('texto de intuición')).toBeInTheDocument()
    expect(screen.getByText('texto formal')).toBeInTheDocument()

    // Capa 3 plegada por defecto.
    expect(screen.queryByText('texto avanzado')).not.toBeInTheDocument()

    // Desplegar la capa avanzada.
    fireEvent.click(screen.getByRole('button', { name: /Avanzado/i }))
    expect(screen.getByText('texto avanzado')).toBeInTheDocument()
  })
})
