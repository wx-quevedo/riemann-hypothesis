import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { applyTheme, initialTheme, storeTheme, type Theme } from '../lib/theme'
import { ThemeContext, type ThemeContextValue } from './theme-context'

type ThemeProviderProps = {
  children: ReactNode
  /** Tema inicial forzado (sobre todo para pruebas deterministas). Por defecto: guardado/sistema. */
  initial?: Theme
}

/**
 * Fuente única de verdad del tema a nivel de toda la app (sección 7). Aplica la clase `dark`
 * al <html>, persiste la elección y la expone por contexto para que cualquier toggle quede
 * sincronizado. El hook `useTheme` vive en ./theme-context.
 */
export function ThemeProvider({ children, initial }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => initial ?? initialTheme())

  useEffect(() => {
    applyTheme(theme)
    storeTheme(theme)
  }, [theme])

  const setTheme = useCallback((t: Theme) => setThemeState(t), [])
  const toggle = useCallback(() => setThemeState((t) => (t === 'dark' ? 'light' : 'dark')), [])

  const value = useMemo<ThemeContextValue>(() => ({ theme, setTheme, toggle }), [theme, setTheme, toggle])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
