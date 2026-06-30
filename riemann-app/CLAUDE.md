# riemann-app — guía para el agente

App didáctica de escritorio para aprender la **Hipótesis de Riemann (HR)**. Uso personal, un solo usuario. **Sitio estático** (React + Vite), sin backend corriendo: los "datos de backend" son JSON precalculados.

La **fuente de verdad** del proyecto es `../riemann-roadmap.md` (documento maestro). El plan de la fase actual vive en `../riemann-fase-0.md`. Todo cambio de rumbo se edita primero en el road map.

## Reglas de diseño del proyecto (skill obligatorio)

> **`.claude/skills/riemann-didactic-design/`** — skill propio del proyecto. Codifica los mandatos M1–M9 (paso a paso sin saltos, patrón acordeón, toda gráfica interactiva, KaTeX real, honestidad intelectual, escritorio primero, autocontenido, tests obligatorios). **Aplícalo SIEMPRE** que construyas, modifiques o estilices cualquier UI, deducción matemática, gráfica o ejercicio de esta app — aunque el pedido no diga "diseño". Es la regla de diseño didáctico y UX/UI del proyecto.

Mandatos no negociables (resumen — detalle en el road map §2 y en el skill):

- **M1** Paso a paso, sin saltos. Nunca "es fácil ver que…"; evaluar con números reales.
- **M2** Patrón acordeón: titular plegable con la ecuación en KaTeX + ▸; al desplegar, la derivación completa.
- **M3** Toda gráfica es interactiva (sliders, arrastre, zoom, play/pausa); responde en vivo. Cero gráficas decorativas.
- **M4** Una gráfica por concepto (también micro-visuales).
- **M5** Ecuaciones reales en KaTeX (LaTeX), nunca monoespaciado.
- **M6** Honestidad intelectual: la HR NO está demostrada; los preprints "proof of RH" son intentos NO validados.
- **M7** **Escritorio primero**, layout horizontal (viewport ref ≥1280px), patrón de dos columnas. Móvil se difiere.
- **M8** Autocontenido: las referencias a libros son profundización opcional.
- **M9** Tests en cada fase con **Vitest** (+ React Testing Library). La fase no termina hasta `npm run test` al 100%. Validar matemática contra valores conocidos (ζ(2)=π²/6, ζ(0)=−1/2, primer cero no trivial t≈14.134725).

## Stack

React 19 + Vite · TypeScript · React Router 7 (`createHashRouter`; rutas en `src/router.tsx`, reutilizadas en tests con `createMemoryRouter`) · KaTeX (ecuaciones) · Plotly (`plotly.js-dist-min`, gráficas de línea — building block de Fase 0, aún no montado en el chasis) · Tailwind CSS v3 (estilos, `darkMode: 'class'`) · WebGL shader para domain coloring (Fase 4) · Python + mpmath offline para precálculo de ceros (Fase 2) · Vitest + Testing Library (tests).

Estado a nivel de app vía contexto: `ThemeProvider` (tema, persistido en `riemann:theme`) y `ProgressProvider` (progreso por sección, persistido en `riemann:progress`). Los hooks `useTheme`/`useProgress` viven en archivos `*-context.ts` aparte del Provider (regla `react/only-export-components`). Componentes reutilizables del chasis: `Accordion` (M2), `Equation` (M5), `ThreeLayers`, `Exercise`, `ModuleLayout`, `GraphicPlaceholder`, `AppShell`. Contenido placeholder de los módulos en `src/modules/moduleContent.ts`, renderizado por `ModuleView`.

Paleta sobria: base neutra + **un** acento (teal), modo claro/oscuro por clase `dark` en `<html>`. Tipografía: Inter para texto, serif de KaTeX para matemática.

## Scripts

- `npm run dev` — servidor de desarrollo.
- `npm run build` — build de producción (`tsc -b && vite build`).
- `npm run test` — Vitest en modo run (una pasada, reporta y sale). `npm run test:watch` para watch.
- `npm run lint` — oxlint.

## Skills de framework (instalados por `npx autoskills`)

`react-best-practices`, `composition-patterns`, `tailwind-css-patterns`, `typescript-advanced-types`, `vite`, `oxlint`, `nodejs-backend-patterns`, `nodejs-best-practices`, `vitest`, `frontend-design`, `accessibility`, `seo` — todos bajo `.claude/skills/`. Cubren "cómo usar los frameworks"; las **reglas del proyecto** las manda `riemann-didactic-design`, que tiene prioridad ante cualquier conflicto de estilo/UX.

## Estado

