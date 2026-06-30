import { useId, useState } from 'react'
import type { ReactNode } from 'react'
import Exercise from './Exercise'
import type { ExerciseLayer, ExerciseStatus } from './Exercise'

type NumericExerciseProps = {
  prompt: ReactNode
  layer: ExerciseLayer
  hint: ReactNode
  solution: ReactNode
  /** Etiqueta del campo de respuesta. */
  inputLabel: string
  /** Decide si el valor introducido es correcto. */
  check: (value: number) => boolean
  /** Retroalimentación específica tras comprobar (p. ej. el valor de referencia que calcula la app). */
  renderFeedback?: (value: number, correct: boolean) => ReactNode
  step?: number
  placeholder?: string
}

/**
 * Ejercicio con COMPROBADOR NUMÉRICO (Fase 3). Envuelve el armazón visual `Exercise` y le
 * controla el estado: el usuario escribe un número, pulsa "Comprobar" y al instante el
 * ejercicio pasa a verde (correcto) o rojo (error) con retroalimentación específica (UX §7).
 * Cambiar la respuesta vuelve el estado a neutro.
 */
export default function NumericExercise({
  prompt,
  layer,
  hint,
  solution,
  inputLabel,
  check,
  renderFeedback,
  step,
  placeholder,
}: NumericExerciseProps) {
  const [raw, setRaw] = useState('')
  const [status, setStatus] = useState<ExerciseStatus>('idle')
  const [message, setMessage] = useState<ReactNode>(null)
  const inputId = useId()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const value = Number(raw)
    if (raw.trim() === '' || Number.isNaN(value)) {
      setStatus('idle')
      setMessage('Introduce un número para comprobar.')
      return
    }
    const ok = check(value)
    setStatus(ok ? 'correct' : 'error')
    setMessage(
      <>
        <span className="font-medium">{ok ? 'Correcto.' : 'Revisa el resultado.'}</span>{' '}
        {renderFeedback?.(value, ok)}
      </>,
    )
  }

  const checker = (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor={inputId} className="text-xs font-medium text-slate-600 dark:text-slate-300">
            {inputLabel}
          </label>
          <input
            id={inputId}
            type="number"
            inputMode="decimal"
            step={step ?? 'any'}
            placeholder={placeholder}
            value={raw}
            onChange={(e) => {
              setRaw(e.target.value)
              setStatus('idle')
              setMessage(null)
            }}
            // El tamaño 16px en táctil (evita el zoom de iOS) lo aplica index.css con @media (pointer: coarse).
            className="touch-target w-40 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-accent-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>
        <button
          type="submit"
          className="touch-target rounded-md border border-accent-500 bg-accent-50 px-3 py-1.5 text-sm font-medium text-accent-700 transition-colors hover:bg-accent-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:border-accent-500/40 dark:bg-accent-500/10 dark:text-accent-200 dark:hover:bg-accent-500/20"
        >
          Comprobar
        </button>
      </div>
      {message && (
        <p
          data-testid="checker-feedback"
          role="status"
          aria-live="polite"
          className={
            status === 'correct'
              ? 'text-sm text-green-700 dark:text-green-300'
              : status === 'error'
                ? 'text-sm text-red-700 dark:text-red-300'
                : 'text-sm text-slate-500 dark:text-slate-400'
          }
        >
          {message}
        </p>
      )}
    </form>
  )

  return <Exercise prompt={prompt} layer={layer} hint={hint} solution={solution} status={status} checker={checker} />
}
