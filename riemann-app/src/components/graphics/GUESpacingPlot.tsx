import { useId, useMemo, useState } from 'react'
import LinePlot from './LinePlot'
import { histogram, meanSpacing, unfoldedSpacings, wignerGUE } from '../../lib/spacingStats'
import { sampleRange } from '../../lib/plotScale'
import { ZERO_COUNT } from '../../lib/zeros'
import { GRAPH } from '../../lib/colors'

const S_MAX = 3
const BINS = 30
const CURVE_PTS = 120

const COL_HIST = 'rgba(13,148,136,0.55)' // histograma de ceros reales — teal translúcido (acento)
const COL_GUE = GRAPH.reference // curva GUE (Wigner)
const AXIS = GRAPH.muted

// Curva GUE estática (no depende de N).
const GUE_X = sampleRange(0, S_MAX, CURVE_PTS)
const GUE_Y = GUE_X.map(wignerGUE)

/**
 * G7 — histograma de los espaciados NORMALIZADOS de los ceros reales (zeros.json) superpuesto a la
 * ley GUE (conjetura de Wigner). Se ve que los ceros siguen la estadística de matrices aleatorias:
 * repulsión (p(0)=0), no azar puro. Control: número de ceros incluidos (M3).
 */
export default function GUESpacingPlot() {
  const [numZeros, setNumZeros] = useState(500)
  const sliderId = useId()

  const hist = useMemo(() => histogram(unfoldedSpacings(numZeros), 0, S_MAX, BINS), [numZeros])
  const mean = useMemo(() => meanSpacing(numZeros), [numZeros])

  const data = useMemo(
    () => [
      {
        x: hist.centers,
        y: hist.density,
        type: 'bar',
        marker: { color: COL_HIST },
        name: 'ceros reales',
        hovertemplate: 's=%{x:.2f}<br>densidad=%{y:.3f}<extra></extra>',
      },
      {
        x: GUE_X,
        y: GUE_Y,
        type: 'scatter',
        mode: 'lines',
        line: { color: COL_GUE, width: 2.5 },
        name: 'ley GUE (Wigner)',
        hovertemplate: 's=%{x:.2f}<br>GUE=%{y:.3f}<extra></extra>',
      },
    ],
    [hist],
  )

  const layout = useMemo(
    () => ({
      margin: { l: 44, r: 16, t: 12, b: 40 },
      xaxis: { title: { text: 'espaciado normalizado s' }, zeroline: false, color: AXIS, gridcolor: 'rgba(100,116,139,0.18)' },
      yaxis: { title: { text: 'densidad' }, rangemode: 'tozero', color: AXIS, gridcolor: 'rgba(100,116,139,0.18)' },
      legend: { orientation: 'h', y: 1.15, x: 0, font: { color: AXIS } },
      bargap: 0.05,
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: { size: 12, color: AXIS },
      height: 320,
    }),
    [],
  )

  return (
    <figure className="m-0">
      <LinePlot data={data} layout={layout} className="w-full" ariaLabel={`Espaciados de ${numZeros} ceros vs ley GUE`} />
      <figcaption className="mt-3 space-y-2">
        <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white/60 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200">
          <label htmlFor={sliderId} className="font-medium">
            nº de ceros
          </label>
          <input
            id={sliderId}
            type="range"
            min={50}
            max={ZERO_COUNT}
            step={50}
            value={numZeros}
            onChange={(e) => setNumZeros(Number(e.target.value))}
            aria-valuetext={`${numZeros} ceros`}
            className="h-1 flex-1 cursor-pointer accent-accent-600"
          />
          <output className="w-28 text-right font-medium tabular-nums text-accent-700 dark:text-accent-300">{numZeros} ceros</output>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Espaciado medio normalizado ≈ {mean.toFixed(3)} (la teoría predice 1). El histograma de los ceros reales sigue
          la curva GUE: cerca de s=0 casi no hay espaciados — los ceros se <strong>repelen</strong>, no son aleatorios.
        </p>
      </figcaption>
    </figure>
  )
}