- **Fase 0** (entorno y andamiaje) ✅ — stack, skills, estructura §8, hola mundo (KaTeX + Plotly), Vitest en verde.
- **Fase 1** (esqueleto navegable) ✅ — navegación entre los 6 módulos + lector de papers (React Router), componentes reutilizables (Accordion/Equation/ThreeLayers/Exercise/ModuleLayout/GraphicPlaceholder), sistema de progreso con persistencia, tema claro/oscuro app-wide, módulos poblados con **placeholders**. Tests 14/14, build y lint limpios.
- **Fase 2** (precálculo de ceros) ✅ — **primera fase con matemática real**. `scripts/precompute_zeros.py` (Python + mpmath, dps=30) genera `public/data/zeros.json` (N=1000 ceros no triviales) y `zeta_special_values.json`. Reproducible (2da corrida byte-idéntica, mismo SHA256). `src/lib/zeros.ts` carga/tipa los datos (importa el JSON; **no** calcula ζ — eso es Fase 3+). Tests: 4/4 Python (ground truth, |ζ(½+it)|<1e-8, valores especiales, estructura) + 18/18 Vitest. Build y lint limpios.
- **Fase 3** (Módulos 0 y 1 completos) ✅ — **primer contenido didáctico real + ζ en JS + G1/G2**. `src/lib/zeta.ts` (`zetaReal` suma directa con su límite documentado, `eulerProductPartial`, `BASEL`) y `src/lib/primes.ts` (`primePi`, `primesUpTo`, `liApprox`=li(x) desde 0, `xOverLnx`). `Module0.tsx`/`Module1.tsx` reescritos a contenido real (3 capas, derivaciones paso a paso en acordeón — Li(x) en M0, **producto de Euler** en M1—, ejercicios con comprobador numérico). Gráficas interactivas `PrimeCountingPlot` (G1) y `ZetaRealPlot` (G2, slider acotado a s∈[1.2,8], honesta sobre el límite de la suma). `NumericExercise` envuelve `Exercise` y le controla el estado (verde/rojo). Módulos 2–5 siguen en placeholder (ModuleView). Tests 37/37, build y lint limpios.
- **Fase 4** (G3 domain coloring WebGL + ζ compleja) ✅ — **pieza de mayor riesgo técnico**. `src/lib/zetaComplex.ts` (tipo `Complex` + ops + `etaDirichlet` + `zetaComplex`=η/(1−2^{1−s}), cubre la franja crítica; límite de convergencia documentado, tolerancias realistas). `src/lib/domainColoring.ts` = lógica PURA testeable (modelo de vista, `screenToPlane`/`planeToScreen`, `zoomViewAt`/`panViewByPixels`, `domainColor`). `DomainColoring.tsx` = shader WebGL (matiz=fase, brillo=módulo; η con 200 términos) + zoom/pan en vivo + overlay (línea crítica + ceros de zeros.json + polo) + lector de cursor (σ+it, |ζ|) + fallback sin WebGL. `Module2.tsx` reescrito a intro mínima + G3 (el resto de M2 es Fase 5). Tests 58/58, build y lint limpios. (Bug de init WebGL en ANGLE 0×0 corregido luego: init espera a tener `size`.)
- **Fase 5** (Módulos 2 y 3 completos + el enunciado de la HR) ✅ — `zetaComplex.ts` ampliado: `gammaComplex` (Lanczos), `chi` (ecuación funcional), `zetaComplexFull` (ζ en todo ℂ por reflexión — permite ceros triviales), `hardyTheta`/`hardyZ` (función Z), `absZetaOnCriticalLine`. `src/lib/criticalLine.ts` = muestreo cacheado de |ζ| y Z (compartido por G4/G5). Gráficas `AbsZetaCriticalPlot` (G4) y `HardyZPlot` (G5, con envolvente ±|ζ|). `Module2.tsx` completo (continuación ζ–η paso a paso, polo s=1, ζ(0)=−½) y `Module3.tsx` completo (ecuación funcional factor a factor, ceros triviales derivados, franja/línea crítica, **enunciado HR destacado con nota M6 "no demostrada"**, 3 ejercicios). **Parte 0:** `INITIAL_VIEW` de G3 ahora **isotrópico** (`isotropicViewForSize`, σ:t = ancho:alto → vórtices circulares). Tests 77/77, build y lint limpios.
- **Fase 6** (Módulo 4: fórmula explícita + animación G6) ✅ — **la joya: los ceros reconstruyen los primos**. `src/lib/explicitFormula.ts` (`psiChebyshev` escalera real, `psiMainTerm`, `waveOfZero` onda del par conjugado, `psiExplicit(x,N)`; ground truth ψ(10)=7.832, ψ(20)=19.266, ψ(30)=28.476). `src/lib/plotScale.ts` = `sampleRange`/`linearScale` (lógica pura de muestreo/escalado, testeable). `ExplicitFormula.tsx` (G6) = animación **Canvas2D** (escalera ψ + término principal + aproximación con N ondas) con slider N (0–200) + botón play (setInterval, testeable con fake timers), siguiendo el patrón de canvas de Fase 4 (espera tamaño, loguea fallos, fallback). `Module4.tsx` completo (3 capas; **derivación de la onda real paso a paso** x^ρ/ρ+x^ρ̄/ρ̄ → 2√x[...]/|ρ|²; por qué importa la HR con nota M6; 3 ejercicios). Tests 93/93, build y lint limpios.
- **Fase 7** (Módulo 5 estado del arte + Lector de papers) ✅ — **ÚLTIMA fase de contenido: los 6 módulos + lector completos**. `src/lib/spacingStats.ts` (`smoothCount` N̄(t), `unfoldedSpacings` con unfolding → media≈1, `meanSpacing`, `wignerGUE` curva GUE, `histogram`). `GUESpacingPlot.tsx` (G7) = histograma de espaciados normalizados de ceros reales vs ley GUE (Wigner), slider de N (M3). `Module5.tsx` completo (verificación computacional Platt/Gourdon, conexión GUE Montgomery–Dyson–Odlyzko + té 1972, enfoques Hilbert–Pólya/Berry–Keating/Connes/GRH, **lección "evidencia ≠ prueba" destacada con Li−π/Littlewood/Skewes 10³¹⁶**, "pruebas"/ML **no validadas** — M6 estricto; 3 ejercicios). `PapersReader.tsx` reescrito (marco condicional vs incondicional + Montgomery–Odlyzko y Platt–Trudgian desmontados con **enlaces a fuentes, sin PDFs ni texto con copyright**; conecta G7 con la Fase 2 del proyecto). Tests 106/106, build y lint limpios.
- **Fase 8** (pulido final) ✅ — **proyecto listo para uso** (sin contenido nuevo; pulido quirúrgico). **A** paleta centralizada en `src/lib/colors.ts` (GRAPH) usada por las 7 gráficas (línea crítica mismo color); contraste AA (slate-400→slate-500 en claro). **B** `usePrefersReducedMotion` → G6 no autoanima con movimiento reducido; ARIA/teclado/aria-label revisados. **C** Plotly cambiado a `plotly.js-basic-dist-min` (1.1 MB vs 4.8); **React.lazy por módulo** (`src/modules/lazyModules.ts`) + `<Suspense>` en AppShell; `chunkSizeWarningLimit: 1300`; build **sin avisos** (módulos en chunks de 8–19 KB). **D** `GraphicErrorBoundary` envuelve G1–G7 (un fallo no tumba el módulo); guard en `zeros.ts`; notas de límites (Riemann–Siegel en G4/G5, Gibbs en G6). **E** revisión de mandatos (M1/M3/M4/M6, Li/li). **F** `QA-CHECKLIST.md` (validación visual del usuario). Tests **112/112** (106 + a11y/reduced-motion/error-boundary), build y lint limpios.
- **Fase 9** (responsive completo) ✅ — adaptación móvil/tablet **ADITIVA, regresión cero en desktop** (≥1280px idéntico; desplegado en `tudominio.com/riemann/`, `base:'/riemann/'`). **A** AppShell: nav lateral `hidden lg:block`; en <lg, menú **hamburguesa** → drawer accesible (aria-expanded, Esc, cierra al elegir/tocar fuera) que se renderiza **solo abierto** (DOM en reposo intacto → tests previos sin tocar). **B** `Equation` display con `.katex-scroll` (scroll-x propio, `touch-action:pan-x`, barra fina). **C** G3 con **Pointer Events** (1 dedo pan, 2 dedos pinch) + `touch-action:none`, altura responsive, lector de coords al tocar; los handlers de ratón quedan **intactos** (los pointer ignoran `pointerType==='mouse'`). LinePlot oculta la modebar de Plotly solo en `(pointer: coarse)`. **D/E** `.touch-target` (≥44px) e inputs a 16px **solo en `@media (pointer: coarse)`** (desktop sin cambios; evita zoom iOS). Tests **122/122** (112 + drawer, overflow ecuación, pinch puro, G3 pointer-pan, touch-target), build y lint limpios.

