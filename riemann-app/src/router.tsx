import type { RouteObject } from 'react-router-dom'
import AppShell from './components/AppShell'
import Home from './components/Home'
import NotFound from './components/NotFound'
// Fase 8 — code-splitting: cada módulo (con sus gráficas pesadas) se carga de forma DIFERIDA al
// navegar a él (React.lazy, definidos en ./modules/lazyModules). El shell, la portada y la 404 van
// eager (se necesitan ya). El <Suspense> que envuelve el contenido vive en AppShell.
import { Module0, Module1, Module2, Module3, Module4, Module5, PapersReader } from './modules/lazyModules'

/**
 * Configuración de rutas. Se exporta como array de RouteObject para reutilizarla tanto con el
 * router real (createHashRouter en App.tsx) como con un MemoryRouter en los tests.
 * El shell (AppShell) es la ruta raíz; cada módulo + el lector de papers son rutas hijas (lazy).
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Home /> },
      { path: 'modulo/0', element: <Module0 /> },
      { path: 'modulo/1', element: <Module1 /> },
      { path: 'modulo/2', element: <Module2 /> },
      { path: 'modulo/3', element: <Module3 /> },
      { path: 'modulo/4', element: <Module4 /> },
      { path: 'modulo/5', element: <Module5 /> },
      { path: 'papers', element: <PapersReader /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]
