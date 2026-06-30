import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import Exercise from './Exercise'

describe('Exercise', () => {
  it('monta con enunciado; pista y solución plegadas por defecto; estado idle', () => {
    render(
      <Exercise
        prompt="enunciado de prueba"
        layer="formal"
        hint={<p>la pista oculta</p>}
        solution={<p>la solución oculta</p>}
      />,
    )

    expect(screen.getByText('enunciado de prueba')).toBeInTheDocument()
    // pista y solución plegadas (cuerpos ausentes hasta abrir).
    expect(screen.queryByText('la pista oculta')).not.toBeInTheDocument()
    expect(screen.queryByText('la solución oculta')).not.toBeInTheDocument()
    // estado por defecto.
    expect(screen.getByTestId('exercise')).toHaveAttribute('data-status', 'idle')
  })

  it('aplica el estado visual correcto/error según la prop status', () => {
    const { rerender } = render(
      <Exercise prompt="x" layer="formal" hint="h" solution="s" status="correct" />,
    )
    expect(screen.getByTestId('exercise')).toHaveAttribute('data-status', 'correct')
    expect(screen.getByTestId('exercise-status')).toHaveTextContent('Correcto')

    rerender(<Exercise prompt="x" layer="formal" hint="h" solution="s" status="error" />)
    expect(screen.getByTestId('exercise')).toHaveAttribute('data-status', 'error')
    expect(screen.getByTestId('exercise-status')).toHaveTextContent(/error/i)
  })
})
