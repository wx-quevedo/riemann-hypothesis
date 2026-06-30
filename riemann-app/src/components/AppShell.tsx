import { Suspense, useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import clsx from 'clsx'
import ThemeToggle from './ThemeToggle'
import { useProgress } from './progress-context'
import { MODULES, PAPERS_SECTION } from '../modules/moduleContent'

type NavItem = {
  to: string
  end?: boolean
  primary: string
  secondary?: string
  sectionId: string | null
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', end: true, primary: 'Inicio', sectionId: null },
  ...MODULES.map((m) => ({ to: m.path, primary: m.code, secondary: m.navLabel, sectionId: m.sectionId })),
  { to: PAPERS_SECTION.path, primary: PAPERS_SECTION.navLabel, sectionId: PAPERS_SECTION.sectionId },
]

const TOTAL_SECTIONS = MODULES.length + 1 // 6 módulos + lector de papers

/**
 * Shell de la app. En desktop (≥lg): cabecera con marca + toggle de tema y navegación LATERAL
 * fija con los 6 módulos + lector (marca activo + check de completados). En móvil/tablet (<lg):
 * la lateral se oculta y la navegación pasa a un menú HAMBURGUESA (drawer) accesible (Fase 9, A).
 * El layout de desktop queda intacto (regresión cero).
 */
export default function AppShell() {
  const { isComplete, count } = useProgress()
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Cerrar el drawer con Escape (accesibilidad de teclado).
  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawerOpen])

  // Lista de enlaces reutilizada por la lateral (desktop) y el drawer (móvil). `onNavigate` cierra
  // el drawer al elegir una sección.
  const navLinks = (onNavigate?: () => void) =>
    NAV_ITEMS.map((item) => {
      const done = item.sectionId ? isComplete(item.sectionId) : false
      return (
        <li key={item.to}>
          <NavLink
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              clsx(
                'flex touch-target items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'border-accent-300 bg-accent-50 text-accent-800 dark:border-accent-500/40 dark:bg-accent-500/10 dark:text-accent-200'
                  : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900/60 dark:hover:text-slate-100',
              )
            }
          >
            <span className="min-w-0 flex-1">
              <span className="block font-medium">{item.primary}</span>
              {item.secondary && (
                <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{item.secondary}</span>
              )}
            </span>
            {done && (
              <span className="text-green-600 dark:text-green-400" aria-hidden="true">
                ✓
              </span>
            )}
            {done && <span className="sr-only">(completado)</span>}
          </NavLink>
        </li>
      )
    })

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
      <header className="flex items-center justify-between gap-3 border-b border-slate-200 py-4 dark:border-slate-800 sm:gap-6">
        <div className="flex min-w-0 items-center gap-3">
          {/* Hamburguesa: solo móvil/tablet (<lg). En desktop la nav lateral hace este trabajo. */}
          <button
            type="button"
            onClick={() => setDrawerOpen((o) => !o)}
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
            aria-label="Abrir menú de módulos"
            className="touch-target inline-flex items-center justify-center rounded-md border border-slate-300 px-2.5 py-1.5 text-slate-700 hover:border-accent-500 hover:text-accent-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 lg:hidden dark:border-slate-700 dark:text-slate-200"
          >
            <span aria-hidden="true" className="text-lg leading-none">
              ☰
            </span>
          </button>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-accent-600 dark:text-accent-400">App didáctica</p>
            <p className="truncate text-lg font-medium text-slate-900 dark:text-slate-100">Hipótesis de Riemann</p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <div className="flex gap-8 py-8">
        {/* Navegación LATERAL — solo desktop (≥lg). Idéntica al diseño previo. */}
        <nav aria-label="Módulos" className="hidden w-64 shrink-0 lg:block">
          <ul className="space-y-1">{navLinks()}</ul>
          <p className="mt-6 px-3 text-xs text-slate-500 dark:text-slate-400">
            Progreso: {count} / {TOTAL_SECTIONS} secciones
          </p>
        </nav>

        <main className="min-w-0 flex-1">
          <Suspense fallback={<p className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">Cargando módulo…</p>}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      {/* Drawer móvil — se renderiza SOLO cuando está abierto (así el DOM en reposo es idéntico al
          previo y la navegación lateral de desktop no compite). Cierra al tocar fuera, elegir una
          sección o pulsar Escape. */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Cerrar el menú tocando fuera"
            tabIndex={-1}
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-slate-950/40"
          />
          <nav
            id="mobile-drawer"
            aria-label="Secciones"
            className="absolute left-0 top-0 flex h-full w-72 max-w-[82%] flex-col gap-4 overflow-y-auto bg-white p-4 shadow-xl dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Módulos</p>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Cerrar menú"
                className="touch-target inline-flex items-center justify-center rounded-md border border-slate-300 px-2.5 py-1.5 text-slate-700 hover:border-accent-500 hover:text-accent-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:border-slate-700 dark:text-slate-200"
              >
                <span aria-hidden="true">✕</span>
              </button>
            </div>
            <ul className="space-y-1">{navLinks(() => setDrawerOpen(false))}</ul>
            <p className="px-3 text-xs text-slate-500 dark:text-slate-400">
              Progreso: {count} / {TOTAL_SECTIONS} secciones
            </p>
          </nav>
        </div>
      )}
    </div>
  )
}
