import { lazy } from 'react'

// Componentes de módulo cargados de forma diferida (React.lazy), aislados en su propio archivo
// para que `router.tsx` no mezcle exports de componentes y de datos (regla react/only-export-components).
export const Module0 = lazy(() => import('./Module0'))
export const Module1 = lazy(() => import('./Module1'))
export const Module2 = lazy(() => import('./Module2'))
export const Module3 = lazy(() => import('./Module3'))
export const Module4 = lazy(() => import('./Module4'))
export const Module5 = lazy(() => import('./Module5'))
export const PapersReader = lazy(() => import('./PapersReader'))