### Precálculo (Fase 2)

- Entorno Python: `python` = 3.10.6 con `mpmath==1.3.0` (`scripts/requirements.txt`). Regenerar: `python scripts/precompute_zeros.py` (~3 min para N=1000). Subir N solo cambia el argumento.
- Tests Python: `python scripts/test_precompute.py` (runner propio, no requiere pytest; también colectable por pytest).
- Datos en `public/data/` (servidos como estáticos y copiados a `dist/data/`). `zeros.ts` los importa para bundlearlos; en runtime la app solo lee JSON, nunca llama a Python (§6).

### Matemática en JS (Fase 3)

- `zeta.ts`: `zetaReal(s, terms)` es la **suma directa pura** Σ 1/n^s (no la aceleres: los tests y el ejercicio de convergencia dependen del valor parcial). Converge mal cerca de s=1 → G2 acota s∈[1.2,8] y la UI lo dice. `eulerProductPartial(s, limit)`, `BASEL = π²/6`.
- `primes.ts`: `liApprox(x)` devuelve li(x) = ∫_0^x dt/ln t (= li(2)+Simpson desde 2), la integral logarítmica clásica (li(1000)≈177.61), NO el offset Li(x)=∫_2^x.
- Plotly: ahora SÍ entra en el bundle (Módulos 0/1 lo usan). Aislado en su propio chunk vía `manualChunks` + `chunkSizeWarningLimit: 5000` para build limpio (es un vendor de ~4.5 MB; perf fino es Fase 8).
- Tests con gráficas: `test.alias` sustituye `plotly.js-dist-min` por `src/test/plotly-stub.ts` (jsdom no tiene canvas/WebGL). Los tests que espían usan su propio `vi.mock` por archivo.

