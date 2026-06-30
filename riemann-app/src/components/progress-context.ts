import { createContext, useContext } from 'react'

export type ProgressContextValue = {
  /** Ids de sección completados. */
  completed: ReadonlySet<string>
  isComplete: (id: string) => boolean
  toggle: (id: string) => void
  setComplete: (id: string, value: boolean) => void
  count: number
}

// Context + hook aparte del Provider (regla react/only-export-components / fast refresh).
export const ProgressContext = createContext<ProgressContextValue | null>(null)

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress debe usarse dentro de <ProgressProvider>')
  return ctx
}
