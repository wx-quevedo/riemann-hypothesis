import { useTheme } from './theme-context'

/**
 * Botón de modo claro/oscuro (sección 7). Control sobrio, esquinas suaves, borde hairline,
 * sentence case, sin estilo de CTA de e-commerce. Lee/escribe el tema en el ThemeProvider,
 * así que cualquier toggle de la app queda sincronizado.
 */
export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      title="Cambiar tema claro/oscuro"
      className="touch-target rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 transition-colors hover:border-accent-500 hover:text-accent-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:border-slate-700 dark:text-slate-200 dark:hover:border-accent-400 dark:hover:text-accent-300"
    >
      {isDark ? 'Modo claro' : 'Modo oscuro'}
    </button>
  )
}
