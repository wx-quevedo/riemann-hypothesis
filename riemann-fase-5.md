# Fase 5 — Módulos 2 y 3 completos (continuación analítica, ceros, el enunciado de la HR)
### Instrucciones para el agente de construcción (Claude Code)

**Objetivo:** el contenido didáctico real de los Módulos 2 y 3 — donde ζ deja de ser una imagen y se entiende: continuación analítica, ecuación funcional, ceros triviales y no triviales, y por fin **el enunciado de la Hipótesis de Riemann**. Más las gráficas G4 (|ζ(½+it)|) y G5 (función Z de Hardy), la otra forma de ver los ceros: como cruces por cero de una función real.

**Contexto obligatorio:** lee `riemann-roadmap.md` (mandatos M1–M9; §3 contenido M2/M3; nota de Fase 4 sobre INITIAL_VIEW isotrópico). Usa los componentes existentes, `zetaComplex.ts`, `zeros.json`. El Módulo 2 ya tiene G3 (domain coloring) e intro mínima; aquí se completa.

---

## Parte 0 — Ajuste pendiente de Fase 4 (hacerlo primero)
- **`INITIAL_VIEW` isotrópico** en `domainColoring.ts`: ajustar el rectángulo inicial para que la proporción (σmax−σmin):(tmax−tmin) coincida con la proporción ancho:alto del canvas. Así los ceros se ven como vórtices circulares desde el inicio, no bandas horizontales. (El usuario validó G3 y pidió esto.) Mantener centrado en la zona de los primeros ceros + el polo.

## Parte A — Módulo 2 completo (Plano complejo y continuación analítica)

Tres capas (M1 paso a paso):
- **Intuición:** la serie Σ1/nˢ solo vive en Re(s)>1, pero ζ se extiende de forma ÚNICA a casi todo ℂ (analogía: una función analítica está "rígidamente determinada" — conocerla en una región la fija en todas partes donde sea analítica).
- **Formal (acordeones):**
  - Por qué la serie diverge para Re(s)≤1 (recordar el límite de Fase 3).
  - **Continuación analítica vía η de Dirichlet** (ya implementada): η(s)=Σ(−1)^(n−1)/nˢ converge para Re(s)>0; ζ(s)=η(s)/(1−2^(1−s)). Esto YA extiende ζ a la franja crítica. Mostrar la derivación de la relación ζ–η paso a paso (factorizar los términos pares: ζ(s)−η(s) = 2·Σ_{pares} = 2^(1−s)ζ(s) → despejar).
  - El **polo simple en s=1** (la serie armónica diverge); ζ(0)=−½ como valor de la continuación.
- **Avanzado (plegado):** mención de que la continuación a TODO ℂ (Re(s)≤0) usa la ecuación funcional (puente al Módulo 3).
- **G3:** ya está; aplicar el ajuste isotrópico de la Parte 0.

## Parte B — Módulo 3 completo (Ceros triviales y no triviales + enunciado HR)

Tres capas:
- **Intuición:** ζ vale 0 en ciertos puntos. Unos "aburridos" (triviales, sobre el eje real negativo), otros "profundos" (no triviales, en la franja). La HR es una afirmación sobre dónde están exactamente los profundos.
- **Formal (acordeones, M1):**
  - **Ecuación funcional:** ζ(s) = 2ˢ π^(s−1) sin(πs/2) Γ(1−s) ζ(1−s). Explicar cada factor; el papel de sin(πs/2) (se anula en pares → genera los ceros triviales) y de Γ (sus polos). Mostrar cómo la ecuación relaciona s con 1−s (simetría respecto a Re(s)=½).
  - **Ceros triviales:** en s=−2,−4,−6,… Verificado: ζ(−2)=ζ(−4)=0. Derivar por qué: en la ecuación funcional, sin(πs/2)=0 para s par negativo, y ζ(1−s) es finito ahí → ζ(s)=0.
  - **Franja crítica** 0<Re(s)<1 y **línea crítica** Re(s)=½ (eje de simetría de la ecuación funcional).
  - **Ceros no triviales:** los de la franja. Los primeros en t=14.1347, 21.0220, 25.0109,… (de zeros.json).
  - **ENUNCIADO DE LA HR (destacado, M6):** *todos los ceros no triviales de ζ tienen parte real exactamente ½.* Presentar con la nota de honestidad: es una CONJETURA, no demostrada; verificada para miles de millones de ceros, sin prueba general.
- **Avanzado (plegado):** la simetría de los ceros (si ρ es cero, también 1−ρ, ρ̄, 1−ρ̄), consecuencia de la ecuación funcional y de coeficientes reales.

