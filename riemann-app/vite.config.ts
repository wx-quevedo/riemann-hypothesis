import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/  ·  Tests con Vitest (M9): entorno jsdom + React Testing Library.
export default defineConfig({
  base: '/riemann/',
  plugins: [react()],
  build: {
    // Fase 8: usamos el bundle "basic" de Plotly (~1.1 MB; solo scatter+bar). Lo aislamos en su
    // propio chunk (cacheable aparte) junto con KaTeX y el router; los módulos cargan de forma
    // diferida (React.lazy). Con todo eso el umbral de aviso baja a un valor real.
    chunkSizeWarningLimit: 1300,
    rollupOptions: {
      output: {
        // Separa dependencias pesadas en chunks propios para cachearlas aparte y mantener el
        // bundle principal de la app pequeño.
        manualChunks(id) {
          if (id.includes('node_modules/plotly')) return 'plotly'
          if (id.includes('node_modules/katex')) return 'katex'
          if (id.includes('node_modules/react-router')) return 'router'
          return undefined
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    clearMocks: true,
    css: false,
    alias: {
      // Plotly no funciona en jsdom (sin canvas/WebGL): se sustituye por un stub no-op en tests.
      'plotly.js-basic-dist-min': fileURLToPath(new URL('./src/test/plotly-stub.ts', import.meta.url)),
    },
  },
})
