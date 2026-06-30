import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import Equation from './Equation'

describe('Equation (KaTeX, M5)', () => {
  it('renderiza la ecuación zeta como markup de KaTeX, no como texto plano', () => {
    const { container } = render(
      <Equation display math={'\\zeta(s) = \\sum_{n=1}^{\\infty} \\frac{1}{n^s}'} />,
    )

    // KaTeX produce un nodo con clase .katex (prueba de que NO es texto plano monoespaciado).
    expect(container.querySelector('.katex')).not.toBeNull()
    // y su maquetación interna (HTML/MathML), no solo el string LaTeX literal.
    expect(container.querySelector('.katex-html, .katex-mathml')).not.toBeNull()

    // Accesibilidad: conserva el LaTeX original en aria-label.
    const mathEl = container.querySelector('[role="math"]')
    expect(mathEl).not.toBeNull()
    expect(mathEl?.getAttribute('aria-label')).toContain('\\zeta(s)')
  })
})
