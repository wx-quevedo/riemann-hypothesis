import { createContext, useContext } from 'react'
import type { Theme } from '../lib/theme'

export type ThemeContextValue = {
  theme: Theme
  setTheme: (t: Theme) => void
  toggle: () => void
}

// Context + hook viven aparte del componente Provider para que cada archivo de provider
// exporte solo un componente (regla react/only-export-components / fast refresh).
export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme debe usarse dentro de <ThemeProvider>')
  return ctx
}
