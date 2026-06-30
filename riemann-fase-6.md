# Fase 6 — Módulo 4: la fórmula explícita y su animación (G6)
### Instrucciones para el agente de construcción (Claude Code)

**Objetivo:** la joya del proyecto. El Módulo 4 muestra cómo los ceros de ζ **reconstruyen la distribución de los primos**: la fórmula explícita de Riemann/von Mangoldt expresa ψ(x) (o π(x)) como un término principal MENOS una suma de ondas, una por cada cero no trivial. G6 es la animación estrella: partir del término suave e ir sumando ondas (un cero a la vez) hasta que emerge la escalera de los primos. Cierra el círculo abierto en el Módulo 0.

**Contexto obligatorio:** lee `riemann-roadmap.md` (mandatos; §3 M4; decisión Li(x) "mostrar ambas"; nota de Fase 4 sobre patrón WebGL/canvas para G6). Usa `zeros.json`, `primes.ts`, los componentes existentes.

---

## Decisión clave: usar ψ(x) de Chebyshev como función estrella

Se anima **ψ(x)** (función de Chebyshev), NO π(x) directamente. Razones:
- La fórmula explícita de ψ es la más limpia: **término principal = x** (una recta), fácil de ver.
- La de π(x) requiere sumar Li(x^ρ) (más enredada, peor para animar).
- ψ(x) = Σ_{p^k ≤ x} log p (suma log p sobre primos y sus potencias). Es una escalera que salta log p en cada potencia de primo.
- Se conecta con π(x) en una capa aparte (relación vía sumatoria de Möbius / log), como contenido avanzado.

**Fórmula explícita (verificada):**
ψ(x) = x − Σ_ρ x^ρ/ρ − log(2π) − ½·log(1 − x^−2)

Con los ceros en pares conjugados ρ = ½ ± iγ, cada par produce una **onda real**:
  x^ρ/ρ + x^ρ̄/ρ̄ = 2·√x·[½·cos(γ ln x) + γ·sin(γ ln x)] / |ρ|²,  con |ρ|² = ¼ + γ²

Así: **ψ(x) ≈ x − log(2π) − ½log(1−x^−2) − Σ_k [onda del cero k]**, y cada onda oscila con frecuencia γ_k y amplitud ~√x/|ρ_k|. Sumar más ceros = aproximar mejor la escalera.

**Convergencia verificada** (x=10, ψ real=7.832): 1 cero→7.76, 10 ceros→7.79, 100 ceros→7.83. Cada cero afina.

---

## Parte A — `src/lib/explicitFormula.ts`
- `psiChebyshev(x)`: ψ(x) exacta sumando log p sobre primos y potencias ≤ x (la "escalera" objetivo).
- `psiExplicit(x, numZeros)`: la fórmula explícita con `numZeros` ondas (término principal − Σ ondas). Usa los γ de `zeros.json`.
- `waveOfZero(x, k)`: la onda individual del cero k (para dibujar ondas sueltas si se quiere).
- Ground truth para tests (ψ real): ψ(10)=7.832, ψ(20)=19.266, ψ(30)=28.476. `psiExplicit(10, 100)`≈7.83 (tol 0.05).

## Parte B — Módulo 4: contenido (3 capas, M1)
- **Intuición:** recordar el Módulo 0 (π(x) y el error Li−π). Aquí se revela el mecanismo: los ceros de ζ son las "frecuencias" ocultas en la distribución de primos. Cada cero = una onda. La escalera de primos es la suma de todas las ondas sobre una tendencia suave.
- **Formal (acordeones paso a paso):**
  - Definición de ψ(x) (función de Chebyshev) y por qué es la escalera natural.
  - La **fórmula explícita** ψ(x) = x − Σ_ρ x^ρ/ρ − log(2π) − ½log(1−x^−2). Explicar cada término: x (tendencia), la suma sobre ceros (las correcciones oscilantes), las constantes.
  - **Derivación de la onda real** a partir del par conjugado ρ, ρ̄ (paso a paso: x^ρ/ρ + conjugado → 2√x·[...]/|ρ|²). Esta es la pieza clave que conecta "cero complejo" con "onda real visible".
  - El papel de la **línea crítica**: como Re(ρ)=½, la amplitud de cada onda es ~√x. Si un cero estuviera fuera de la línea (Re(ρ)>½), su onda crecería más rápido (~x^Re(ρ)) y la distribución de primos sería más irregular. **AQUÍ se ve por qué la HR importa** (M6: sin afirmar que está probada — "si la HR es cierta, el error es el mínimo posible").
