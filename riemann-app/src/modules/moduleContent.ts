// Contenido PLACEHOLDER de los módulos (Fase 1). No es contenido didáctico real ni matemática
// implementada: solo texto de marcador + las ecuaciones (en LaTeX) que dan forma al chasis para
// que la app se vea completa y navegable. El contenido real llega módulo por módulo (Fase 3+).
import type { ExerciseLayer } from '../components/Exercise'

export type GraphicSpec = {
  code: string
  name: string
  phase: string
  controls: string
}

export type ModuleContent = {
  id: number
  path: string
  sectionId: string
  code: string
  navLabel: string
  title: string
  tagline: string
  intuicion: string
  formal: { text: string; equation?: string }
  avanzado: { text: string; equation?: string }
  accordion: { title: string; equation?: string; steps: string[] }
  graphics: GraphicSpec[]
  exercise: { prompt: string; layer: ExerciseLayer; hint: string; solution: string[] }
}

const PLACEHOLDER_STEPS = [
  'Paso 1 (placeholder): se mostrará cada paso aritmético y algebraico explícito (M1).',
  'Paso 2 (placeholder): cada línea justificará la regla o identidad aplicada.',
  'Paso 3 (placeholder): el valor final se calculará con números reales, sin dejarlo en abstracto.',
]

