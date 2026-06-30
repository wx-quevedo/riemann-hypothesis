/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'

export default {
  // Escritorio primero (M7): el diseño base es horizontal; no optimizamos para móvil en esta fase.
  darkMode: 'class', // modo claro/oscuro por clase `dark` en <html> (sección 7 del road map)
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // UN único acento (teal — calma y foco) para interacción: slider en foco, botón primario, enlace activo.
        accent: colors.teal,
      },
      fontFamily: {
        // Texto en sans de alta legibilidad (Inter); la matemática usa la serif de KaTeX aparte.
        sans: ['Inter', 'Figtree', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
