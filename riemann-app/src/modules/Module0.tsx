// src/modules/Module0.tsx — Módulo 0: Primos y el porqué (contenido real, Fase 3).
// Tres capas (intuición/formal/avanzado), derivación de li(x) paso a paso en acordeones (M1+M2),
// gráfica interactiva G1 (M3) y ejercicios con comprobador numérico. Honestidad en el puente a
// la HR (M6): se señala, no se afirma demostrada.
import Accordion from '../components/Accordion'
import Equation from '../components/Equation'
import GraphicErrorBoundary from '../components/GraphicErrorBoundary'
import ModuleLayout from '../components/ModuleLayout'
import NumericExercise from '../components/NumericExercise'
import SectionCompleteButton from '../components/SectionCompleteButton'
import ThreeLayers from '../components/ThreeLayers'
import PrimeCountingPlot from '../components/graphics/PrimeCountingPlot'
import { getModule } from './moduleContent'
import { primePi, xOverLnx, liApprox } from '../lib/primes'

const META = getModule(0)!

// Conteo real de primos en [10⁶, 10⁶+1000] para el comprobador del ejercicio 3.
// Se calcula una sola vez y solo cuando hace falta (criba de ~10⁶).
let millionWindowCache: number | null = null
function realPrimesInMillionWindow(): number {
  if (millionWindowCache === null) {
    millionWindowCache = primePi(1_001_000) - primePi(1_000_000)
  }
  return millionWindowCache
}

