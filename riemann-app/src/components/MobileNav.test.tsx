import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { renderApp } from '../test/utils'

beforeEach(() => {
  window.localStorage.clear()
})

// Nota: en jsdom no se aplican media queries, así que tanto la nav lateral (desktop) como la
// hamburguesa coexisten en el DOM. La regresión cero la garantizan los tests de Navigation/Progress
// (la lateral sigue intacta); aquí probamos SOLO el comportamiento añadido del drawer móvil.
describe('Navegación móvil (hamburguesa / drawer)', () => {
  it('abre y cierra el drawer, exponiendo aria-expanded', () => {
    renderApp('/')
    const button = screen.getByRole('button', { name: /abrir menú de módulos/i })
    expect(button).toHaveAttribute('aria-expanded', 'false')

    // Cerrado: el drawer (nav "Secciones") no está en el DOM.
    expect(screen.queryByRole('navigation', { name: /secciones/i })).not.toBeInTheDocument()

    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('navigation', { name: /secciones/i })).toBeInTheDocument()

    // Cierra con el botón ✕.
    fireEvent.click(screen.getByRole('button', { name: /cerrar menú/i }))
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('navigation', { name: /secciones/i })).not.toBeInTheDocument()
  })

  it('navega a un módulo desde el drawer y se cierra al elegir', async () => {
    renderApp('/')
    fireEvent.click(screen.getByRole('button', { name: /abrir menú de módulos/i }))

    const drawer = screen.getByRole('navigation', { name: /secciones/i })
    fireEvent.click(within(drawer).getByRole('link', { name: /Módulo 4/i }))

    // El módulo carga diferido (React.lazy) → esperamos su encabezado.
    expect(await screen.findByRole('heading', { name: /fórmula explícita/i })).toBeInTheDocument()
    // Al elegir sección, el drawer se cierra.
    expect(screen.queryByRole('navigation', { name: /secciones/i })).not.toBeInTheDocument()
  })
})
