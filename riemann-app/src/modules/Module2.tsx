// src/modules/Module2.tsx — Módulo 2: Plano complejo y continuación analítica (Fase 5, completo).
// Tres capas (M1 paso a paso): por qué la serie muere en Re(s)≤1, la continuación vía η de
// Dirichlet derivada paso a paso (ζ=η/(1−2^{1−s})), el polo en s=1 y ζ(0)=−½. G3 (domain
// coloring, ahora con vista inicial isotrópica) en el aside. Honestidad (M6) sobre la HR.
import Accordion from '../components/Accordion'
import Equation from '../components/Equation'
import GraphicErrorBoundary from '../components/GraphicErrorBoundary'
import ModuleLayout from '../components/ModuleLayout'
import SectionCompleteButton from '../components/SectionCompleteButton'
import ThreeLayers from '../components/ThreeLayers'
import DomainColoring from '../components/graphics/DomainColoring'
import { getModule } from './moduleContent'

const META = getModule(2)!

export default function Module2() {
  return (
    <ModuleLayout
      header={
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-accent-600 dark:text-accent-400">{META.code}</p>
            <h1 className="mt-1 text-2xl font-medium text-slate-900 dark:text-slate-100">{META.title}</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">{META.tagline}</p>
          </div>
          <SectionCompleteButton sectionId={META.sectionId} />
        </div>
      }
      aside={
        <GraphicErrorBoundary label="G3 · domain coloring de ζ">
          <DomainColoring />
        </GraphicErrorBoundary>
      }
    >
      <ThreeLayers
        intuicion={
          <div className="space-y-3">
            <p>
              La serie <Equation math={'\\sum 1/n^s'} /> solo vive en <Equation math={'\\operatorname{Re}(s)>1'} />. Y sin
              embargo ζ se extiende de forma <strong>única</strong> a casi todo el plano complejo. ¿Por qué única?
            </p>
            <p>
              Porque una función analítica es <em>rígida</em>: conocerla en una región pequeña la fija en todas partes
              donde sea analítica (principio de continuación analítica). Solo hay UNA manera de extender ζ — y el domain
              coloring de la derecha es esa extensión hecha imagen.
            </p>
          </div>
        }
        formal={
          <div className="space-y-4">
            <p>
              Extendemos ζ con la función eta de Dirichlet, que sí converge en la franja crítica{' '}
              <Equation math={'\\operatorname{Re}(s)>0'} />:
            </p>
            <Equation
              display
              className="block overflow-x-auto py-1 text-slate-900 dark:text-slate-100"
              math={'\\zeta(s) = \\frac{\\eta(s)}{1 - 2^{1-s}}, \\qquad \\eta(s)=\\sum_{n=1}^{\\infty}\\frac{(-1)^{n-1}}{n^s}'}
            />

            <Accordion title="Por qué la serie diverge para Re(s) ≤ 1" equation={'\\sum 1/n^s \\to \\infty'}>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  En <Equation math={'s=1'} /> es la serie armónica <Equation math={'\\sum 1/n'} />, que diverge (lo vimos
                  en el Módulo 1: <Equation math={'\\int dx/x = \\ln x \\to \\infty'} />).
                </li>
                <li>
                  Para <Equation math={'\\operatorname{Re}(s)<1'} /> los términos decaen aún más lento, así que también
                  diverge. La serie directa, por sí sola, no puede definir ζ ahí.
                </li>
              </ol>
            </Accordion>

            <Accordion
              title="Continuación analítica vía η — derivación de ζ = η/(1 − 2^{1−s})"
              equation={'\\zeta(s)\\,(1 - 2^{1-s}) = \\eta(s)'}
            >
              <ol className="list-decimal space-y-3 pl-5">
                <li>
                  Escribimos ambas series (η alterna los signos; ζ no):
                  <Equation display className="my-2 block overflow-x-auto" math={'\\eta(s)=1-\\tfrac{1}{2^s}+\\tfrac{1}{3^s}-\\tfrac{1}{4^s}+\\cdots, \\quad \\zeta(s)=1+\\tfrac{1}{2^s}+\\tfrac{1}{3^s}+\\cdots'} />
                </li>
                <li>
                  Restamos <Equation math={'\\zeta(s)-\\eta(s)'} />: los términos IMPARES se cancelan y los PARES se
                  DUPLICAN.
                  <Equation display className="my-2 block overflow-x-auto" math={'\\zeta(s)-\\eta(s) = 2\\left(\\tfrac{1}{2^s}+\\tfrac{1}{4^s}+\\tfrac{1}{6^s}+\\cdots\\right).'} />
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    Justificación: en η el término par <Equation math={'1/(2k)^s'} /> lleva signo −; al restar{' '}
                    <Equation math={'\\zeta-\\eta'} /> queda <Equation math={'+2/(2k)^s'} />.
                  </span>
                </li>
                <li>
                  Factorizamos los pares (<Equation math={'n=2k'} /> ⇒ <Equation math={'(2k)^{-s}=2^{-s}k^{-s}'} />):
                  <Equation display className="my-2 block overflow-x-auto" math={'2\\sum_{k\\ge 1}\\frac{1}{(2k)^s} = 2\\cdot 2^{-s}\\sum_{k\\ge 1}\\frac{1}{k^s} = 2^{1-s}\\,\\zeta(s).'} />
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    Justificación: <Equation math={'\\sum_k 1/k^s = \\zeta(s)'} />; sacamos <Equation math={'2^{-s}'} /> de la suma.
                  </span>
                </li>
                <li>
                  Igualamos y despejamos:
                  <Equation display className="my-2 block overflow-x-auto" math={'\\zeta(s)-\\eta(s)=2^{1-s}\\zeta(s) \\;\\Rightarrow\\; \\zeta(s)\\,(1-2^{1-s})=\\eta(s) \\;\\Rightarrow\\; \\zeta(s)=\\frac{\\eta(s)}{1-2^{1-s}}.'} />
                </li>
                <li>
                  <strong>La clave:</strong> η converge para <Equation math={'\\operatorname{Re}(s)>0'} />, así que esta
                  fórmula <em>define</em> ζ en toda la franja crítica (y más), salvo donde el denominador se anula. El
                  único polo real es <Equation math={'s=1'} /> (en los otros ceros del denominador, η también se anula y
                  el cociente es finito). ∎
                </li>
              </ol>
            </Accordion>

            <Accordion title="El polo en s=1 y el valor ζ(0) = −½" equation={'\\zeta(0)=-\\tfrac{1}{2}'}>
              <ol className="list-decimal space-y-3 pl-5">
                <li>
                  En <Equation math={'s=1'} />: <Equation math={'1-2^{1-1}=1-2^0=0'} />, y{' '}
                  <Equation math={'\\eta(1)=1-\\tfrac12+\\tfrac13-\\cdots=\\ln 2 \\approx 0.693 \\neq 0'} />. Cociente
                  finito entre 0 ⇒ <strong>polo simple</strong> en <Equation math={'s=1'} /> (coherente: la armónica
                  diverge).
                </li>
                <li>
                  En <Equation math={'s=0'} />: <Equation math={'\\eta(0)=1-1+1-1+\\cdots=\\tfrac12'} /> (suma de Abel), y{' '}
                  <Equation math={'1-2^{1-0}=1-2=-1'} />. Entonces
                  <Equation display className="my-2 block overflow-x-auto" math={'\\zeta(0)=\\frac{\\eta(0)}{1-2}=\\frac{1/2}{-1}=-\\tfrac12.'} />
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    Coincide con el valor precalculado con mpmath (Fase 2): <Equation math={'\\zeta(0)=-0.5'} />.
                  </span>
                </li>
              </ol>
            </Accordion>
          </div>
        }
        avanzado={
          <div className="space-y-3">
            <p>
              η extiende ζ solo a <Equation math={'\\operatorname{Re}(s)>0'} />. Para el resto del plano (
              <Equation math={'\\operatorname{Re}(s)\\le 0'} />) se usa la <strong>ecuación funcional</strong>, que
              refleja <Equation math={'s \\leftrightarrow 1-s'} /> — el tema del Módulo 3. Esa simetría es la que genera
              los ceros triviales y singulariza la línea crítica <Equation math={'\\operatorname{Re}(s)=\\tfrac12'} />.
            </p>
            <p className="rounded-md border border-amber-300/60 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-200">
              Honestidad (M6): que los ceros marcados en la imagen caigan sobre la línea crítica es lo que <em>afirma</em>{' '}
              la Hipótesis de Riemann; <strong>no</strong> es un hecho demostrado. Se desarrolla en el Módulo 3.
            </p>
          </div>
        }
      />

      <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
        <h2 className="text-sm font-medium text-slate-900 dark:text-slate-100">Cómo leer el domain coloring</h2>
        <ul className="mt-2 space-y-1.5 text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
          <li>
            <strong>Matiz</strong> = fase de <Equation math={'\\zeta(s)'} />; <strong>brillo</strong> = módulo{' '}
            <Equation math={'|\\zeta(s)|'} /> (oscuro en los ceros).
          </li>
          <li>
            Los <strong>ceros</strong> son los vórtices; el <strong>polo</strong> en <Equation math={'s=1'} /> es el punto
            brillante. La línea a trazos es <Equation math={'\\operatorname{Re}(s)=\\tfrac12'} />.
          </li>
        </ul>
      </div>
    </ModuleLayout>
  )
}
