import { useId, useMemo, useState } from 'react'
import LinePlot from './LinePlot'
import { liApprox, primesUpTo, xOverLnx } from '../../lib/primes'
import { GRAPH } from '../../lib/colors'

// Colores con significado (sección 3 del skill), desde la paleta central (consistencia).
const COL_PI = GRAPH.accentStrong // π(x) — la cuenta real, protagonista
const COL_LI = GRAPH.reference // li(x) — sobreestima
const COL_XLNX = GRAPH.muted // x/ln x — subestima
const AXIS = GRAPH.muted

type PiPoint = { xs: number[]; pi: number[]; li: number[]; xlnx: number[] }

function computeCurves(xMax: number): PiPoint {
  const primes = primesUpTo(xMax)
  const xs: number[] = []
  const pi: number[] = []
  const li: number[] = []
  const xlnx: number[] = []
  let count = 0
  let pIdx = 0
  for (let x = 2; x <= xMax; x++) {
    while (pIdx < primes.length && primes[pIdx] === x) {
      count++
      pIdx++
    }
    xs.push(x)
    pi.push(count) // π(x) exacto en cada entero
    li.push(liApprox(x))
    xlnx.push(xOverLnx(x))
  }
  return { xs, pi, li, xlnx }
}

/**
 * G1 — π(x) vs x/ln x vs li(x), con slider del rango x (M3). Al mover x se ve cómo li(x)
 * sobreestima y x/ln x subestima la cuenta real π(x). Render con Plotly (LinePlot).
 */
export default function PrimeCountingPlot() {
  const [xMax, setXMax] = useState(200)
  const sliderId = useId()

  const c = useMemo(() => computeCurves(xMax), [xMax])

  const data = useMemo(
    () => [
      {
        x: c.xs,
        y: c.pi,
        type: 'scatter',
        mode: 'lines',
        line: { color: COL_PI, width: 2.5, shape: 'hv' },
        name: 'π(x)',
        hovertemplate: 'x=%{x}<br>π(x)=%{y}<extra></extra>',
      },
      {
        x: c.xs,
        y: c.li,
        type: 'scatter',
        mode: 'lines',
        line: { color: COL_LI, width: 2 },
        name: 'li(x)',
        hovertemplate: 'x=%{x}<br>li(x)=%{y:.1f}<extra></extra>',
      },
      {
        x: c.xs,
        y: c.xlnx,
        type: 'scatter',
        mode: 'lines',
        line: { color: COL_XLNX, width: 2, dash: 'dot' },
        name: 'x / ln x',
        hovertemplate: 'x=%{x}<br>x/ln x=%{y:.1f}<extra></extra>',
      },
    ],
    [c],
  )

  const layout = useMemo(
    () => ({
      margin: { l: 48, r: 16, t: 12, b: 40 },
      xaxis: { title: { text: 'x' }, zeroline: false, color: AXIS, gridcolor: 'rgba(100,116,139,0.18)' },
      yaxis: { title: { text: 'conteo' }, rangemode: 'tozero', color: AXIS, gridcolor: 'rgba(100,116,139,0.18)' },
      legend: { orientation: 'h', y: 1.12, x: 0, font: { color: AXIS } },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: { size: 12, color: AXIS },
      height: 340,
    }),
    [],
  )

  return (
    <figure className="m-0">
      <LinePlot data={data} layout={layout} className="w-full" ariaLabel={`π(x), li(x) y x/ln x para x hasta ${xMax}`} />
      <figcaption className="mt-3 space-y-2">
        <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white/60 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200">
          <label htmlFor={sliderId} className="font-medium">
            x máx
          </label>
          <input
            id={sliderId}
            type="range"
            min={20}
            max={1000}
            step={10}
            value={xMax}
            onChange={(e) => setXMax(Number(e.target.value))}
            aria-valuetext={`x hasta ${xMax}`}
            className="h-1 flex-1 cursor-pointer accent-accent-600"
          />
          <output className="w-16 text-right font-medium tabular-nums text-accent-700 dark:text-accent-300">{xMax}</output>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          li(x) (indigo) sobreestima; x/ln x (gris, punteado) subestima; π(x) (teal) es la cuenta real.
        </p>
      </figcaption>
    </figure>
  )
}
