# Fase 3 — Módulos 0 y 1 completos (primer contenido real + G1, G2)
### Instrucciones para el agente de construcción (Claude Code)

**Objetivo:** la fase donde el patrón completo cobra vida por primera vez. Construir el **contenido didáctico real** de los Módulos 0 y 1, con ζ(s) real implementada en JavaScript, las gráficas interactivas G1 y G2, y ejercicios con comprobador numérico funcionando. Valida end-to-end: acordeón paso a paso (M1+M2) + gráfica interactiva (M3) + ejercicio con feedback, todo junto en pantalla real.

**Contexto obligatorio:** lee `riemann-roadmap.md` (mandatos M1–M9; §3 contenido de módulos; §7 UX). Usa los componentes de Fase 1 (Accordion, Equation, ThreeLayers, Exercise, ModuleLayout) y los datos de Fase 2 (`zeros.ts`, valores especiales). Reemplaza los placeholders de los Módulos 0 y 1 por contenido real.

---

## Parte A — Implementar ζ y utilidades matemáticas en JS

### `src/lib/zeta.ts`
- `zetaReal(s: number, terms?: number): number` — suma directa Σ 1/nˢ para s>1.
- **LÍMITE CONOCIDO (documentar en el código):** la suma directa converge bien para s≳2 pero MAL cerca de s=1. Referencia verificada: s=2,N=10000→err 1e-4; s=1.5,N=10000→err 2e-2 (todavía 2%). Por tanto: para el Módulo 1, acotar el slider de s a un rango donde la suma sea fiable (p. ej. s∈[1.2, 8]) y/o usar más términos cerca de 1, dejando claro en la UI que es una aproximación por suma parcial. NO prometer precisión que la suma directa no da. (La continuación analítica para s≤1 y el plano complejo llegan en Fase 4+.)
- `eulerProductPartial(s: number, primeLimit: number): number` — Π 1/(1−p⁻ˢ) truncado, para el ejercicio de M1.

### `src/lib/primes.ts`
- `primePi(x: number): number` — contar primos ≤ x (criba para x moderado).
- `primesUpTo(x: number): number[]`.
- `liApprox(x: number): number` — integral logarítmica Li(x) (integración numérica).
- `xOverLnx(x: number): number`.

### Ground truth verificado (para tests y comprobadores)
| Cantidad | Valor |
|----------|-------|
| π(10),π(100),π(1000),π(10⁴) | 4, 25, 168, 1229 |
| x/ln x en 100, 1000 | 21.71, 144.76 |
| Li(x) en 100, 1000 | 30.13, 177.61 |
| ζ(2) suma directa N=10⁴ | 1.6448340… (err 1e-4 vs π²/6) |
| Euler trunc. p≤29 para s=2 | 1.6330705 (converge a 1.6449341) |

---

## Parte B — Módulo 0 (Primos y el porqué) con contenido real

Seguir §3 del road map y M1 (paso a paso). Estructura con las tres capas:
- **Intuición:** primos parecen aleatorios pero su densidad es regular. ¿Cuántos primos hasta x?
- **Formal (acordeones con derivación paso a paso):**
  - Definición de π(x).
  - Densidad ≈ 1/ln(x) → de ahí x/ln(x) y Li(x) = ∫₂ˣ dt/ln t. **Mostrar la derivación completa** (densidad × ancho → integral), sin saltos (M1).
  - Enunciado del PNT: π(x) ~ x/ln x, con la aclaración precisa de que el *cociente*→1 pero la *diferencia* crece (la sutileza clave).