export const MODULES: ModuleContent[] = [
  {
    id: 0,
    path: '/modulo/0',
    sectionId: 'modulo-0',
    code: 'Módulo 0',
    navLabel: 'Primos y el porqué',
    title: 'Primos y el porqué',
    tagline: 'Los primos parecen aleatorios pero esconden un orden. ¿Cuántos hay hasta x?',
    intuicion:
      'Placeholder: los números primos aparecen sin patrón evidente, pero su densidad sigue una ley. La pregunta guía: ¿cuántos primos hay por debajo de un número x?',
    formal: {
      text: 'Placeholder: el Teorema de los Números Primos (PNT) describe el crecimiento de π(x), la cantidad de primos hasta x.',
      equation: '\\pi(x) \\sim \\frac{x}{\\ln x}',
    },
    avanzado: {
      text: 'Placeholder: la integral logarítmica Li(x) aproxima π(x) mejor que x/ln x. La derivación detallada llega en Fase 3.',
      equation: '\\operatorname{Li}(x) = \\int_2^{x} \\frac{dt}{\\ln t}',
    },
    accordion: {
      title: 'Derivación: de Gauss a la integral logarítmica',
      equation: '\\pi(x) \\approx \\operatorname{Li}(x)',
      steps: PLACEHOLDER_STEPS,
    },
    graphics: [
      { code: 'G1', name: 'π(x) vs x/ln x vs Li(x)', phase: 'Fase 3', controls: 'slider de x' },
    ],
    exercise: {
      prompt: 'Placeholder: cuenta a mano los primos menores que 30 y compara con x/ln x.',
      layer: 'intuicion',
      hint: 'Placeholder: recuerda que 1 no es primo y revisa la divisibilidad hasta √x.',
      solution: PLACEHOLDER_STEPS,
    },
  },
  {
    id: 1,
    path: '/modulo/1',
    sectionId: 'modulo-1',
    code: 'Módulo 1',
    navLabel: 'La función zeta de Euler',
    title: 'La función zeta de Euler (variable real)',
    tagline: 'Sumar 1 + 1/2ˢ + 1/3ˢ + … y por qué converge; la joya es el producto de Euler.',
    intuicion:
      'Placeholder: sumamos los inversos de las potencias de los naturales. Para s > 1 la suma converge a un número finito.',
    formal: {
      text: 'Placeholder: la función zeta como serie de Dirichlet para s real mayor que 1.',
      equation: '\\zeta(s) = \\sum_{n=1}^{\\infty} \\frac{1}{n^s}',
    },
    avanzado: {
      text: 'Placeholder: el producto de Euler conecta zeta con los primos mediante la factorización única. La derivación (serie geométrica → producto) llega en Fase 3.',
      equation: '\\zeta(s) = \\prod_{p \\text{ primo}} \\frac{1}{1 - p^{-s}}',
    },
    accordion: {
      title: 'Derivación: el producto de Euler',
      equation: '\\sum_{n=1}^{\\infty} \\frac{1}{n^s} = \\prod_{p} \\frac{1}{1 - p^{-s}}',
      steps: PLACEHOLDER_STEPS,
    },
    graphics: [
      { code: 'G2', name: 'ζ(s) real y valores especiales', phase: 'Fase 3', controls: 'slider de s' },
    ],
    exercise: {
      prompt: 'Placeholder: verifica el producto de Euler truncado a los primeros primos para s = 2.',
      layer: 'formal',
      hint: 'Placeholder: compara la suma parcial de 1/n² con el producto sobre p = 2, 3, 5, 7.',
      solution: PLACEHOLDER_STEPS,
    },
  },
  {
    id: 2,
    path: '/modulo/2',
    sectionId: 'modulo-2',
    code: 'Módulo 2',
    navLabel: 'Plano complejo y continuación',
    title: 'Plano complejo y continuación analítica',
    tagline: 'La serie se rompe para Re(s) ≤ 1, pero ζ se extiende de forma única a casi todo ℂ.',
    intuicion:
      'Placeholder: aunque la serie deja de sumar, existe una única forma de extender ζ a casi todo el plano complejo.',
    formal: {
      text: 'Placeholder: continuación analítica con un polo simple en s = 1; un valor famoso es ζ(0).',
      equation: '\\zeta(0) = -\\tfrac{1}{2}',
    },
    avanzado: {
      text: 'Placeholder: la función eta de Dirichlet ofrece una vía de cálculo convergente más allá de Re(s) > 1. Detalle en Fase 5.',
      equation: '\\eta(s) = \\sum_{n=1}^{\\infty} \\frac{(-1)^{n-1}}{n^s} = (1 - 2^{1-s})\\,\\zeta(s)',
    },
    accordion: {
      title: 'Derivación: ζ(0) = −1/2 vía la función eta',
      equation: '\\zeta(0) = -\\tfrac{1}{2}',
      steps: PLACEHOLDER_STEPS,
    },
    graphics: [
      { code: 'G3', name: 'Domain coloring de ζ en ℂ', phase: 'Fase 4', controls: 'zoom, pan, arrastre' },
    ],
    exercise: {
      prompt: 'Placeholder: identifica en el domain coloring dónde "gira" el color (los ceros).',
      layer: 'formal',
      hint: 'Placeholder: un cero se ve como un punto donde el matiz recorre todo el círculo cromático.',
      solution: PLACEHOLDER_STEPS,
    },
  },
  {
    id: 3,
    path: '/modulo/3',
    sectionId: 'modulo-3',
    code: 'Módulo 3',
    navLabel: 'Ceros triviales y no triviales',
    title: 'Ceros triviales y no triviales',
    tagline: 'Zonas donde ζ = 0: unas triviales, otras profundas. Aquí aparece el enunciado de la HR.',
    intuicion:
      'Placeholder: ζ se anula en ciertos puntos. Unos ceros son "fáciles" (triviales); los interesantes viven en la franja crítica.',
    formal: {
      text: 'Placeholder: la ecuación funcional relaciona ζ(s) con ζ(1−s); de ahí salen los ceros triviales en −2, −4, −6, …',
      equation: '\\zeta(s) = 2^{s}\\,\\pi^{s-1}\\,\\sin\\!\\left(\\tfrac{\\pi s}{2}\\right)\\,\\Gamma(1-s)\\,\\zeta(1-s)',
    },
    avanzado: {
      text: 'Placeholder — enunciado de la Hipótesis de Riemann: todos los ceros no triviales tendrían parte real 1/2. NO está demostrada (M6).',
      equation: '\\Re(s) = \\tfrac{1}{2}',
    },
    accordion: {
      title: 'Derivación: ceros triviales desde la ecuación funcional',
      equation: '\\sin\\!\\left(\\tfrac{\\pi s}{2}\\right) = 0 \\implies s = -2, -4, -6, \\dots',
      steps: PLACEHOLDER_STEPS,
    },
    graphics: [
      { code: 'G4', name: '|ζ(1/2 + it)|', phase: 'Fase 5', controls: 'rango de t, zoom' },
      { code: 'G5', name: 'Función Z de Hardy', phase: 'Fase 5', controls: 'rango de t' },
    ],
    exercise: {
      prompt: 'Placeholder: localiza los primeros ceros no triviales (t ≈ 14.13, 21.02, 25.01…).',
      layer: 'avanzado',
      hint: 'Placeholder: usa los cruces por cero de la función Z de Hardy.',
      solution: PLACEHOLDER_STEPS,
    },
  },
  {
    id: 4,
    path: '/modulo/4',
    sectionId: 'modulo-4',
    code: 'Módulo 4',
    navLabel: 'Ceros y primos: fórmula explícita',
    title: 'Ceros y primos: la fórmula explícita',
    tagline: 'Cada cero produce una "onda"; sumándolas se reconstruye la escalera de primos.',
    intuicion:
      'Placeholder: el módulo más bello. Cada cero no trivial aporta una onda; al sumarlas emergen los saltos en los primos.',
    formal: {
      text: 'Placeholder: la fórmula explícita de Riemann/von Mangoldt expresa ψ(x) como una suma sobre los ceros.',
      equation: '\\psi(x) = x - \\sum_{\\rho} \\frac{x^{\\rho}}{\\rho} - \\ln(2\\pi) - \\tfrac{1}{2}\\ln\\!\\left(1 - x^{-2}\\right)',
    },
    avanzado: {
      text: 'Placeholder: la contribución de cada cero ρ = 1/2 + iγ es una oscilación. El desarrollo y la animación llegan en Fase 6.',
      equation: '\\frac{x^{\\rho}}{\\rho}, \\quad \\rho = \\tfrac{1}{2} + i\\gamma',
    },
    accordion: {
      title: 'Derivación: de los ceros a la escalera de primos',
      equation: '\\psi(x) = x - \\sum_{\\rho} \\frac{x^{\\rho}}{\\rho} + \\cdots',
      steps: PLACEHOLDER_STEPS,
    },
    graphics: [
      { code: 'G6', name: 'Animación de la fórmula explícita', phase: 'Fase 6', controls: 'play/pausa, N ceros' },
    ],
    exercise: {
      prompt: 'Placeholder: suma N ondas y mide el error frente a π(x) real al crecer N.',
      layer: 'avanzado',
      hint: 'Placeholder: a más ceros sumados, más fina la aproximación de los saltos.',
      solution: PLACEHOLDER_STEPS,
    },
  },
  {
    id: 5,
    path: '/modulo/5',
    sectionId: 'modulo-5',
    code: 'Módulo 5',
    navLabel: 'Estado del arte',
    title: 'Estado del arte (verificado a 2026)',
    tagline: 'Evidencia numérica enorme — pero evidencia ≠ prueba. La HR sigue abierta (M6).',
    intuicion:
      'Placeholder: se han verificado billones de ceros sobre la línea crítica. Aun así, la Hipótesis de Riemann NO está demostrada.',
    formal: {
      text: 'Placeholder: conexión con matrices aleatorias (Montgomery–Dyson); el espaciado de ceros sigue la estadística GUE.',
      equation: 'R_2(u) = 1 - \\left(\\frac{\\sin \\pi u}{\\pi u}\\right)^2',
    },
    avanzado: {
      text: 'Placeholder: región libre de ceros, GRH y Langlands; los preprints recientes que se autodenominan "proof of RH" se tratan como intentos NO validados (M6).',
      equation: '\\text{HR abierta — Millennium Prize, US\\$1{,}000{,}000}',
    },
    accordion: {
      title: 'Lección crítica: verificar billones de ceros no es una prueba',
      steps: PLACEHOLDER_STEPS,
    },
    graphics: [
      { code: 'G7', name: 'Espaciado de ceros vs ley GUE', phase: 'Fase 7', controls: 'nº de ceros' },
    ],
    exercise: {
      prompt: 'Placeholder: contrasta un histograma de espaciados de ceros con la curva GUE.',
      layer: 'avanzado',
      hint: 'Placeholder: normaliza los espaciados antes de comparar con la densidad GUE.',
      solution: PLACEHOLDER_STEPS,
    },
  },
]

export function getModule(id: number): ModuleContent | undefined {
  return MODULES.find((m) => m.id === id)
}

// Sección "Lector de papers" (Fase 7). Se incluye en la navegación junto a los módulos.
export const PAPERS_SECTION = {
  path: '/papers',
  sectionId: 'papers',
  code: 'Lector de papers',
  navLabel: 'Lector de papers',
}
