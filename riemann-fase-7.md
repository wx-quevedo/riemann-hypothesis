# Fase 7 — Módulo 5 (estado del arte) + Lector de papers
### Instrucciones para el agente de construcción (Claude Code)

**Objetivo:** la última fase de contenido. El **Módulo 5** lleva al usuario al estado del arte de la HR (verificación computacional, conexión GUE/matrices aleatorias, enfoques teóricos actuales, y la lección central "evidencia ≠ prueba"), con G7 (estadística de espaciados vs GUE). Y el **Lector de papers**, que cumple el objetivo original del proyecto: acompañamiento para leer papers académicos sobre la HR desmontándolos.

**Contexto obligatorio:** lee `riemann-roadmap.md` (mandatos; §3 M5; M6 honestidad — CRÍTICO aquí). Usa `zeros.json`. Datos verificados a 2026 abajo.

---

## Parte A — Módulo 5: estado del arte (datos verificados a 2026)

Tres capas (M1):
- **Intuición:** ¿qué sabemos hoy? Miles de millones de ceros verificados, todos en la línea crítica. Una conexión asombrosa con la física (matrices aleatorias). Pero NINGUNA prueba. Y la lección: por qué tanta evidencia no basta.
- **Formal / contenido:**

  **1. Verificación computacional.** Rigurosa hasta altura ~3×10¹² (Platt, 2021); los primeros 10¹³ ceros (Gourdon–Demichel, 2004). Todos sobre Re(s)=½ hasta hoy. **Nota:** verificar N ceros confirma la HR *hasta esa altura*, no en general — quedan infinitos.

  **2. Conexión GUE / matrices aleatorias (Montgomery–Dyson–Odlyzko).** La historia: Montgomery estudió la correlación de pares de los espaciados entre ceros; Dyson reconoció que coincidía con la de los autovalores del Gaussian Unitary Ensemble (matrices hermíticas aleatorias). Odlyzko lo confirmó numéricamente a gran escala (ceros cerca del 10¹² y 10²⁰). Implica "repulsión de niveles": los ceros no están distribuidos al azar, se evitan como autovalores. Sugiere un operador hermítico subyacente cuyos autovalores serían los ceros (Hilbert–Pólya).
  - Anécdota (té en el IAS, 1972): incluir como caja de color, hace el contenido memorable.

  **3. Enfoques teóricos actuales (panorama, no demostraciones):**
     - **Hilbert–Pólya:** buscar un operador autoadjunto cuyos autovalores sean los γ. La HR seguiría de que el operador es hermítico (autovalores reales).
     - **Berry–Keating:** modelo H=xp (posición·momento) como candidato a ese Hamiltoniano; conexión con caos cuántico. Sin construcción rigurosa.
     - **Connes:** geometría no conmutativa; la fórmula explícita de Weil como fórmula de traza; la HR como condición de positividad. Análoga a la HR para cuerpos finitos (probada vía Weil/Grothendieck).
     - **GRH y Langlands:** la HR generalizada a L-funciones; parte del programa de Langlands.

  **4. La lección central (M6, destacada).** Evidencia numérica ≠ prueba. Históricamente, conjeturas con respaldo numérico enorme resultaron falsas (mencionar el ejemplo de Li(x)−π(x): parece siempre positivo en todo cómputo, pero Littlewood probó que cambia de signo infinitas veces; el primer cruce está más allá de 10³¹⁶, nunca visto). Esto enseña *por qué* la HR sigue siendo conjetura pese a 10¹³ ceros.

  **5. "Pruebas" recientes y ML (M6 — manejar con cuidado).** Hay un flujo de preprints (2025) que se autodenominan pruebas de la HR, y trabajos de machine learning sobre los ceros. Presentarlos honestamente: NINGUNO está validado por la comunidad matemática. Los de ML son exploraciones empíricas que "refuerzan la RH sin producir prueba formal". Enseñar *por qué validar una prueba es tan difícil* (requiere revisión por pares experta, no un veredicto rápido). NUNCA presentar ninguno como resuelto.

- **G7 — Estadística de espaciados vs GUE** (Plotly, interactiva): histograma de los espaciados normalizados de los ceros (de `zeros.json`) superpuesto a la curva de distribución GUE (Wigner surmise ≈ (32/π²)s²exp(−4s²/π) como aproximación, o la fórmula de repulsión). El usuario ve que los ceros reales siguen la ley GUE — repulsión, no aleatoriedad pura. Control: número de ceros incluidos. Ground truth: con los primeros ~1000 ceros, el espaciado medio normalizado ≈ 1, std consistente con GUE.

