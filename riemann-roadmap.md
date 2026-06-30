# Proyecto Riemann — Documento Técnico Maestro (Road Map)
### App didáctica interactiva para aprender la Hipótesis de Riemann

**Estado:** documento guía. Es la fuente de verdad del proyecto. Todo cambio de rumbo se edita aquí primero.
**Uso:** personal (un solo usuario). **Plataforma:** escritorio primero.
**Última actualización:** sesión de diseño inicial.

---

## Índice
1. Visión y principios
2. Mandatos del proyecto (reglas no negociables)
3. Estructura de módulos (contenido)
4. Especificación de gráficas
5. Modelo de ejercicios
6. Stack técnico
7. UX/UI — diseño para aprendizaje
8. Arquitectura de carpetas
9. Skills del agente
10. Plan de fases
11. Riesgos y decisiones abiertas

---

## 1. Visión y principios

App modular que lleva al estudiante desde "¿por qué importan los primos?" hasta el estado del arte de la Hipótesis de Riemann (HR), combinando **explicación en tres capas**, **ejercicios resolubles paso a paso** y **gráficas interactivas**. Incluye además acompañamiento para **leer papers académicos** sobre la HR.

**Principio rector — las tres capas.** Cada concepto se presenta en tres niveles plegables:
1. **Intuición** — palabras llanas + una imagen. Accesible.
2. **Formal** — la ecuación con su justificación. Nivel universitario.
3. **Avanzado (opcional)** — demostración o detalle técnico, oculto por defecto.

Esto materializa el nivel "mixto/progresivo": un mismo módulo sirve al curioso y al matemático.

**Perfil del estudiante.** Ingeniero con cálculo, análisis numérico, análisis complejo y análisis matemático I–IV (algo oxidado). → No diluir la matemática; mostrar todo paso intermedio; repasar lo oxidado solo cuando haga falta.

---

## 2. Mandatos del proyecto (reglas no negociables)

Estas reglas gobiernan toda construcción. Están codificadas en el skill `riemann-didactic-design`.

**M1 — Paso a paso, sin saltos ("llevar de la mano").** Toda deducción y todo ejercicio muestra cada paso aritmético y algebraico explícito, sin omitir ninguno, hasta el resultado o la demostración. Nunca "es fácil ver que…". Cada línea justifica la regla/identidad aplicada. Cuando algo se evalúa en un punto (p. ej. "en los ceros no triviales"), se calcula **con números reales** y se muestra el valor.

**M2 — Patrón acordeón.** Cada ecuación/principio = titular plegable con la ecuación en **KaTeX** + flechita ▸; al desplegar, la derivación completa (M1); al plegar, el lector sigue sin saturación.

**M3 — Toda gráfica es interactiva.** Cero gráficas decorativas. Cada visual lleva controles sobre los parámetros de su ecuación (sliders σ/t, arrastre en el plano complejo, zoom, play/pausa) y responde en vivo. Justificación: la HR vive en el plano complejo (2D→2D); solo se entiende moviendo y observando.

**M4 — Una gráfica por concepto.** No solo las 7 gráficas grandes; cada principio lleva su micro-visual.

**M5 — Ecuaciones reales.** Todo en KaTeX (LaTeX real), nunca tipografía monoespaciada de aproximación.

**M6 — Honestidad intelectual.** La HR NO está demostrada; nunca presentarla como hecho. Enseñar que "verificar billones de ceros no es prueba". Los preprints recientes que se autodenominan "proof of RH" se tratan como intentos NO validados; nunca como resueltos.

**M7 — Escritorio primero.** Diseñar para navegadores de escritorio con layouts horizontales (viewport ref ≥1280px). Patrón de dos columnas (concepto/derivación | gráfica). Móvil se difiere hasta pulir escritorio; no comprometer escritorio por anticipar móvil.

**M8 — Autocontenido.** Las referencias a libros (Apostol, Titchmarsh, Edwards) son profundización OPCIONAL; todo lo necesario está en la app.

