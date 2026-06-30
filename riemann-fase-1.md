# Fase 1 — Esqueleto navegable de la app
### Instrucciones para el agente de construcción (Claude Code)

**Objetivo:** construir el chasis navegable que sostendrá todo el contenido futuro — navegación entre módulos, los componentes reutilizables que exigen los mandatos (acordeón, ecuación, ejercicio, capas), sistema de progreso y layout de escritorio definitivo. **Sin contenido matemático real todavía**: se usan placeholders. Esta fase valida que la *estructura* funciona end-to-end.

**Contexto obligatorio:** lee `riemann-roadmap.md` (fuente de verdad, mandatos M1–M9) y ten presente el skill `riemann-didactic-design`. La Fase 0 ya está completa; partes de lo que existe en `riemann-app/`.

---

## Qué construir

### 1. Layout y navegación (M7 — escritorio)
- **Shell de la app:** barra lateral o superior con la lista de los 6 módulos (Módulo 0–5) + sección "Lector de papers". Área de contenido principal a la derecha/centro, max-w 1280px, layout horizontal.
- **Routing:** React Router (o equivalente). Cada módulo es una ruta. La navegación marca el módulo activo.
- **Estado de navegación:** saber en qué módulo/sección está el usuario.

### 2. Componentes reutilizables (el corazón de la fase)

**`Accordion.tsx` (M2)** — titular plegable.
- Props: título, ecuación (opcional), contenido (la derivación).
- Cerrado por defecto; flechita ▸ que rota al abrir; render condicional del cuerpo (no romper accesibilidad: `aria-expanded`, `button` real).
- Es el componente que envolverá todas las derivaciones paso a paso.

**`Equation.tsx` (M5)** — wrapper de KaTeX.
- Ya existe de la Fase 0; refinarlo: soportar modo inline y modo bloque (display).
- Prop para la cadena LaTeX. Manejo de error si el LaTeX es inválido.

**`ThreeLayers.tsx` (capas intuición/formal/avanzado)** — el patrón de las tres capas.
- Tres secciones visualmente distinguibles. Intuición siempre visible; formal visible; avanzado plegado por defecto (usa Accordion internamente).
- Jerarquía tipográfica clara entre ellas (sección 7 del road map).

**`Exercise.tsx`** — contenedor de ejercicio (estructura, sin lógica matemática aún).
- Campos: enunciado, capa de dificultad, pista (plegable), solución paso a paso (plegable), zona de comprobador (placeholder).
- Estados visuales: sin intentar / correcto (verde) / error (rojo) — solo el armazón visual por ahora.

**`ModuleLayout.tsx`** — plantilla de un módulo.
- Patrón de dos columnas donde aporte (M7): concepto/derivación | gráfica.
- Recibe el contenido del módulo y lo dispone consistentemente.

**`GraphicPlaceholder.tsx`** — marcador para las gráficas futuras.
- Un recuadro con el nombre de la gráfica (G1–G7) y "pendiente de Fase X". Así el layout se ve completo sin construir las gráficas todavía.

### 3. Sistema de progreso (M9-friendly, sección 7 UX)
- Marcar módulos/secciones como completados (check discreto, sobrio — no estrellas llamativas).
- Persistencia local (localStorage) del progreso. *(Nota: localStorage es válido en la app real fuera de artifacts.)*
- Indicador visual de avance en la navegación.

### 4. Tema y estilos
- Consolidar el toggle claro/oscuro de Fase 0 a nivel de toda la app.
- Aplicar la paleta (base neutra + acento teal) de forma consistente vía Tailwind.
- Tipografía: Inter (texto) ya instalada; KaTeX para matemática.

### 5. Poblar con placeholders
- Cada Módulo 0–5 muestra su estructura (título, las tres capas con texto "lorem"/placeholder, un Accordion de ejemplo, un GraphicPlaceholder, un Exercise de ejemplo).
- El objetivo es **ver la app completa navegable** aunque sin contenido real.

---

## Tests de la fase (M9 — obligatorio)
Escribir con Vitest + Testing Library. La fase NO se cierra hasta que todos pasen al 100%.
- **Navegación:** al hacer clic en un módulo, se renderiza su ruta y se marca activo.
- **Accordion:** cerrado por defecto; al hacer clic abre y muestra el cuerpo; `aria-expanded` correcto.
- **ThreeLayers:** intuición y formal visibles; avanzado oculto hasta desplegar.
- **Exercise:** monta con sus campos; los estados visuales (correcto/error) se aplican según prop.
- **Progreso:** marcar una sección la persiste y se refleja en la navegación.
- **Tema:** el toggle propaga la clase dark a nivel app.

---

## Criterios de aceptación de la Fase 1
- [ ] La app es navegable entre los 6 módulos + lector de papers.
- [ ] Accordion, Equation, ThreeLayers, Exercise, ModuleLayout, GraphicPlaceholder existen y se usan.
- [ ] Cada módulo muestra su estructura con placeholders (la app "se ve completa").
- [ ] El layout es horizontal/escritorio (max-w 1280, dos columnas donde aplica).
- [ ] Sistema de progreso funciona y persiste.
- [ ] Toggle claro/oscuro y paleta consistentes en toda la app.
- [ ] `npm run test` pasa al 100%.
- [ ] `npm run build` y `npm run lint` limpios.

## Lo que NO se hace en Fase 1
- No se implementa ζ ni ningún cálculo matemático (Fase 3+).
- No se construyen las gráficas reales (placeholders; G1/G2 llegan en Fase 3, G3 en Fase 4).
- No se escribe el contenido didáctico real de los módulos (eso llega módulo por módulo).
- No se corre el precálculo de ceros (Fase 2).
