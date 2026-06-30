import clsx from 'clsx'
import { useProgress } from './progress-context'

type SectionCompleteButtonProps = {
  /** Id de la sección (p. ej. 'modulo-0', 'papers'). */
  sectionId: string
  className?: string
}

/**
 * Marca/desmarca una sección como completada (sección 7: progreso visible pero sobrio).
 * Check discreto, sin gamificación. El estado se persiste vía ProgressProvider.
 */
export default function SectionCompleteButton({ sectionId, className }: SectionCompleteButtonProps) {
  const { isComplete, toggle } = useProgress()
  const done = isComplete(sectionId)

  return (
    <button
      type="button"
      onClick={() => toggle(sectionId)}
      aria-pressed={done}
      className={clsx(
        'touch-target inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
        done
          ? 'border-green-400 text-green-700 dark:border-green-500/40 dark:text-green-300'
          : 'border-slate-300 text-slate-600 hover:border-accent-500 hover:text-accent-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-accent-400 dark:hover:text-accent-300',
        className,
      )}
    >
      <span aria-hidden="true">{done ? '✓' : '○'}</span>
      {done ? 'Completado' : 'Marcar como completado'}
    </button>
  )
}