**M9 — Tests en cada fase (obligatorio).** Cada fase incluye su suite de tests y NO se declara terminada hasta que **todos pasan (100%)**. Test runner: **Vitest** (+ React Testing Library para componentes). Para las piezas matemáticas, tests numéricos que validen contra valores conocidos (p. ej. ζ(2)=π²/6, primer cero no trivial en t≈14.134725, ζ(0)=−1/2). El agente reporta el resultado de los tests al cerrar cada fase; si algo falla, se corrige antes de avanzar. Los criterios de aceptación de cada fase incluyen "todos los tests pasan".

---

## 3. Estructura de módulos

### Módulo 0 — Primos y el porqué
- **Intuición:** los primos parecen aleatorios pero esconden orden. ¿Cuántos primos hay hasta x?
- **Conceptos:** π(x); estimaciones de Gauss/Legendre; Teorema de los Números Primos (PNT) π(x) ~ x/ln x; integral logarítmica Li(x).
- **Gráfica (G1):** π(x) vs x/ln x vs Li(x), slider de x.
- **Ejercicios:** contar primos a mano; comparar π(x) con aproximaciones; densidad en un intervalo.

### Módulo 1 — La función zeta de Euler (variable real)
- **Intuición:** sumar 1 + 1/2ˢ + 1/3ˢ + … y por qué converge.
- **Formal:** ζ(s) = Σ 1/nˢ para s > 1.
- **La joya — Producto de Euler:** ζ(s) = Π_p 1/(1 − p⁻ˢ). Conexión zeta ↔ primos *sin complejos todavía*. (Derivación: serie geométrica → producto sobre primos → factorización única.)
- **Gráfica (G2):** ζ(s) real > 1; valores especiales (ζ(2)=π²/6).
- **Ejercicios:** verificar producto de Euler truncado; ζ(2) parcial.

### Módulo 2 — Plano complejo y continuación analítica
- **Intuición:** la serie se rompe para Re(s) ≤ 1, pero ζ se extiende de forma única a casi todo ℂ.
- **Formal:** continuación analítica; polo simple en s = 1; ζ(0) = −1/2; función eta de Dirichlet como vía de cálculo.
- **Gráfica clave (G3) — DOMAIN COLORING** de ζ(s) en ℂ (WebGL).
- **Ejercicios:** identificar dónde "gira" el color (ceros).

### Módulo 3 — Ceros triviales y no triviales
- **Intuición:** zonas donde ζ = 0; unas triviales, otras profundas.
- **Formal:** ecuación funcional ζ(s) = 2ˢ π^(s−1) sin(πs/2) Γ(1−s) ζ(1−s); ceros triviales en −2,−4,−6,…; franja crítica 0<Re(s)<1; línea crítica Re(s)=1/2.
- **Enunciado HR:** todos los ceros no triviales tienen parte real 1/2.
- **Gráficas (G4, G5):** |ζ(1/2+it)|; función Z de Hardy (cruces por cero = ceros).
- **Ejercicios:** localizar primeros ceros (t ≈ 14.13, 21.02, 25.01…); usar Z(t) para cruces.

### Módulo 4 — Ceros y primos: la fórmula explícita
- **Intuición:** cada cero produce una "onda"; sumándolas se reconstruye la escalera de primos. El módulo más bello.
- **Formal:** fórmula explícita de Riemann/von Mangoldt; ψ(x) como suma sobre ceros.
- **Gráfica estrella (G6) — ANIMACIÓN:** sumar ondas (un cero a la vez) y ver emerger los saltos.
- **Ejercicios:** sumar N ondas y medir error vs π(x) real.

