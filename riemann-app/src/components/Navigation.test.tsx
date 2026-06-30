import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { renderApp } from '../test/utils'

beforeEach(() => {
  window.localStorage.clear()
})

describe('Navegación entre módulos', () => {
  it('parte en Inicio y navega a un módulo, marcándolo activo', async () => {
    renderApp('/')

    // Inicio renderizado.
    expect(screen.getByRole('heading', { name: /Aprender la Hipótesis de Riemann/i })).toBeInTheDocument()

    const nav = screen.getByRole('navigation', { name: /Módulos/i })
    fireEvent.click(within(nav).getByRole('link', { name: /Módulo 2/i }))

    // El módulo carga de forma diferida (React.lazy): esperamos a su encabezado.
    expect(
      await screen.findByRole('heading', { name: /Plano complejo y continuación analítica/i }),
    ).toBeInTheDocument()

    // El enlace del Módulo 2 queda marcado como activo (aria-current="page").
    expect(within(nav).getByRole('link', { name: /Módulo 2/i })).toHaveAttribute('aria-current', 'page')
  })

  it('navega al lector de papers', async () => {
    renderApp('/')
    const nav = screen.getByRole('navigation', { name: /Módulos/i })
    fireEvent.click(within(nav).getByRole('link', { name: /Lector de papers/i }))
    expect(await screen.findByRole('heading', { name: /Lector de papers/i })).toBeInTheDocument()
  })
})
