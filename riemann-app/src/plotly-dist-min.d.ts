// Plotly (bundle pre-compilado) NO trae tipos propios. Declaración mínima.
// Fase 8: se usa el bundle "basic" (scatter + bar) — ~1.1 MB en vez de ~4.8 MB del completo —
// porque las gráficas de línea/barras (G1, G2, G4, G5, G7) solo necesitan scatter y bar.
declare module 'plotly.js-basic-dist-min' {
  const Plotly: {
    react: (el: HTMLElement, data: unknown[], layout?: unknown, config?: unknown) => Promise<unknown>
    newPlot: (el: HTMLElement, data: unknown[], layout?: unknown, config?: unknown) => Promise<unknown>
    purge: (el: HTMLElement) => void
    Plots: { resize: (el: HTMLElement) => void }
  }
  export default Plotly
}