- **Avanzado (plegado):** conexión ψ→π (Li(x^ρ)), y la fórmula explícita para π(x) directamente.

## Parte C — G6: la animación (canvas, patrón WebGL de Fase 4)

**La gráfica estrella.** Una animación interactiva:
- Eje x: valores de x (p. ej. 2 a 30). Eje y: ψ(x).
- Dibuja en capas:
  1. La **escalera real** ψ(x) de Chebyshev (objetivo, en color tenue de fondo).
  2. El **término principal** x − log(2π) − ½log(1−x^−2) (la tendencia suave).
  3. La **aproximación** ψExplicit(x, N) con N ceros, que se actualiza al cambiar N.
- **Control central (M3): slider de "número de ceros N"** (0 a, digamos, 200). Al subir N, la curva de aproximación gana ondas y se ciñe cada vez más a la escalera. ESTE es el momento "ajá".
- **Botón play**: anima N de 0 hacia arriba automáticamente, viendo emerger los escalones uno a uno.
- Opcional: mostrar la onda del cero N-ésimo recién añadida resaltada, para ver "qué aporta cada cero".
- **Patrón de Fase 4 (canvas/WebGL):** NO inicializar el render sin canvas dimensionado; loguear fallos. (Evitar el bug de timing ya resuelto en G3.) Si se hace en Canvas2D en vez de WebGL (suficiente para curvas de línea), igual respetar el patrón de esperar dimensiones.

### Ejercicios Módulo 4
- Numérico: con N ceros, ¿cuál es el error |ψExplicit(x,N) − ψ(x)| en x=20? Comparar para N=1,10,100 (comprobador).
- Conceptual: ¿por qué la amplitud de cada onda es ~√x y qué pasaría si un cero tuviera Re(ρ)=0.7? (conecta con la importancia de la HR).
- Exploración: en G6, subir N y observar a partir de cuántos ceros se distingue el primer escalón.

---

## Tests de la fase (M9 — obligatorio)
Vitest. NO cierra hasta 100%.
- **explicitFormula.ts:** `psiChebyshev(10/20/30)` = 7.832/19.266/28.476 (tol 1e-2). `psiExplicit(10, 100)`≈7.83 (tol 0.05). Convergencia: el error con 100 ceros < error con 1 cero (en varios x).
- **Onda conjugada:** `waveOfZero` produce valores reales; la suma de ondas reproduce −Σ x^ρ/ρ dentro de tolerancia.
- **Componente G6:** monta (con el patrón de canvas dimensionado de Fase 4), el slider de N actualiza la curva (el dato cambia), play incrementa N. Lógica pura (muestreo, escalado a pantalla) testeable aparte como en G3.
- **Módulo 4:** 3 capas renderizan; el acordeón de la fórmula explícita abre; la nota M6 sobre la importancia de la HR aparece sin afirmar que está probada.

---

## Criterios de aceptación de la Fase 6
- [ ] `explicitFormula.ts`: ψ exacta, ψ explícita con N ceros, onda individual. Tests verdes contra ground truth.
- [ ] Módulo 4 completo: 3 capas, fórmula explícita y derivación de la onda real PASO A PASO, conexión con la importancia de la HR (M6).
- [ ] G6 animación: slider de N + play; al sumar ceros, la aproximación converge a la escalera ψ. Interactiva (M3).
- [ ] G6 respeta el patrón de inicialización de canvas de Fase 4 (no bug de timing).
- [ ] Ejercicios con comprobador; ecuaciones KaTeX; derivaciones paso a paso.
- [ ] `npm run test` 100%; `npm run build` y `npm run lint` limpios.
- [ ] (Validación visual diferida al recorrido del usuario: ver emerger la escalera al subir N.)

## Lo que NO se hace en Fase 6
- No el Módulo 5 (estado del arte) ni el lector de papers (Fase 7).
- No G7 (estadística GUE).
- π(x) directa solo en capa avanzada; la estrella es ψ(x).

## Nota de profundización
La fórmula explícita es de Riemann (1859), rigorizada por von Mangoldt (1895). Para x grande la suma sobre ceros converge despacio y condicionalmente; para la animación (x≤30, N≤200) es estable. Referencia: Edwards cap. 1–3; Apostol cap. 13.
