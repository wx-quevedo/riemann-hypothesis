// src/modules/Module5.tsx — Módulo 5: estado del arte de la HR (Fase 7, datos verificados a 2026).
// Verificación computacional, conexión GUE/matrices aleatorias (Montgomery–Dyson–Odlyzko),
// enfoques actuales (Hilbert–Pólya, Berry–Keating, Connes, GRH) y la LECCIÓN central
// "evidencia ≠ prueba" (Li−π / Littlewood / Skewes). M6 ESTRICTO: la HR no está demostrada y
// las "pruebas" recientes / trabajos de ML se presentan como NO validados. G7 en el aside.
import Accordion from '../components/Accordion'
import Equation from '../components/Equation'
import GraphicErrorBoundary from '../components/GraphicErrorBoundary'
import ModuleLayout from '../components/ModuleLayout'
import NumericExercise from '../components/NumericExercise'
import SectionCompleteButton from '../components/SectionCompleteButton'
import ThreeLayers from '../components/ThreeLayers'
import GUESpacingPlot from '../components/graphics/GUESpacingPlot'
import { getModule } from './moduleContent'
import { meanSpacing } from '../lib/spacingStats'

const META = getModule(5)!

export default function Module5() {
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
        <GraphicErrorBoundary label="G7 · espaciados vs GUE">
          <GUESpacingPlot />
        </GraphicErrorBoundary>
      }
    >
      <ThreeLayers
        intuicion={
          <div className="space-y-3">
            <p>
              ¿Qué sabemos hoy? Se han verificado <strong>más de 10¹³ ceros</strong> y todos caen sobre la línea crítica.
              Hay además una conexión asombrosa con la física (matrices aleatorias). Pero <strong>no hay ninguna prueba</strong>.
            </p>
            <p data-testid="hr-status">
              La Hipótesis de Riemann sigue siendo una <strong>conjetura abierta</strong>: <strong>no está demostrada</strong>{' '}
              ni refutada. La lección de este módulo es justamente <em>por qué</em> tanta evidencia no basta.
            </p>
          </div>
        }
        formal={
          <div className="space-y-4">
            <Accordion title="1. Verificación computacional" equation={'\\operatorname{Re}(\\rho)=\\tfrac12 \\text{ hasta altura } \\sim 3\\times10^{12}'}>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Verificación rigurosa hasta altura <Equation math={'t\\approx 3\\times 10^{12}'} /> (Platt, 2021).
                </li>
                <li>
                  Los primeros <Equation math={'10^{13}'} /> ceros calculados (Gourdon &amp; Demichel, 2004). Todos sobre{' '}
                  <Equation math={'\\operatorname{Re}(s)=\\tfrac12'} /> hasta hoy.
                </li>
                <li>
                  <strong>Nota (M6):</strong> verificar <Equation math={'N'} /> ceros confirma la HR <em>hasta esa altura</em>,
                  no en general. Quedan infinitos ceros por encima; un contraejemplo podría vivir a una altura nunca
                  alcanzada.
                </li>
              </ul>
            </Accordion>

            <Accordion title="2. Conexión GUE / matrices aleatorias (Montgomery–Dyson–Odlyzko)" equation={'1-\\left(\\tfrac{\\sin\\pi u}{\\pi u}\\right)^2'}>
              <div className="space-y-3">
                <p>
                  Montgomery (1973) estudió la <strong>correlación de pares</strong> de los espaciados entre ceros y obtuvo
                  una fórmula. Dyson la reconoció al instante: era la de los autovalores del <strong>Gaussian Unitary
                  Ensemble</strong> (matrices hermíticas aleatorias) de la física. Odlyzko lo confirmó numéricamente a
                  gran escala (ceros cerca de las alturas <Equation math={'10^{12}'} /> y <Equation math={'10^{20}'} />).
                </p>
                <p>
                  Consecuencia: <strong>repulsión de niveles</strong> — los ceros no están al azar, se evitan como los
                  autovalores de una matriz hermítica. La gráfica G7 (derecha) lo reproduce a pequeña escala con los
                  primeros ceros: su histograma sigue la ley GUE.
                </p>
                <p className="rounded-md border border-accent-300/60 bg-accent-50/60 px-3 py-2 text-sm text-slate-700 dark:border-accent-500/30 dark:bg-accent-500/10 dark:text-slate-200">
                  <strong>El té de 1972 (IAS).</strong> Montgomery, de visita en Princeton, le mencionó su fórmula a Freeman
                  Dyson durante el té de la tarde. Dyson la identificó en el acto como la correlación de pares del GUE. Un
                  encuentro casual conectó la teoría de números con la física cuántica.
                </p>
              </div>
            </Accordion>

            <Accordion title="3. Enfoques teóricos actuales (un panorama, no demostraciones)" equation={'H\\,|\\psi\\rangle = \\gamma\\,|\\psi\\rangle'}>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Hilbert–Pólya:</strong> buscar un operador autoadjunto cuyos autovalores sean los{' '}
                  <Equation math={'\\gamma'} />; como los operadores hermíticos tienen autovalores reales, la HR seguiría.
                </li>
                <li>
                  <strong>Berry–Keating:</strong> el modelo <Equation math={'H=xp'} /> (posición × momento) como candidato a
                  ese Hamiltoniano; vínculo con el caos cuántico. Sin construcción rigurosa.
                </li>
                <li>
                  <strong>Connes:</strong> geometría no conmutativa; la fórmula explícita de Weil como una fórmula de traza;
                  la HR como condición de positividad. Inspirada en la HR para cuerpos finitos (esa sí con prueba completa,
                  vía Weil y Grothendieck).
                </li>
                <li>
                  <strong>GRH y Langlands:</strong> la HR generalizada a las L-funciones, dentro del programa de Langlands.
                </li>
                <li className="text-slate-500 dark:text-slate-400">Ninguno de estos enfoques es, a día de hoy, una demostración.</li>
              </ul>
            </Accordion>

            <Accordion title="4. “Pruebas” recientes y aprendizaje automático (M6 — con cuidado)" equation={'\\text{preprints} \\nRightarrow \\text{teorema}'}>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Circulan preprints (incluido 2025) que se autodenominan pruebas de la HR, y trabajos de machine learning
                  sobre los ceros. <strong>Ninguno está validado</strong> por la comunidad matemática.
                </li>
                <li>
                  Los de ML son exploraciones empíricas: refuerzan la evidencia a favor de la HR <em>sin producir una
                  prueba formal</em>.
                </li>
                <li>
                  <strong>Por qué validar una prueba es difícil:</strong> exige revisión por pares experta, línea a línea,
                  durante meses o años — no un veredicto rápido ni un "lo dice una IA". Una prueba real reescribiría la
                  teoría analítica de números; el listón es altísimo.
                </li>
              </ul>
            </Accordion>
          </div>
        }
        avanzado={
          <div className="space-y-3">
            <p>
              <strong>Correlación de pares (Montgomery).</strong> La densidad de correlación de pares de los ceros
              normalizados es
            </p>
            <Equation
              display
              className="block overflow-x-auto py-1 text-slate-900 dark:text-slate-100"
              math={'R_2(u) = 1 - \\left(\\frac{\\sin \\pi u}{\\pi u}\\right)^2,'}
            />
            <p>
              exactamente la del GUE. G7 muestra la versión de "vecino más próximo" (conjetura de Wigner). Profundización:
              Montgomery (1973); Odlyzko; Katz–Sarnak, <em>Random Matrices, Frobenius Eigenvalues, and Monodromy</em>.
            </p>
          </div>
        }
      />

      {/* LECCIÓN CENTRAL (M6, destacada): evidencia ≠ prueba. */}
      <section
        aria-label="La lección central: evidencia no es prueba"
        className="rounded-xl border-2 border-amber-300/70 bg-amber-50 p-5 dark:border-amber-500/40 dark:bg-amber-950/30"
      >
        <h2 className="text-xs font-medium uppercase tracking-wide text-amber-700 dark:text-amber-300">
          La lección central — evidencia ≠ prueba
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-amber-900 dark:text-amber-100">
          La historia de las matemáticas tiene conjeturas con respaldo numérico enorme que resultaron <strong>falsas</strong>.
          El ejemplo clásico es <Equation math={'\\operatorname{li}(x)-\\pi(x)'} />: en todo cómputo conocido{' '}
          <Equation math={'\\operatorname{li}(x)>\\pi(x)'} />, parece <em>siempre</em> positiva. Pero Littlewood (1914)
          demostró que <strong>cambia de signo infinitas veces</strong>; el primer cruce está más allá de{' '}
          <Equation math={'x=10^{316}'} /> (cota de Skewes), una altura jamás alcanzada por ningún ordenador.
        </p>
        <p className="mt-2 text-[15px] leading-relaxed text-amber-900 dark:text-amber-100">
          Si una cantidad puede "parecer" positiva hasta <Equation math={'10^{316}'} /> sin serlo, verificar{' '}
          <Equation math={'10^{13}'} /> ceros tampoco demuestra la HR. <strong>Por eso sigue siendo una conjetura</strong>{' '}
          — y por eso verificar billones de ceros no es una prueba.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-amber-900 dark:text-amber-100">
          Por lo mismo, las "pruebas" recientes de la HR (incluidas las asistidas por IA) <strong>no están validadas</strong>{' '}
          por la comunidad: trátalas como intentos abiertos, nunca como resueltos.
        </p>
      </section>

      <section aria-label="Ejercicios" className="space-y-4">
        <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">Ejercicios</h2>

        <NumericExercise
          layer="formal"
          prompt={
            <span>
              Calcula el espaciado medio normalizado de los primeros 1000 ceros (de <code className="text-xs">zeros.json</code>).
              ¿Cuánto da (2 decimales)?
            </span>
          }
          inputLabel="espaciado medio ="
          step={0.01}
          check={(v) => Math.abs(v - meanSpacing(1000)) < 0.05}
          renderFeedback={(_v, ok) => (
            <span>
              {ok ? '' : 'El "unfolding" normaliza para que la media sea ≈ 1. '}Da {meanSpacing(1000).toFixed(3)}; la
              estadística GUE predice exactamente 1. Sube N en G7 y se ajusta mejor a la curva de Wigner.
            </span>
          )}
          hint={<p>Tras normalizar (unfolding), la media de los espaciados tiende a 1 por construcción.</p>}
          solution={
            <ol className="list-decimal space-y-1 pl-5">
              <li>Se normalizan los espaciados con la densidad media local (unfolding).</li>
              <li>La media de los normalizados tiende a 1.</li>
              <li>Con 1000 ceros ya da ≈ 1.00.</li>
            </ol>
          }
        />

        <NumericExercise
          layer="avanzado"
          prompt={
            <span>
              ¿Por qué 10¹³ ceros verificados no demuestran la HR? El primer cruce conocido de{' '}
              <Equation math={'\\operatorname{li}(x)-\\pi(x)'} /> (Littlewood/Skewes) está más allá de{' '}
              <Equation math={'x=10^{?}'} />. Introduce el exponente.
            </span>
          }
          inputLabel="exponente de Skewes ="
          check={(v) => Math.abs(v - 316) < 2}
          renderFeedback={(_v, ok) => (
            <span>
              {ok ? '' : 'Está más allá de 10³¹⁶. '}El primer cruce está más allá de <Equation math={'10^{316}'} />, una
              altura nunca observada. Por eso "parecer positiva en todo cómputo" no demuestra que lo sea — ni 10¹³ ceros
              demuestran la HR.
            </span>
          )}
          hint={<p>La cota de Skewes pone el primer cruce más allá de 10 elevado a un número de tres cifras.</p>}
          solution={
            <ol className="list-decimal space-y-1 pl-5">
              <li>
                <Equation math={'\\operatorname{li}(x)-\\pi(x)'} /> parece siempre positiva en los cómputos.
              </li>
              <li>Littlewood probó que cambia de signo infinitas veces.</li>
              <li>El primer cruce está más allá de 10³¹⁶ → exponente 316.</li>
            </ol>
          }
        />

        <NumericExercise
          layer="formal"
          prompt={
            <span>
              Lectura. Un resumen (parafraseado) dice: <em>"Suponiendo la hipótesis de Riemann, demostramos una cota óptima
              para el término de error del teorema de los números primos."</em> ¿El resultado es condicional (escribe 1) o
              incondicional (escribe 0)?
            </span>
          }
          inputLabel="condicional=1 / incondicional=0 ="
          check={(v) => v === 1}
          renderFeedback={(_v, ok) => (
            <span>
              {ok ? '' : 'Fíjate en "suponiendo la HR". '}Es <strong>condicional</strong>: "suponiendo la HR" hace que el
              resultado dependa de una conjetura aún no probada. Un resultado incondicional no asume la HR.
            </span>
          )}
          hint={<p>Si el resultado empieza por "suponiendo/asumiendo la HR…", depende de ella.</p>}
          solution={
            <ol className="list-decimal space-y-1 pl-5">
              <li>El abstract dice "suponiendo la hipótesis de Riemann".</li>
              <li>Eso condiciona el resultado a que la HR sea cierta.</li>
              <li>Por tanto es condicional (1).</li>
            </ol>
          }
        />
      </section>
    </ModuleLayout>
  )
}
