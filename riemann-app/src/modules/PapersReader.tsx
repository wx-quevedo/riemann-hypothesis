// src/modules/PapersReader.tsx — Lector de papers (Fase 7). Cumple el objetivo original: acompañar
// la lectura de papers de la HR desmontándolos por capas. Marco didáctico (condicional vs
// incondicional, qué asume/qué prueba) + 1–2 papers reales explicados con palabras propias y
// ENLACES a las fuentes (NO se incrustan PDFs ni se reproduce texto con copyright). Conecta con la
// Fase 2 del propio proyecto (G7 reproduce el análisis de espaciados GUE). M6: "pruebas" recientes
// = no validadas.
import type { ReactNode } from 'react'
import Accordion from '../components/Accordion'
import Equation from '../components/Equation'
import ModuleLayout from '../components/ModuleLayout'
import SectionCompleteButton from '../components/SectionCompleteButton'
import { PAPERS_SECTION } from './moduleContent'

type LinkProps = { href: string; children: ReactNode }
function Source({ href, children }: LinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent-700 underline decoration-accent-400/50 underline-offset-2 hover:text-accent-800 dark:text-accent-300 dark:hover:text-accent-200"
    >
      {children}
    </a>
  )
}

export default function PapersReader() {
  return (
    <ModuleLayout
      header={
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-accent-600 dark:text-accent-400">Acompañamiento</p>
            <h1 className="mt-1 text-2xl font-medium text-slate-900 dark:text-slate-100">Lector de papers</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
              Cómo leer un paper de la Hipótesis de Riemann desmontándolo por capas.
            </p>
          </div>
          <SectionCompleteButton sectionId={PAPERS_SECTION.sectionId} />
        </div>
      }
    >
      <div className="space-y-6">
        <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
          Leer un paper de teoría analítica de números no es leerlo de principio a fin. Es localizar{' '}
          <strong>qué afirma</strong>, <strong>qué asume</strong> y <strong>qué prueba</strong> — y separar lo{' '}
          condicional de lo incondicional. Aquí tienes un marco y dos papers reales explicados con palabras propias, con
          enlaces a las fuentes (sin reproducir su texto).
        </p>

        <section aria-label="Marco para leer un paper" className="space-y-3">
          <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">Marco para leer un paper</h2>
          <Accordion title="Cómo abordar un paper de teoría analítica de números" defaultOpen>
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                <strong>Abstract:</strong> el resumen. Di en una frase qué resultado anuncia y bajo qué hipótesis.
              </li>
              <li>
                <strong>Enunciado principal (el teorema):</strong> búscalo (suele estar numerado). Identifica las
                cantidades y las cotas.
              </li>
              <li>
                <strong>Qué asume vs qué prueba:</strong> ¿usa hipótesis extra? La distinción crítica:
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  <li>
                    <strong>Condicional</strong> — "<em>suponiendo la HR</em>, …": el resultado depende de una conjetura
                    no probada.
                  </li>
                  <li>
                    <strong>Incondicional</strong> — no asume la HR: es un teorema que se sostiene por sí mismo.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Métodos:</strong> ¿es analítico, computacional, una conexión con otra área? No hace falta seguir
                cada paso para entender la estructura.
              </li>
              <li>
                <strong>Alcance honesto:</strong> ¿qué queda abierto? Un buen paper lo dice. Desconfía del que afirme
                "resolver" la HR sin revisión por pares.
              </li>
            </ol>
          </Accordion>
        </section>

        <section aria-label="Papers desmontados" className="space-y-4">
          <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">Papers desmontados por capas</h2>

          <Accordion
            title="Montgomery (1973) + Odlyzko — la conexión GUE (incondicional)"
            equation={'R_2(u)=1-\\left(\\tfrac{\\sin\\pi u}{\\pi u}\\right)^2'}
          >
            <div className="space-y-3">
              <p>
                <strong>Intuición:</strong> ¿están los ceros repartidos al azar? Montgomery midió cómo se correlacionan
                sus espaciados y encontró un patrón; Dyson lo reconoció como el de los autovalores de matrices aleatorias
                (GUE). Odlyzko lo confirmó computacionalmente a gran escala.
              </p>
              <p>
                <strong>Qué hacen:</strong> Montgomery deriva la función de correlación de pares (incondicional en su forma
                principal). Odlyzko calcula millones de ceros a alta precisión y compara su estadística con la predicción
                GUE — y encaja.
              </p>
              <p>
                <strong>Cómo (y por qué te suena):</strong> Odlyzko usa exactamente lo que tú hiciste en la Fase 2 de este
                proyecto: <strong>precálculo de ceros a alta precisión</strong> y análisis de sus espaciados. Es teoría de
                números hecha también con cómputo cuidadoso.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Fuentes: <Source href="https://en.wikipedia.org/wiki/Montgomery%27s_pair_correlation_conjecture">conjetura de correlación de pares de Montgomery</Source>{' '}
                · <Source href="https://en.wikipedia.org/wiki/Hilbert%E2%80%93P%C3%B3lya_conjecture">conjetura de Hilbert–Pólya</Source>.
              </p>
            </div>
          </Accordion>

          <Accordion title="Platt & Trudgian (2021) — verificación hasta 3×10¹² (incondicional, pero acotado)" equation={'\\operatorname{Re}(\\rho)=\\tfrac12 \\text{ para } |\\gamma| \\le 3\\times10^{12}'}>
            <div className="space-y-3">
              <p>
                <strong>Intuición:</strong> comprobar, con garantías rigurosas, que todos los ceros hasta cierta altura
                están en la línea crítica.
              </p>
              <p>
                <strong>Qué prueba:</strong> que la HR es cierta <em>hasta la altura</em> <Equation math={'t\\approx 3\\times10^{12}'} />.
                Es un resultado <strong>incondicional</strong> — no asume la HR — pero <strong>acotado</strong>: no dice
                nada sobre los infinitos ceros por encima.
              </p>
              <p>
                <strong>La trampa que enseña a evitar:</strong> "verificado hasta <Equation math={'3\\times10^{12}'} />" no es
                "demostrado". Conecta con la lección del Módulo 5 (evidencia ≠ prueba).
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Fuente: <Source href="https://arxiv.org/abs/2004.09765">Platt &amp; Trudgian, "The Riemann hypothesis is true up to 3·10¹²" (arXiv:2004.09765)</Source>.
              </p>
            </div>
          </Accordion>
        </section>

        <section
          aria-label="Conexión con tu proyecto"
          className="rounded-xl border border-accent-300/60 bg-accent-50/50 p-4 dark:border-accent-500/30 dark:bg-accent-500/10"
        >
          <h2 className="text-sm font-medium text-slate-900 dark:text-slate-100">Ya hiciste ciencia del estado del arte</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
            La gráfica G7 del Módulo 5 reproduce, a pequeña escala, el análisis de espaciados de los papers de GUE: tomas
            ceros precalculados (Fase 2, mpmath), los normalizas y comparas con la ley de Wigner. Es el mismo pipeline que
            usa Odlyzko, solo que con 1000 ceros en lugar de millones.
          </p>
        </section>

        <p className="rounded-md border border-amber-300/60 bg-amber-50 px-3 py-2 text-sm leading-relaxed text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-200">
          <strong>Honestidad (M6):</strong> circulan preprints que se autodenominan pruebas de la HR. Trátalos como{' '}
          <strong>no validados</strong> hasta que pasen revisión por pares experta; ninguno lo ha hecho. Para explorar lo
          más reciente con criterio, mira el listado de teoría de números en{' '}
          <Source href="https://arxiv.org/list/math.NT/recent">arXiv math.NT</Source> — y aplica el marco de arriba. La HR{' '}
          <strong>no está resuelta</strong>; ver también la{' '}
          <Source href="https://www.claymath.org/millennium/riemann-hypothesis/">página del Clay Millennium Prize</Source>.
        </p>
      </div>
    </ModuleLayout>
  )
}
