import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import Equation from './Equation'
import DomainColoring from './graphics/DomainColoring'

describe('Responsive / táctil (Fase 9)', () => {
  it('una ecuación en bloque tiene su propio scroll horizontal (.katex-scroll)', () => {
    const { container } = render(<Equation math={'\\zeta(s)=\\sum_{n=1}^{\\infty} n^{-s}'} display />)
    const eq = container.querySelector('[data-display="block"]')
    expect(eq).not.toBeNull()
    expect(eq).toHaveClass('katex-scroll')
  })

  it('una ecuación inline NO recibe el scroll horizontal (hace wrap con el texto)', () => {
    const { container } = render(<Equation math={'\\zeta(2)'} />)
    expect(container.querySelector('[data-display="inline"]')).not.toHaveClass('katex-scroll')
  })

  it('los controles clave llevan .touch-target (garantiza ≥44px en pantallas táctiles)', () => {
    render(<DomainColoring />)
    expect(screen.getByRole('button', { name: /acercar/i })).toHaveClass('touch-target')
    expect(screen.getByRole('button', { name: /reiniciar vista/i })).toHaveClass('touch-target')
  })
})
