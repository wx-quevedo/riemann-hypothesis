"""Precálculo offline de datos matemáticos de alta precisión (Fase 2).

Genera, con Python + mpmath, los JSON estáticos que la app consume en runtime
(road map §6 — arquitectura híbrida: mpmath calcula offline con precisión arbitraria;
en el navegador la app SOLO lee estos JSON, nunca llama a Python):

  public/data/zeros.json                 -> primeros N ceros no triviales de ζ (parte
                                            imaginaria t; la parte real es 1/2 por
                                            construcción, hipótesis de Riemann).
  public/data/zeta_special_values.json   -> valores especiales de ζ para tests y módulos.

Reproducible por diseño: misma N y mismos dps ⇒ archivos byte-idénticos en cada corrida
(cómputo determinista de mpmath + serialización JSON estable, sin marcas de tiempo).

Uso:
    python scripts/precompute_zeros.py            # N por defecto (1000), dps=30
    python scripts/precompute_zeros.py 200        # override de N (no cambia el resto)

Valores conocidos para validar (los comprueba scripts/test_precompute.py):
    primer cero no trivial t ≈ 14.1347251417,  ζ(2)=π²/6,  ζ(0)=−1/2,  ζ(−1)=−1/12.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

from mpmath import mp, zeta, zetazero

# --- Parámetros de la fase ----------------------------------------------------
DEFAULT_N = 1000          # primeros N ceros (punto de partida cómodo, road map / fase 2)
WORKING_DPS = 30          # precisión de trabajo: 30 dígitos decimales (sobra para float64)
RE_CRITICAL = 0.5         # parte real de los ceros no triviales (línea crítica)

ROOT = Path(__file__).resolve().parents[1]        # .../riemann-app
DATA_DIR = ROOT / "public" / "data"


def compute_zeros(n: int) -> list[dict]:
    """Devuelve [{n, t}] con la parte imaginaria t de los primeros `n` ceros.

    Fuente: mpmath.zetazero(k). t se guarda como float64 (la precisión relevante en
    cliente; el navegador trabaja en float64). El cálculo se hace a WORKING_DPS dps.
    """
    zeros: list[dict] = []
    for k in range(1, n + 1):
        t = zetazero(k).imag          # mpf a WORKING_DPS
        zeros.append({"n": k, "t": float(t)})
        if k % 100 == 0:
            print(f"  ... {k}/{n} ceros", file=sys.stderr)
    return zeros


def compute_special_values() -> list[dict]:
    """Valores especiales de ζ con su forma cerrada (LaTeX) para tests y módulos."""
    specs = [
        (2, r"\dfrac{\pi^2}{6}", None),
        (4, r"\dfrac{\pi^4}{90}", None),
        (6, r"\dfrac{\pi^6}{945}", None),
        (3, None, "Constante de Apéry — sin forma cerrada elemental conocida."),
        (0, r"-\tfrac{1}{2}", None),
        (-1, r"-\tfrac{1}{12}", None),
        (-2, r"0", "Primer cero trivial de ζ."),
        (-3, r"\tfrac{1}{120}", None),
    ]
    values: list[dict] = []
    for s, closed_form, note in specs:
        entry: dict = {"s": s, "value": float(zeta(s))}
        if closed_form is not None:
            entry["closed_form"] = closed_form
        if note is not None:
            entry["note"] = note
        values.append(entry)
    return values


def write_json(path: Path, obj: object) -> None:
    """Serialización JSON estable (determinista) con salto de línea final."""
    text = json.dumps(obj, ensure_ascii=False, indent=2) + "\n"
    path.write_text(text, encoding="utf-8")


def build(n: int = DEFAULT_N, out_dir: Path = DATA_DIR) -> dict[str, Path]:
    """Genera los JSON en `out_dir`. Devuelve las rutas escritas."""
    mp.dps = WORKING_DPS
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"Calculando {n} ceros no triviales a dps={WORKING_DPS} ...", file=sys.stderr)
    zeros = compute_zeros(n)
    zeros_doc = {
        "description": "Primeros N ceros no triviales de la función zeta de Riemann.",
        "source": "mpmath.zetazero(n).imag",
        "count": len(zeros),
        "precision_dps": WORKING_DPS,
        "re": RE_CRITICAL,
        "zeros": zeros,
    }
    zeros_path = out_dir / "zeros.json"
    write_json(zeros_path, zeros_doc)

    special_doc = {
        "description": "Valores especiales de ζ(s) para validación y para mostrar en módulos.",
        "source": "mpmath.zeta(s)",
        "precision_dps": WORKING_DPS,
        "values": compute_special_values(),
    }
    special_path = out_dir / "zeta_special_values.json"
    write_json(special_path, special_doc)

    return {"zeros": zeros_path, "special": special_path}


def main(argv: list[str]) -> int:
    n = DEFAULT_N
    if len(argv) > 1:
        n = int(argv[1])
    paths = build(n)
    for key, path in paths.items():
        print(f"escrito {key}: {path.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
