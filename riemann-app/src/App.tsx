import { createHashRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './components/ThemeProvider'
import { ProgressProvider } from './components/ProgressProvider'
import { routes } from './router'

// HashRouter: la app es un sitio estático (puede servirse desde cualquier subruta sin
// reescritura de servidor); el hash evita 404 al recargar.
const router = createHashRouter(routes)

/**
 * Raíz de la app: providers de tema y progreso (estado a nivel de toda la app) envolviendo
 * el router. El layout y la navegación viven en AppShell (ruta raíz).
 */
export default function App() {
  return (
    <ThemeProvider>
      <ProgressProvider>
        <RouterProvider router={router} />
      </ProgressProvider>
    </ThemeProvider>
  )
}