### Módulo 5 — Estado del arte (verificado a 2026)
- **Verificación:** rigurosa hasta altura ~3×10¹² (Platt, 2021); primeros 10¹³ ceros (Gourdon–Demichel, 2004). Todos sobre la línea crítica hasta hoy.
- **Lección crítica:** evidencia numérica ≠ prueba. La HR sigue abierta (Millennium Prize, US$1M).
- **Conexiones:** hipótesis GUE / matrices aleatorias (Montgomery–Dyson).
- **Frontera:** región libre de ceros (Mossinghoff–Trudgian–Yang, 2022); GRH y Langlands; intentos de prueba asistida por IA — sin validar.
- **Lectura de papers:** desmontar un paper real y explicar qué hace y por qué.

---

## 4. Especificación de gráficas

| # | Gráfica | Módulo | Qué muestra | Controles | Cómputo | Render |
|---|---------|--------|-------------|-----------|---------|--------|
| G1 | π(x) vs aproximaciones | 0 | distribución de primos | slider x | Bajo | Plotly |
| G2 | ζ(s) real | 1 | convergencia, valores especiales | slider s | Bajo | Plotly |
| G3 | **Domain coloring de ζ** | 2 | ceros como vórtices de color | zoom, pan, arrastre | **Alto** | **WebGL** |
| G4 | \|ζ(1/2+it)\| | 3 | ceros = puntos que tocan 0 | rango t, zoom | Medio | Plotly |
| G5 | **Función Z de Hardy** | 3 | cruces por cero = ceros | rango t | Medio | Plotly |
| G6 | **Animación fórmula explícita** | 4 | ondas → escalera de primos | play/pausa, N ceros | **Alto** | Canvas/Plotly |
| G7 | Espaciado de ceros (GUE) | 5 | histograma vs ley GUE | nº ceros | Medio (precalc.) | Plotly |

G3 y G6 son las de mayor riesgo técnico → se prototipan primero.

---

## 5. Modelo de ejercicios

Tres tipos por módulo:
- **Cálculo a mano** — con solución paso a paso plegable (M1).
- **Verificación numérica** — el usuario predice, la app calcula y compara.
- **Exploración guiada sobre la gráfica** — localizar un cero, contar cruces, medir error.

Estructura de datos por ejercicio: enunciado, capa (intuición/formal/avanzado), pista, solución paso a paso, comprobador numérico opcional.

---

## 6. Stack técnico

**Arquitectura de cómputo: HÍBRIDA.**
- **Precálculo offline (Python + mpmath, en el tower):** lista de los primeros ~1000 ceros con muchos decimales, tablas de referencia, mallas de fondo → JSON estático. Se corre una vez.
- **Interactivo en vivo (JavaScript en navegador):** ζ vía función eta de Dirichlet, float64. Suficiente para los primeros cientos de ceros. Responde a los controles al instante.
- Resultado: **sitio estático** (los "datos de backend" son JSON pregenerados; no hay servidor corriendo).

| Capa | Herramienta |
|------|-------------|
| Frontend base | React + Vite |
| Estilos | Tailwind CSS v3 (fijado; v4 rompe el flujo init -p / config) |
| Ecuaciones | KaTeX |
| Gráficas de línea | Plotly (o D3) |
| Domain coloring (G3) | Shader WebGL sobre canvas |
| Precálculo de ceros | Python + mpmath (offline) |
| Tests | Vitest + React Testing Library |

---

## 7. UX/UI — diseño para aprendizaje (no comercial)

Modelo de referencia: **Mathspace** (contenido adaptativo, pistas por paso, just-in-time). NO es e-commerce ni app infantil. Descartar: gamificación llamativa, colores cartoon, animaciones decorativas, CTAs de venta.

**Principios:** minimalismo que no distrae (el contenido es protagonista); ayuda just-in-time (acordeones); feedback inmediato y específico en ejercicios; progreso visible pero sobrio (check discreto); carga cognitiva baja (un concepto por pantalla); modo claro y oscuro.

**Paleta:** base neutra (blancos/grises claros u oscuros profundos, nada saturado de fondo); UN acento (azul o teal) para interacción; semánticos con parquedad (verde=correcto, ámbar=pista, rojo=error). Color con significado matemático en gráficas; la línea crítica siempre el mismo color.

