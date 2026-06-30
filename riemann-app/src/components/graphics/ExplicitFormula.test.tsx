import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import ExplicitFormula from './ExplicitFormula'

// Mock mínimo de un contexto 2D (las llamadas que hace draw()). `stroke` es el espía clave.
function makeMockCtx() {
  return {
    setTransform: vi.fn(),
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    setLineDash: vi.fn(),
    fillText: vi.fn(),
    font: '',
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
  }
}

// Monta el componente simulando el ResizeObserver (tamaño 0 al montar, real al llamar deliver),
// igual que el patrón de canvas de Fase 4.
function mountWithResize() {
  let roCb: ResizeObserverCallback | null = null
  class MockResizeObserver {
    constructor(cb: ResizeObserverCallback) {
      roCb = cb
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal('ResizeObserver', MockResizeObserver)
  const utils = render(<ExplicitFormula />)
  const container = screen.getByTestId('explicit-formula')
  const deliver = (width: number, height: number) => {
    Object.defineProperty(container, 'clientWidth', { configurable: true, value: width })
    Object.defineProperty(container, 'clientHeight', { configurable: true, value: height })
    act(() => {
      roCb?.([], {} as ResizeObserver)
    })
  }
  return { ...utils, deliver }
}

const origGetContext = HTMLCanvasElement.prototype.getContext

afterEach(() => {
  HTMLCanvasElement.prototype.getContext = origGetContext
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('ExplicitFormula (G6)', () => {
  it('inicializa el canvas tras llegar el tamaño y dibuja (patrón de Fase 4)', () => {
    const ctx = makeMockCtx()
    HTMLCanvasElement.prototype.getContext = (() => ctx) as unknown as typeof HTMLCanvasElement.prototype.getContext

    const { deliver } = mountWithResize()
    deliver(800, 380)

    expect(screen.queryByTestId('canvas-fallback')).not.toBeInTheDocument()
    expect(ctx.stroke).toHaveBeenCalled() // dibujó las curvas
  })

  it('el slider de N actualiza la curva (cambia el dato y redibuja)', () => {
    const ctx = makeMockCtx()
    HTMLCanvasElement.prototype.getContext = (() => ctx) as unknown as typeof HTMLCanvasElement.prototype.getContext

    const { deliver } = mountWithResize()
    deliver(800, 380)

    const before = ctx.stroke.mock.calls.length
    fireEvent.change(screen.getByRole('slider'), { target: { value: '120' } })

    expect(screen.getByText('N = 120')).toBeInTheDocument()
    expect(ctx.stroke.mock.calls.length).toBeGreaterThan(before)
  })

  it('el botón play incrementa N con el tiempo', () => {
    vi.useFakeTimers()
    const ctx = makeMockCtx()
    HTMLCanvasElement.prototype.getContext = (() => ctx) as unknown as typeof HTMLCanvasElement.prototype.getContext

    const { deliver } = mountWithResize()
    deliver(800, 380)

    expect(screen.getByText('N = 20')).toBeInTheDocument() // N por defecto
    fireEvent.click(screen.getByRole('button', { name: /reproducir/i }))
    act(() => {
      vi.advanceTimersByTime(400) // ~10 ticks × +2
    })

    expect(Number((screen.getByRole('slider') as HTMLInputElement).value)).toBeGreaterThan(20)
  })

  it('muestra el fallback si no hay contexto 2D', () => {
    // getContext global devuelve null (setup.ts) → sin lienzo.
    const { deliver } = mountWithResize()
    deliver(800, 380)
    expect(screen.getByTestId('canvas-fallback')).toBeInTheDocument()
  })

  it('respeta prefers-reduced-motion: sin botón reproducir (no autoplay)', () => {
    // matchMedia → reduce: true.
    vi.stubGlobal('matchMedia', (q: string) => ({
      matches: /prefers-reduced-motion/.test(q),
      media: q,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }))
    const ctx = makeMockCtx()
    HTMLCanvasElement.prototype.getContext = (() => ctx) as unknown as typeof HTMLCanvasElement.prototype.getContext

    const { deliver } = mountWithResize()
    deliver(800, 380)

    expect(screen.queryByRole('button', { name: /reproducir/i })).not.toBeInTheDocument()
    expect(screen.getByText(/movimiento reducido/i)).toBeInTheDocument()
  })
})
