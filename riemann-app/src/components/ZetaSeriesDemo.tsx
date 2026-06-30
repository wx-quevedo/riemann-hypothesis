import { useId, useMemo, useState } from 'react'
import LinePlot from './graphics/LinePlot'
import { partialSeries } from '../lib/series'

const N_MAX = 12
const ACCENT = '#0d9488' // teal-600 — color de acento del proyecto

/**
 * "Hola mundo" interactivo (M3): grafica los términos 1/n^s y un slider que cambia el
 * exponente s EN VIVO. Es la prueba mínima del patrón "toda gráfica responde a su control".
 * No calcula ζ(s); solo muestra cómo decaen sus términos al variar s.
 */
export default function ZetaSeriesDemo() {
  const [s, setS] = useState(2)
  const sliderId = useId()

  const points = useMemo(() => partialSeries(s, N_MAX), [s])

  // Cada cambio de s produce un nuevo objeto `data` → LinePlot re-alimenta Plotly (en vivo).
  const data = useMemo(
    () => [
      {
        x: points.map((p) => p.n),
        y: points.map((p) => p.term),
        type: 'scatter',
        mode: 'lines+markers',
        line: { color: ACCENT, width: 2 },
        marker: { color: ACCENT, size: 7 },
        hovertemplate: 'n = %{x}<br>1/n^s = %{y:.4f}<extra></extra>',
        name: '1/n^s',
      },
    ],
    [points],
  )

  const layout = useMemo(
    () => ({
      margin: { l: 52, r: 16, t: 12, b: 44 },
      xaxis: { title: { text: 'n' }, dtick: 1, zeroline: false },
      yaxis: { title: { text: '1 / nˢ' }, rangemode: 'tozero' },
      showlegend: false,
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: { size: 12 },
      height: 360,
    }),
    [],
  )

  return (
    <figure className="m-0">
      <LinePlot
        data={data}
        layout={layout}
        ariaLabel={`Términos 1/n^s para n de 1 a ${N_MAX}, con s = ${s.toFixed(1)}`}
        className="w-full"
      />
      {/* Controles agrupados junto a su gráfica, con el valor del parámetro siempre visible (M3 / sección 7). */}
      <figcaption className="mt-4 flex items-center gap-4 rounded-lg border border-slate-200 bg-white/60 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200">
        <label htmlFor={sliderId} className="font-medium">
          exponente s
        </label>
        <input
          id={sliderId}
          type="range"
          min={0.5}
          max={5}
          step={0.1}
          value={s}
          onChange={(e) => setS(Number(e.target.value))}
          aria-valuetext={`s = ${s.toFixed(1)}`}
          className="h-1 flex-1 cursor-pointer accent-accent-600"
        />
        <output htmlFor={sliderId} className="w-16 text-right font-medium tabular-nums text-accent-700 dark:text-accent-300">
          s = {s.toFixed(1)}
        </output>
      </figcaption>
    </figure>
  )
}
