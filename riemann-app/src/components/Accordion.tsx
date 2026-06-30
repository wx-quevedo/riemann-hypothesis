import { useId, useState } from 'react'
import type { ReactNode } from 'react'
import clsx from 'clsx'
import Equation from './Equation'

type AccordionProps = {
  /** Titular del acordeón (texto o nodo). */
  title: ReactNode
  /** Ecuación opcional en LaTeX, mostrada junto al titular (M2). */
  equation?: string
  /** Cuerpo: la derivación paso a paso (M1). Se renderiza solo cuando está abierto. */
  children: ReactNode
  /** Cerrado por defecto (M2). Se puede forzar abierto para casos puntuales. */
  defaultOpen?: boolean
  className?: string
}

/**
 * Patrón acordeón (M2). Titular plegable con flechita ▸ que rota al abrir; el cuerpo se
 * renderiza condicionalmente (no se oculta con CSS) y la accesibilidad se preserva con un
 * `button` real + `aria-expanded` + `aria-controls`. Cerrado por defecto.
 */
export default function Accordion({ title, equation, children, defaultOpen = false, className }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const bodyId = useId()

  return (
    <div className={clsx('rounded-lg border border-slate-200 dark:border-slate-800', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={bodyId}
        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:hover:bg-slate-900/60"
      >
        <span
          aria-hidden="true"
          className={clsx(
            'select-none text-accent-600 transition-transform duration-150 dark:text-accent-400',
            open && 'rotate-90',
          )}
        >
          ▸
        </span>
        <span className="flex flex-1 flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-medium text-slate-900 dark:text-slate-100">{title}</span>
          {equation && <Equation math={equation} className="text-slate-700 dark:text-slate-300" />}
        </span>
      </button>

      {open && (
        <div id={bodyId} className="border-t border-slate-200 px-4 py-3 text-slate-700 dark:border-slate-800 dark:text-slate-300">
          {children}
        </div>
      )}
    </div>
  )
}
