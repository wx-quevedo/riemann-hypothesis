// Setup global de Vitest: registra los matchers de jest-dom en `expect`
// (toBeInTheDocument, etc.) y limpia el DOM tras cada test.
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// jsdom no implementa canvas/WebGL: getContext devuelve null silenciosamente (evita el ruido
// de "Not implemented" y hace que los componentes WebGL — p. ej. DomainColoring — caigan a su
// fallback de forma determinista en los tests).
HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext

afterEach(() => {
  cleanup()
})