**Botones/controles:** esquinas suaves, outline o relleno sutil (no CTA de e-commerce); un primario por vista; sentence case siempre; bordes hairline, sin sombras dramáticas/gradientes/glow; sliders con valor visible; controles agrupados junto a su gráfica.

**Tipografía:** texto en sans legible (Inter/Figtree); matemática en serif de KaTeX; dos pesos; jerarquía por tamaño.

---

## 8. Arquitectura de carpetas (propuesta)

```
riemann-app/
├── .claude/
│   └── skills/
│       ├── riemann-didactic-design/   (skill propio — copiado a mano)
│       └── [skills generados por autoskills]
├── CLAUDE.md                          (generado por autoskills + notas)
├── public/
│   └── data/                          (JSON precalculados: ceros, tablas)
├── scripts/
│   └── precompute_zeros.py            (Python + mpmath; genera public/data/*)
├── src/
│   ├── components/
│   │   ├── Accordion.tsx              (patrón M2)
│   │   ├── Equation.tsx               (wrapper KaTeX)
│   │   ├── Exercise.tsx
│   │   └── graphics/
│   │       ├── DomainColoring.tsx     (G3, WebGL)
│   │       ├── LinePlot.tsx           (G1,G2,G4,G5,G7)
│   │       └── ExplicitFormula.tsx    (G6, animación)
│   ├── lib/
│   │   ├── zeta.ts                    (η de Dirichlet, ζ en JS)
│   │   └── primes.ts
│   ├── modules/
│   │   ├── Module0.tsx … Module5.tsx
│   │   └── PapersReader.tsx
│   └── App.tsx
└── package.json
```

---

## 9. Skills del agente

- **`riemann-didactic-design`** (propio, escrito a mano): codifica los mandatos M1–M8. Se copia a `.claude/skills/`. Es específico del proyecto; autoskills no lo genera.
- **Skills de framework (autoskills):** tras instalar el stack, `npx autoskills` detecta React/Tailwind/etc. e instala skills curados. **Nota (v0.3.6):** autoskills SOLO instala skills; NO genera `CLAUDE.md` (suposición corregida tras Fase 0). El `CLAUDE.md` se escribe a mano con el resumen del proyecto + M1–M9 + puntero al skill propio. Los skills se instalan como **symlinks**: contenido real en `.agents/skills/`, enlazados en `.claude/skills/` (relevante si se mueve el proyecto o se versiona en git).

---

## 10. Plan de fases

