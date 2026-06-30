# Fase 0 — Entorno y andamiaje
### Instrucciones para el agente de construcción (Claude Code)

**Objetivo de la fase:** dejar el proyecto listo para construir — stack instalado, skills en su sitio (incluido autoskills), estructura de carpetas creada, y un "hola mundo" que prueba que KaTeX y una gráfica Plotly renderizan. NO se construye contenido de módulos todavía.

**Contexto obligatorio:** lee primero `riemann-roadmap.md` (documento maestro) y el skill `riemann-didactic-design`. Todos los mandatos M1–M8 aplican desde ya, en especial **M7 (escritorio primero)**.

---

## Orden de ejecución (la secuencia importa)

> **Por qué este orden:** autoskills escanea `package.json` y configs para detectar el stack. Por eso se instala TODO el stack ANTES de correr autoskills; sobre un proyecto vacío no detectaría nada.

### Paso 1 — Scaffolding del proyecto
```bash
npm create vite@latest riemann-app -- --template react-ts
cd riemann-app
npm install
```

### Paso 2 — Instalar todas las dependencias del stack
```bash
# Ecuaciones
npm install katex
npm install -D @types/katex

# Gráficas de línea
npm install plotly.js-dist-min

# Estilos
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
# (configurar tailwind.config.js y el CSS base según docs de Tailwind)

# Utilidades (opcional pero probable)
npm install clsx

# Tests (M9 — obligatorio)
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
# (añadir script "test": "vitest" en package.json y configurar vitest en vite.config)
```
*Nota:* WebGL (G3) no necesita librería extra en esta fase — se usa la API nativa del canvas cuando llegue la Fase 4. shadcn/ui se añade en Fase 1 si se decide usarlo.

### Paso 3 — Correr autoskills (AHORA que hay stack que detectar)
```bash
npx autoskills
```
- Confirmar la selección de skills detectados (React, Tailwind, etc.).
- Verificar que se generó `CLAUDE.md` en la raíz y que hay skills bajo `.claude/skills/`.

### Paso 4 — Copiar el skill propio del proyecto
- Copiar la carpeta `riemann-didactic-design/` (con su `SKILL.md`) a `.claude/skills/riemann-didactic-design/`.
- Verificar que queda junto a los skills de autoskills, no sobrescrito.
- Añadir una línea en `CLAUDE.md` apuntando a este skill como el de reglas de diseño del proyecto.

### Paso 5 — Crear la estructura de carpetas
Según §8 del road map:
```
src/components/         (Accordion, Equation, Exercise, graphics/)
src/lib/                (zeta.ts, primes.ts — vacíos por ahora)
src/modules/            (Module0..5, PapersReader — vacíos por ahora)
public/data/            (vacío; lo llena Fase 2)
scripts/                (precompute_zeros.py — placeholder)
```

### Paso 6 — "Hola mundo" de validación
Crear una página mínima de escritorio (layout horizontal, M7) que demuestre que las dos piezas técnicas clave funcionan:
1. **KaTeX:** renderizar la ecuación de la función zeta `\zeta(s) = \sum_{n=1}^{\infty} \frac{1}{n^s}` correctamente.
2. **Plotly:** una gráfica de línea simple e interactiva (p. ej. 1/n^s para algunos n) con un slider que la modifique en vivo — para probar el patrón M3 desde el inicio.
3. Aplicar la paleta sobria (§7): base neutra, un acento, modo claro/oscuro toggle.

### Paso 7 — Tests de la fase (M9)
Configurar Vitest y escribir tests mínimos que validen el "hola mundo":
1. **Test de render KaTeX:** el componente que renderiza la ecuación monta sin error y produce el markup de KaTeX (no texto plano).
2. **Test de la gráfica:** el componente Plotly monta y el slider actualiza el estado/dato que alimenta la gráfica.
3. **Test de toggle de tema:** el switch claro/oscuro cambia la clase/atributo correspondiente.
Correr `npm run test` y confirmar que **todos pasan**.

---

## Criterios de aceptación de la Fase 0
- [ ] `npm run dev` levanta la app sin errores.
- [ ] Una ecuación se ve renderizada con KaTeX (no como texto plano).
- [ ] Una gráfica Plotly responde a un slider en vivo.
- [ ] `CLAUDE.md` existe y `.claude/skills/` contiene tanto los skills de autoskills como `riemann-didactic-design`.
- [ ] La estructura de carpetas del §8 está creada.
- [ ] El layout es horizontal/escritorio; nada está optimizado para móvil.
- [ ] La paleta es sobria y hay toggle claro/oscuro.
- [ ] **`npm run test` pasa al 100%** (M9).

## Lo que NO se hace en Fase 0
- No se escribe contenido matemático de módulos.
- No se implementa ζ en JS (eso es Fase 3+).
- No se hace el domain coloring (Fase 4).
- No se corre el precálculo de ceros (Fase 2).
