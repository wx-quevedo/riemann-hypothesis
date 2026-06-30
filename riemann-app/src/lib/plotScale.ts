// Utilidades PURAS de muestreo y escalado a pantalla, separadas del canvas para que sean
// testeables sin DOM (mismo enfoque que la lógica pura de G3 en domainColoring.ts).

/** `count` valores equiespaciados en [min, max] (inclusive). */
export function sampleRange(min: number, max: number, count: number): number[] {
  if (count < 2) return [min]
  const out: number[] = []
  for (let i = 0; i < count; i++) out.push(min + ((max - min) * i) / (count - 1))
  return out
}

/**
 * Escala lineal dominio→rango: devuelve la función v ↦ rMin + (v−dMin)/(dMax−dMin)·(rMax−rMin).
 * Para el eje Y de pantalla se invierte el rango (rMin = alto−margen, rMax = margen).
 */
export function linearScale(dMin: number, dMax: number, rMin: number, rMax: number): (v: number) => number {
  const span = dMax - dMin || 1
  return (v: number) => rMin + ((v - dMin) / span) * (rMax - rMin)
}
