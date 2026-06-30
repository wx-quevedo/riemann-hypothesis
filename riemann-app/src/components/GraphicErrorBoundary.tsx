import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

type Props = { children: ReactNode; label?: string }
type State = { hasError: boolean }

/**
 * Error boundary POR GRÁFICA (Fase 8, robustez). Si una gráfica lanza al renderizar, se muestra un
 * aviso sobrio en su lugar y el RESTO del módulo (texto, derivaciones, ejercicios) sigue funcionando
 * — un fallo aislado no tumba la página.
 */
export default class GraphicErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('GraphicErrorBoundary: la gráfica falló al renderizar.', error, info)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="img"
          aria-label={`No se pudo cargar la gráfica${this.props.label ? `: ${this.props.label}` : ''}`}
          className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400"
        >
          <p>No se pudo cargar esta gráfica. El resto del módulo sigue disponible.</p>
        </div>
      )
    }
    return this.props.children
  }
}
