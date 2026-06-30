import { useMemo } from 'react'
import clsx from 'clsx'
import katex from 'katex'
import 'katex/dist/katex.min.css'

type EquationProps = {
  /** La ecuación en LaTeX real (M5). Ej.: '\\zeta(s) = \\sum_{n=1}^{\\infty} \\frac{1}{n^s}' */
  math: string
  /** true = ecuación en bloque centrada (display); false (por defecto) = en línea con el texto. */
  display?: boolean
  className?: string
}

/**
 * Envoltorio de KaTeX (M5). Renderiza matemática con LaTeX real, nunca como texto plano ni
 * monoespaciado. Soporta modo inline y modo bloque (display). Si el LaTeX es inválido NO rompe
 * la app: KaTeX marca el error en rojo (throwOnError:false) y, ante cualquier excepción
 * inesperada, caemos a mostrar el código fuente entre <code> con aviso accesible.
 */
export default function Equation({ math, display = false, className }: EquationProps) {
  const rendered = useMemo(() => {
    try {
      return { ok: true as const, html: katex.renderToString(math, { displayMode: display, throwOnError: false }) }
    } catch {
      return { ok: false as const, html: '' }
    }
  }, [math, display])

  if (!rendered.ok) {
    // Fallback defensivo: LaTeX irrecuperable → mostrar el origen sin tumbar el render.
    return (
      <code className={className} role="math" aria-label={`Ecuación inválida: ${math}`} title="LaTeX inválido">
        {math}
      </code>
    )
  }

  return (
    <span
      // Fase 9 (B): en modo bloque, la ecuación tiene su PROPIO scroll horizontal (.katex-scroll) para
      // no desbordar el layout en móvil ni encogerse ilegible. Inline no cambia (wrap natural con el texto).
      className={clsx(className, display && 'katex-scroll')}
      role="math"
      aria-label={math}
      data-display={display ? 'block' : 'inline'}
      dangerouslySetInnerHTML={{ __html: rendered.html }}
    />
  )
}
