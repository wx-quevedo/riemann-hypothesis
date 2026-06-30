import clsx from 'clsx'

type GraphicPlaceholderProps = {
  /** Código de la gráfica según §4 del road map: 'G1'..'G7'. */
  code: string
  /** Nombre descriptivo (p. ej. 'π(x) vs aproximaciones'). */
  name: string
  /** Fase en la que se construirá (p. ej. 'Fase 3'). */
  phase: string
  /** Pista de controles que tendrá (M3), solo informativa por ahora. */
  controls?: string
  className?: string
}

/**
 * Marcador de una gráfica futura (G1–G7). Recuadro sobrio con borde discontinuo que reserva
 * el espacio y deja claro QUÉ irá aquí y CUÁNDO, para que el layout se vea completo sin
 * construir todavía la gráfica real (M3 se cumplirá cuando se implemente).
 */
export default function GraphicPlaceholder({ code, name, phase, controls, className }: GraphicPlaceholderProps) {
  return (
    <figure
      data-testid="graphic-placeholder"
      className={clsx(
        'flex min-h-[260px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-6 text-center dark:border-slate-700 dark:bg-slate-900/40',
        className,
      )}
    >
      <span className="rounded-full border border-accent-300 bg-accent-50 px-2.5 py-0.5 text-xs font-medium text-accent-700 dark:border-accent-500/40 dark:bg-accent-500/10 dark:text-accent-300">
        {code}
      </span>
      <figcaption className="text-sm font-medium text-slate-700 dark:text-slate-200">{name}</figcaption>
      {controls && (
        <p className="text-xs text-slate-500 dark:text-slate-400">Controles: {controls}</p>
      )}
      <p className="text-xs text-slate-400 dark:text-slate-500">Gráfica interactiva — pendiente de {phase}</p>
    </figure>
  )
}
