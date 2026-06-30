import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { renderApp } from '../test/utils'
import { loadProgress } from '../lib/progress'

beforeEach(() => {
  window.localStorage.clear()
})

describe('Sistema de progreso', () => {
  it('marcar una sección la persiste y la refleja en la navegación', async () => {
    renderApp('/modulo/0')
    const nav = screen.getByRole('navigation', { name: /Módulos/i })

    // El módulo carga diferido (React.lazy): esperamos a su botón de "marcar como completado".
    const markBtn = await screen.findByRole('button', { name: /marcar como completado/i })

    // Antes: el enlace del Módulo 0 no está marcado como completado.
    expect(within(nav).getByRole('link', { name: /Módulo 0/i })).not.toHaveAccessibleName(/completado/i)

    // Marcar como completado.
    fireEvent.click(markBtn)

    // Persiste en localStorage.
    expect(loadProgress()).toContain('modulo-0')

    // Se refleja en la navegación (el check añade "completado" al nombre accesible).
    expect(within(nav).getByRole('link', { name: /Módulo 0/i })).toHaveAccessibleName(/completado/i)
  })

  it('carga el progreso previo desde localStorage al iniciar', () => {
    window.localStorage.setItem('riemann:progress', JSON.stringify(['modulo-1']))

    renderApp('/')
    const nav = screen.getByRole('navigation', { name: /Módulos/i })
    expect(within(nav).getByRole('link', { name: /Módulo 1/i })).toHaveAccessibleName(/completado/i)
  })
})
