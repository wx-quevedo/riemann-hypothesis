import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import DomainColoring from './DomainColoring'

// En jsdom no hay WebGL (setup.ts fuerza getContext→null) → el componente debe caer a su
// fallback sin romperse. La lógica de mapeo/color/overlay se prueba aparte (domainColoring.test).

// Mock mínimo de un contexto WebGL válido: cubre todas las llamadas de initGL + draw.
function makeMockGl() {
  return {
    VERTEX_SHADER: 1,
    FRAGMENT_SHADER: 2,
    COMPILE_STATUS: 3,
    LINK_STATUS: 4,
    ARRAY_BUFFER: 5,
    STATIC_DRAW: 6,
    FLOAT: 7,
    TRIANGLES: 8,
    createShader: () => ({}),
    shaderSource: () => {},
    compileShader: () => {},
    getShaderParameter: () => true,
    getShaderInfoLog: () => '',
    deleteShader: () => {},
    createProgram: () => ({}),
    attachShader: () => {},
    linkProgram: () => {},
    getProgramParameter: () => true,
    getProgramInfoLog: () => '',
    createBuffer: () => ({}),
    bindBuffer: () => {},
    bufferData: () => {},
    getAttribLocation: () => 0,
    enableVertexAttribArray: () => {},
    vertexAttribPointer: () => {},
    getUniformLocation: () => ({}),
    useProgram: () => {},
    uniform4f: () => {},
    viewport: () => {},
    drawArrays: () => {},
    getExtension: () => null,
  }
}

// Monta el componente simulando el ResizeObserver real: el contenedor mide 0×0 al montar y un
// tamaño real cuando se llama a deliverSize (igual que en un navegador, donde el RO mide después).
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
  const utils = render(<DomainColoring />)
  const container = screen.getByTestId('domain-coloring')
  const deliverSize = (width: number, height: number) => {
    Object.defineProperty(container, 'clientWidth', { configurable: true, value: width })
    Object.defineProperty(container, 'clientHeight', { configurable: true, value: height })
    act(() => {
      roCb?.([], {} as ResizeObserver)
    })
  }
  return { ...utils, container, deliverSize }
}

const origGetContext = HTMLCanvasElement.prototype.getContext

// jsdom no trae PointerEvent: lo polirrellenamos sobre MouseEvent (que sí acepta clientX/clientY)
// para poder simular gestos táctiles con fireEvent.pointer*.
class FakePointerEvent extends MouseEvent {
  pointerType: string
  pointerId: number
  constructor(type: string, props: PointerEventInit = {}) {
    super(type, props)
    this.pointerType = props.pointerType ?? 'mouse'
    this.pointerId = props.pointerId ?? 0
  }
}

afterEach(() => {
  HTMLCanvasElement.prototype.getContext = origGetContext
  vi.unstubAllGlobals()
})

describe('DomainColoring (componente)', () => {
  it('expone los controles interactivos (zoom y reinicio)', () => {
    render(<DomainColoring />)
    expect(screen.getByRole('button', { name: /acercar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /alejar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reiniciar vista/i })).toBeInTheDocument()
  })

  it('muestra el fallback de WebGL cuando, ya con tamaño, no hay contexto GL', () => {
    // getContext global devuelve null (setup.ts) → sin GL aunque haya tamaño.
    const { deliverSize } = mountWithResize()
    deliverSize(420, 560)
    expect(screen.getByTestId('webgl-fallback')).toBeInTheDocument()
  })

  it('responde a Pointer Events táctiles: un dedo arrastra (pan) y la vista cambia (Fase 9)', () => {
    vi.stubGlobal('PointerEvent', FakePointerEvent)
    const mockGl = makeMockGl()
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement) {
      const w = this.parentElement?.clientWidth ?? 0
      return (w > 0 ? mockGl : null) as unknown as RenderingContext
    } as typeof HTMLCanvasElement.prototype.getContext

    const { container, deliverSize } = mountWithResize()
    deliverSize(420, 560) // GL listo → se dibuja la capa de anotaciones (línea crítica)

    // Posición en pantalla de la línea crítica Re(s)=½ antes del gesto.
    const lineBefore = container.querySelector('line')
    expect(lineBefore).not.toBeNull()
    const xBefore = Number(lineBefore?.getAttribute('x1'))

    // Un dedo: pointer down + move hacia la derecha (dx = +80) → pan; el contenido sigue al dedo,
    // así que la línea crítica se desplaza a la derecha (x mayor).
    const target = screen.getByTestId('domain-coloring')
    fireEvent.pointerDown(target, { pointerId: 1, pointerType: 'touch', clientX: 100, clientY: 280 })
    fireEvent.pointerMove(target, { pointerId: 1, pointerType: 'touch', clientX: 180, clientY: 280 })

    const xAfter = Number(container.querySelector('line')?.getAttribute('x1'))
    expect(xAfter).toBeGreaterThan(xBefore)
  })

  it('REGRESIÓN: no se queda en fallback cuando el tamaño llega tras el montaje (bug ANGLE 0×0)', () => {
    const mockGl = makeMockGl()
    // GL solo inicializa bien cuando el canvas YA tiene tamaño (modela ANGLE: init sobre 0×0 = inválido).
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement) {
      const w = this.parentElement?.clientWidth ?? 0
      return (w > 0 ? mockGl : null) as unknown as RenderingContext
    } as typeof HTMLCanvasElement.prototype.getContext

    const { deliverSize } = mountWithResize()

    // Tras montar, el contenedor mide 0×0. Con el FIX, init aún no corre → no hay fallback todavía.
    // (Con el bug, init corre al montar, GL falla en 0×0 y el fallback queda PERMANENTE.)
    expect(screen.queryByTestId('webgl-fallback')).not.toBeInTheDocument()

    // Llega el tamaño real (ResizeObserver) → init corre → GL válido → glReady = true.
    deliverSize(420, 560)

    expect(screen.queryByTestId('webgl-fallback')).not.toBeInTheDocument()
    // Señal positiva de que GL quedó listo: aparece el lector de cursor (solo si glReady).
    expect(screen.getByText(/mueve el cursor sobre el plano/i)).toBeInTheDocument()
  })
})
