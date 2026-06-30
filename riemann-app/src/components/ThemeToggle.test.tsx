import { afterEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider } from './ThemeProvider'
import ThemeToggle from './ThemeToggle'

afterEach(() => {
  // Deja el <html> y el almacenamiento limpios entre tests.
  document.documentElement.classList.remove('dark')
  document.documentElement.removeAttribute('data-theme')
  window.localStorage.clear()
})

describe('ThemeToggle (modo claro/oscuro, app-wide)', () => {
  it('propaga la clase `dark` al <html> a través del ThemeProvider', () => {
    render(
      <ThemeProvider initial="light">
        <ThemeToggle />
      </ThemeProvider>,
    )
    const root = document.documentElement

    // Estado inicial: claro.
    expect(root.classList.contains('dark')).toBe(false)
    expect(root.getAttribute('data-theme')).toBe('light')

    const button = screen.getByRole('button', { name: /modo oscuro/i })

    // Clic → oscuro a nivel de toda la app.
    fireEvent.click(button)
    expect(root.classList.contains('dark')).toBe(true)
    expect(root.getAttribute('data-theme')).toBe('dark')
    expect(button).toHaveAttribute('aria-pressed', 'true')

    // Clic de nuevo → claro.
    fireEvent.click(button)
    expect(root.classList.contains('dark')).toBe(false)
    expect(root.getAttribute('data-theme')).toBe('light')
    expect(button).toHaveAttribute('aria-pressed', 'false')
  })
})