### WebGL / ζ compleja (Fase 4)

- `zetaComplex.ts`: ζ para s complejo vía η de Dirichlet (converge para Re(s)>0 → franja crítica). Convergencia LENTA en la línea crítica: los tests usan tolerancias realistas (primer cero |ζ|<0.05, NO <1e-8). Para t grande lo correcto sería Riemann–Siegel (mejora futura).
- División de trabajo (§6): el **shader** pinta el campo con pocos términos (200); las **posiciones exactas** de los ceros marcados vienen de `zeros.json`, no del shader.
- Testabilidad: toda la lógica pura (mapeo pantalla↔plano, zoom/pan, color, overlay) vive en `domainColoring.ts` y se testea sin GL. `src/test/setup.ts` fuerza `HTMLCanvasElement.getContext = () => null` para que jsdom caiga al fallback de forma determinista y silenciosa.
- Vista inicial `INITIAL_VIEW`: desde Fase 5 es **isotrópica** — `isotropicViewForSize(width,height)` hace σ-span:t-span = ancho:alto del canvas (vórtices circulares). El componente la calcula con el tamaño real al medir; "Reiniciar vista" la recalcula. Centrada en FOCUS=(0.5, 7), t-span 20.

### Ec. funcional, ceros y Z de Hardy (Fase 5)

- `zetaComplex.ts` añade: `gammaComplex` (Lanczos, reflexión para Re<0.5), `chi(s)` (factor de la ecuación funcional ζ(s)=χ(s)ζ(1−s)), `zetaComplexFull(s)` (η para Re≥½, reflexión para Re<½ → permite ζ(−2)=0), `hardyTheta`/`hardyZ` (Z(t)=cosθ·Reζ−sinθ·Imζ, θ Riemann–Siegel asintótica), `absZetaOnCriticalLine`.
- **Tests de la ec. funcional**: solo en Re(s)∈(0,1) (p. ej. s=0.5+3i, terms=100000, tol 1e-3). El "s=3" del doc NO sirve: Γ(1−s) tiene polo en enteros y η diverge para ζ(1−s) si Re(s)>1. Z y |ζ| de las tablas con terms=20000 (tol 1e-2; ceros <0.05).
- G4/G5 muestrean ζ sobre σ=½ con `sampleCriticalLine` (cacheado, terms=2500 para la curva — los ceros se ven igual). Para t grande, η impracticable → Riemann–Siegel completo sería la mejora (documentado, igual que Fase 4).

### Fórmula explícita y G6 (Fase 6)

