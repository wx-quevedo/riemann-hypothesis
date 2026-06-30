// Stub de Plotly para tests: jsdom no tiene canvas/WebGL ni layout real, así que el Plotly
// auténtico fallaría al montar. Se inyecta vía `test.alias` en vite.config.ts, de modo que
// cualquier test que renderice una gráfica (incluida la app completa) use estos no-ops.
// Los tests que necesitan ESPIAR las llamadas usan su propio vi.mock por archivo.
const Plotly = {
  react: () => Promise.resolve(),
  newPlot: () => Promise.resolve(),
  purge: () => {},
  Plots: { resize: () => {} },
}

export default Plotly
