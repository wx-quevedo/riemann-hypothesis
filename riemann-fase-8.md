# Fase 8 — Pulido (escritorio)
### Instrucciones para el agente de construcción (Claude Code)

**Objetivo:** llevar el proyecto funcionalmente completo a calidad de "producto terminado". NO se añade contenido ni features nuevas: se pule lo existente — accesibilidad, rendimiento, consistencia visual, manejo de errores, y la revisión transversal de los mandatos. Es la última fase antes de que el proyecto quede listo para el recorrido didáctico del usuario (y, a futuro, la adaptación móvil).

**Contexto obligatorio:** lee `riemann-roadmap.md` completo (todos los mandatos, todas las notas de fases previas, en especial las lecciones de Fase 4 sobre WebGL y las decisiones de Li(x), Gibbs, unfolding). Este es un pase de revisión sobre TODA la app.

---

## Parte A — Consistencia visual (skill §UX, M7)
- **Auditoría de la paleta:** un solo acento (teal) en toda la app; semánticos (verde/ámbar/rojo) solo donde corresponde; la **línea crítica con el MISMO color** en G3, G4, G5 (revisar que no se haya desviado entre gráficas).
- **Tipografía consistente:** Inter para texto, KaTeX para matemática; jerarquía por tamaño; dos pesos. Revisar que no se hayan colado tamaños/pesos ad hoc.
- **Botones y controles uniformes:** mismo estilo (outline, esquinas suaves, sentence case) en las 7 gráficas y los ejercicios. Un primario por vista.
- **Modo claro/oscuro:** revisar TODA la app en ambos modos — que ningún texto quede invisible, que las gráficas (especialmente las de fondo oscuro como G3) se vean bien en ambos.
- **Espaciado y layout:** consistencia del patrón de dos columnas; el ancho 1280; que las ecuaciones anchas (ecuación funcional) no desborden.

## Parte B — Accesibilidad
- **Navegación por teclado:** todos los controles (sliders, botones, acordeones, toggles) alcanzables y operables con teclado; foco visible.
- **ARIA:** acordeones con `aria-expanded`/`aria-controls` (ya en M2); gráficas con `aria-label` descriptivo; la región de cada módulo con encabezados jerárquicos correctos (h1→h2→h3).
- **Contraste:** verificar ratios AA en texto sobre fondos (claro y oscuro).
- **Movimiento:** la animación de G6 debe respetar `prefers-reduced-motion` (pausar/no autoiniciar si el usuario lo pide).
- **Texto alternativo:** las gráficas tienen descripción para lectores de pantalla (qué representa, no solo "gráfica").

## Parte C — Rendimiento
- **Code-splitting (lo diferido en Fase 3):** revisar los chunks; Plotly, KaTeX, las gráficas pesadas cargadas de forma diferida (lazy) por módulo si mejora el arranque. Bajar el `chunkSizeWarningLimit` a un valor razonable una vez optimizado, en vez del 5000 temporal.
- **G3 (WebGL):** confirmar que solo redibuja al interactuar (no en bucle ocioso); que el `WEBGL_lose_context` se llama al desmontar (ya implementado, verificar).
- **G6 (animación):** que el `setInterval` se limpie al desmontar y al terminar la animación; no fugas.
- **Lazy-load de módulos:** considerar `React.lazy` para que cada módulo cargue su código al navegar a él (la app de un solo usuario no necesita todo de golpe).
- **`zeros.ts` (nota de Fase 2):** revisar si conviene pasar de import bundleado a `fetch` de `public/data/` para no inflar el bundle JS, ahora que los ceros se usan en varias gráficas.

## Parte D — Robustez y manejo de errores
- **Fallbacks:** WebGL ausente (G3, ya hecho); Canvas2D ausente (G6); LaTeX inválido (Equation, ya hecho). Revisar que ningún fallo de una gráfica tumbe el módulo entero (error boundaries por gráfica).
- **Datos:** si `zeros.json` faltara o estuviera corrupto, degradar con mensaje claro, no crashear.
- **Límites numéricos documentados:** que las notas sobre convergencia (η lenta cerca de s=1, Riemann–Siegel para t grande, Gibbs en saltos) estén visibles en la UI donde aplique, no solo en el código.

## Parte E — Revisión transversal de mandatos
Recorrer la app módulo por módulo verificando:
- **M1:** ¿hay alguna derivación con saltos? Toda deducción paso a paso.
- **M6:** ¿la HR aparece siempre como conjetura? ¿Las "pruebas" recientes como no validadas? (Ya hay tests; revisar también el texto visible.)
- **M3:** ¿toda gráfica responde a sus controles?
- **M4:** ¿cada concepto tiene su micro-visual o gráfica?
- Coherencia de la convención Li(x)/li(x) entre M0 y M4 (decisión "mostrar ambas").

## Parte F — Consolidar la validación visual pendiente
Generar una **checklist de validación visual** (documento o página de "QA" interna) que liste todo lo que el usuario debe confirmar en su recorrido, recogiendo lo diferido de fases previas:
- G3 (`/modulo/2`): vórtices circulares (isotrópico); ceros triviales en eje real; zoom/pan fluido (ya confirmado).
- G4/G5 (`/modulo/3`): |ζ| toca cero / Z cruza el eje en cada ρₙ, marcas alineadas.
- G6 (`/modulo/4`): al subir N emergen los escalones; Gibbs visible en x=25.
- G7 (`/modulo/5`): histograma sigue la curva GUE.
- Recorrido completo en claro y oscuro.

---

## Tests de la fase (M9 — obligatorio)
- Mantener los 106 tests existentes en verde tras los cambios (regresión cero).
- Añadir: tests de accesibilidad básica (roles, aria, foco) en componentes clave; test de que `prefers-reduced-motion` desactiva el autoplay de G6; test de error boundary (una gráfica que lanza no tumba el módulo).
- `npm run build` con chunks optimizados y `chunkSizeWarningLimit` bajado; sin avisos.
- `npm run lint` limpio.

## Criterios de aceptación de la Fase 8
- [ ] Paleta, tipografía y controles consistentes en toda la app; línea crítica mismo color en G3/G4/G5.
- [ ] App revisada en claro y oscuro sin texto invisible ni gráficas rotas.
- [ ] Navegación por teclado y ARIA completos; contraste AA; `prefers-reduced-motion` respetado en G6.
- [ ] Code-splitting/lazy-load aplicado; `chunkSizeWarningLimit` bajado; build sin avisos.
- [ ] Error boundaries por gráfica; fallbacks revisados; degradación elegante si faltan datos.
- [ ] Revisión transversal de mandatos (M1, M3, M4, M6, Li(x)) pasada.
- [ ] Checklist de validación visual generada para el recorrido del usuario.
- [ ] Los 106 tests siguen verdes + nuevos tests de accesibilidad/robustez; build y lint limpios.

## Lo que NO se hace en Fase 8
- No contenido nuevo ni módulos nuevos.
- No adaptación móvil (Fase 9, futuro).
- No refactors grandes que arriesguen la regresión; el pulido es quirúrgico.

## Nota
Tras esta fase el proyecto está listo para uso. La validación conceptual final la hace el usuario recorriendo los módulos como estudiante (es el propósito del proyecto). La Fase 9 (móvil) queda para cuando la experiencia de escritorio esté pulida y usada, según el road map (M7).
