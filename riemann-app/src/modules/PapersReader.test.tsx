import { beforeEach, describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../test/utils'
import PapersReader from './PapersReader'

beforeEach(() => {
  window.localStorage.clear()
})

describe('Lector de papers', () => {
  it('monta con enlaces a las fuentes (y SIN PDFs incrustados)', () => {
    const { container } = renderWithProviders(<PapersReader />)

    // Hay enlaces externos a fuentes (arXiv, Wikipedia, Clay…), todos con href http(s).
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
    expect(links.every((a) => /^https?:\/\//.test(a.getAttribute('href') || ''))).toBe(true)

    // No se incrusta contenido con copyright (sin PDFs/iframes/embeds).
    expect(container.querySelectorAll('iframe, embed, object').length).toBe(0)
  })

  it('enseña a distinguir condicional de incondicional y marca las "pruebas" como no validadas (M6)', () => {
    const { container } = renderWithProviders(<PapersReader />)
    const text = container.textContent || ''
    expect(text).toMatch(/condicional/i)
    expect(text).toMatch(/incondicional/i)
    expect(text).toMatch(/no validad/i)
    expect(text).toMatch(/no está resuelta/i)
  })

  it('conecta con la Fase 2 del proyecto (G7 reproduce el análisis de espaciados)', () => {
    const { container } = renderWithProviders(<PapersReader />)
    expect(container.textContent || '').toMatch(/Fase 2|precálculo de ceros|G7/i)
  })
})
