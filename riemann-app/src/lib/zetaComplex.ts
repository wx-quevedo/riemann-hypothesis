// ζ(s) para s COMPLEJO en JavaScript (float64), vía la función eta de Dirichlet.
// Es lo que alimenta el domain coloring (G3, Fase 4) y cubre la franja crítica, donde la
// serie directa Σ 1/n^s de la Fase 3 ya no converge.

/** Número complejo. */
export interface Complex {
  re: number
  im: number
}

export const cx = (re: number, im = 0): Complex => ({ re, im })

export const cAdd = (a: Complex, b: Complex): Complex => ({ re: a.re + b.re, im: a.im + b.im })
export const cSub = (a: Complex, b: Complex): Complex => ({ re: a.re - b.re, im: a.im - b.im })
export const cMul = (a: Complex, b: Complex): Complex => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
})
export const cDiv = (a: Complex, b: Complex): Complex => {
  const d = b.re * b.re + b.im * b.im
  return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d }
}
/** Escala por un real. */
export const cScale = (a: Complex, k: number): Complex => ({ re: a.re * k, im: a.im * k })
/** Exponencial compleja: exp(re)·(cos im + i sin im). */
export const cExp = (z: Complex): Complex => {
  const e = Math.exp(z.re)
  return { re: e * Math.cos(z.im), im: e * Math.sin(z.im) }
}
export const cAbs = (z: Complex): number => Math.hypot(z.re, z.im)
/** Argumento (fase) en (−π, π]. */
export const cArg = (z: Complex): number => Math.atan2(z.im, z.re)

/**
 * Potencia compleja de base real positiva: n^s = exp(s · ln n), con s complejo y n > 0.
 * (Es la pieza que aparece en la serie: 1/n^s = n^{−s} = exp(−s · ln n).)
 */
export const nPowS = (n: number, s: Complex): Complex => cExp(cScale(s, Math.log(n)))

/** Seno complejo: sin(a+bi) = sin a · cosh b + i cos a · sinh b. */
export const cSin = (z: Complex): Complex => ({
  re: Math.sin(z.re) * Math.cosh(z.im),
  im: Math.cos(z.re) * Math.sinh(z.im),
})
/** Logaritmo principal complejo: ln|z| + i·arg(z). */
export const cLog = (z: Complex): Complex => ({ re: Math.log(cAbs(z)), im: Math.atan2(z.im, z.re) })
/** Potencia compleja general: base^exp = exp(exp · ln base). */
export const cPow = (base: Complex, exp: Complex): Complex => cExp(cMul(exp, cLog(base)))

/**
 * Función eta de Dirichlet (suma alternada): η(s) = Σ_{n=1}^{terms} (−1)^{n−1} / n^s.
 *
 * Converge para Re(s) > 0 (a diferencia de la serie directa de ζ), así que CUBRE la franja
 * crítica 0 < Re(s) < 1. La sumamos en orden directo; basta para los primeros ceros.
 */
export function etaDirichlet(s: Complex, terms: number): Complex {
  let re = 0
  let im = 0
  const { re: sigma, im: t } = s
  for (let n = 1; n <= terms; n++) {
    const lnn = Math.log(n)
    const mag = Math.exp(-sigma * lnn) // |n^{−s}| = n^{−σ}
    const ang = -t * lnn // arg(n^{−s}) = −t·ln n
    const sign = (n & 1) === 1 ? 1 : -1 // (−1)^{n−1}
    re += sign * mag * Math.cos(ang)
    im += sign * mag * Math.sin(ang)
  }
  return { re, im }
}

/**
 * ζ(s) para s complejo, vía la relación ζ(s) = η(s) / (1 − 2^{1−s}).
 *
 * ── LÍMITE DE CONVERGENCIA verificado (M9 usa tolerancias realistas por esto) ───────────────
 * η converge MUY LENTO sobre la línea crítica. En el primer cero (0.5 + 14.1347 i):
 *     terms=50   → |ζ| ≈ 0.030
 *     terms=1000 → |ζ| ≈ 0.0067
 *     terms=5000 → |ζ| ≈ 0.0030
 * Implicaciones (división de trabajo del stack híbrido, road map §6):
 *   · Para el SHADER visual basta con pocos términos (~100–300): los ceros se ven como
 *     vórtices y el ojo no nota la diferencia. La velocidad manda.
 *   · Para las POSICIONES EXACTAS de los ceros NO se confía en esta suma: se usan los t de
 *     `zeros.json` (Fase 2, 30 dígitos). El shader pinta el campo; los datos marcan los puntos.
 * No se exige precisión alta sobre la línea crítica (los tests piden, p. ej., |ζ|<0.05 en el
 * primer cero, no <1e-8). Para t muy grande lo correcto sería Riemann–Siegel (mejora futura).
 */
