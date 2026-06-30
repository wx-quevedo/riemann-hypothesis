// Utilidades de primos y aproximaciones al conteo de primos (Módulo 0, gráfica G1).
// Cálculo en cliente (float64), criba de Eratóstenes para x moderado.

/** Devuelve todos los primos ≤ x (criba de Eratóstenes). */
export function primesUpTo(x: number): number[] {
  const n = Math.floor(x)
  if (n < 2) return []
  // composite[i] = 1 si i es compuesto; 0 si (aún) primo.
  const composite = new Uint8Array(n + 1)
  const primes: number[] = []
  for (let i = 2; i <= n; i++) {
    if (composite[i] === 0) {
      primes.push(i)
      for (let j = i * i; j <= n; j += i) composite[j] = 1
    }
  }
  return primes
}

/** π(x): cantidad de primos ≤ x. Criba contando, sin construir el array. */
export function primePi(x: number): number {
  const n = Math.floor(x)
  if (n < 2) return 0
  const composite = new Uint8Array(n + 1)
  let count = 0
  for (let i = 2; i <= n; i++) {
    if (composite[i] === 0) {
      count++
      for (let j = i * i; j <= n; j += i) composite[j] = 1
    }
  }
  return count
}

/** Aproximación elemental al conteo de primos: x / ln x. */
export function xOverLnx(x: number): number {
  return x / Math.log(x)
}

// Integración de Simpson compuesta (n par de subintervalos). Para integrandos suaves.
function simpson(f: (t: number) => number, a: number, b: number, n: number): number {
  if (b <= a) return 0
  const m = n % 2 === 0 ? n : n + 1
  const h = (b - a) / m
  let s = f(a) + f(b)
  for (let i = 1; i < m; i++) {
    s += (i % 2 === 0 ? 2 : 4) * f(a + i * h)
  }
  return (h / 3) * s
}

// li(2) = valor principal de ∫_0^2 dt/ln t. Constante conocida; evita la singularidad en t=1.
const LI2 = 1.0451637801174927

/**
 * li(x): la integral logarítmica = valor principal ∫_0^x dt/ln t.
 *
 * Es la aproximación clásica del PNT a π(x) (la famosa SOBREestimación). Se calcula como
 *   li(x) = li(2) + ∫_2^x dt/ln t
 * integrando desde 2 (zona suave, sin la singularidad de t=1) y sumando la constante li(2).
 *
 * OJO con la notación: el "offset logarithmic integral" Li(x) = ∫_2^x dt/ln t difiere de li(x)
 * en exactamente li(2) ≈ 1.045. Aquí usamos li(x) (desde 0), que es la que da los valores
 * clásicos: li(100) ≈ 30.13, li(1000) ≈ 177.61.
 */
export function liApprox(x: number): number {
  if (x <= 2) return LI2
  return LI2 + simpson((t) => 1 / Math.log(t), 2, x, 2000)
}
