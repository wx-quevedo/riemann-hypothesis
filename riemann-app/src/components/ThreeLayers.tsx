import type { ReactNode } from 'react'
import Accordion from './Accordion'

type ThreeLayersProps = {
  /** Capa 1 — intuición: palabras llanas. Siempre visible. */
  intuicion: ReactNode
  /** Capa 2 — formal: la ecuación con su justificación. Visible. */
  formal: ReactNode
  /** Capa 3 — avanzado: demostración/detalle técnico. Plegado por defecto (Accordion). */
  avanzado: ReactNode
  /** Título del acordeón de la capa avanzada. */
  avanzadoTitle?: string
}

/**
 * Patrón de las tres capas (principio rector del road map). Tres niveles visualmente
 * distinguibles por jerarquía tipográfica (sección 7):
 *   1. Intuición — siempre visible.
 *   2. Formal — visible.
 *   3. Avanzado — OPCIONAL, plegado por defecto (reutiliza Accordion, M2).
 */
export default function ThreeLayers({ intuicion, formal, avanzado, avanzadoTitle = 'Avanzado (opcional)' }: ThreeLayersProps) {
  return (
    <div className="space-y-5">
      <LayerSection tone="intuicion" label="Intuición">
        <div className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">{intuicion}</div>
      </LayerSection>

      <LayerSection tone="formal" label="Formal">
        <div className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">{formal}</div>
      </LayerSection>

      <section aria-label="Capa avanzada">
        <Accordion title={avanzadoTitle}>
          <div className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">{avanzado}</div>
        </Accordion>
      </section>
    </div>
  )
}

type LayerSectionProps = {
  tone: 'intuicion' | 'formal'
  label: string
  children: ReactNode
}

function LayerSection({ tone, label, children }: LayerSectionProps) {
  // Acento sutil a la izquierda para distinguir las capas sin saturar (sección 7).
  const bar = tone === 'intuicion' ? 'border-l-slate-300 dark:border-l-slate-700' : 'border-l-accent-400 dark:border-l-accent-500'
  return (
    <section aria-label={`Capa ${label.toLowerCase()}`} className={`border-l-2 pl-4 ${bar}`}>
      <h3 className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</h3>
      {children}
    </section>
  )
}
