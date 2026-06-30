// Paleta de las gráficas — FUENTE ÚNICA DE VERDAD (Fase 8, consistencia visual; skill §UX y §3).
// UN solo acento (teal); secundario indigo; gris para ejes y curvas atenuadas (legible en claro y
// oscuro); y la LÍNEA CRÍTICA Re(s)=½ con el MISMO color en toda la app (G3/G4/G5).
export const GRAPH = {
  /** Curva protagonista / interacción (acento del proyecto). teal-600. */
  accent: '#0d9488',
  /** Variante fuerte del acento (p. ej. el punto activo). teal-700. */
  accentStrong: '#0f766e',
  /** Curva secundaria / marcadores de ceros sobre fondo claro. indigo-500. */
  reference: '#6366f1',
  /** Ejes, etiquetas y curvas atenuadas. slate-500 (contraste suficiente en claro y oscuro). */
  muted: '#64748b',
  /** Curva de fondo muy tenue (escalera objetivo de G6). slate-400. */
  faint: '#94a3b8',
  /** Línea crítica Re(s)=½ — MISMO color en toda la app. Blanco: contrasta sobre el campo de G3. */
  criticalLine: '#ffffff',
  /** Marcadores de ceros sobre el domain coloring (G3): blanco para contrastar en cualquier matiz. */
  zeroOnField: '#ffffff',
} as const
