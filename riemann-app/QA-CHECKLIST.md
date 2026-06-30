# QA — checklist de validación visual (Fases 8–9)

Lista para tu recorrido como estudiante. Lo automatizable ya está cubierto por los 122 tests de
Vitest; aquí va lo que **solo se confirma con el ojo** (gráficas con GPU/canvas, modos de color, y
el comportamiento táctil/responsive de la Fase 9). Recórrela en **modo claro y oscuro** (toggle
arriba a la derecha). Arranca con `npm run dev` y abre cada ruta por su hash.

## Gráficas (lo diferido de fases 4–7)

- [ ] **G3 — domain coloring** (`/#/modulo/2`)
  - [ ] Los ceros se ven como **vórtices circulares** desde el inicio (vista isotrópica), no bandas horizontales.
  - [ ] Sobre el eje real (t≈0) aparecen los **ceros triviales** (−2, −4, −6, …) y el **polo** brillante en s=1.
  - [ ] **Zoom (rueda)** y **pan (arrastre)** responden fluidos; el lector de cursor muestra σ+it y |ζ| en vivo.
  - [ ] La **línea crítica** Re(s)=½ está marcada a trazos (blanco) y los ρₙ etiquetados.
  - [ ] "Reiniciar vista" recoloca la vista isotrópica.

- [ ] **G4 — |ζ(½+it)|** y **G5 — función Z de Hardy** (`/#/modulo/3`)
  - [ ] En G4, la curva **toca cero** justo en cada marca ρₙ.
  - [ ] En G5, **Z(t) cruza el eje** (cambia de signo) en cada ρₙ; la envolvente gris ±|ζ| coincide con G4.
  - [ ] El slider de t máx extiende ambas curvas y las marcas siguen alineadas con los datos.

- [ ] **G6 — fórmula explícita** (`/#/modulo/4`)
  - [ ] Al **subir N** (o pulsar **reproducir**) la aproximación teal gana ondas y **emergen los escalones** de la escalera ψ.
  - [ ] Cerca de un salto (p. ej. **x=25**) la curva **oscila** aunque suba N: es Gibbs (la nota lo dice).
  - [ ] El check "última onda" muestra el aporte del último cero.

- [ ] **G7 — espaciados vs GUE** (`/#/modulo/5`)
  - [ ] El **histograma** de los ceros reales sigue la **curva GUE** (Wigner): casi nada cerca de s=0 (repulsión).
  - [ ] El "espaciado medio ≈ 1" se mantiene al mover el nº de ceros.

## Consistencia visual y modos (Parte A)

- [ ] **Un solo acento teal** en interacción (sliders, botón primario, enlaces activos) en toda la app.
- [ ] La **línea crítica** usa el mismo color allí donde se dibuja (G3); los marcadores de ceros, color coherente en G4/G5.
- [ ] **Modo claro y oscuro**: ningún texto queda invisible; las gráficas (incl. el fondo oscuro de G3) se leen bien en ambos.
- [ ] Tipografía: Inter en texto, serif de KaTeX en matemática; ecuaciones anchas (ecuación funcional) no desbordan.

## Accesibilidad (Parte B)

- [ ] **Teclado**: tabular llega a sliders, botones, acordeones y toggles; el foco es visible.
- [ ] **Lector de pantalla**: cada gráfica tiene descripción (aria-label), no solo "gráfica".
- [ ] **Movimiento reducido**: con `prefers-reduced-motion` activado en el SO, G6 no autoanima (oculta "reproducir" y sugiere el slider).

## Robustez (Parte D)

- [ ] Si tu navegador no diera WebGL (G3) o Canvas2D (G6), aparece un **fallback** claro y el resto del módulo sigue.
- [ ] Un fallo de una gráfica no tumba el módulo (error boundary por gráfica).

## Mandatos (Parte E) — revisión hecha

