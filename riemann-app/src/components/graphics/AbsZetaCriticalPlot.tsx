import { useId, useMemo, useState } from 'react'
import LinePlot from './LinePlot'
import { sampleCriticalLine, sliceUpTo } from '../../lib/criticalLine'
import { firstZeros } from '../../lib/zeros'
import { GRAPH } from '../../lib/colors'

const SAMPLE_TERMS = 2500 // pocos términos: la curva basta para ver los toques (velocidad)
const T_MIN = 2
const T_MAX = 40
const STEP = 0.1

const COL_CURVE = GRAPH.accent // |ζ| — acento teal
const COL_ZERO = GRAPH.reference // ceros (de zeros.json)
const AXIS = GRAPH.muted

const ALL_ZEROS = firstZeros(60)

/**
 * G4 — |ζ(½+it)| sobre la línea crítica (Plotly, interactiva). Los ceros son los puntos donde
 * la curva TOCA cero. Slider del rango de t (M3). Las marcas usan los t exactos de zeros.json.
 */
export default function AbsZetaCriticalPlot() {
  const [tMax, setTMax] = useState(26)
  const sliderId = useId()

  const samples = useMemo(() => sampleCriticalLine(T_MIN, T_MAX, STEP, SAMPLE_TERMS), [])
  const view = useMemo(() => sliceUpTo(samples, tMax), [samples, tMax])
  const zerosInView = useMemo(() => ALL_ZEROS.filter((z) => z.t <= tMax), [tMax])

  const data = useMemo(
    () => [
      {
        x: view.ts,
        y: view.abs,
        type: 'scatter',
        mode: 'lines',
        line: { color: COL_CURVE, width: 2 },
        name: '|ζ(½+it)|',
        hovertemplate: 't=%{x:.2f}<br>|ζ|=%{y:.3f}<extra></extra>',
      },
      {
        x: zerosInView.map((z) => z.t),
        y: zerosInView.map(() => 0),
        type: 'scatter',
        mode: 'markers',
        marker: { color: COL_ZERO, size: 9, symbol: 'circle-open', line: { width: 2 } },
        name: 'ceros ρₙ',
        hovertemplate: 'ρ en t=%{x:.4f}<extra></extra>',
      },
    ],
    [view, zerosInView],
  )

  const layout = useMemo(
    () => ({
      margin: { l: 44, r: 16, t: 12, b: 40 },
      xaxis: { title: { text: 't' }, zeroline: false, color: AXIS, gridcolor: 'rgba(100,116,139,0.18)' },
      yaxis: { title: { text: '|ζ(½+it)|' }, rangemode: 'tozero', color: AXIS, gridcolor: 'rgba(100,116,139,0.18)' },
      legend: { orientation: 'h', y: 1.15, x: 0, font: { color: AXIS } },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: { size: 12, color: AXIS },
      height: 300,
    }),
    [],
  )

  return (
    <figure className="m-0">
      <LinePlot data={data} layout={layout} className="w-full" ariaLabel={`Módulo de zeta en la línea crítica para t hasta ${tMax}`} />
      <figcaption className="mt-3 space-y-2">
        <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white/60 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200">
          <label htmlFor={sliderId} className="font-medium">
            t máx
          </label>
          <input
            id={sliderId}
            type="range"
            min={16}
            max={T_MAX}
            step={1}
            value={tMax}
            onChange={(e) => setTMax(Number(e.target.value))}
            aria-valuetext={`t hasta ${tMax}`}
            className="h-1 flex-1 cursor-pointer accent-accent-600"
          />
          <output className="w-12 text-right font-medium tabular-nums text-accent-700 dark:text-accent-300">{tMax}</output>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Cada vez que la curva toca cero hay un cero de ζ; los círculos marcan los ρₙ exactos (zeros.json). ζ se evalúa
          con la suma de η (pocos términos): basta para los primeros ceros; para t mucho mayor haría falta Riemann–Siegel.
        </p>
      </figcaption>
    </figure>
  )
}