- **Fase 0 — Entorno y andamiaje. ✅ COMPLETADA.** Vite+React-TS (React 19, Vite 8, TS 6), stack instalado, autoskills (12 skills) + skill propio (13 total), carpetas §8, hola mundo (KaTeX + Plotly con slider, layout 2 columnas, teal + claro/oscuro), Vitest 6/6 passing, build y lint limpios. Vive en `c:\xampp\htdocs\riemann-hypothesis\riemann-app\`.
- **Fase 1 — Esqueleto navegable. ✅ COMPLETADA.** Shell + nav lateral (6 módulos + lector de papers + Inicio), React Router 7 (createHashRouter, coherente con sitio estático). Componentes núcleo: Accordion (M2), Equation inline/bloque (M5), ThreeLayers, Exercise (estados idle/correcto/error), ModuleLayout (2 columnas), GraphicPlaceholder. ThemeProvider + ProgressProvider (localStorage). 14/14 tests, build y lint limpios. ZetaSeriesDemo/LinePlot conservados fuera del chasis como base de G1/G2.
- **Fase 2 — Precálculo de ceros. ✅ COMPLETADA.** `scripts/precompute_zeros.py` (mpmath 1.3.0, mp.dps=30) genera `public/data/zeros.json` (N=1000, t en float64) + `zeta_special_values.json` (con closed_form LaTeX). Reproducible (SHA256 byte-idéntico). `src/lib/zeros.ts` carga y tipa. Verificación independiente |ζ(½+it)|<1e-8; primeros 5 ceros con |Δt|~1e-29. Tests: Python 4/4 (runner propio, sin pytest), TS 18/18. Build/lint limpios.
  - *Notas de entorno:* mpmath instalado en `python` (3.10.6), NO en `py` (3.11.9) — usar `python` para script y tests. Compute ~3 min para 1000 ceros (offline, una vez).
  - *A futuro:* `zeros.ts` importa el JSON (bundleado, hoy tree-shaken). Cuando se conecte a las gráficas, revisar si conviene pasar a `fetch` de `public/data/` para no inflar el bundle JS. `zeta_critical_line.json` se generará en Fase 5 (G4/G5).
- **Fase 3 — Módulos 0 y 1 completos. ✅ COMPLETADA.** Contenido real M0 (π(x), densidad, Li(x) paso a paso, PNT) y M1 (ζ real, producto de Euler derivado en acordeón — caso modelo). `zeta.ts` (suma directa, límite cerca de s=1 documentado, slider G2 en [1.2,8]) y `primes.ts`. G1 y G2 interactivas. 37/37 tests, build/lint limpios. Módulos 0/1 como componentes a medida; 2–5 siguen en ModuleView placeholder. `plotly-stub.ts` para jsdom.

  **✓ DECISIÓN RESUELTA — convención de la integral logarítmica: MOSTRAR AMBAS.** El proyecto presenta las dos funciones como contenido didáctico (no esconde la ambigüedad): **li(x)=∫₀ˣ dt/ln t** (desde 0, con valor principal de Cauchy por la singularidad en t=1; li(1000)=177.61 — la ya implementada) y **Li(x)=∫₂ˣ dt/ln t** (offset desde 2; Li(1000)=176.56). Relación exacta verificada: **Li(x) = li(x) − li(2)**, con **li(2) ≈ 1.0451637801**. Punto didáctico: asintóticamente idénticas (ambas valen para el PNT), pero **Li(x) offset es la de la teoría** (aparece en el término principal de la fórmula explícita, M4) y pega ligeramente más cerca de π(x). M0 y M4 usan esta MISMA presentación dual; Li offset es la "estrella" en la narrativa de precisión. Implementación: conservar `liApprox` (desde 0) y añadir `Li(x) = liApprox(x) − liApprox(2)` o constante li(2).
- **Fase 4 — Domain coloring WebGL (G3). ✅ COMPLETADA Y VALIDADA VISUALMENTE.** `zetaComplex.ts` (η de Dirichlet) + `DomainColoring.tsx` (shader GLSL, 200 términos, zoom+pan fluidos, cursor σ+it, línea crítica + ceros de zeros.json marcados y alineados, polo s=1). Validado en navegador real: campo de color se pinta, ceros sobre la línea crítica, zoom/pan SIN tirones (enfoque WebGL confirmado para G6). Bug de timing de init resuelto (ver lección abajo). 59/59 tests (incl. regresión que falla con bug y pasa con fix), build/lint limpios.
  - **➡️ AJUSTE PARA FASE 5 (pedido por el usuario):** cambiar `INITIAL_VIEW` a **isotrópico** — la proporción σ:t debe coincidir con la del canvas para que los ceros se vean como vórtices circulares desde el inicio (no bandas horizontales aplastadas). Hoy σ∈[−2,4]×t∈[−5,35] en canvas casi cuadrado distorsiona. Cambio trivial, va con el contenido del Módulo 2.
  - *Decisión:* tests de G3 por lógica pura (no GL real); `getContext→null` forzado para fallback determinista; sin headless-gl (build nativo problemático en Windows).
  - **🐛 LECCIÓN (bug de timing, resuelto):** el domain coloring caía al fallback en navegadores reales aunque WebGL funcionaba. Causa: `initGL` en un `useEffect []` corría al montar, con el canvas aún 0×0 (el ResizeObserver no había medido todavía); en ANGLE/Windows eso invalida el contexto y, sin reintento, el fallback queda permanente. Fix: la init depende de `size` y espera dimensiones >0; cleanup en efecto aparte; logs de `getShaderInfoLog`/`getProgramInfoLog` para no fallar en silencio; test de regresión con tamaño 0→real. **Aplicar el mismo patrón en G6 (Fase 6, también canvas/WebGL): nunca inicializar GL sin canvas dimensionado, y siempre loguear los fallos de compile/link.**
- **Fase 5 — Módulos 2 y 3 completos. ✅ COMPLETADA · ⚠️ VALIDACIÓN VISUAL PENDIENTE.** M2 (continuación analítica vía η paso a paso, polo s=1, ζ(0)=−½). M3 (ecuación funcional factor a factor, ceros triviales derivados, franja/línea crítica, **enunciado de la HR con honestidad M6**). Math nueva en `zetaComplex.ts`: `gammaComplex` (Lanczos), `chi(s)`, `zetaComplexFull` (reflexión → ceros triviales en Re≤0), `hardyTheta`/`hardyZ`, `absZetaOnCriticalLine`. G4 (|ζ(½+it)|) y G5 (Z de Hardy, cruces=ceros) con envolvente ±|ζ| compartida (`criticalLine.ts`). INITIAL_VIEW isotrópico aplicado. 77/77 tests, build/lint limpios.
  - *Corrección al spec:* el test de la ecuación funcional NO puede usar s=3 (con ζ vía η, ζ(1−3)=ζ(−2) cae fuera de η y Γ(−2) es polo). Solo verificable en Re(s)∈(0,1): usado s=0.5+3i (|diff|=6.8e-4) + invariante χ(s)·χ(1−s)=1. **Para futuros tests de la ec. funcional con η: punto de prueba en la franja 0<Re<1.**
  - *Nota:* `zetaComplexFull` (reflexión) habilita ver ceros triviales en el eje real negativo; el G3 isotrópico ahora muestra ambos tipos de ceros. |ζ(−2)|≈2e-18.
  - **VALIDACIÓN VISUAL DIFERIDA** al recorrido didáctico del usuario (módulo a módulo, como estudiante). La maquinaria está validada (tests/build/lint); la validación conceptual fina (G4 toca cero, G5 cruza el eje, vórtices circulares) la hará el usuario al estudiar cada módulo.
- **Fase 6 — Módulo 4: fórmula explícita + animación G6. ✅ COMPLETADA.** `explicitFormula.ts` (ψ Chebyshev, término principal, `waveOfZero` par conjugado, `psiExplicit(x,N)`). Module4 con derivación de la onda real paso a paso y la conexión "por qué importa la HR" (amplitud ~x^Re(ρ); M6 sin afirmar prueba). G6 `ExplicitFormula.tsx` en Canvas2D: escalera ψ real + término principal + aproximación con N ondas; slider N (0–200) + play (setInterval, testeable); patrón de canvas de Fase 4. 93/93 tests, build/lint limpios. Convergencia verificada (ψExplicit(10,100)≈7.827 vs 7.832).
  - *Decisiones:* Canvas2D (no WebGL — basta para líneas, mejor para animar); setInterval+fake timers (determinista/testeable); G6 a ancho completo (no aside).
  - **💡 MEJORA DIDÁCTICA POSIBLE (anotada):** en x=potencia de primo (p.ej. 25=5²) ψ tiene un salto y la fórmula explícita sufre **fenómeno de Gibbs** (sobreoscila en la discontinuidad, no converge uniformemente). El test de convergencia usa puntos limpios (15,20,30) para evitar falsos fallos. Vale la pena que G6/M4 lo MUESTREN como contenido — es visualmente llamativo y profundo (las ondas siempre sobreoscilan en los saltos).
  - **VALIDACIÓN VISUAL DIFERIDA** al recorrido del usuario: `/#/modulo/4`, subir N → emergen los escalones de ψ.
