import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { loadProgress, saveProgress } from '../lib/progress'
import { ProgressContext, type ProgressContextValue } from './progress-context'

type ProgressProviderProps = {
  children: ReactNode
}

/**
 * Estado de progreso a nivel de app, persistido en localStorage. Lo consumen tanto la
 * navegación (check discreto por módulo) como cada página de módulo (botón "marcar completado").
 * El hook `useProgress` vive en ./progress-context.
 */
export function ProgressProvider({ children }: ProgressProviderProps) {
  const [completed, setCompleted] = useState<Set<string>>(() => new Set(loadProgress()))

  useEffect(() => {
    saveProgress([...completed])
  }, [completed])

  const setComplete = useCallback((id: string, value: boolean) => {
    setCompleted((prev) => {
      const has = prev.has(id)
      if (value === has) return prev
      const next = new Set(prev)
      if (value) next.add(id)
      else next.delete(id)
      return next
    })
  }, [])

  const toggle = useCallback((id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const value = useMemo<ProgressContextValue>(
    () => ({
      completed,
      isComplete: (id: string) => completed.has(id),
      toggle,
      setComplete,
      count: completed.size,
    }),
    [completed, toggle, setComplete],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}
