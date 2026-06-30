// Sistema de progreso (sección 7 / fase 1): marcar secciones como completadas y recordarlo
// localmente. Sin gamificación: solo un conjunto de ids de sección completadas.

const STORAGE_KEY = 'riemann:progress'

/** Lee del localStorage la lista de ids de sección completadas. Tolerante a datos corruptos. */
export function loadProgress(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((x): x is string => typeof x === 'string')
  } catch {
    return []
  }
}

/** Persiste la lista de ids completados (silencioso si localStorage no está disponible). */
export function saveProgress(ids: string[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    /* almacenamiento no disponible: el progreso simplemente no se recuerda */
  }
}
