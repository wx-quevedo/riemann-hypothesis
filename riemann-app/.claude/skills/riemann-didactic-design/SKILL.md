---
name: riemann-didactic-design
description: Reglas de diseño didáctico y de interfaz (UX/UI) para la app de aprendizaje de la Hipótesis de Riemann. Úsalo SIEMPRE que construyas, modifiques o estilices cualquier parte de esta plataforma educativa: componentes de React, ecuaciones, gráficas interactivas, acordeones de derivación, ejercicios, paleta de colores, botones, tipografía o layout. Aplícalo aunque el pedido no diga "diseño" explícitamente — cualquier UI, deducción matemática o ejercicio de este proyecto debe seguir estas reglas. Es una app PERSONAL de aprendizaje matemático profundo, NO comercial ni infantil.
---

# Riemann — Diseño didáctico y UX/UI

Skill que codifica los mandatos del proyecto. Toda construcción de esta plataforma los obedece.

## 1. Mandato didáctico central: paso a paso, sin saltos

La regla suprema. En la plataforma, **cada deducción y cada ejercicio muestra todos los pasos aritméticos y algebraicos explícitos**, sin omitir ninguno, hasta llegar al resultado o demostración.

- Nunca escribas "es fácil ver que…" ni "trivialmente…" ni saltes álgebra. Muestra cada línea.
- Cada paso justifica qué identidad o regla se aplicó (nota al margen o línea de comentario).
- Los pasos rutinarios (sustituir, factorizar, simplificar) se muestran igual.
- Cuando una cantidad se evalúe en un punto concreto (p. ej. "en los ceros no triviales"), **calcúlala con números reales** y muestra el valor. No la dejes en abstracto.
- El lector es ingeniero con análisis complejo y numérico, algo oxidado: no diluyas la matemática, pero no asumas ningún paso.
- Cada tema PUEDE cerrar con una referencia opcional de profundización (Apostol *Introduction to Analytic Number Theory*, Titchmarsh *The Theory of the Riemann Zeta-Function*, Edwards *Riemann's Zeta Function*). Es complementaria — la app es 100% autocontenida.

## 2. Patrón acordeón (interacción central)

Cada ecuación o principio = titular plegable.
- Titular: nombre del principio + la ecuación renderizada con **KaTeX** (LaTeX real, nunca monoespaciado) + flechita ▸.
- Al desplegar: la derivación completa paso a paso (regla 1).
- Al plegar: el lector sigue el hilo del módulo sin saturación.
- Implementa con estado de React; no uses `display:none` que rompa accesibilidad — usa render condicional o aria-expanded correcto.

## 3. Gráficas: TODA gráfica es interactiva

Prohibido el gráfico decorativo o estático.
- Cada gráfica lleva controles sobre los parámetros de su ecuación: sliders (σ, t), arrastre de puntos en el plano complejo, zoom, animación play/pausa.
- El valor de cada parámetro siempre visible junto a su control.
- El usuario modifica y *ve* cómo responde la curva/superficie en tiempo real.
- **Domain coloring de ζ → shader WebGL** (la GPU calcula los píxeles en paralelo para interactividad fluida). No lo hagas píxel-a-píxel en CPU.
- Gráficas de línea (π(x), |ζ(1/2+it)|, Z de Hardy) → Plotly o D3.
- Color con significado matemático, no estético: la fase del complejo codifica color en domain coloring; la línea crítica usa SIEMPRE el mismo color en toda la app.

## 4. UX/UI — app de aprendizaje, no comercial

**ESCRITORIO PRIMERO.** Diseña y maqueta para navegadores de escritorio (laptops/computadoras) con **layouts horizontales**. NO priorices móvil en esta fase. Aprovecha el ancho: patrón de dos columnas "ecuación/derivación a un lado, gráfica interactiva al otro" donde aporte. La versión móvil viene después como adaptación; no recortes ni comprometas la experiencia de escritorio por anticiparla. Ancho de referencia: viewport de laptop (≥1280px).

Referencia: Mathspace (contenido adaptativo, pistas por paso, ayuda just-in-time). NO es e-commerce ni app infantil.

**Descartar siempre:** gamificación llamativa, colores cartoon brillantes, animaciones decorativas, CTAs tipo venta, cualquier elemento que compita con el contenido por la atención.

**Principios:**
- Minimalismo que no distrae. Superficies planas, sin gradientes/sombras dramáticas/glow. El contenido (ecuaciones, gráficas) es el protagonista.
- Ayuda just-in-time: profundidad a un clic (acordeones), nunca impuesta.
- Retroalimentación inmediata y específica en ejercicios: comprobación al instante, indica en qué paso está el error.
- Progreso visible pero sobrio (check discreto de sección completada, no estrellas llamativas).
- Carga cognitiva baja: un concepto por pantalla, espaciado generoso.
- Modo claro y oscuro (oscuro valioso para sesiones nocturnas largas).

**Paleta:**
- Base neutra: blancos/grises muy claros (claro), grises oscuros profundos (oscuro). Nada saturado de fondo.
- UN color de acento (azul o teal — calma y foco) para interacción: enlace activo, slider en foco, botón primario.
- Semánticos con parquedad: verde=correcto, ámbar=pista/atención, rojo=error puntual. Nunca decorativos.

**Botones y controles:**
- Esquinas suaves, radio pequeño y consistente. Estilo outline o relleno sutil — NO botones llamativos de e-commerce.
- Un solo botón primario por vista; resto secundarios/fantasma.
- **Sentence case** en todo. Nunca TODO MAYÚSCULAS ni Title Case.
- Bordes hairline. Sliders con pista fina, thumb claro, valor visible.
- Controles de una gráfica agrupados y etiquetados, junto a la gráfica que afectan.

**Tipografía:**
- Texto: sans de alta legibilidad (Inter o Figtree).
- Matemática: fuente serif de KaTeX (estilo Computer Modern) — lo que el ojo entrenado espera.
- Dos pesos (regular/medium). Jerarquía por tamaño, no por exceso de negritas.
- Tres capas visualmente distinguibles: intuición / formal / avanzado (opcional, plegado por defecto).

## 5. Honestidad intelectual (transversal)

- La HR NO está demostrada. Nunca la presentes como hecho.
- Enseña explícitamente que "verificar billones de ceros no es una prueba".
- Los preprints recientes que se autodenominan "proof of RH" se tratan como intentos NO validados por la comunidad. Nunca los presentes como resueltos.

## 6. Stack de referencia

React + Vite · KaTeX (ecuaciones) · Plotly/D3 (líneas) · WebGL shader (domain coloring) · datos de ceros precalculados con Python+mpmath servidos como JSON estático. Sitio estático, sin backend corriendo. Tras instalar, correr `npx autoskills` para los skills de framework.

## 7. Tests obligatorios en cada fase

Cada fase incluye su suite de tests con **Vitest** (+ React Testing Library para componentes) y NO se declara terminada hasta que **todos pasan al 100%**. Para piezas matemáticas, validar contra valores conocidos: ζ(2)=π²/6, ζ(0)=−1/2, primer cero no trivial en t≈14.134725, etc. Reportar el resultado de los tests al cerrar cada fase. Si algo falla, corregir antes de avanzar.
