import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import GraphicErrorBoundary from './GraphicErrorBoundary'

function Boom(): never {
  throw new Error('fallo de gráfica')
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('GraphicErrorBoundary (robustez por gráfica)', () => {
  it('una gráfica que lanza NO tumba el módulo: muestra fallback y el resto sigue', () => {
    // React imprime el error capturado por consola; lo silenciamos para no ensuciar la salida.
    vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <div>
        <p>contenido del módulo</p>
        <GraphicErrorBoundary label="G-test">
          <Boom />
        </GraphicErrorBoundary>
      </div>,
    )

    expect(screen.getByText(/No se pudo cargar esta gráfica/i)).toBeInTheDocument()
    expect(screen.getByText('contenido del módulo')).toBeInTheDocument()
  })

  it('renderiza los hijos con normalidad cuando no hay error', () => {
    render(
      <GraphicErrorBoundary>
        <p>gráfica ok</p>
      </GraphicErrorBoundary>,
    )
    expect(screen.getByText('gráfica ok')).toBeInTheDocument()
  })
})
