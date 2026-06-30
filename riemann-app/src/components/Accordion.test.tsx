import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import Accordion from './Accordion'

describe('Accordion (M2)', () => {
  it('cerrado por defecto; abre al pulsar; aria-expanded correcto', () => {
    render(
      <Accordion title="Derivación">
        <p>cuerpo de la derivación</p>
      </Accordion>,
    )

    const button = screen.getByRole('button', { name: /Derivación/i })

    // Cerrado por defecto: cuerpo ausente, aria-expanded=false.
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('cuerpo de la derivación')).not.toBeInTheDocument()

    // Abrir.
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('cuerpo de la derivación')).toBeInTheDocument()

    // Cerrar.
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('cuerpo de la derivación')).not.toBeInTheDocument()
  })
})
