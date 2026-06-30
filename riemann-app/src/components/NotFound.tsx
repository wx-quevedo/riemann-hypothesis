import { Link } from 'react-router-dom'

/** Ruta no encontrada. Sobria, con vuelta a inicio. */
export default function NotFound() {
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-medium text-slate-900 dark:text-slate-100">Sección no encontrada</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300">La ruta solicitada no existe.</p>
      <Link to="/" className="text-sm text-accent-700 hover:underline dark:text-accent-300">
        Volver a inicio
      </Link>
    </div>
  )
}
