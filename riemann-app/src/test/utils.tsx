import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '../components/ThemeProvider'
import { ProgressProvider } from '../components/ProgressProvider'
import { routes } from '../router'

/** Renderiza la app completa (shell + rutas) bajo un MemoryRouter en la ruta indicada. */
export function renderApp(initialPath = '/') {
  const router = createMemoryRouter(routes, { initialEntries: [initialPath] })
  return render(
    <ThemeProvider initial="light">
      <ProgressProvider>
        <RouterProvider router={router} />
      </ProgressProvider>
    </ThemeProvider>,
  )
}

/** Renderiza un componente suelto con los providers de tema y progreso. */
export function renderWithProviders(ui: ReactElement) {
  return render(
    <ThemeProvider initial="light">
      <ProgressProvider>{ui}</ProgressProvider>
    </ThemeProvider>,
  )
}
