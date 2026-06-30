import type { ReactNode } from 'react'
import clsx from 'clsx'

type ModuleLayoutProps = {
  /** Cabecera del módulo (código, título, acciones de progreso). */
  header: ReactNode
  /** Columna principal: concepto / derivación. */
  children: ReactNode
  /** Columna lateral: la gráfica (o su placeholder). Si se omite, el módulo va a una columna. */
  aside?: ReactNode
}

/**
 * Plantilla de un módulo (M7 — escritorio). Patrón de dos columnas donde aporta:
 * concepto/derivación a la izquierda, gráfica a la derecha (sticky en pantallas anchas).
 * Si no hay `aside`, el contenido ocupa una sola columna.
 */
export default function ModuleLayout({ header, children, aside }: ModuleLayoutProps) {
  return (
    <article className="space-y-8">
      <header className="border-b border-slate-200 pb-5 dark:border-slate-800">{header}</header>

      <div className={clsx('grid grid-cols-1 items-start gap-10', aside && 'lg:grid-cols-2')}>
        <div className="min-w-0 space-y-8">{children}</div>
        {aside && (
          <aside className="space-y-3 lg:sticky lg:top-6">
            {aside}
          </aside>
        )}
      </div>
    </article>
  )
}