- **Avanzado (plegado):** el puente a la HR — el tamaño del error Li(x)−π(x) está controlado por los ceros de ζ. (Sin demostrar aún; se desarrolla en M4.)
- **G1 (gráfica interactiva):** π(x) vs x/ln x vs Li(x), con slider de x. Las tres curvas; al mover x se ve cómo se separan. Render Plotly (reusar LinePlot de Fase 0/1).
- **Ejercicios:**
  - Cálculo a mano: π(30) contando primos; comparar con 30/ln(30). Comprobador numérico.
  - Conceptual: por qué cociente→1 y diferencia→∞ no se contradicen.
  - Numérico: predecir primos en [10⁶,10⁶+1000] con densidad 1/ln(10⁶); comparar con conteo real.

## Parte C — Módulo 1 (Zeta de Euler real) con contenido real

- **Intuición:** sumar 1+1/2ˢ+1/3ˢ+… y por qué converge para s>1.
- **Formal (acordeones paso a paso):**
  - ζ(s)=Σ1/nˢ, convergencia para s>1.
  - **Producto de Euler** ζ(s)=Π 1/(1−p⁻ˢ): la derivación COMPLETA en acordeón (serie geométrica de cada factor → multiplicar sobre primos → Teorema Fundamental de la Aritmética da unicidad → reagrupa en Σ1/nˢ). Este es el caso modelo del proyecto (M1+M2).
  - Valores especiales: ζ(2)=π²/6 (mostrar, citar que la prueba es el "problema de Basilea", opcionalmente en capa avanzada).
- **G2 (gráfica interactiva):** ζ(s) para s real, con slider de s en [1.2, 8] (rango donde la suma es fiable — ver límite en zeta.ts). Marcar ζ(2)=π²/6 como punto especial. Al mover s, la curva y el valor se actualizan en vivo (M3).
- **Ejercicios:**
  - Verificar producto de Euler truncado: el usuario elige cuántos primos; la app calcula el producto parcial y lo compara con ζ(2). Comprobador.
  - Calcular ζ(2) parcial con N términos y ver el error vs π²/6.

---

## Tests de la fase (M9 — obligatorio)
Vitest. La fase NO cierra hasta 100%.
- **zeta.ts:** `zetaReal(2, 10000)` ≈ 1.64483 (tol 1e-3); `zetaReal(4,10000)`≈π⁴/90 (tol 1e-3). `eulerProductPartial(2, 29)` ≈ 1.63307 (tol 1e-5).
- **primes.ts:** `primePi(10/100/1000/10⁴)` = 4/25/168/1229 exacto. `liApprox(1000)`≈177.6 (tol 0.5). `xOverLnx(1000)`≈144.76 (tol 0.1).
- **Componentes:** Módulo 0 y 1 renderizan sus tres capas; el acordeón del producto de Euler abre y muestra la derivación; G1 y G2 montan y responden al slider (el dato cambia); el comprobador de un ejercicio marca correcto/error según la respuesta.
- **Integración:** un ejercicio con respuesta correcta pasa a estado verde; con respuesta incorrecta, a rojo con la pista disponible.

---

## Criterios de aceptación de la Fase 3
- [ ] `zeta.ts` y `primes.ts` implementados, con el límite de convergencia documentado.
- [ ] Módulo 0 con contenido real: 3 capas, derivación de Li(x) paso a paso, G1 interactiva, 3 ejercicios con comprobador.
- [ ] Módulo 1 con contenido real: 3 capas, **producto de Euler derivado paso a paso en acordeón**, G2 interactiva, 2 ejercicios.
- [ ] G1 y G2 responden a sus sliders en vivo (M3); ecuaciones en KaTeX (M5).
- [ ] Ejercicios dan feedback inmediato correcto/error (UX §7).
- [ ] Honestidad (M6): el puente a la HR se presenta sin afirmar que está demostrada.
- [ ] `npm run test` 100%; `npm run build` y `npm run lint` limpios.

## Lo que NO se hace en Fase 3
- No continuación analítica ni ζ para s≤1 (Fase 4+).
- No plano complejo ni domain coloring (Fase 4).
- No Módulos 2–5.
- El slider de G2 se queda en s>1 real; nada de parte imaginaria todavía.
