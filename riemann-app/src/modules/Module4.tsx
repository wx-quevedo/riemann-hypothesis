// src/modules/Module4.tsx — Módulo 4: la fórmula explícita y su animación (Fase 6, la joya).
// Los ceros de ζ reconstruyen la distribución de los primos: ψ(x) = tendencia suave − Σ ondas
// (una por cada cero). G6 anima cómo, al sumar ceros, emerge la escalera. Tres capas (M1) con la
// DERIVACIÓN DE LA ONDA REAL paso a paso y por qué importa la HR (M6, sin afirmar que está probada).
import Accordion from '../components/Accordion'
import Equation from '../components/Equation'
import GraphicErrorBoundary from '../components/GraphicErrorBoundary'
import ModuleLayout from '../components/ModuleLayout'
import NumericExercise from '../components/NumericExercise'
import SectionCompleteButton from '../components/SectionCompleteButton'
import ThreeLayers from '../components/ThreeLayers'
import ExplicitFormula from '../components/graphics/ExplicitFormula'
import { getModule } from './moduleContent'
import { psiChebyshev, psiExplicit, psiMainTerm, waveOfZero } from '../lib/explicitFormula'

const META = getModule(4)!

export default function Module4() {
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
    >
      <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
        En el Módulo 0 vimos la escalera de los primos y un error misterioso entre <Equation math={'\\operatorname{li}(x)'} />{' '}
        y <Equation math={'\\pi(x)'} />. Aquí se revela el mecanismo: cada cero de ζ es una <strong>onda</strong>, y al
        sumarlas sobre una tendencia suave <em>reaparece</em> la distribución de los primos. Pulsa reproducir y míralo.
      </p>

      <GraphicErrorBoundary label="G6 · animación de la fórmula explícita">
        <ExplicitFormula />
      </GraphicErrorBoundary>

      <ThreeLayers
        intuicion={
          <div className="space-y-3">
            <p>
              Los ceros de ζ son las <strong>frecuencias ocultas</strong> en la distribución de los primos. Cada cero{' '}
              <Equation math={'\\rho=\\tfrac12+i\\gamma'} /> produce una onda que oscila con frecuencia{' '}
              <Equation math={'\\gamma'} />.
            </p>
            <p>
              La escalera de los primos no es ruido: es la <strong>suma de todas esas ondas</strong> sobre una tendencia
              suave. Con pocas ondas ves la tendencia; con muchas, emergen los escalones uno a uno.
            </p>
          </div>
        }
        formal={
          <div className="space-y-4">
            <p>
              Animamos <Equation math={'\\psi(x)'} /> (función de Chebyshev), no <Equation math={'\\pi(x)'} /> directa: su
              fórmula explícita es la más limpia (término principal = <Equation math={'x'} />).
            </p>
            <Equation
              display
              className="block overflow-x-auto py-1 text-slate-900 dark:text-slate-100"
              math={'\\psi(x) = x - \\sum_{\\rho}\\frac{x^{\\rho}}{\\rho} - \\log(2\\pi) - \\tfrac12\\log\\!\\left(1-x^{-2}\\right)'}
            />

            <Accordion title="Definición de ψ(x) (Chebyshev)" equation={'\\psi(x)=\\sum_{p^k\\le x}\\log p'}>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  <Equation math={'\\psi(x)'} /> suma <Equation math={'\\log p'} /> sobre cada primo Y cada potencia de
                  primo <Equation math={'p^k\\le x'} />. Es una escalera que salta <Equation math={'\\log p'} /> en cada
                  potencia.
                </li>
                <li>
                  Ejemplo con números (M1), <Equation math={'x=10'} />: potencias <Equation math={'\\le 10'} /> son{' '}
                  <Equation math={'2,4,8'} /> (de 2), <Equation math={'3,9'} /> (de 3), <Equation math={'5,7'} />. Así
                  <Equation display className="my-2 block overflow-x-auto" math={'\\psi(10)=3\\log 2+2\\log 3+\\log 5+\\log 7 = 7.832.'} />
                </li>
              </ol>
            </Accordion>

            <Accordion title="La fórmula explícita, término a término" equation={'\\psi(x)=x-\\textstyle\\sum_\\rho \\frac{x^\\rho}{\\rho}-\\cdots'}>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <Equation math={'x'} />: la <strong>tendencia</strong> principal (ψ crece como x en promedio).
                </li>
                <li>
                  <Equation math={'-\\sum_\\rho x^\\rho/\\rho'} />: las <strong>correcciones oscilantes</strong>, una por
                  cada cero no trivial — las ondas que tallan los escalones.
                </li>
                <li>
                  <Equation math={'-\\log(2\\pi)'} /> y <Equation math={'-\\tfrac12\\log(1-x^{-2})'} />: constantes y un
                  término pequeño (de los ceros triviales) que ajustan la base.
                </li>
              </ul>
            </Accordion>

            <Accordion title="Derivación de la onda real (par conjugado ρ, ρ̄)" equation={'\\frac{x^{\\rho}}{\\rho}+\\frac{x^{\\bar\\rho}}{\\bar\\rho}'}>
              <ol className="list-decimal space-y-3 pl-5">
                <li>
                  Los ceros vienen en pares conjugados <Equation math={'\\rho=\\tfrac12+i\\gamma'} /> y{' '}
                  <Equation math={'\\bar\\rho=\\tfrac12-i\\gamma'} />, así que en la suma aparecen juntos.
                </li>
                <li>
                  Forma polar de <Equation math={'x^\\rho'} /> (con <Equation math={'\\theta=\\gamma\\ln x'} />):
                  <Equation display className="my-2 block overflow-x-auto" math={'x^{\\rho}=x^{1/2+i\\gamma}=\\sqrt{x}\\,e^{i\\gamma\\ln x}=\\sqrt{x}\\,(\\cos\\theta+i\\sin\\theta).'} />
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    Justificación: <Equation math={'x^{i\\gamma}=e^{i\\gamma\\ln x}'} /> y la fórmula de Euler.
                  </span>
                </li>
                <li>
                  Dividimos por <Equation math={'\\rho=\\tfrac12+i\\gamma'} /> racionalizando (× conjugado{' '}
                  <Equation math={'\\tfrac12-i\\gamma'} />; denominador <Equation math={'|\\rho|^2=\\tfrac14+\\gamma^2'} />):
                  <Equation display className="my-2 block overflow-x-auto" math={'\\frac{x^\\rho}{\\rho}=\\frac{\\sqrt{x}\\,(\\cos\\theta+i\\sin\\theta)(\\tfrac12-i\\gamma)}{\\tfrac14+\\gamma^2}.'} />
                  Expandiendo el numerador: <Equation math={'(\\tfrac12\\cos\\theta+\\gamma\\sin\\theta)+i(\\tfrac12\\sin\\theta-\\gamma\\cos\\theta)'} />.
                </li>
                <li>
                  <Equation math={'x^{\\bar\\rho}/\\bar\\rho'} /> es el <strong>conjugado</strong> de{' '}
                  <Equation math={'x^\\rho/\\rho'} />. Al sumar un complejo y su conjugado, la parte imaginaria se cancela
                  y la real se duplica:
                  <Equation display className="my-2 block overflow-x-auto" math={'\\frac{x^\\rho}{\\rho}+\\frac{x^{\\bar\\rho}}{\\bar\\rho}=\\frac{2\\sqrt{x}\\,\\big[\\tfrac12\\cos(\\gamma\\ln x)+\\gamma\\sin(\\gamma\\ln x)\\big]}{\\tfrac14+\\gamma^2}.'} />
                </li>
                <li>
                  Cada par de ceros aporta una <strong>onda real</strong> de frecuencia <Equation math={'\\gamma'} /> y
                  amplitud <Equation math={'\\sim \\sqrt{x}/|\\rho|'} />. Verificación (M1): la onda del primer cero en{' '}
                  <Equation math={'x=10'} /> vale <Equation math={`\\approx ${waveOfZero(10, 1).toFixed(3)}`} />. ∎
                </li>
              </ol>
            </Accordion>

            <Accordion title="La línea crítica y por qué importa la HR" equation={'\\text{amplitud} \\sim x^{\\operatorname{Re}(\\rho)}'}>
              <ol className="list-decimal space-y-3 pl-5">
                <li>
                  La amplitud de cada onda lleva el factor <Equation math={'\\sqrt{x}=x^{1/2}=x^{\\operatorname{Re}(\\rho)}'} />,
                  y ese <Equation math={'\\tfrac12'} /> es justo <Equation math={'\\operatorname{Re}(\\rho)'} /> en la
                  línea crítica.
                </li>
                <li>
                  Si un cero estuviera FUERA de la línea, con <Equation math={'\\operatorname{Re}(\\rho)=0.7'} />, su onda
                  crecería como <Equation math={'x^{0.7}'} /> — mucho más rápido que <Equation math={'\\sqrt{x}=x^{0.5}'} />{' '}
                  — y la distribución de primos sería bastante más irregular (error grande).
                </li>
                <li>
                  Por eso <strong>importa la HR</strong>: <em>si</em> la HR es cierta (todos los ceros con{' '}
                  <Equation math={'\\operatorname{Re}(\\rho)=\\tfrac12'} />), todas las ondas tienen amplitud{' '}
                  <Equation math={'\\sqrt{x}'} /> y el error <Equation math={'|\\psi(x)-x|'} /> es el <em>mínimo posible</em>{' '}
                  (<Equation math={'\\sim\\sqrt{x}\\,\\log^2 x'} />).
                </li>
                <li>
                  <strong>M6:</strong> esto dice "si la HR fuese cierta, el error es mínimo". La HR <strong>no</strong> está
                  demostrada — es lo que hace de esta conexión una motivación, no una conclusión.
                </li>
              </ol>
            </Accordion>
          </div>
        }
        avanzado={
          <div className="space-y-3">
            <p>
              <strong>De ψ a π.</strong> La fórmula explícita para <Equation math={'\\pi(x)'} /> (la del Módulo 0) tiene la
              misma estructura pero con <Equation math={'\\operatorname{li}(x^\\rho)'} /> en lugar de{' '}
              <Equation math={'x^\\rho/\\rho'} />:
            </p>
            <Equation
              display
              className="block overflow-x-auto py-1 text-slate-900 dark:text-slate-100"
              math={'\\pi(x) \\approx \\operatorname{li}(x) - \\sum_{\\rho}\\operatorname{li}(x^{\\rho}) + \\cdots'}
            />
            <p>
              Es más enredada de animar (por eso usamos <Equation math={'\\psi'} />), pero el mensaje es el mismo: el error{' '}
              <Equation math={'\\operatorname{li}(x)-\\pi(x)'} /> del Módulo 0 está controlado por los ceros. Profundización:
              Edwards, <em>Riemann's Zeta Function</em>, cap. 1–3.
            </p>
          </div>
        }
      />

      <p className="rounded-md border border-amber-300/60 bg-amber-50 px-3 py-2 text-sm leading-relaxed text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-200">
        <strong>Por qué importa la HR (honestidad M6):</strong> si la HR fuese cierta —todos los ceros con{' '}
        <Equation math={'\\operatorname{Re}(\\rho)=\\tfrac12'} />— cada onda tendría amplitud <Equation math={'\\sqrt{x}'} />{' '}
        y el error <Equation math={'|\\psi(x)-x|'} /> sería el mínimo posible. Pero la HR <strong>no está demostrada</strong>:
        esto es una motivación poderosa, no una conclusión. Verificar billones de ceros no es una prueba.
      </p>

      <section aria-label="Ejercicios" className="space-y-4">
        <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">Ejercicios</h2>

        <NumericExercise
          layer="formal"
          prompt={
            <span>
              Calcula la escalera real <Equation math={'\\psi(20)'} /> sumando <Equation math={'\\log p'} /> sobre las
              potencias de primo <Equation math={'\\le 20'} /> (3 decimales).
            </span>
          }
          inputLabel="ψ(20) ="
          step={0.001}
          check={(v) => Math.abs(v - psiChebyshev(20)) < 0.01}
          renderFeedback={(_v, ok) => (
            <span>
              {ok ? '' : 'Suma log p sobre 2,4,8,16, 3,9, 5,7,11,13,17,19. '}ψ(20) = {psiChebyshev(20).toFixed(3)}. Con 100
              ondas la fórmula explícita da {psiExplicit(20, 100).toFixed(2)} (error ≈{' '}
              {Math.abs(psiExplicit(20, 100) - psiChebyshev(20)).toFixed(2)}; con 1 cero el error es{' '}
              {Math.abs(psiExplicit(20, 1) - psiChebyshev(20)).toFixed(2)}).
            </span>
          )}
          hint={
            <p>
              Potencias de primo <Equation math={'\\le 20'} />: 2, 4, 8, 16 (cuatro veces <Equation math={'\\log 2'} />),
              3, 9 (dos <Equation math={'\\log 3'} />), y 5, 7, 11, 13, 17, 19.
            </p>
          }
          solution={
            <ol className="list-decimal space-y-1 pl-5">
              <li>
                <Equation math={'4\\log 2 + 2\\log 3 + \\log 5+\\log 7+\\log 11+\\log 13+\\log 17+\\log 19'} />.
              </li>
              <li>≈ 2.773 + 2.197 + 1.609 + 1.946 + 2.398 + 2.565 + 2.833 + 2.944.</li>
              <li>= 19.266.</li>
            </ol>
          }
        />

        <NumericExercise
          layer="avanzado"
          prompt={
            <span>
              La amplitud de la onda de un cero crece como <Equation math={'x^{\\operatorname{Re}(\\rho)}'} />. Si un cero
              estuviera en <Equation math={'\\operatorname{Re}(\\rho)=0.7'} />, ¿con qué exponente de <Equation math={'x'} />{' '}
              crecería su onda?
            </span>
          }
          inputLabel="exponente ="
          check={(v) => Math.abs(v - 0.7) < 1e-6}
          renderFeedback={(_v, ok) => (
            <span>
              {ok ? '' : 'La amplitud es x^{Re(ρ)}. '}Crecería como <Equation math={'x^{0.7}'} /> — más rápido que{' '}
              <Equation math={'\\sqrt{x}=x^{0.5}'} />. Por eso, si la HR es cierta (Re=½), el error es el mínimo posible.
            </span>
          )}
          hint={
            <p>
              La amplitud lleva el factor <Equation math={'x^{\\operatorname{Re}(\\rho)}'} />; en la línea crítica{' '}
              <Equation math={'\\operatorname{Re}(\\rho)=\\tfrac12'} /> da <Equation math={'\\sqrt{x}'} />.
            </p>
          }
          solution={
            <ol className="list-decimal space-y-1 pl-5">
              <li>
                La onda de <Equation math={'\\rho'} /> tiene amplitud <Equation math={'\\sim x^{\\operatorname{Re}(\\rho)}'} />.
              </li>
              <li>
                Con <Equation math={'\\operatorname{Re}(\\rho)=0.7'} /> el exponente es 0.7.
              </li>
              <li>
                Es {'>'} 0.5, así que crecería más rápido que <Equation math={'\\sqrt{x}'} /> (primos más irregulares).
              </li>
            </ol>
          }
        />

        <NumericExercise
          layer="intuicion"
          prompt={
            <span>
              Exploración: con <Equation math={'N=0'} /> ondas, <Equation math={'\\psi_{\\text{exp}}'} /> es solo la
              tendencia suave. ¿Cuánto vale <Equation math={'\\psi_{\\text{exp}}(10,\\,0)'} /> (sin ondas)? (2 decimales)
            </span>
          }
          inputLabel="ψ aproximada (N=0) ="
          step={0.01}
          check={(v) => Math.abs(v - psiMainTerm(10)) < 0.05}
          renderFeedback={(_v, ok) => (
            <span>
              {ok ? '' : 'Es x − log(2π) − ½log(1−x⁻²) en x=10. '}Sin ondas: {psiMainTerm(10).toFixed(2)}. Sube N en G6 y
              verás que con 100 ondas baja a {psiExplicit(10, 100).toFixed(2)}, cerca de ψ(10) = {psiChebyshev(10).toFixed(3)}.
            </span>
          )}
          hint={
            <p>
              <Equation math={'\\psi_{\\text{exp}}(x,0)=x-\\log(2\\pi)-\\tfrac12\\log(1-x^{-2})'} />, evaluado en{' '}
              <Equation math={'x=10'} />.
            </p>
          }
          solution={
            <ol className="list-decimal space-y-1 pl-5">
              <li>
                <Equation math={'10-\\log(2\\pi)-\\tfrac12\\log(1-10^{-2})'} />.
              </li>
              <li>
                <Equation math={'\\log(2\\pi)\\approx 1.838'} />; el último término es minúsculo.
              </li>
              <li>≈ 8.17 (la tendencia; las ondas la corrigen hacia 7.832).</li>
            </ol>
          }
        />
      </section>
    </ModuleLayout>
  )
}