export default function Module0() {
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
        <GraphicErrorBoundary label="G1 · π(x) vs aproximaciones">
          <PrimeCountingPlot />
        </GraphicErrorBoundary>
      }
    >
      <ThreeLayers
        intuicion={
          <div className="space-y-3">
            <p>
              Los números primos parecen salir sin patrón: 2, 3, 5, 7, 11, 13, … Sin embargo, vistos en masa, su{' '}
              <em>densidad</em> sigue una ley muy regular. La pregunta que abre todo el viaje es sencilla de enunciar:{' '}
              <strong>¿cuántos primos hay por debajo de un número x?</strong>
            </p>
            <p>
              A esa cantidad la llamamos <Equation math={'\\pi(x)'} />. Mueve el slider de la gráfica: verás que{' '}
              <Equation math={'\\pi(x)'} /> crece de forma sorprendentemente suave, escoltada por dos aproximaciones.
            </p>
          </div>
        }
        formal={
          <div className="space-y-4">
            <p>
              Definimos la función contadora de primos y la comparamos con dos aproximaciones clásicas: la elemental{' '}
              <Equation math={'x/\\ln x'} /> y la integral logarítmica <Equation math={'\\operatorname{li}(x)'} />.
            </p>
            <Equation
              display
              className="block overflow-x-auto py-1 text-slate-900 dark:text-slate-100"
              math={'\\pi(x) \\sim \\frac{x}{\\ln x}, \\qquad \\pi(x) \\approx \\operatorname{li}(x) = \\int_0^{x}\\frac{dt}{\\ln t}'}
            />

            <Accordion title="Definición de π(x)" equation={'\\pi(x) = \\#\\{\\,p \\text{ primo} : p \\le x\\,\\}'}>
              <div className="space-y-3">
                <p>
                  <Equation math={'\\pi(x)'} /> cuenta cuántos primos hay hasta x (incluido x). Calculémoslo con números
                  reales (no en abstracto):
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    Primos <Equation math={'\\le 10'} />: 2, 3, 5, 7 <span className="text-slate-500">→ </span>
                    <Equation math={'\\pi(10) = 4'} />.
                  </li>
                  <li>
                    Primos <Equation math={'\\le 30'} />: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29{' '}
                    <span className="text-slate-500">→ </span>
                    <Equation math={'\\pi(30) = 10'} />.
                  </li>
                </ul>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Nota: 1 no es primo. Para decidir si <Equation math={'n'} /> es primo basta probar divisores hasta{' '}
                  <Equation math={'\\sqrt{n}'} />.
                </p>
              </div>
            </Accordion>

            <Accordion
              title="De la densidad 1/ln x a la integral logarítmica"
              equation={'\\pi(x) \\approx \\int_2^{x}\\frac{dt}{\\ln t}'}
            >
              <ol className="list-decimal space-y-3 pl-5">
                <li>
                  <strong>Heurística de Gauss.</strong> Cerca de un número grande <Equation math={'t'} />, la proporción
                  de primos (su densidad) es aproximadamente <Equation math={'1/\\ln t'} />.
                  <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                    Justificación: observación empírica de Gauss sobre tablas de primos; el PNT la formaliza.
                  </span>
                </li>
                <li>
                  <strong>Contribución de una franja.</strong> En un intervalo estrecho{' '}
                  <Equation math={'[t,\\, t+dt]'} />, el número esperado de primos es densidad × ancho{' '}
                  <Equation math={'= \\dfrac{1}{\\ln t}\\,dt'} />.
                  <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                    Justificación: número ≈ densidad × longitud del intervalo.
                  </span>
                </li>
                <li>
                  <strong>Sumar todas las franjas = integrar.</strong> Acumulando desde <Equation math={'t=2'} /> hasta x:
                  <Equation
                    display
                    className="my-2 block overflow-x-auto"
                    math={'\\pi(x) \\approx \\int_2^{x}\\frac{dt}{\\ln t}.'}
                  />
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    Justificación: la integral es la suma continua de las contribuciones infinitesimales.
                  </span>
                </li>
                <li>
                  <strong>Eso es la integral logarítmica.</strong> La versión estándar{' '}
                  <Equation math={'\\operatorname{li}(x)'} /> integra desde 0 (valor principal en la singularidad{' '}
                  <Equation math={'t=1'} />). Numéricamente la calculamos partiendo de 2 y sumando la constante{' '}
                  <Equation math={'\\operatorname{li}(2)\\approx 1.04516'} />:
                  <Equation
                    display
                    className="my-2 block overflow-x-auto"
                    math={'\\operatorname{li}(x) = \\operatorname{li}(2) + \\int_2^{x}\\frac{dt}{\\ln t}.'}
                  />
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    Justificación: definición de <Equation math={'\\operatorname{li}'} />; partir de 2 evita la
                    singularidad en <Equation math={'t=1'} />. (El "offset" <Equation math={'\\mathrm{Li}(x)=\\int_2^x'} />{' '}
                    difiere justo en <Equation math={'\\operatorname{li}(2)'} />.)
                  </span>
                </li>
                <li>
                  <strong>Evaluación con números reales.</strong> En <Equation math={'x=1000'} />:
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    <li>
                      <Equation math={'\\operatorname{li}(1000) \\approx 177.61'} /> (la app integra Simpson).
                    </li>
                    <li>
                      <Equation math={'\\pi(1000) = 168'} /> (conteo real por criba).
                    </li>
                    <li>
                      <Equation math={'1000/\\ln 1000 \\approx 144.76'} />.
                    </li>
                  </ul>
                  <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                    Es decir, <Equation math={'\\operatorname{li}'} /> sobreestima por ≈ 9.6 y{' '}
                    <Equation math={'x/\\ln x'} /> subestima por ≈ 23. Mueve el slider para verlo.
                  </span>
                </li>
              </ol>
            </Accordion>

            <Accordion
              title="Enunciado del PNT (y su sutileza)"
              equation={'\\lim_{x\\to\\infty}\\frac{\\pi(x)}{x/\\ln x} = 1'}
            >
              <div className="space-y-3">
                <p>
                  El <strong>Teorema de los Números Primos</strong> dice <Equation math={'\\pi(x)\\sim x/\\ln x'} />, que
                  significa que el <em>cociente</em> tiende a 1. La sutileza clave: el cociente → 1 pero la{' '}
                  <em>diferencia</em> crece sin tope.
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    En <Equation math={'x=1000'} />: cociente <Equation math={'168/144.76 \\approx 1.16'} />; diferencia{' '}
                    <Equation math={'168 - 144.76 \\approx 23.2'} />.
                  </li>
                  <li>
                    En <Equation math={'x=10^4'} />: cociente <Equation math={'1229/1085.7 \\approx 1.13'} />; diferencia{' '}
                    <Equation math={'\\approx 143'} />.
                  </li>
                </ul>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No hay contradicción: cociente → 1 quiere decir error <em>relativo</em> → 0; la diferencia{' '}
                  <em>absoluta</em> puede crecer igualmente.
                </p>
              </div>
            </Accordion>
          </div>
        }
        avanzado={
          <div className="space-y-3">
            <p>
              <strong>El puente a la Hipótesis de Riemann.</strong> ¿De qué <em>tamaño</em> es el error{' '}
              <Equation math={'\\operatorname{li}(x) - \\pi(x)'} />? Ahí aparece ζ. La fórmula explícita (Módulo 4)
              escribe ese error como una suma sobre los <em>ceros</em> de la función zeta.
            </p>
            <p>
              Si la HR fuese cierta —todos los ceros no triviales con parte real <Equation math={'\\tfrac{1}{2}'} />— el
              error quedaría acotado por <Equation math={'\\approx \\sqrt{x}\\,\\ln x'} />, minúsculo frente a x.
            </p>
            <p className="rounded-md border border-amber-300/60 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-200">
              Pero la HR <strong>no</strong> está demostrada: solo se conocen cotas más débiles, y verificar billones
              de ceros no es una prueba (M6). Aquí solo señalamos el puente; se desarrolla en el Módulo 4.
            </p>
          </div>
        }
      />

      <section aria-label="Ejercicios" className="space-y-4">
        <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">Ejercicios</h2>

        <NumericExercise
          layer="intuicion"
          prompt={
            <span>
              Cálculo a mano: cuenta los primos hasta 30 y di cuánto vale <Equation math={'\\pi(30)'} />.
            </span>
          }
          inputLabel="π(30) ="
          step={1}
          check={(v) => Math.abs(v - 10) < 0.5}
          renderFeedback={(_v, ok) =>
            ok ? (
              <span>
                π(30) = {primePi(30)}. Para comparar, 30/ln 30 ≈ {xOverLnx(30).toFixed(2)}.
              </span>
            ) : (
              <span>El conteo real es π(30) = {primePi(30)} (2, 3, 5, 7, 11, 13, 17, 19, 23, 29).</span>
            )
          }
          hint={
            <p>
              Recuerda que 1 no es primo. Basta comprobar divisibilidad por 2, 3 y 5 (hasta{' '}
              <Equation math={'\\sqrt{30}\\approx 5.48'} />).
            </p>
          }
          solution={
            <ol className="list-decimal space-y-1 pl-5">
              <li>Lista los candidatos impares (y el 2) hasta 30.</li>
              <li>Descarta múltiplos de 2, 3, 5.</li>
              <li>Quedan 2, 3, 5, 7, 11, 13, 17, 19, 23, 29 → diez primos.</li>
            </ol>
          }
        />

        <NumericExercise
          layer="formal"
          prompt={
            <span>
              El cociente del PNT tiende a 1, pero la diferencia crece. En <Equation math={'x=1000'} />, ¿cuánto vale{' '}
              <Equation math={'\\operatorname{li}(1000)-\\pi(1000)'} />? (redondea al entero)
            </span>
          }
          inputLabel="li(1000) − π(1000) ≈"
          check={(v) => Math.abs(v - (liApprox(1000) - primePi(1000))) < 1}
          renderFeedback={(_v, ok) => (
            <span>
              {ok ? '' : 'Casi. '}li(1000) ≈ {liApprox(1000).toFixed(2)}, π(1000) = {primePi(1000)} → diferencia ≈{' '}
              {(liApprox(1000) - primePi(1000)).toFixed(2)}. El cociente va hacia 1, pero la diferencia crece: no se
              contradicen.
            </span>
          )}
          hint={<p>Resta el conteo real al valor de la integral logarítmica que ves en la gráfica.</p>}
          solution={
            <ol className="list-decimal space-y-1 pl-5">
              <li>li(1000) ≈ 177.61 (la app lo integra).</li>
              <li>π(1000) = 168 (conteo real).</li>
              <li>Diferencia ≈ 9.6 → redondeando, 10.</li>
            </ol>
          }
        />

        <NumericExercise
          layer="formal"
          prompt={
            <span>
              Verificación numérica: usa la densidad <Equation math={'1/\\ln(10^6)'} /> para predecir cuántos primos hay
              en el intervalo <Equation math={'[10^6,\\, 10^6+1000]'} />. (redondea)
            </span>
          }
          inputLabel="primos previstos ≈"
          check={(v) => Math.abs(v - 1000 / Math.log(1e6)) < 2}
          renderFeedback={(_v, ok) => (
            <span>
              {ok ? '' : 'Revisa. '}Densidad 1/ln(10⁶) ≈ {(1 / Math.log(1e6)).toFixed(4)}; × 1000 ≈{' '}
              {(1000 / Math.log(1e6)).toFixed(1)} primos previstos. Conteo real: {realPrimesInMillionWindow()}. Buena
              aproximación.
            </span>
          )}
          hint={
            <p>
              La densidad es <Equation math={'1/\\ln(10^6)'} /> y el ancho del intervalo es 1000. Multiplica.
            </p>
          }
          solution={
            <ol className="list-decimal space-y-1 pl-5">
              <li>
                <Equation math={'\\ln(10^6) = 6\\ln 10 \\approx 13.8155'} />.
              </li>
              <li>
                Densidad <Equation math={'\\approx 1/13.8155 \\approx 0.0724'} />.
              </li>
              <li>Previsión: 0.0724 × 1000 ≈ 72.4 primos (el real ronda 75).</li>
            </ol>
          }
        />
      </section>
    </ModuleLayout>
  )
}