- **Fase 7 — Módulo 5 (estado del arte) + Lector de papers. ✅ COMPLETADA.** M5: verificación computacional (Platt ~3×10¹², Gourdon–Demichel 10¹³), GUE con historia Montgomery–Dyson–Odlyzko (+ anécdota IAS 1972), enfoques actuales (Hilbert–Pólya, Berry–Keating H=xp, Connes, GRH/Langlands), lección "evidencia ≠ prueba" (Li−π / Littlewood / Skewes >10³¹⁶). `spacingStats.ts` + G7 (`GUESpacingPlot`, histograma con **unfolding** por densidad vs ley Wigner, media normalizada ≈1). Lector de papers: marco (condicional vs incondicional) + Montgomery/Odlyzko y Platt–Trudgian (arXiv:2004.09765) desmontados, sin PDFs/copyright, enlaces a fuentes. 106/106 tests (incl. tests de honestidad M6 ejecutables), build/lint limpios.
  - **⭐ DECISIÓN EJEMPLAR (M6 aplicado al proceso):** el spec de Fase 7 sugería citar "un paper de 2024 con 3000 ceros mpmath 50 díg." — dato NO verificado (vino de una búsqueda mía sin confirmar). El agente NO lo citó al no poder confirmarlo; usó referencias reales y estables en su lugar. Correcto: una app sobre "evidencia ≠ prueba" no puede citar un paper fantasma. *Lección para el diseño de fases: verificar la existencia de toda referencia antes de ponerla en un spec.*
  - *Decisiones:* G7 con unfolding (densidad N̄(t)) — correcto para comparar con GUE; histograma en densidad (área 1) para superponer la curva Wigner.
  - **VALIDACIÓN VISUAL DIFERIDA** al recorrido del usuario: `/#/modulo/5`, G7 sigue la curva GUE (repulsión cerca de s=0).

