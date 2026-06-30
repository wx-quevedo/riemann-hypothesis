// src/modules/Module3.tsx — Módulo 3: Ceros triviales y no triviales + el ENUNCIADO DE LA HR
// (Fase 5, completo). Tres capas (M1 paso a paso): ecuación funcional con cada factor, ceros
// triviales derivados (sin(πs/2)=0), franja/línea crítica, ceros no triviales, y el enunciado
// de la Hipótesis de Riemann DESTACADO con la nota de honestidad obligatoria (M6). Gráficas
// G4 (|ζ(½+it)|) y G5 (función Z de Hardy) en el aside. Ejercicios con comprobador.
import Accordion from '../components/Accordion'
import Equation from '../components/Equation'
import GraphicErrorBoundary from '../components/GraphicErrorBoundary'
import ModuleLayout from '../components/ModuleLayout'
import NumericExercise from '../components/NumericExercise'
import SectionCompleteButton from '../components/SectionCompleteButton'
import ThreeLayers from '../components/ThreeLayers'
import AbsZetaCriticalPlot from '../components/graphics/AbsZetaCriticalPlot'
import HardyZPlot from '../components/graphics/HardyZPlot'
import { getModule } from './moduleContent'
import { cAbs, cx, zetaComplexFull } from '../lib/zetaComplex'
import { getZero } from '../lib/zeros'

const META = getModule(3)!