### Gráficas del Módulo 3

**G4 — |ζ(½+it)|** (Plotly, interactiva): módulo de ζ sobre la línea crítica, slider/rango de t. Los ceros = puntos donde la curva TOCA cero. Ground truth verificado:
| t | \|ζ(½+it)\| |
|---|------------|
| 5 | 0.73886 |
| 10 | 1.54919 |
| 14.1347 | ≈0 (ρ₁) |
| 18 | 2.33680 |
| 21.022 | ≈0 (ρ₂) |
| 25 | 0.0149 (cerca de ρ₃=25.0109) |

**G5 — Función Z de Hardy** (Plotly, interactiva): la estrella didáctica de este módulo. Z(t) es REAL y sus cruces por cero SON los ceros de ζ en la línea crítica. Más fácil de "ver" que |ζ| porque cambia de signo. Implementar Z(t) en JS (Z(t)=e^{iθ(t)}ζ(½+it), real; usar la fórmula de Riemann–Siegel theta para θ, o derivar Z de ζ compleja: Z(t)=ζ(½+it)·e^{iθ(t)} tomando parte real). Ground truth verificado (cambia de signo en cada cero):
| t | Z(t) |
|---|------|
| 5 | −0.73886 |
| 10 | −1.54919 |
| 14 | −0.10563 |
| 14.1347 | ≈0 (cruce → ρ₁) |
| 15 | +0.71994 |
| 18 | +2.33680 |
| 21.022 | ≈0 (cruce → ρ₂) |
| 23 | −1.45463 |
- Nota didáctica: para t donde no hay cruce cercano, |Z(t)|=|ζ(½+it)| (G4 es la envolvente de G5). Conectar ambas gráficas visualmente.

### Ejercicios Módulo 3
- Verificar ζ(−2)=0 usando la ecuación funcional (a mano, con la pista de sin(πs/2)).
- Localizar ρ₁ en G5 contando el cruce por cero; comparar con el valor exacto de zeros.json.
- Conceptual: ¿por qué la línea crítica es Re(s)=½ y no otra? (la simetría s↔1−s de la ecuación funcional).

---

## Tests de la fase (M9 — obligatorio)
Vitest. NO cierra hasta 100%.
- **Z de Hardy en JS:** Z(5)≈−0.739, Z(18)≈+2.337, Z(23)≈−1.455 (tol 1e-2); cambio de signo entre t=14 y t=15 (cruce en ρ₁); entre t=20.5 y t=21.5 (ρ₂).
- **|ζ(½+it)|:** valores de la tabla G4 (tol 1e-2, salvo los ceros: <0.05).
- **Ecuación funcional:** verificar ζ(s)=χ(s)ζ(1−s) en un punto sin polos (p. ej. s=3 o s=0.5+5i), tol 1e-3. (Evitar s entero par positivo: Γ(1−s) tiene polo.)
- **Ceros triviales:** |ζ(−2)|<1e-6, |ζ(−4)|<1e-6.
- **Componentes:** M2 y M3 renderizan sus tres capas; el enunciado de la HR aparece con la nota de "no demostrada" (M6); G4 y G5 montan y responden al rango de t; el acordeón de la ecuación funcional abre.
- **INITIAL_VIEW isotrópico:** test que verifique que la proporción σ:t de INITIAL_VIEW coincide (con tolerancia) con la proporción del canvas objetivo.

---

## Criterios de aceptación de la Fase 5
- [ ] INITIAL_VIEW isotrópico aplicado (vórtices circulares de inicio).
- [ ] Módulo 2 completo: continuación analítica vía η derivada paso a paso, polo en s=1, 3 capas.
- [ ] Módulo 3 completo: ecuación funcional, ceros triviales derivados, franja/línea crítica, **enunciado HR con nota de honestidad (M6)**.
- [ ] G4 (|ζ(½+it)|) y G5 (Z de Hardy) interactivas, con los ceros visibles como toques/cruces.
- [ ] Ejercicios del M3 con comprobador.
- [ ] Ecuaciones en KaTeX (M5); derivaciones paso a paso (M1).
- [ ] `npm run test` 100%; `npm run build` y `npm run lint` limpios.
- [ ] (Validación visual del usuario en navegador: G4/G5 muestran los ceros; INITIAL_VIEW isotrópico se ve circular.)

## Lo que NO se hace en Fase 5
- No la fórmula explícita ni G6 (Fase 6).
- No el Módulo 4 ni 5.
- No Riemann–Siegel completo para t grande (si Z se deriva de ζ compleja con η, basta para los primeros ceros; documentar el límite igual que en Fase 4).
