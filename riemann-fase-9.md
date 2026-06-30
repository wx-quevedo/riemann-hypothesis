# Fase 9 — Adaptación responsive completa (móvil + tablet + desktop)
### Instrucciones para el agente de construcción (Claude Code)

**Objetivo:** experiencia COMPLETA en todo el rango de pantallas — teléfono (~360–430px), tablet (~768px), desktop fluido (≥1280px) — con la misma calidad de uso que ya tiene el desktop. No solo "legible": las gráficas deben ser usables al tacto, los controles operables con el dedo, la navegación cómoda en pantalla pequeña.

**Contexto obligatorio:** lee `riemann-roadmap.md` (M7 actualizado: responsive completo, regresión cero en desktop; todas las notas de gráficas). El desktop está PULIDO y DESPLEGADO — no romperlo es la prioridad #1.

**REGLA CENTRAL DE LA FASE: responsive ADITIVO, regresión cero en desktop.** Usar breakpoints de Tailwind para *añadir* comportamiento en pantallas pequeñas, partiendo de mobile-first donde convenga, pero sin alterar el resultado en ≥1280px. Tras cada cambio, verificar que el desktop se ve idéntico. Los 112 tests deben seguir verdes.

---

## Parte A — Layout y navegación
- **Menú lateral → hamburguesa en móvil.** En desktop, la nav lateral se queda como está. En móvil/tablet, colapsar a un menú hamburguesa (drawer) accesible: botón con `aria-expanded`, panel deslizable, cierra al elegir módulo o al tocar fuera. Teclado operable.
- **Patrón de dos columnas → apilado.** El layout "concepto | gráfica" (lg:grid-cols-2) ya usa `lg:`; confirmar que por debajo de `lg` apila en una columna (concepto arriba, gráfica abajo) con orden lógico. Revisar TODOS los módulos.
- **Header:** marca + toggle de tema deben caber en móvil (reducir, no romper).
- **Anchos:** el `max-w-[1280px]` se mantiene en desktop; en móvil, padding lateral cómodo (no pegado a los bordes).

## Parte B — Ecuaciones KaTeX (el punto delicado)
- Las ecuaciones anchas (ecuación funcional, fórmula explícita) NO caben en ~360px.
- Solución: envolver cada bloque KaTeX display en un contenedor con **scroll horizontal propio** (`overflow-x-auto`) y un indicador sutil de que se puede deslizar (sombra/gradiente en el borde, o scrollbar fino visible). Así la ecuación no rompe el layout ni se encoge ilegible.
- Las ecuaciones inline deben hacer wrap natural con el texto.
- Verificar que el scroll de la ecuación no atrape el scroll vertical de la página (touch-action correcto).

## Parte C — Gráficas táctiles (la verdadera dificultad)

**G3 — Domain coloring (WebGL):** la más compleja.
- Reemplazar/complementar rueda+arrastre con **gestos táctiles**: pinch (dos dedos) para zoom, un dedo para pan. Usar Pointer Events (unifican mouse/touch) en vez de solo MouseEvent.
- CRÍTICO: el pan de un dedo NO debe competir con el scroll de la página. Dentro del canvas, `touch-action: none` para capturar el gesto; fuera, el scroll normal funciona.
- Mantener los botones Acercar/Alejar/Reiniciar (son la alternativa accesible al pinch).
- El lector de cursor (σ+it) no aplica a touch (no hay hover); en móvil, mostrar las coords al tocar/arrastrar, o un retículo central fijo con sus coords.
- Reducir la altura del canvas en móvil para que quepa con sus controles sin scroll infinito.

**G1/G2/G4/G5/G7 — Plotly:** Plotly trae soporte táctil básico (pinch-zoom, pan). Verificar que funciona; configurar `responsive: true` y `displayModeBar` adecuado para touch (o quitar la toolbar en móvil si estorba). Los sliders de control deben ser cómodos al dedo (área de toque ≥44px).

**G6 — Animación (Canvas2D):** el slider de N y el botón play deben ser táctiles cómodos. El canvas se redimensiona al ancho disponible (ya respeta dimensiones; verificar en móvil). Respetar prefers-reduced-motion (ya implementado).

## Parte D — Controles y ergonomía táctil
- **Áreas de toque ≥44×44px** en todos los controles interactivos (botones, sliders, toggles, acordeones, checkboxes). Es el mínimo recomendado para dedos.
- **Sliders:** thumb grande, track visible, valor siempre visible junto al control (ya es la regla; verificar tamaño en móvil).
- **Acordeones:** la zona de toque del titular cómoda y obvia.
- **Ejercicios:** los inputs de respuesta y el feedback correcto/error legibles y operables en móvil.

## Parte E — Tipografía y legibilidad responsive
- Escalas de texto que funcionen en móvil sin ser diminutas (mínimo ~16px en body para evitar zoom automático de iOS en inputs).
- Jerarquía mantenida (intuición/formal/avanzado distinguibles en pantalla pequeña).
- Que el modo claro y oscuro sigan correctos en móvil.

## Parte F — Meta viewport y base
- Confirmar `<meta name="viewport" content="width=device-width, initial-scale=1.0">` en index.html (ya está).
- El `base: '/riemann/'` del despliegue no se toca; es ortogonal al responsive.

---

## Tests de la fase (M9 — obligatorio)
- **Regresión cero:** los 112 tests existentes siguen verdes. ESTE es el criterio más importante.
- **Nuevos:**
  - El menú hamburguesa abre/cierra, es accesible (aria-expanded), y navega.
  - Los contenedores de ecuación tienen overflow-x-auto (no rompen layout a ancho estrecho).
  - G3 responde a Pointer Events (simular pointer down/move para pan; verificar que la vista cambia). Pinch puede testearse a nivel de lógica pura (dos puntos → factor de zoom).
  - Áreas de toque: test de que los controles clave tienen el tamaño mínimo (o clases que lo garantizan).
- Tests de layout responsive son limitados en jsdom (no hay layout real); priorizar lógica (gestos, estado del drawer) y dejar lo visual a la checklist.

## Criterios de aceptación de la Fase 9
- [ ] Navegación por hamburguesa en móvil/tablet; lateral intacta en desktop.
- [ ] Dos columnas apilan correctamente bajo `lg` en todos los módulos; desktop idéntico.
- [ ] Ecuaciones anchas con scroll horizontal propio, sin romper el layout ni atrapar el scroll vertical.
- [ ] G3 usable al tacto (pinch zoom, pan un dedo, sin pelear con el scroll) + botones de respaldo.
- [ ] Plotly (G1/G2/G4/G5/G7) y G6 táctiles; sliders cómodos al dedo.
- [ ] Áreas de toque ≥44px; texto body ≥16px; claro/oscuro correctos en móvil.
- [ ] **Regresión cero en desktop** (verificado visualmente + 112 tests verdes).
- [ ] `npm run build` y `npm run lint` limpios.
- [ ] Checklist de validación visual ACTUALIZADA con casos móviles (añadir a QA-CHECKLIST.md: teléfono y tablet, en claro y oscuro, para cada módulo y gráfica).

## Lo que NO se hace en Fase 9
- No rediseñar el desktop (está pulido y desplegado).
- No añadir contenido ni features nuevas; solo adaptación responsive.
- No reescribir las gráficas desde cero; adaptar sus controles a touch.

## Nota
Tras esta fase, re-desplegar: `npm run build` y subir el nuevo `dist/` por FTP a `public_html/riemann/` (mismo procedimiento). Validación visual final: recorrer la app en un teléfono y una tablet reales, no solo el emulador del navegador — el touch real revela cosas que el emulador no.