export function zetaComplex(s: Complex, terms = 10000): Complex {
  const eta = etaDirichlet(s, terms)
  const ln2 = Math.LN2
  // 2^{1−s} = exp((1 − s) · ln 2);  (1 − s)·ln2 = ((1 − σ)ln2, −t·ln2)
  const k = cExp({ re: (1 - s.re) * ln2, im: -s.im * ln2 })
  const denom: Complex = { re: 1 - k.re, im: -k.im }
  if (Math.hypot(denom.re, denom.im) < 1e-12) {
    // Polo simple en s = 1.
    return { re: Infinity, im: Infinity }
  }
  return cDiv(eta, denom)
}

// --- Función Gamma compleja (Lanczos), ecuación funcional y ζ en todo el plano ---------------

const LANCZOS_G = 7
const LANCZOS_C = [
  0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
  -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6,
  1.5056327351493116e-7,
]

/**
 * Función Gamma compleja Γ(z) por la aproximación de Lanczos (g=7). Para Re(z) < 0.5 usa la
 * fórmula de reflexión Γ(z)Γ(1−z) = π / sin(πz). Verificada: Γ(3)=2, |Γ(½+5i)|≈9.73e−4.
 */
export function gammaComplex(z: Complex): Complex {
  if (z.re < 0.5) {
    // Γ(z) = π / (sin(πz) · Γ(1−z))
    return cDiv(cx(Math.PI, 0), cMul(cSin(cScale(z, Math.PI)), gammaComplex(cSub(cx(1), z))))
  }
  const zz = cSub(z, cx(1))
  let x = cx(LANCZOS_C[0])
  for (let i = 1; i < LANCZOS_G + 2; i++) {
    x = cAdd(x, cDiv(cx(LANCZOS_C[i]), cAdd(zz, cx(i))))
  }
  const t = cAdd(zz, cx(LANCZOS_G + 0.5))
  // √(2π) · t^{z+½} · e^{−t} · x
  const tPow = cPow(t, cAdd(zz, cx(0.5)))
  return cMul(cScale(cMul(tPow, cExp(cScale(t, -1))), Math.sqrt(2 * Math.PI)), x)
}

/**
 * Factor de la ECUACIÓN FUNCIONAL χ(s), tal que ζ(s) = χ(s)·ζ(1−s):
 *     χ(s) = 2^s · π^{s−1} · sin(πs/2) · Γ(1−s).
 */
export function chi(s: Complex): Complex {
  const a = cPow(cx(2), s)
  const b = cPow(cx(Math.PI), cSub(s, cx(1)))
  const c = cSin(cScale(s, Math.PI / 2))
  const d = gammaComplex(cSub(cx(1), s))
  return cMul(cMul(a, b), cMul(c, d))
}

/**
 * ζ(s) en TODO el plano complejo (salvo el polo s=1). Para Re(s) ≥ ½ usa η de Dirichlet
 * directamente; para Re(s) < ½ refleja con la ecuación funcional ζ(s)=χ(s)·ζ(1−s) (donde
 * 1−s tiene Re > ½ y η converge). Esto permite, p. ej., los ceros triviales: ζ(−2)=ζ(−4)=0
 * (porque sin(πs/2)=0 en χ para s par negativo). η directo NO sirve ahí (la serie diverge).
 */
export function zetaComplexFull(s: Complex, terms = 10000): Complex {
  if (s.re >= 0.5) return zetaComplex(s, terms)
  return cMul(chi(s), zetaComplexFull(cSub(cx(1), s), terms))
}

/**
 * Theta de Riemann–Siegel θ(t) (forma asintótica). Buena para los primeros ceros; para t muy
 * grande habría que añadir más términos o usar Riemann–Siegel completo (mejora futura, igual
 * que el límite de η documentado arriba).
 */
export function hardyTheta(t: number): number {
  return (t / 2) * Math.log(t / (2 * Math.PI)) - t / 2 - Math.PI / 8 + 1 / (48 * t) + 7 / (5760 * t * t * t)
}

/**
 * Función Z de Hardy: Z(t) = e^{iθ(t)} · ζ(½+it), que es REAL. Sus CRUCES POR CERO son los
 * ceros de ζ en la línea crítica (cambia de signo en cada uno) → más fácil de "ver" que |ζ|.
 * Se calcula como Z = cos θ · Re ζ − sin θ · Im ζ con ζ = ζ(½+it) vía η. Verificada contra la
 * tabla (Z(5)≈−0.739, Z(18)≈+2.337, Z(23)≈−1.455).
 */
export function hardyZ(t: number, terms = 20000): number {
  const z = zetaComplex(cx(0.5, t), terms)
  const th = hardyTheta(t)
  return Math.cos(th) * z.re - Math.sin(th) * z.im
}

/** |ζ(½+it)| sobre la línea crítica (G4). Los ceros son los puntos donde toca 0. */
export function absZetaOnCriticalLine(t: number, terms = 20000): number {
  return cAbs(zetaComplex(cx(0.5, t), terms))
}
