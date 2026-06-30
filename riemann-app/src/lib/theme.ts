export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'riemann:theme'

/**
 * Aplica el tema al elemento <html>:
 *  - alterna la clase `dark` (para Tailwind darkMode:'class')
 *  - fija el atributo data-theme (gancho de estilos / pruebas)
 */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.setAttribute('data-theme', theme)
}

/** Lee el tema guardado en localStorage, si lo hay y es válido. */
export function loadStoredTheme(): Theme | null {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY)
    return v === 'light' || v === 'dark' ? v : null
  } catch {
    return null
  }
}

/** Persiste el tema elegido (silencioso si localStorage no está disponible). */
export function storeTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* almacenamiento no disponible: el tema simplemente no se recuerda */
  }
}

/** Tema inicial: lo guardado tiene prioridad; si no, la preferencia del sistema; por defecto, claro. */
export function initialTheme(): Theme {
  const stored = loadStoredTheme()
  if (stored) return stored
  const canQuery = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
  if (canQuery && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}