export default function Module3() {
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
        <div className="space-y-6">
          <div>
            <h3 className="mb-1 text-sm font-medium text-slate-900 dark:text-slate-100">G4 · |ζ(½+it)|</h3>
            <GraphicErrorBoundary label="G4 · |ζ(½+it)|">
              <AbsZetaCriticalPlot />
            </GraphicErrorBoundary>
          </div>
          <div>
            <h3 className="mb-1 text-sm font-medium text-slate-900 dark:text-slate-100">G5 · función Z de Hardy</h3>
            <GraphicErrorBoundary label="G5 · función Z de Hardy">
              <HardyZPlot />
            </GraphicErrorBoundary>
          </div>
        </div>
      }
    >
      <ThreeLayers
        intuicion={
          <div className="space-y-3">
            <p>
              ζ vale 0 en ciertos puntos. Unos son "aburridos" —los <strong>triviales</strong>, sobre el eje real
              negativo— y otros "profundos" —los <strong>no triviales</strong>, dentro de la franja{' '}
              <Equation math={'0<\\operatorname{Re}(s)<1'} />.
            </p>
            <p>
              La Hipótesis de Riemann es una afirmación sobre <em>dónde</em> están exactamente los profundos. En las
              gráficas de la derecha los ves de dos formas: como toques de <Equation math={'|\\zeta|'} /> (G4) y como
              cruces por cero de una función real <Equation math={'Z(t)'} /> (G5).
            </p>
          </div>
        }
        formal={
          <div className="space-y-4">
            <p>
              Todo arranca de la <strong>ecuación funcional</strong>, que relaciona ζ en <Equation math={'s'} /> con ζ en{' '}
              <Equation math={'1-s'} />:
            </p>
            <Equation
              display
              className="block overflow-x-auto py-1 text-slate-900 dark:text-slate-100"
              math={'\\zeta(s) = 2^{s}\\,\\pi^{s-1}\\,\\sin\\!\\left(\\tfrac{\\pi s}{2}\\right)\\,\\Gamma(1-s)\\,\\zeta(1-s)'}
            />

            <Accordion title="La ecuación funcional, factor a factor" equation={'s \\leftrightarrow 1-s'}>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <Equation math={'2^{s}\\,\\pi^{s-1}'} />: factores de escala (potencias de 2 y π).
                </li>
                <li>
                  <Equation math={'\\sin(\\pi s/2)'} />: se anula en los <strong>enteros pares</strong>{' '}
                  <Equation math={'s=0,\\pm2,\\pm4,\\dots'} />. Es el factor que GENERA los ceros triviales.
                </li>
                <li>
                  <Equation math={'\\Gamma(1-s)'} />: la función Gamma; tiene <strong>polos</strong> en{' '}
                  <Equation math={'1-s=0,-1,-2,\\dots'} /> (o sea <Equation math={'s=1,2,3,\\dots'} />). Esos polos
                  cancelan los ceros de <Equation math={'\\sin(\\pi s/2)'} /> en los pares POSITIVOS.
                </li>
                <li>
                  <Equation math={'\\zeta(1-s)'} />: la zeta reflejada. El punto medio de <Equation math={'s'} /> y{' '}
                  <Equation math={'1-s'} /> es <Equation math={'\\tfrac12'} /> ⇒ la ecuación es simétrica respecto a la
                  recta <Equation math={'\\operatorname{Re}(s)=\\tfrac12'} />.
                </li>
              </ul>
            </Accordion>

            <Accordion title="Ceros triviales: ζ(−2)=ζ(−4)=⋯=0" equation={'\\sin(\\pi s/2)=0 \\Rightarrow \\zeta(s)=0'}>
              <ol className="list-decimal space-y-3 pl-5">
                <li>
                  Evaluamos la ecuación funcional en <Equation math={'s=-2'} /> (par negativo):
                  <Equation display className="my-2 block overflow-x-auto" math={'\\zeta(-2)=2^{-2}\\,\\pi^{-3}\\,\\sin(-\\pi)\\,\\Gamma(3)\\,\\zeta(3).'} />
                </li>
                <li>
                  El factor clave: <Equation math={'\\sin(\\pi\\cdot(-2)/2)=\\sin(-\\pi)=0'} />. Los demás son finitos:{' '}
                  <Equation math={'\\Gamma(3)=2'} />, <Equation math={'\\zeta(3)\\approx 1.202'} />,{' '}
                  <Equation math={'2^{-2}\\pi^{-3}'} /> finito.
                </li>
                <li>
                  Un producto con un factor 0 es 0 ⇒ <Equation math={'\\zeta(-2)=0'} />. Igual en{' '}
                  <Equation math={'-4,-6,\\dots'} />. (Verificado: <Equation math={'|\\zeta(-2)|<10^{-6}'} />.)
                </li>
                <li>
                  ¿Y los pares <em>positivos</em> (<Equation math={'s=2,4,\\dots'} />)? Ahí{' '}
                  <Equation math={'\\sin(\\pi s/2)=0'} /> también, PERO <Equation math={'\\Gamma(1-s)=\\Gamma(-1),\\Gamma(-3),\\dots'} />{' '}
                  tiene un POLO. El <Equation math={'0\\cdot\\infty'} /> se resuelve finito y NO da cero — por eso{' '}
                  <Equation math={'\\zeta(2)=\\pi^2/6\\neq 0'} />. <strong>Solo los pares negativos son ceros triviales.</strong>
                </li>
              </ol>
            </Accordion>

            <Accordion title="Franja crítica y línea crítica" equation={'\\operatorname{Re}(s)=\\tfrac12'}>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Franja crítica:</strong> <Equation math={'0<\\operatorname{Re}(s)<1'} />. Todos los ceros no
                  triviales viven aquí.
                </li>
                <li>
                  <strong>Línea crítica:</strong> <Equation math={'\\operatorname{Re}(s)=\\tfrac12'} />, el eje de
                  simetría de la ecuación funcional (<Equation math={'s'} /> y <Equation math={'1-s'} /> se reflejan
                  respecto a ella).
                </li>
              </ul>
            </Accordion>

            <Accordion title="Ceros no triviales" equation={'\\rho = \\tfrac12 + i\\gamma'}>
              <p>
                Los de la franja. No hay fórmula cerrada: se calculan numéricamente. Los primeros, sobre la línea
                crítica, están en <Equation math={'t=14.1347,\\ 21.0220,\\ 25.0109,\\dots'} /> (de{' '}
                <code className="text-xs">zeros.json</code>, mpmath a 30 dígitos). Búscalos en G4 (toques) y en G5
                (cruces por cero).
              </p>
            </Accordion>
          </div>
        }
        avanzado={
          <div className="space-y-3">
            <p>
              <strong>Simetría de los ceros.</strong> Si <Equation math={'\\rho'} /> es un cero no trivial, también lo
              son <Equation math={'1-\\rho'} /> (por la ecuación funcional), <Equation math={'\\bar\\rho'} /> (porque ζ
              tiene coeficientes reales) y <Equation math={'1-\\bar\\rho'} />. Los ceros vienen en cuádruples.
            </p>
            <p>
              Sobre la línea crítica <Equation math={'\\rho=\\tfrac12+i\\gamma'} />: ahí{' '}
              <Equation math={'\\bar\\rho=\\tfrac12-i\\gamma'} /> coincide con <Equation math={'1-\\rho'} />, y el
              cuádruple colapsa al par <Equation math={'\\pm\\gamma'} />.
            </p>
          </div>
        }
      />

      {/* ENUNCIADO DE LA HR — destacado, con la nota de honestidad obligatoria (M6). */}
      <section
        aria-label="Enunciado de la Hipótesis de Riemann"
        className="rounded-xl border-2 border-accent-400 bg-accent-50/60 p-5 dark:border-accent-500/40 dark:bg-accent-500/10"
      >
        <h2 className="text-xs font-medium uppercase tracking-wide text-accent-700 dark:text-accent-300">
          Hipótesis de Riemann (1859)
        </h2>
        <p className="mt-2 text-lg font-medium leading-relaxed text-slate-900 dark:text-slate-100">
          Todos los ceros no triviales de <Equation math={'\\zeta(s)'} /> tienen parte real exactamente{' '}
          <Equation math={'\\tfrac12'} />.
        </p>
        <Equation
          display
          className="mt-2 block overflow-x-auto text-slate-900 dark:text-slate-100"
          math={'\\zeta(\\rho)=0,\\ \\rho\\ \\text{no trivial} \\;\\Longrightarrow\\; \\operatorname{Re}(\\rho)=\\tfrac12'}
        />
        <p className="mt-3 rounded-md border border-amber-300/60 bg-amber-50 px-3 py-2 text-sm leading-relaxed text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-200">
          <strong>Honestidad intelectual (M6):</strong> es una <strong>conjetura</strong>, <strong>no está demostrada</strong>.
          Se ha verificado para más de <Equation math={'10^{13}'} /> ceros, pero verificar miles de millones de ceros{' '}
          <strong>no es una prueba</strong>. No la presentamos como un hecho.
        </p>
      </section>

      <section aria-label="Ejercicios" className="space-y-4">
        <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">Ejercicios</h2>

        <NumericExercise
          layer="formal"
          prompt={
            <span>
              Según la ecuación funcional, ¿cuánto vale <Equation math={'\\zeta(-2)'} />? (un número)
            </span>
          }
          inputLabel="ζ(−2) ="
          check={(v) => Math.abs(v) < 1e-3}
          renderFeedback={(_v, ok) => (
            <span>
              {ok ? '' : 'Pista: mira el factor seno. '}
              <Equation math={'\\sin(-\\pi)=0'} /> ⇒ <Equation math={'\\zeta(-2)=0'} />. Numéricamente |ζ(−2)| ≈{' '}
              {cAbs(zetaComplexFull(cx(-2, 0), 5000)).toExponential(1)} (≈ 0).
            </span>
          )}
          hint={
            <p>
              En <Equation math={'\\zeta(-2)=2^{-2}\\pi^{-3}\\sin(-\\pi)\\Gamma(3)\\zeta(3)'} />, ¿qué factor se anula?
            </p>
          }
          solution={
            <ol className="list-decimal space-y-1 pl-5">
              <li>
                <Equation math={'\\sin(\\pi(-2)/2)=\\sin(-\\pi)=0'} />.
              </li>
              <li>Los demás factores son finitos.</li>
              <li>
                Producto con un 0 ⇒ <Equation math={'\\zeta(-2)=0'} />.
              </li>
            </ol>
          }
        />

        <NumericExercise
          layer="formal"
          prompt={
            <span>
              En G5, ¿en qué <Equation math={'t'} /> cruza <Equation math={'Z(t)'} /> por cero por primera vez (el primer
              cero <Equation math={'\\rho_1'} />)? (4 decimales)
            </span>
          }
          inputLabel="t del primer cruce ="
          step={0.0001}
          check={(v) => Math.abs(v - (getZero(1)?.t ?? 14.1347)) < 0.01}
          renderFeedback={(_v, ok) => (
            <span>
              {ok ? '' : 'Mira dónde Z cambia de signo entre t=14 y t=15. '}El valor exacto (zeros.json) es{' '}
              <Equation math={'\\rho_1: t='} /> {(getZero(1)?.t ?? 0).toFixed(4)}.
            </span>
          )}
          hint={<p>Z(t) cambia de signo justo en cada cero. El primero está entre t=14 y t=15.</p>}
          solution={
            <ol className="list-decimal space-y-1 pl-5">
              <li>En G5, Z(14)≈−0.11 y Z(15)≈+0.72 → cruza entre 14 y 15.</li>
              <li>El cruce es el primer cero no trivial.</li>
              <li>
                Valor exacto: <Equation math={'t\\approx 14.1347'} /> (precalculado con mpmath).
              </li>
            </ol>
          }
        />

        <NumericExercise
          layer="avanzado"
          prompt={
            <span>
              Conceptual: la ecuación funcional refleja <Equation math={'s \\leftrightarrow 1-s'} />. ¿Cuál es la parte
              real del eje de simetría (la línea crítica)?
            </span>
          }
          inputLabel="Re(s) del eje ="
          check={(v) => Math.abs(v - 0.5) < 1e-6}
          renderFeedback={(_v, ok) => (
            <span>
              {ok ? '' : 'El punto medio de s y 1−s. '}El punto medio de <Equation math={'s'} /> y{' '}
              <Equation math={'1-s'} /> es <Equation math={'\\tfrac{s+(1-s)}{2}=\\tfrac12'} /> ⇒ la línea crítica es{' '}
              <Equation math={'\\operatorname{Re}(s)=\\tfrac12'} />.
            </span>
          )}
          hint={
            <p>
              ¿Qué número está justo a medio camino entre <Equation math={'s'} /> y <Equation math={'1-s'} />?
            </p>
          }
          solution={
            <ol className="list-decimal space-y-1 pl-5">
              <li>
                La ecuación relaciona <Equation math={'s'} /> con <Equation math={'1-s'} />.
              </li>
              <li>
                Su punto medio es <Equation math={'\\tfrac{s+(1-s)}{2}=\\tfrac12'} />, fijo.
              </li>
              <li>
                Por eso el eje de simetría —y la línea crítica— es <Equation math={'\\operatorname{Re}(s)=\\tfrac12'} />.
              </li>
            </ol>
          }
        />
      </section>
    </ModuleLayout>
  )
}
