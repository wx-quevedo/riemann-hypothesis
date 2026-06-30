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
- **Fase 3 — Módulos 0 y 1 completos.** Contenido paso a paso, G1, G2, ejercicios. Valida el patrón end-to-end.
- **Fase 4 — Prototipo G3 (domain coloring WebGL).** La pieza de mayor riesgo. Validar interactividad.
- **Fase 5 — Módulos 2 y 3.** Continuación analítica, ceros, G3/G4/G5.
- **Fase 6 — Prototipo G6 + Módulo 4.** Animación de la fórmula explícita.
- **Fase 7 — Módulo 5 + lector de papers.** Estado del arte, G7.
- **Fase 8 — Pulido escritorio.** Accesibilidad, rendimiento, consistencia visual.
- **Fase 9 (futuro) — Adaptación móvil.** Solo tras pulir escritorio.

---

## 11. Riesgos y decisiones abiertas

- **G3/G6 son el riesgo técnico principal** → prototipar antes de comprometer (Fases 4 y 6).
- **Precisión de ζ en JS:** float64 basta para cientos de ceros; si se quiere ir más alto, apoyarse en precálculo.
- **Skill propio sin probar aún:** se itera con uso real en Claude Code (las primeras tareas dirán si afinar reglas).
- **Profundidad/volumen de ejercicios por módulo:** a definir al escribir cada módulo.