## Parte B — Lector de papers (cumple el objetivo original)

Una sección que enseña a leer papers de la HR desmontándolos. Estructura:
- **Marco didáctico:** cómo abordar un paper de teoría analítica de números (qué es el abstract, cómo leer el enunciado principal, identificar qué asume y qué prueba, distinguir resultado condicional —"asumiendo la HR…"— de incondicional).
- **Paper(s) modelo desmontado(s):** elegir 1–2 papers reales accesibles y explicarlos por capas (intuición → qué hacen → cómo). Candidatos verificados:
  - Un survey reciente de la HR (p. ej. el de 2025 en *Symmetry*, MDPI) — bueno como puerta de entrada.
  - La conexión GUE/Odlyzko como caso donde un paper computacional usa **exactamente** lo que el usuario construyó: precálculo de ceros con mpmath a alta precisión y análisis de espaciados. (Un paper de 2024 valida con "los primeros 3000 ceros no triviales, mpmath 50 dígitos" — puente perfecto con la Fase 2 de este proyecto.)
- **Conexión con la app:** señalar que G7 reproduce, a pequeña escala, el análisis de espaciados que hacen los papers de GUE. El usuario ya *hizo* ciencia del estado del arte.
- **Honestidad (M6):** al reseñar cualquier "prueba" reciente, marcarla como no validada.
- **NO incrustar PDFs ni reproducir texto de papers** (copyright): enlazar a las fuentes (arXiv, DOI) y explicar con palabras propias. Resúmenes breves, sin copiar.

### Ejercicios Módulo 5
- Numérico: calcular el espaciado medio de los primeros N ceros (de zeros.json) y compararlo con la predicción; ver cómo se acerca a la ley GUE al subir N.
- Conceptual: ¿por qué 10¹³ ceros verificados no demuestran la HR? (la lección de Li−π).
- Lectura: dado el abstract de un paper (provisto), identificar si su resultado es condicional o incondicional.

---

## Tests de la fase (M9 — obligatorio)
Vitest. NO cierra hasta 100%.
- **Estadística de espaciados:** el espaciado medio normalizado de los primeros N ceros (de zeros.json) ≈ 1 (tol razonable); la función de la curva GUE (Wigner) evaluada da valores correctos (máximo cerca de s≈0.8, →0 en s=0 y s→∞).
- **G7:** monta y el control de N actualiza el histograma; la curva GUE se dibuja.
- **Componentes:** M5 renderiza las capas; la lección "evidencia ≠ prueba" y la nota de "pruebas no validadas" (M6) aparecen; el lector de papers monta con los enlaces (no PDFs incrustados).
- **Honestidad:** test que verifique que el enunciado de la HR en M5 NO aparece como "demostrada/resuelta" (buscar ausencia de afirmaciones de prueba).

---

## Criterios de aceptación de la Fase 7
- [ ] Módulo 5 completo: verificación computacional, GUE (con la historia Montgomery–Dyson–Odlyzko), enfoques actuales (Hilbert–Pólya, Berry–Keating, Connes, GRH), y la lección "evidencia ≠ prueba" (M6).
- [ ] "Pruebas" recientes y ML presentadas como NO validadas (M6).
- [ ] G7 interactiva: espaciados de ceros reales vs ley GUE.
- [ ] Lector de papers: marco para leer papers + 1–2 desmontados, con la conexión a la Fase 2 del propio proyecto. Sin reproducir texto con copyright; enlaces a fuentes.
- [ ] Ejercicios con comprobador; KaTeX; paso a paso.
- [ ] `npm run test` 100%; `npm run build` y `npm run lint` limpios.

## Lo que NO se hace en Fase 7
- No pulido final (Fase 8: accesibilidad, rendimiento, consistencia).
- No incrustar ni reproducir contenido con copyright de los papers.
- No afirmar que ninguna "prueba" reciente es válida.

## Nota
Tras esta fase, los 6 módulos + lector de papers están completos. Solo queda la Fase 8 (pulido) y, a futuro, la Fase 9 (adaptación móvil). El proyecto será funcionalmente completo.