- `explicitFormula.ts`: se anima **ψ(x) de Chebyshev** (no π(x)): su fórmula explícita tiene término principal = x (la más limpia). `waveOfZero(x,k)` = onda real del par conjugado ρ_k=½±iγ_k = 2√x[½cos(γ lnx)+γ sin(γ lnx)]/(¼+γ²). `psiExplicit(x,N)` = término principal − Σ ondas; converge a la escalera al subir N (err con 100 < err con 1).
- G6 es **Canvas2D** (no Plotly ni WebGL): suficiente para curvas y mejor para animar (redibujo por frame). Sigue el patrón de Fase 4 (init solo con tamaño, fallback). Play usa `setInterval` (testeable con `vi.useFakeTimers`), no rAF. Lógica pura (muestreo/escalado) en `plotScale.ts`, testeada aparte; el componente se testea con un mock de contexto 2D (espía `stroke`) + ResizeObserver simulado (como el test de regresión de G3).

### Estado del arte y G7 (Fase 7)

- `spacingStats.ts`: para comparar los espaciados de ceros con GUE hay que **desplegarlos (unfolding)** con la parte suave N̄(t)=(t/2π)ln(t/2π)−t/2π+7/8 (la densidad de ceros crece con t). La media normalizada → 1 (verificado, ≈1.000 con 1000 ceros). `wignerGUE(s)`=(32/π²)s²exp(−4s²/π): p(0)=0, máx en √π/2≈0.886, área 1.
- **M6 estricto** en M5 y el lector: la HR se presenta como conjetura no demostrada; las "pruebas" recientes/ML como NO validadas. El elemento `data-testid="hr-status"` lleva el estado; un test verifica que la HR no aparece como "resuelta/demostrada". El lector NO incrusta PDFs (sin `iframe/embed/object`) — solo enlaces a fuentes reales (arXiv, Wikipedia, Clay).

### Pulido (Fase 8)

- **Colores:** `src/lib/colors.ts` (`GRAPH`) es la fuente única de la paleta de gráficas; las 7 lo importan. No metas hex sueltos en las gráficas.
- **Code-splitting:** Plotly es `plotly.js-basic-dist-min` (1.1 MB; solo scatter+bar). Módulos vía `React.lazy` en `src/modules/lazyModules.ts`, con `<Suspense>` en AppShell. Por eso **los tests que navegan por el router (Navigation/Progress) son async** (`findBy`); los tests que importan un módulo directo siguen síncronos. `chunkSizeWarningLimit: 1300` → build sin avisos.
- **Robustez:** `GraphicErrorBoundary` envuelve cada gráfica en los módulos; un fallo de gráfica no tumba el módulo. `usePrefersReducedMotion` desactiva el autoplay de G6.
- **QA:** `riemann-app/QA-CHECKLIST.md` lista la validación visual del usuario (vórtices G3, cruces G5, escalones/Gibbs G6, histograma GUE G7, claro/oscuro).

### Responsive (Fase 9)

- **Regla de oro:** responsive ADITIVO. Todo lo táctil/móvil va detrás de breakpoints `lg:` o de `@media (pointer: coarse)`; el desktop (≥1280, puntero fino) queda byte-idéntico. Al tocar UI, verifica que no cambias el resultado en desktop.
- **Nav:** lateral `hidden lg:block`; el drawer móvil se renderiza **solo cuando está abierto** (por eso los tests Navigation/Progress no se tocaron: en reposo el DOM es el de antes). El drawer usa `aria-label="Secciones"` (la lateral, `"Módulos"`) para no colisionar en `getByRole('navigation', {name:/Módulos/i})`.
- **Touch targets:** clase `.touch-target` (definida en `index.css` dentro de `@media (pointer: coarse)` → 44px solo en táctil). Los sliders y los inputs (16px anti-zoom iOS) se cubren con reglas de elemento en ese mismo `@media`. **Ojo:** la variante Tailwind `pointer-coarse:` NO está disponible aquí (3.4.19 no la emitió) — usa la clase `.touch-target` o reglas en el `@media` de `index.css`, no `pointer-coarse:*`.
- **G3 touch:** Pointer Events conviven con los handlers de ratón; los pointer **ignoran `pointerType==='mouse'`** para no duplicar. Pinch = lógica pura `distance`/`pinchZoomFactor` en `domainColoring.ts` (testeable sin GL). Tests de pointer en jsdom: polyfill `PointerEvent` sobre `MouseEvent` y `setPointerCapture` va con guarda `try/catch`.

El proyecto está **completo y responsive** (6 módulos + lector; desktop pulido + móvil/tablet). No quedan fases. No avanzar/retocar sin `npm run test` al 100% + build y lint limpios + tests Python en verde (M9). Pendiente: validación visual del usuario en dispositivos reales según `QA-CHECKLIST.md` (incluye la sección responsive de Fase 9). Tras cambios, re-desplegar: `npm run build` y subir `dist/` a `public_html/riemann/`.
