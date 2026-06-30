import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import Accordion from './Accordion'
import Equation from './Equation'
import LinePlot from './graphics/LinePlot'

describe('Accesibilidad básica (Fase 8)', () => {
  it('Equation expone role="math" con el LaTeX en aria-label', () => {
    // querySelector en vez de getByRole: el markup MathML de KaTeX rompe getComputedStyle en jsdom.
    const { container } = render(<Equation math={'\\zeta(s)'} />)
    const eq = container.querySelector('[role="math"]')
    expect(eq).not.toBeNull()
    expect(eq?.getAttribute('aria-label')).toContain('\\zeta(s)')
  })

  it('Accordion enlaza el botón con su cuerpo (aria-expanded + aria-controls)', () => {
    render(
      <Accordion title="Prueba">
        <p>cuerpo del acordeón</p>
      </Accordion>,
    )
    const btn = screen.getByRole('button', { name: /Prueba/i })
    expect(btn).toHaveAttribute('aria-expanded', 'false')

    const controlsId = btn.getAttribute('aria-controls')
    expect(controlsId).toBeTruthy()

    fireEvent.click(btn)
    expect(btn).toHaveAttribute('aria-expanded', 'true')
    const body = document.getElementById(controlsId as string)
    expect(body?.textContent).toContain('cuerpo del acordeón')
  })

  it('las gráficas (LinePlot) exponen role="img" con descripción para lectores de pantalla', () => {
    render(<LinePlot data={[]} ariaLabel="curva de prueba de ζ" />)
    expect(screen.getByRole('img', { name: /curva de prueba de ζ/i })).toBeInTheDocument()
  })
})
