# Fase 4 — Domain coloring de ζ en WebGL (G3) + ζ compleja
### Instrucciones para el agente de construcción (Claude Code)

**Objetivo:** la pieza de mayor riesgo técnico del proyecto. Implementar ζ(s) para **s complejo** y visualizar ζ en el plano complejo mediante **domain coloring con un shader WebGL** (G3), interactivo (zoom/pan). Esto convierte el Módulo 2 (continuación analítica) en algo que se *ve*. Es un prototipo de validación: si el enfoque WebGL funciona fluido, queda como base de las gráficas pesadas.

**Contexto obligatorio:** lee `riemann-roadmap.md` (mandatos; §4 G3; §6 stack híbrido). Usa `zeros.json` de Fase 2 para marcar ceros exactos. NO toca aún el contenido completo del Módulo 2 (eso es Fase 5); aquí se construye la GRÁFICA y la ζ compleja que la alimenta, más una integración mínima para verla.

---

## Concepto: domain coloring
Cada punto s del plano complejo se colorea según ζ(s): el **matiz (hue)** codifica el argumento (fase) de ζ(s), y el **brillo/saturación** codifica el módulo |ζ(s)|. Resultado: los ceros aparecen como puntos donde todos los colores convergen en espiral ("vórtices"), y el polo en s=1 como un punto brillante. Es la imagen icónica de ζ.

---

## Parte A — ζ compleja en JS: `src/lib/zetaComplex.ts`

- Tipo complejo simple (`{re, im}` o tuplas) con operaciones (suma, mult, div, potencia compleja n^s = exp(s·ln n)).
- **Función eta de Dirichlet** (verificada como el enfoque correcto):
  - η(s) = Σ (−1)^(n−1) / nˢ — converge para Re(s)>0, así que **cubre la franja crítica** (la serie directa de ζ no llega ahí).
  - ζ(s) = η(s) / (1 − 2^(1−s)).
- **LÍMITE DE CONVERGENCIA verificado (documentar):** η converge LENTO en la línea crítica. En el primer cero (0.5+14.13i): N=50→|ζ|≈0.030, N=1000→0.0067, N=5000→0.0030. Implicaciones:
  - Para el **shader visual**, usar pocos términos (p. ej. 100–300): basta para que los ceros se vean como vórtices; el ojo no nota la diferencia. La velocidad manda.
  - Para **marcar posiciones exactas de ceros**, NO confiar en el shader: usar `zeros.json` (Fase 2, 30 dígitos). El shader pinta el campo; los datos precisos marcan los puntos. (División de trabajo del stack híbrido, §6.)
- Valores de verificación (mpmath, para tests):
  | s | \|ζ(s)\| |
  |---|---------|
  | 2+0i | 1.64493 |
  | 3+2i | 0.98419 |
  | 0.5+5i | 0.73886 |
  | 0.5+14.1347i | ≈0 (primer cero) |
  | 0.5+21.0220i | ≈0 (segundo cero) |

## Parte B — Shader WebGL: `src/components/graphics/DomainColoring.tsx`

- Canvas WebGL; fragment shader en GLSL que, por píxel:
  1. Mapea coordenada de pantalla → punto s del plano complejo (según zoom/pan actuales).
  2. Calcula ζ(s) con η de Dirichlet truncada (pocos términos, ver límite arriba). Implementar aritmética compleja en GLSL.
  3. Convierte ζ(s) a color: hue = atan2(Im,Re) normalizado; lightness según |ζ| (p. ej. con bandas para ver contornos).
- **Controles interactivos (M3):** zoom (rueda) y pan (arrastre). El shader recalcula en tiempo real — esa es la razón de usar GPU. Mostrar las coordenadas del cursor (s = σ+it) en vivo.
- **Overlays:** la línea crítica Re(s)=½ marcada (color consistente del proyecto); los primeros ceros de `zeros.json` marcados como puntos sobre la línea; opción de mostrar la franja crítica 0<Re<1.
- Rango inicial sugerido: σ∈[−2, 4], t∈[−5, 35] (cubre los primeros ceros y el polo).
- **Fallback:** si WebGL no está disponible, mensaje claro (no romper la app).

## Parte C — Integración mínima
- Montar G3 en el Módulo 2 (que por lo demás sigue en placeholder hasta Fase 5), con una intro breve de qué se está viendo.
- Reemplazar el `GraphicPlaceholder` de G3 por el componente real.

---

## Tests de la fase (M9 — obligatorio)
Vitest. NO cierra hasta 100%.
- **zetaComplex.ts:** |ζ(2)|≈1.64493 (tol 1e-3); |ζ(3+2i)|≈0.98419 (tol 1e-3); |ζ(0.5+5i)|≈0.73886 (tol 1e-2, por convergencia lenta); |ζ| en el primer cero (0.5+14.1347i) < 0.05 con N grande (NO exigir <1e-8: la suma lenta no lo da — esa es la lección del límite).
- **Aritmética compleja:** mult, div, potencia n^s contra valores conocidos.
- **Componente:** DomainColoring monta, inicializa contexto WebGL (o usa mock/headless-gl si jsdom no da WebGL — si no es viable en CI, testear la lógica de mapeo pantalla→plano y color por separado, en funciones puras testeables fuera del shader).
- **Overlay de ceros:** los puntos marcados coinciden con los t de `zeros.json` (mapeo correcto a coordenadas de pantalla).

> Nota de testabilidad: jsdom no provee WebGL real. Extraer la lógica pura (mapeo de coordenadas, conversión a color, posición de overlays) a funciones testeables, y dejar el shader como capa fina. Así M9 se cumple sin depender de un GL real en CI.

---

## Criterios de aceptación de la Fase 4
- [ ] `zetaComplex.ts` implementa ζ compleja vía η de Dirichlet, con el límite de convergencia documentado.
- [ ] Los valores de verificación de la tabla pasan (con las tolerancias realistas).
- [ ] `DomainColoring.tsx` renderiza el domain coloring de ζ en WebGL.
- [ ] Zoom y pan funcionan y el shader recalcula en tiempo real (M3).
- [ ] La línea crítica y los primeros ceros (de `zeros.json`) están marcados correctamente.
- [ ] Coordenadas del cursor (σ+it) visibles en vivo.
- [ ] Fallback si no hay WebGL.
- [ ] `npm run test` 100%; `npm run build` y `npm run lint` limpios.

## Lo que NO se hace en Fase 4
- No el contenido didáctico completo del Módulo 2 (Fase 5) — solo la gráfica + intro mínima.
- No la ecuación funcional ni los ceros triviales en detalle (Módulo 3, Fase 5).
- No Riemann–Siegel (ver nota de profundización).
- No G4/G5/G6/G7.

## Nota de profundización
Para t grande, η de Dirichlet se vuelve impracticable (demasiados términos). La técnica estándar es la **fórmula de Riemann–Siegel**, que evalúa ζ en la línea crítica con coste ~√t. Para los primeros ceros (los que mostramos) η acelerada basta y es mucho más simple en GLSL. Si en el futuro se quiere explorar ceros muy altos visualmente, Riemann–Siegel sería la mejora. Referencia: Edwards, *Riemann's Zeta Function*, cap. 7.
