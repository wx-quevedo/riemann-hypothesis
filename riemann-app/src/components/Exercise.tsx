import type { ReactNode } from 'react'
import clsx from 'clsx'
import Accordion from './Accordion'

export type ExerciseLayer = 'intuicion' | 'formal' | 'avanzado'
export type ExerciseStatus = 'idle' | 'correct' | 'error'

type ExerciseProps = {
  /** Enunciado del ejercicio. */
  prompt: ReactNode
  /** Capa de dificultad (intuición/formal/avanzado). */
  layer: ExerciseLayer
  /** Pista, plegable (M2). */
  hint: ReactNode
  /** Solución paso a paso, plegable (M1/M2). */
  solution: ReactNode
  /** Estado visual: sin intentar / correcto / error. Solo armazón visual en Fase 1. */
  status?: ExerciseStatus
  /** Zona de comprobador (placeholder en Fase 1; la lógica numérica llega después). */
  checker?: ReactNode
  className?: string
}

const LAYER_LABEL: Record<ExerciseLayer, string> = {
  intuicion: 'Intuición',
  formal: 'Formal',
  avanzado: 'Avanzado',
}

const STATUS_META: Record<ExerciseStatus, { label: string; badge: string; ring: string }> = {
  idle: {
    label: 'Sin intentar',
    badge: 'border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300',
    ring: 'border-slate-200 dark:border-slate-800',
  },
  correct: {
    label: 'Correcto',
    badge: 'border-green-400 text-green-700 dark:border-green-500/40 dark:text-green-300',
    ring: 'border-green-400/60 dark:border-green-500/40',
  },
  error: {
    label: 'Hay un error',
    badge: 'border-red-400 text-red-700 dark:border-red-500/40 dark:text-red-300',
    ring: 'border-red-400/60 dark:border-red-500/40',
  },
}

/**
 * Contenedor de ejercicio (sin lógica matemática todavía, Fase 1). Reúne enunciado, capa de
 * dificultad, pista y solución plegables (M2), una zona de comprobador (placeholder) y un
 * estado visual sobrio (sin intentar / correcto=verde / error=rojo) según la prop `status`.
 */
export default function Exercise({ prompt, layer, hint, solution, status = 'idle', checker, className }: ExerciseProps) {
  const meta = STATUS_META[status]

  return (
    <section
      data-testid="exercise"
      data-status={status}
      aria-label="Ejercicio"
      className={clsx('space-y-4 rounded-xl border bg-white/60 p-5 dark:bg-slate-900/40', meta.ring, className)}
    >
      <header className="flex items-start justify-between gap-3">
        <span className="rounded-md border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-500 dark:border-slate-700 dark:text-slate-400">
          Ejercicio · {LAYER_LABEL[layer]}
        </span>
        <span
          data-testid="exercise-status"
          className={clsx('rounded-full border px-2.5 py-0.5 text-xs font-medium', meta.badge)}
        >
          {meta.label}
        </span>
      </header>

      <div className="text-[15px] leading-relaxed text-slate-800 dark:text-slate-100">{prompt}</div>

      <div className="space-y-2">
        <Accordion title="Pista">{hint}</Accordion>
        <Accordion title="Solución paso a paso">{solution}</Accordion>
      </div>

      {/* Zona de comprobador: en Fase 1 es un placeholder; la verificación numérica llega después. */}
      <div className="rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        {checker ?? 'Comprobador numérico — pendiente (la lógica matemática llega en fases posteriores).'}
      </div>
    </section>
  )
}