**EL PROYECTO ES FUNCIONALMENTE COMPLETO: 6 módulos (0–5) + lector de papers. Solo queda Fase 8 (pulido) y, a futuro, Fase 9 (móvil).**
- **Fase 8 — Pulido (escritorio). ✅ COMPLETADA. PROYECTO LISTO PARA USO.** `colors.ts` (paleta única, línea crítica centralizada). Accesibilidad (prefers-reduced-motion en G6, ARIA, teclado, contraste AA). Rendimiento: Plotly→variante "basic" (1.1 MB vs 4.8), React.lazy por módulo (chunks 8–19 KB), chunkSizeWarningLimit→1300, build sin avisos. `GraphicErrorBoundary` por gráfica (G1–G7). Notas de límites visibles en UI (Riemann–Siegel, Gibbs). `QA-CHECKLIST.md` con la validación visual diferida. 112/112 tests (106 + 6 nuevos: error boundary, a11y, reduced-motion), build/lint limpios.
  - *Decisiones:* Plotly "basic" (scatter+bar, cubre G1/G2/G4/G5/G7) en vez de dist-min — registrado en CLAUDE.md. `zeros.ts` se mantiene import bundleado (62 KB, despreciable); pasar a fetch sería refactor grande con riesgo, contrario al pulido quirúrgico — revisado y descartado con criterio. ModuleView/GraphicPlaceholder quedan como código muerto inofensivo (sin renderizar).
- **Fase 9 (futuro) — Adaptación móvil.** Solo tras pulir escritorio.

---

## 11. Riesgos y decisiones abiertas

- **G3/G6 son el riesgo técnico principal** → prototipar antes de comprometer (Fases 4 y 6).
- **Precisión de ζ en JS:** float64 basta para cientos de ceros; si se quiere ir más alto, apoyarse en precálculo.
- **Skill propio sin probar aún:** se itera con uso real en Claude Code (las primeras tareas dirán si afinar reglas).
- **Profundidad/volumen de ejercicios por módulo:** a definir al escribir cada módulo.