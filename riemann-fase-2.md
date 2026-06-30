# Fase 2 — Precálculo de ceros y datos matemáticos
### Instrucciones para el agente de construcción (Claude Code)

**Objetivo:** generar, con Python + mpmath, los datos matemáticos de alta precisión que la app consumirá como JSON estático: la lista de los primeros ceros no triviales de ζ y tablas de referencia. Esta es la **primera fase con matemática real**, así que los tests numéricos contra valores conocidos (M9) son el centro de la validación.

**Contexto obligatorio:** lee `riemann-roadmap.md` (mandatos M1–M9; §6 stack híbrido; §8 carpetas). El script vive en `scripts/precompute_zeros.py` (stub creado en Fase 0). La salida va a `public/data/`.

**Recordatorio de arquitectura (§6):** mpmath calcula offline con precisión arbitraria → JSON estático. En runtime, la app NO llama a Python; solo lee los JSON. Esta fase produce esos JSON.

---

## Qué construir

### 1. Entorno Python
- `scripts/requirements.txt` con `mpmath` (y `sympy` si se usa para primos).
- El script debe ser reproducible: correrlo de nuevo regenera idénticos los JSON.
- Precisión de trabajo: `mp.dps = 30` (30 dígitos decimales) — sobra para float64 en cliente y deja margen.

### 2. `scripts/precompute_zeros.py`
Genera estos archivos en `public/data/`:

**`zeros.json`** — primeros N ceros no triviales (empezar con N=1000).
- Para cada cero: índice n, y la parte imaginaria t (la parte real es 1/2 por construcción).
- Guardar t con suficientes decimales (p. ej. 15–20) para uso en cliente.
- Fuente: `mpmath.zetazero(n).imag`.
- Estructura sugerida:
  ```json
  { "count": 1000, "precision_dps": 30,
    "zeros": [ {"n": 1, "t": 14.134725141734694}, ... ] }
  ```

**`zeta_special_values.json`** — valores especiales para tests y para mostrar en módulos.
- ζ(2)=π²/6, ζ(4)=π⁴/90, ζ(0)=−1/2, ζ(−1)=−1/12, ζ(−2)=0 (primer cero trivial), etc.

**`zeta_critical_line.json`** (opcional, si ayuda a G4/G5 luego) — muestreo de |ζ(½+it)| y de la función Z de Hardy en un rango de t (p. ej. 0..50, paso fino). Útil para validar el cálculo en JS de fases futuras contra esta referencia.

### 3. Valores de referencia (GROUND TRUTH) — verificados con mpmath
Estos valores ya están confirmados; úsalos en los tests:

| Cantidad | Valor de referencia |
|----------|---------------------|
| Primer cero ρ₁ (t) | 14.1347251417346937904572519836 |
| Segundo cero ρ₂ (t) | 21.0220396387715549926284795939 |
| Tercer cero ρ₃ (t) | 25.0108575801456887632137909926 |
| Cuarto cero ρ₄ (t) | 30.4248761258595132103118975306 |
| Quinto cero ρ₅ (t) | 32.9350615877391896906623689641 |
| ζ(2) | 1.6449340668482264… (= π²/6) |
| ζ(0) | −0.5 |
| ζ(−1) | −0.0833333… (= −1/12) |
| ζ(4) | 1.0823232337111381… (= π⁴/90) |
| \|ζ(½+i·t₁)\| | ~6.2×10⁻³¹ (≈ 0; confirma cero en línea crítica) |

### 4. Carga en la app (lado TS)
- `src/lib/zeros.ts`: cargar y tipar `zeros.json` (tipo `Zero { n: number; t: number }`).
- Helper para acceder a los primeros k ceros. (No se grafican aún; solo disponibilidad de datos.)
- NO implementar ζ en JS todavía (eso es Fase 3+); esta fase es solo datos precalculados + su carga.

---

## Tests de la fase (M9 — obligatorio)

**Tests de Python** (pytest o asserts en un script de verificación):
- Los primeros 5 ceros de `zeros.json` coinciden con el ground truth (tolerancia ~1e-9).
- `zeros.json` tiene exactamente N entradas, índices consecutivos 1..N, todos los t crecientes y positivos.
- Verificación independiente: para cada uno de los primeros ~10 ceros, |ζ(½+i·t)| < 1e-8 (recalcular con mpmath y confirmar que el t guardado anula ζ).
- Valores especiales: ζ(2)≈π²/6, ζ(0)=−1/2, ζ(−1)=−1/12 dentro de tolerancia.

**Tests de TS** (Vitest):
- `src/lib/zeros.ts` carga el JSON y devuelve objetos bien tipados.
- El primer cero cargado tiene t≈14.1347 (tolerancia 1e-4 en float64).
- El helper de "primeros k" devuelve la cantidad correcta.

La fase NO se cierra hasta que **todos los tests (Python y TS) pasen al 100%**.

---

## Criterios de aceptación de la Fase 2
- [ ] `scripts/precompute_zeros.py` corre y genera `zeros.json` (N=1000) + `zeta_special_values.json` en `public/data/`.
- [ ] El script es reproducible (segunda corrida = mismos archivos).
- [ ] Los primeros 5 ceros coinciden con el ground truth.
- [ ] Verificación |ζ(½+it)|<1e-8 pasa para los primeros ceros.
- [ ] `src/lib/zeros.ts` carga y tipa los datos; test TS en verde.
- [ ] `npm run test` pasa al 100% (incluye los nuevos tests TS).
- [ ] Tests de Python pasan al 100%.
- [ ] `npm run build` y `npm run lint` limpios.

## Lo que NO se hace en Fase 2
- No se implementa ζ(s) en JavaScript (Fase 3+).
- No se grafica nada (los datos quedan disponibles, sin visualizar aún).
- No se escribe contenido didáctico de módulos.
- No domain coloring (Fase 4).

## Nota de profundización
N=1000 ceros es un punto de partida cómodo para los primeros módulos. Si más adelante hace falta llegar más alto (para G7 / estadística GUE), basta subir N y regenerar — el script no cambia. `mpmath.zetazero` es fiable hasta índices muy altos, aunque más lento conforme suben.
