import { useEffect, useRef } from 'react'
import Plotly from 'plotly.js-basic-dist-min'

type LinePlotProps = {
  /** Trazas de Plotly (array de objetos de traza). */
  data: unknown[]
  layout?: Record<string, unknown>
  config?: Record<string, unknown>
  className?: string
  ariaLabel?: string
}

// ¿Puntero grueso (dedo)? En ese caso ocultamos la barra de herramientas de Plotly, que en táctil
// estorba; el pinch-zoom y el pan nativos siguen funcionando. En desktop (puntero fino) se deja el
// comportamiento por defecto (barra al pasar el ratón) → regresión cero. (Fase 9, C)
const COARSE_POINTER =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(pointer: coarse)').matches

// Sin logo de Plotly; responsivo al ancho disponible (se reajusta al rotar/redimensionar el móvil).
const DEFAULT_CONFIG: Record<string, unknown> = {
  responsive: true,
  displaylogo: false,
  displayModeBar: COARSE_POINTER ? false : undefined,
}

/**
 * Envoltorio de Plotly para gráficas de línea (G1, G2, G4, G5, G7 del road map).
 * Actualiza la gráfica in situ con Plotly.react cuando cambian los datos → responde
 * en vivo a los controles (M3). Limpia con Plotly.purge al desmontar.
 */
export default function LinePlot({ data, layout, config, className, ariaLabel }: LinePlotProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    void Plotly.react(el, data, layout ?? {}, config ?? DEFAULT_CONFIG)
  }, [data, layout, config])

  useEffect(() => {
    const el = ref.current
    return () => {
      if (el) Plotly.purge(el)
    }
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      role="img"
      aria-label={ariaLabel}
      data-testid="line-plot"
    />
  )
}
