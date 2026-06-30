// src/modules/Module1.tsx — Módulo 1: La función zeta de Euler, variable real (Fase 3).
// Tres capas; convergencia y PRODUCTO DE EULER derivados paso a paso en acordeón (caso modelo
// del proyecto, M1+M2); gráfica interactiva G2 (M3); ejercicios con comprobador. La curva de
// G2 es por suma parcial: se es honesto con su límite cerca de s=1 (ver zeta.ts).
import Accordion from '../components/Accordion'
import Equation from '../components/Equation'
import GraphicErrorBoundary from '../components/GraphicErrorBoundary'
import ModuleLayout from '../components/ModuleLayout'
import NumericExercise from '../components/NumericExercise'
import SectionCompleteButton from '../components/SectionCompleteButton'
import ThreeLayers from '../components/ThreeLayers'
import ZetaRealPlot from '../components/graphics/ZetaRealPlot'
import { getModule } from './moduleContent'
import { BASEL, eulerProductPartial, zetaReal } from '../lib/zeta'

const META = getModule(1)!

export default function Module1() {
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
        <GraphicErrorBoundary label="G2 · ζ(s) real">
          <ZetaRealPlot />
        </GraphicErrorBoundary>
      }
    >
      <ThreeLayers
        intuicion={
          <div className="space-y-3">
            <p>La función zeta nace de una suma muy simple: invertimos cada potencia de los naturales y las sumamos,</p>
            <Equation
              display
              className="block overflow-x-auto py-1 text-slate-900 dark:text-slate-100"
              math={'\\zeta(s) = 1 + \\frac{1}{2^s} + \\frac{1}{3^s} + \\frac{1}{4^s} + \\cdots'}
            />
            <p>
              Para <Equation math={'s>1'} /> los sumandos decaen lo bastante rápido y la suma converge a un número
              finito. Mueve el slider de la gráfica: al crecer <Equation math={'s'} /> la suma baja hacia 1.
            </p>
          </div>
        }
        formal={
          <div className="space-y-4">
            <p>
              Definimos la serie de Dirichlet y demostramos su convergencia para <Equation math={'s>1'} />; luego la joya
              del módulo: el <strong>producto de Euler</strong>, que conecta ζ con los primos.
            </p>
            <Equation
              display
              className="block overflow-x-auto py-1 text-slate-900 dark:text-slate-100"
              math={'\\zeta(s) = \\sum_{n=1}^{\\infty}\\frac{1}{n^s} = \\prod_{p\\ \\text{primo}}\\frac{1}{1-p^{-s}}'}
            />

            <Accordion
              title="Convergencia de la serie para s > 1"
              equation={'\\sum_{n=1}^{\\infty}\\frac{1}{n^s} \\le 1 + \\frac{1}{s-1}'}
            >
              <ol className="list-decimal space-y-3 pl-5">
                <li>
                  La función <Equation math={'1/x^s'} /> es positiva y decreciente, así que la suma se acota por una
                  integral (criterio integral):
                  <Equation display className="my-2 block overflow-x-auto" math={'\\sum_{n=2}^{N}\\frac{1}{n^s} \\le \\int_{1}^{N}\\frac{dx}{x^s}.'} />
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    Justificación: para función decreciente, cada término <Equation math={'1/n^s'} /> ≤ el área bajo la
                    curva en <Equation math={'[n-1,n]'} />.
                  </span>
                </li>
                <li>
                  Calculamos la integral para <Equation math={'s>1'} />:
                  <Equation
                    display
                    className="my-2 block overflow-x-auto"
                    math={'\\int_{1}^{\\infty}\\frac{dx}{x^s} = \\left[\\frac{x^{1-s}}{1-s}\\right]_{1}^{\\infty} = \\frac{1}{s-1}.'}
                  />
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    Justificación: integral de una potencia; converge porque <Equation math={'1-s<0'} />, así que{' '}
                    <Equation math={'x^{1-s}\\to 0'} />.
                  </span>
                </li>
                <li>
                  Por tanto <Equation math={'\\zeta(s) = 1 + \\sum_{n\\ge 2} 1/n^s \\le 1 + \\tfrac{1}{s-1} < \\infty'} />:
                  la serie converge para todo <Equation math={'s>1'} />.
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    Justificación: serie de términos positivos acotada superiormente ⇒ converge.
                  </span>
                </li>
                <li>
                  En <Equation math={'s=1'} /> es la serie armónica <Equation math={'\\sum 1/n'} />, que{' '}
                  <strong>diverge</strong> (<Equation math={'\\int dx/x = \\ln x \\to \\infty'} />). Por eso{' '}
                  <Equation math={'s=1'} /> es la frontera.
                </li>
                <li>
                  Números reales: <Equation math={'\\zeta(2)=\\pi^2/6\\approx 1.6449'} />; con{' '}
                  <Equation math={'N=100'} /> términos la suma parcial da <Equation math={'1.63498'} /> (error ≈ 0.00995,
                  la cola <Equation math={'\\sim 1/N'} />). Cerca de <Equation math={'s=1'} /> la convergencia es
                  lentísima — lo ves en la gráfica G2.
                </li>
              </ol>
            </Accordion>

            <Accordion title="Producto de Euler — derivación completa" equation={'\\zeta(s) = \\prod_{p}\\frac{1}{1-p^{-s}}'}>
              <ol className="list-decimal space-y-3 pl-5">
                <li>
                  Fija un primo <Equation math={'p'} /> y mira el factor <Equation math={'1/(1-p^{-s})'} />. Como{' '}
                  <Equation math={'s>1'} />, se cumple <Equation math={'|p^{-s}|<1'} />, así que es la suma de una serie
                  geométrica de razón <Equation math={'r=p^{-s}'} />:
                  <Equation
                    display
                    className="my-2 block overflow-x-auto"
                    math={'\\frac{1}{1-p^{-s}} = \\sum_{k=0}^{\\infty} p^{-ks} = 1 + p^{-s} + p^{-2s} + \\cdots'}
                  />
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    Justificación: serie geométrica <Equation math={'\\sum_{k\\ge0} r^k = 1/(1-r)'} /> para{' '}
                    <Equation math={'|r|<1'} />.
                  </span>
                </li>
                <li>
                  Escribimos ese desarrollo para CADA primo y multiplicamos todos los factores:
                  <Equation
                    display
                    className="my-2 block overflow-x-auto"
                    math={'\\prod_{p}\\left(1 + p^{-s} + p^{-2s} + \\cdots\\right).'}
                  />
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    Justificación: el producto de Euler es el producto sobre TODOS los primos de cada serie geométrica.
                  </span>
                </li>
                <li>
                  Al <strong>expandir</strong> el producto, cada término se forma eligiendo una potencia{' '}
                  <Equation math={'p^{-k_p s}'} /> de cada factor (con <Equation math={'k_p=0'} /> en todos salvo
                  finitos). El producto de las elecciones es:
                  <Equation display className="my-2 block overflow-x-auto" math={'\\prod_{p} p^{-k_p s} = \\Big(\\prod_{p} p^{\\,k_p}\\Big)^{-s}.'} />
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    Justificación: leyes de exponentes, <Equation math={'a^{-s}b^{-s}=(ab)^{-s}'} />.
                  </span>
                </li>
                <li>
                  <strong>Teorema Fundamental de la Aritmética</strong> (factorización única): todo entero{' '}
                  <Equation math={'n\\ge 1'} /> se escribe de forma ÚNICA como <Equation math={'n=\\prod_p p^{k_p}'} />.
                  Así cada elección de exponentes <Equation math={'(k_p)'} /> corresponde a exactamente un{' '}
                  <Equation math={'n'} />, y
                  <Equation display className="my-2 block overflow-x-auto" math={'\\Big(\\prod_p p^{\\,k_p}\\Big)^{-s} = n^{-s}.'} />
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    Justificación: existencia y unicidad de la factorización en primos.
                  </span>
                </li>
                <li>
                  Por eso, al expandir el producto aparece cada <Equation math={'n^{-s}'} /> exactamente UNA vez.
                  Reagrupando:
                  <Equation
                    display
                    className="my-2 block overflow-x-auto"
                    math={'\\prod_{p}\\frac{1}{1-p^{-s}} = \\sum_{n=1}^{\\infty} n^{-s} = \\zeta(s).'}
                  />
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    Justificación: reagrupación de la suma; el TFA garantiza que cada <Equation math={'n'} /> sale una y
                    solo una vez. ∎
                  </span>
                </li>
                <li>
                  Verificación con números reales: para <Equation math={'s=2'} />, el producto truncado en{' '}
                  <Equation math={'p\\le 29'} /> da <Equation math={'1.6330705'} />, acercándose a{' '}
                  <Equation math={'\\zeta(2)=\\pi^2/6=1.6449341'} /> (faltan los primos <Equation math={'>29'} />). Cada
                  primo nuevo acerca más — pruébalo en el ejercicio.
                </li>
              </ol>
            </Accordion>

            <Accordion title="Valor especial: ζ(2) = π²/6" equation={'\\zeta(2) = \\dfrac{\\pi^2}{6}'}>
              <p>
                <Equation math={'\\zeta(2) = \\sum 1/n^2 = \\pi^2/6 \\approx 1.6449341'} />. Es el célebre{' '}
                <em>problema de Basilea</em>, resuelto por Euler en 1734. Lo usamos como valor de referencia para
                comparar las sumas parciales; el bosquejo de su prueba está en la capa avanzada.
              </p>
            </Accordion>
          </div>
        }
        avanzado={
          <div className="space-y-3">
            <p>
              <strong>El problema de Basilea.</strong> Euler partió del desarrollo en producto de{' '}
              <Equation math={'\\sin(\\pi x)/(\\pi x)'} /> y, comparando coeficientes con su serie de Taylor, obtuvo{' '}
              <Equation math={'\\sum 1/n^2 = \\pi^2/6'} />. (Profundización opcional: Apostol, <em>Introduction to
              Analytic Number Theory</em>.)
            </p>
            <p>
              <strong>Hacia dónde va esto.</strong> En el eje real <Equation math={'s>1'} /> ζ es una función tranquila:
              positiva, decreciente, sin sorpresas. Toda la riqueza —y la Hipótesis de Riemann— aparece al extender ζ al{' '}
              <strong>plano complejo</strong>, donde surgen los <em>ceros</em>. Eso llega en las fases siguientes.
            </p>
            <p className="rounded-md border border-amber-300/60 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-200">
              Y, como siempre: la HR <strong>no</strong> está demostrada (M6). Aquí solo trabajamos la mitad real de la
              historia.
            </p>
          </div>
        }
      />

      <section aria-label="Ejercicios" className="space-y-4">
        <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">Ejercicios</h2>

        <NumericExercise
          layer="formal"
          prompt={
            <span>
              Producto de Euler truncado. Calcula <Equation math={'\\prod_{p\\le 29} 1/(1-p^{-2})'} /> para{' '}
              <Equation math={'s=2'} /> (4 decimales).
            </span>
          }
          inputLabel="producto parcial ≈"
          check={(v) => Math.abs(v - eulerProductPartial(2, 29)) < 1e-3}
          renderFeedback={(_v, ok) => (
            <span>
              {ok ? '' : 'Casi. '}El producto sobre <Equation math={'p\\le 29'} /> da{' '}
              {eulerProductPartial(2, 29).toFixed(7)}; <Equation math={'\\zeta(2)=\\pi^2/6='} /> {BASEL.toFixed(7)}.
              Faltan los primos {'>'} 29 → diferencia ≈ {(BASEL - eulerProductPartial(2, 29)).toFixed(4)}.
            </span>
          )}
          hint={
            <p>
              Multiplica <Equation math={'1/(1-p^{-2})'} /> sobre <Equation math={'p = 2, 3, 5, 7, \\dots, 29'} /> (diez
              primos).
            </p>
          }
          solution={
            <ol className="list-decimal space-y-1 pl-5">
              <li>
                Cada factor es <Equation math={'1/(1-p^{-2})'} />, p. ej. <Equation math={'1/(1-1/4)=4/3'} />.
              </li>
              <li>Multiplica los diez factores (p = 2…29).</li>
              <li>
                Resultado ≈ 1.6331, que se acerca a <Equation math={'\\pi^2/6 \\approx 1.6449'} />.
              </li>
            </ol>
          }
        />

        <NumericExercise
          layer="formal"
          prompt={
            <span>
              Suma parcial de ζ(2). Calcula <Equation math={'\\sum_{n=1}^{100} 1/n^2'} /> (4 decimales) y observa el error
              frente a <Equation math={'\\pi^2/6'} />.
            </span>
          }
          inputLabel="suma parcial ≈"
          check={(v) => Math.abs(v - zetaReal(2, 100)) < 1e-3}
          renderFeedback={(_v, ok) => (
            <span>
              {ok ? '' : 'Revisa. '}La suma parcial da {zetaReal(2, 100).toFixed(7)}; frente a{' '}
              <Equation math={'\\pi^2/6='} /> {BASEL.toFixed(7)} el error es ≈ {(BASEL - zetaReal(2, 100)).toFixed(5)} (la
              cola <Equation math={'\\sim 1/N'} />).
            </span>
          )}
          hint={
            <p>
              Suma <Equation math={'1 + 1/4 + 1/9 + \\cdots + 1/100^2'} />. La cola que falta es{' '}
              <Equation math={'\\approx 1/100'} />.
            </p>
          }
          solution={
            <ol className="list-decimal space-y-1 pl-5">
              <li>
                Suma los 100 términos <Equation math={'1/n^2'} />.
              </li>
              <li>Da ≈ 1.6350.</li>
              <li>
                El error frente a <Equation math={'\\pi^2/6\\approx 1.6449'} /> es ≈ 0.0100 (lento: la cola decae como
                1/N).
              </li>
            </ol>
          }
        />
      </section>
    </ModuleLayout>
  )
}
