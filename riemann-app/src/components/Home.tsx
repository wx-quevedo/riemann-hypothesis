import { Link } from 'react-router-dom'
import { MODULES } from '../modules/moduleContent'

/**
 * Página de inicio (ruta índice). Visión general y entrada a los módulos. Tono sobrio,
 * sin gamificación (sección 7). Incluye el recordatorio de honestidad intelectual (M6).
 */
export default function Home() {
  return (
    <div className="space-y-8">
      <header className="border-b border-slate-200 pb-5 dark:border-slate-800">
        <h1 className="text-2xl font-medium text-slate-900 dark:text-slate-100">Aprender la Hipótesis de Riemann</h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
          Un recorrido en tres capas — intuición, formal y avanzado — desde por qué importan los primos hasta el
          estado del arte. Cada concepto trae su gráfica interactiva y ejercicios paso a paso. Esto es el chasis
          navegable (Fase 1): el contenido se llena módulo a módulo.
        </p>
      </header>

      <p className="rounded-md border border-amber-300/60 bg-amber-50 px-3 py-2 text-sm leading-relaxed text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-200">
        Honestidad intelectual (M6): la Hipótesis de Riemann <strong>no</strong> está demostrada. Verificar billones
        de ceros no constituye una prueba.
      </p>

      <section aria-label="Módulos" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {MODULES.map((m) => (
          <Link
            key={m.id}
            to={m.path}
            className="rounded-xl border border-slate-200 p-4 transition-colors hover:border-accent-400 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:border-slate-800 dark:hover:border-accent-500/40 dark:hover:bg-slate-900/60"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-accent-600 dark:text-accent-400">{m.code}</p>
            <p className="mt-1 font-medium text-slate-900 dark:text-slate-100">{m.navLabel}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{m.tagline}</p>
          </Link>
        ))}
      </section>
    </div>
  )
}