- [x] **M1** derivaciones paso a paso (Li(x), producto de Euler, onda real, continuación ζ–η, ceros triviales).
- [x] **M3** las 7 gráficas responden a sus controles.
- [x] **M4** cada módulo tiene su gráfica (G1…G7).
- [x] **M6** la HR siempre como conjetura no demostrada; "pruebas" recientes/ML como no validadas (tests lo verifican).
- [x] **Li(x)/li(x)** coherente entre Módulo 0 y Módulo 4 (li desde 0; se nombra el offset Li).

---

## QA responsive (Fase 9) — teléfono y tablet, en claro y oscuro

**Validar en dispositivos REALES** (un teléfono ~390px y una tablet ~768px), no solo el emulador del
navegador: el touch real revela cosas que el emulador no (la nota del archivo de fase). Para cada
punto, comprobarlo en **modo claro y oscuro**. Prioridad #1: en **desktop (≥1280px) todo se ve
idéntico a antes** (regresión cero).

### Layout y navegación (Parte A)

- [ ] **Teléfono/tablet:** la barra lateral desaparece y arriba a la izquierda aparece el botón **☰**.
- [ ] Pulsar ☰ abre el **drawer** lateral; se cierra al tocar fuera, al pulsar **✕**, al elegir un módulo o con **Esc**.
- [ ] El drawer marca el módulo activo y los completados (✓), igual que la lateral de desktop.
- [ ] El **header** (marca + "Modo claro/oscuro") cabe sin romperse en ~390px.
- [ ] En **cada módulo** (0–5 + lector) el layout "concepto | gráfica" **apila** en una columna (concepto arriba, gráfica abajo).
- [ ] El contenido no queda pegado a los bordes (padding lateral cómodo).
- [ ] **Desktop ≥1280px:** la lateral sigue fija, sin ☰, con el mismo aspecto de la Fase 8.

### Ecuaciones (Parte B)

- [ ] Las ecuaciones anchas (ecuación funcional en **M3**, fórmula explícita en **M4**) **no desbordan**: tienen su propia **barra de scroll horizontal** fina.
- [ ] Deslizar la ecuación a lo ancho **no** mueve verticalmente la página; el scroll vertical sigue funcionando al deslizar fuera de la ecuación.
- [ ] Las ecuaciones inline fluyen con el texto (wrap natural), sin barras.

### Gráficas táctiles (Parte C)

- [ ] **G3 (M2):** un dedo **arrastra** (pan); dos dedos **pellizcan** para zoom; los botones Acercar/Alejar/Reiniciar siguen funcionando.
- [ ] G3 no "pelea" con el scroll: al arrastrar sobre el lienzo se mueve el plano, no la página; al tocar al borde aparecen las **coordenadas** (σ+it, |ζ|).
- [ ] G3 cabe en pantalla con sus controles (altura reducida en móvil), sin scroll infinito.
- [ ] **G1/G2/G4/G5/G7 (Plotly):** pinch-zoom y arrastre funcionan; la curva se reajusta al ancho; la barra de Plotly no estorba (oculta en táctil).
- [ ] **G6 (M4):** el slider de N y el botón reproducir/pausa son cómodos al dedo; el lienzo ocupa el ancho disponible.

### Ergonomía y tipografía (Partes D y E)

- [ ] Todos los controles (botones, sliders, acordeones, checkboxes, "Comprobar") se tocan cómodos (~44px); ningún objetivo diminuto.
- [ ] Al enfocar el **input de un ejercicio**, iOS **no** hace zoom (texto ≥16px en táctil).
- [ ] El texto del cuerpo se lee sin forzar la vista; la jerarquía intuición/formal/avanzado se distingue en pantalla pequeña.
- [ ] **Claro y oscuro** correctos en móvil en todas las vistas (sin texto invisible ni gráficas rotas).

### Orientación

- [ ] Girar el teléfono (portrait ↔ landscape) reajusta las gráficas (Plotly responsive; G3/G6 remiden) sin romper el layout.
