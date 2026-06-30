import { useId, useMemo, useState } from 'react'
import LinePlot from './LinePlot'
import { BASEL, zetaReal } from '../../lib/zeta'
import { GRAPH } from '../../lib/colors'

// Rango fiable para la suma directa (ver límite documentado en zeta.ts). Por debajo de 1.2
// la suma parcial converge tan lento que no es honesto graficarla como ζ(s).
const S_MIN = 1.2
const S_MAX = 8

const COL_CURVE = GRAPH.accent // ζ(s) — acento teal
const COL_MARK = GRAPH.accentStrong // punto en s actual
const COL_SPECIAL = GRAPH.reference // ζ(2)=π²/6
const AXIS = GRAPH.muted

// Más términos cerca de s=1 (cola lenta), acotado para mantener la interacción fluida.
function termsFor(s: number): number {
  return Math.min(200000, Math.max(2000, Math.round(20000 / (s - 1))))
}

/**
 * G2 — ζ(s) para s real en [1.2, 8], con slider de s (M3). La curva es la suma parcial
 * directa (honesta: cerca de s=1 subestima — ver nota en UI y en zeta.ts). Marca ζ(2)=π²/6
 * y un punto que sigue al slider mostrando ζ(s) en vivo.
 */
export default function ZetaRealPlot() {
  const [s, setS] = useState(2)
  const sliderId = useId()

  // Curva ESTÁTICA (no depende del slider): se calcula una vez.
  const curve = useMemo(() => {
    const xs: number[] = []
    const ys: number[] = []
    const STEPS = 140
    for (let i = 0; i <= STEPS; i++) {
      const sv = S_MIN + ((S_MAX - S_MIN) * i) / STEPS
      xs.push(sv)
      ys.push(zetaReal(sv, termsFor(sv)))
    }
    return { xs, ys }
  }, [])

  // ζ en el s actual: se recalcula al mover el slider (la gráfica responde en vivo).
  const zAtS = useMemo(() => zetaReal(s, termsFor(s)), [s])

  const data = useMemo(
    () => [
      {
        x: curve.xs,
        y: curve.ys,
        type: 'scatter',
        mode: 'lines',
        line: { color: COL_CURVE, width: 2.5 },
        name: 'ζ(s) ≈ suma parcial',
        hovertemplate: 's=%{x:.2f}<br>ζ(s)≈%{y:.4f}<extra></extra>',
      },
      {
        x: [2],
        y: [BASEL],
        type: 'scatter',
        mode: 'markers',
        marker: { color: COL_SPECIAL, size: 11, symbol: 'diamond' },
        name: 'ζ(2)=π²/6',
        hovertemplate: 'ζ(2)=π²/6≈%{y:.4f}<extra></extra>',
      },
      {
        x: [s],
        y: [zAtS],
        type: 'scatter',
        mode: 'markers',
        marker: { color: COL_MARK, size: 13, line: { color: '#fff', width: 1 } },
        name: 'ζ(s)',
        hovertemplate: `s=${s.toFixed(2)}<br>ζ(s)≈%{y:.4f}<extra></extra>`,
      },
    ],
    [curve, s, zAtS],
  )

  const layout = useMemo(
    () => ({
      margin: { l: 48, r: 16, t: 12, b: 40 },
      xaxis: { title: { text: 's' }, zeroline: false, color: AXIS, gridcolor: 'rgba(100,116,139,0.18)' },
      yaxis: { title: { text: 'ζ(s)' }, color: AXIS, gridcolor: 'rgba(100,116,139,0.18)' },
      legend: { orientation: 'h', y: 1.12, x: 0, font: { color: AXIS } },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: { size: 12, color: AXIS },
      height: 340,
    }),
    [],
  )

  const nearOne = s < 1.5

  return (
    <figure className="m-0">
      <LinePlot data={data} layout={layout} className="w-full" ariaLabel={`ζ(s) para s en [1.2, 8], con s = ${s.toFixed(1)}`} />
      <figcaption className="mt-3 space-y-2">
        <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white/60 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200">
          <label htmlFor={sliderId} className="font-medium">
            exponente s
          </label>
          <input
            id={sliderId}
            type="range"
            min={S_MIN}
            max={S_MAX}
            step={0.1}
            value={s}
            onChange={(e) => setS(Number(e.target.value))}
            aria-valuetext={`s = ${s.toFixed(1)}`}
            className="h-1 flex-1 cursor-pointer accent-accent-600"
          />
          <output className="w-28 text-right font-medium tabular-nums text-accent-700 dark:text-accent-300">
            ζ({s.toFixed(1)}) ≈ {zAtS.toFixed(4)}
          </output>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Curva por suma parcial directa.{' '}
          {nearOne
            ? 'Aviso: cerca de s = 1 la serie converge muy lento y esta suma subestima ζ(s).'
            : 'Para s ≳ 2 la suma directa es muy precisa.'}
        </p>
      </figcaption>
    </figure>
  )
}
