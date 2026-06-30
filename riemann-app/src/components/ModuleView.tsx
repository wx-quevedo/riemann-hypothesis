import Accordion from './Accordion'
import Equation from './Equation'
import Exercise from './Exercise'
import GraphicPlaceholder from './GraphicPlaceholder'
import ModuleLayout from './ModuleLayout'
import SectionCompleteButton from './SectionCompleteButton'
import ThreeLayers from './ThreeLayers'
import { getModule } from '../modules/moduleContent'

type ModuleViewProps = {
  /** Id del módulo (0–5). */
  id: number
}

/**
 * Renderiza un módulo completo a partir de su contenido placeholder, componiendo las piezas
 * reutilizables (ModuleLayout + ThreeLayers + Accordion + Exercise + GraphicPlaceholder).
 * Esto demuestra el chasis end-to-end sin contenido matemático real (Fase 1).
 */
export default function ModuleView({ id }: ModuleViewProps) {
  const m = getModule(id)

  if (!m) {
    return <p className="text-slate-600 dark:text-slate-300">Módulo no encontrado.</p>
  }

  return (
    <ModuleLayout
      header={
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-accent-600 dark:text-accent-400">{m.code}</p>
            <h1 className="mt-1 text-2xl font-medium text-slate-900 dark:text-slate-100">{m.title}</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">{m.tagline}</p>
          </div>
          <SectionCompleteButton sectionId={m.sectionId} />
        </div>
      }
      aside={m.graphics.map((g) => (
        <GraphicPlaceholder key={g.code} code={g.code} name={g.name} phase={g.phase} controls={g.controls} />
      ))}
    >
      <ThreeLayers
        intuicion={<p>{m.intuicion}</p>}
        formal={
          <div className="space-y-3">
            <p>{m.formal.text}</p>
            {m.formal.equation && (
              <Equation display className="block overflow-x-auto py-1 text-slate-900 dark:text-slate-100" math={m.formal.equation} />
            )}
          </div>
        }
        avanzado={
          <div className="space-y-3">
            <p>{m.avanzado.text}</p>
            {m.avanzado.equation && (
              <Equation display className="block overflow-x-auto py-1 text-slate-900 dark:text-slate-100" math={m.avanzado.equation} />
            )}
          </div>
        }
      />

      <section aria-label="Derivación de ejemplo" className="space-y-3">
        <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">Derivación (ejemplo)</h2>
        <Accordion title={m.accordion.title} equation={m.accordion.equation}>
          <ol className="list-decimal space-y-2 pl-5">
            {m.accordion.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </Accordion>
      </section>

      <section aria-label="Ejercicio de ejemplo" className="space-y-3">
        <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">Ejercicio (ejemplo)</h2>
        <Exercise
          prompt={m.exercise.prompt}
          layer={m.exercise.layer}
          hint={<p>{m.exercise.hint}</p>}
          solution={
            <ol className="list-decimal space-y-2 pl-5">
              {m.exercise.solution.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          }
        />
      </section>
    </ModuleLayout>
  )
}
