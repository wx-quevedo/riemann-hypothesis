"""Tests de verificación del precálculo (Fase 2, mandato M9).

Valida los JSON generados por precompute_zeros.py contra valores conocidos y mediante
una verificación INDEPENDIENTE con mpmath (recalcula |ζ(½+it)| en los t guardados).

Se puede correr de dos formas:
    python scripts/test_precompute.py     # runner propio (no requiere pytest)
    pytest scripts/test_precompute.py      # si pytest está instalado

No depende de pytest: las funciones test_* las recoge también el runner de __main__.
"""

from __future__ import annotations

import json
from pathlib import Path

from mpmath import mp, mpc, mpf, pi, zeta

mp.dps = 30

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "public" / "data"

# Ground truth (verificado con mpmath), primeros 5 ceros — parte imaginaria t.
GROUND_TRUTH_T = [
    "14.1347251417346937904572519836",
    "21.0220396387715549926284795939",
    "25.0108575801456887632137909926",
    "30.4248761258595132103118975306",
    "32.9350615877391896906623689641",
]

EXPECTED_N = 1000


def _load(name: str) -> dict:
    return json.loads((DATA_DIR / name).read_text(encoding="utf-8"))


def _special_map() -> dict[int, float]:
    doc = _load("zeta_special_values.json")
    return {entry["s"]: entry["value"] for entry in doc["values"]}


# --- Tests --------------------------------------------------------------------

def test_first_five_zeros_match_ground_truth() -> None:
    """Los primeros 5 ceros guardados coinciden con el ground truth (tol ~1e-9)."""
    zeros = _load("zeros.json")["zeros"]
    for i, truth in enumerate(GROUND_TRUTH_T):
        stored = mpf(repr(zeros[i]["t"]))
        diff = abs(stored - mpf(truth))
        assert diff < mpf("1e-9"), f"cero {i+1}: |Δt| = {mp.nstr(diff, 5)} ≥ 1e-9"


def test_structure_is_consistent() -> None:
    """count = N, índices consecutivos 1..N, t estrictamente creciente y positivos."""
    doc = _load("zeros.json")
    zeros = doc["zeros"]
    assert doc["count"] == EXPECTED_N, f"count = {doc['count']} ≠ {EXPECTED_N}"
    assert len(zeros) == EXPECTED_N, f"len(zeros) = {len(zeros)} ≠ {EXPECTED_N}"
    assert doc["re"] == 0.5, "la parte real declarada debe ser 1/2 (línea crítica)"
    prev = 0.0
    for i, z in enumerate(zeros):
        assert z["n"] == i + 1, f"índice no consecutivo en posición {i}: {z['n']}"
        assert z["t"] > 0, f"t no positivo en n={z['n']}"
        assert z["t"] > prev, f"t no creciente en n={z['n']}"
        prev = z["t"]


def test_stored_zeros_annihilate_zeta() -> None:
    """Verificación independiente: |ζ(½ + i·t)| < 1e-8 para los primeros 10 ceros.

    Recalcula ζ con mpmath en los t GUARDADOS: confirma que cada t anula ζ.
    """
    zeros = _load("zeros.json")["zeros"]
    for z in zeros[:10]:
        s = mpc(mpf(1) / 2, mpf(repr(z["t"])))
        magnitude = abs(zeta(s))
        assert magnitude < mpf("1e-8"), (
            f"n={z['n']}: |ζ(½+it)| = {mp.nstr(magnitude, 5)} ≥ 1e-8"
        )


def test_special_values() -> None:
    """ζ(2)=π²/6, ζ(0)=−1/2, ζ(−1)=−1/12 (y ζ(4)=π⁴/90, ζ(−2)=0) dentro de tolerancia."""
    sv = _special_map()
    checks = [
        (2, pi**2 / 6, "1e-12"),
        (4, pi**4 / 90, "1e-12"),
        (0, mpf(-1) / 2, "1e-15"),
        (-1, mpf(-1) / 12, "1e-12"),
        (-2, mpf(0), "1e-15"),
    ]
    for s, expected, tol in checks:
        assert s in sv, f"falta ζ({s}) en zeta_special_values.json"
        diff = abs(mpf(repr(sv[s])) - expected)
        assert diff < mpf(tol), f"ζ({s}): |Δ| = {mp.nstr(diff, 5)} ≥ {tol}"


# --- Runner propio (sin pytest) ----------------------------------------------

def _run_all() -> int:
    tests = [obj for name, obj in sorted(globals().items())
             if name.startswith("test_") and callable(obj)]
    failures = 0
    for fn in tests:
        try:
            fn()
            print(f"PASS  {fn.__name__}")
        except AssertionError as exc:
            failures += 1
            print(f"FAIL  {fn.__name__}: {exc}")
        except Exception as exc:  # noqa: BLE001 — reportar cualquier error inesperado
            failures += 1
            print(f"ERROR {fn.__name__}: {type(exc).__name__}: {exc}")
    total = len(tests)
    print(f"\n{total - failures}/{total} tests Python en verde")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(_run_all())
