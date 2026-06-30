import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import NumericExercise from './NumericExercise'

function setup() {
  render(
    <NumericExercise
      layer="formal"
      prompt="¿Cuánto es 6 × 7?"
      inputLabel="respuesta ="
      check={(v) => v === 42}
      renderFeedback={(_v, ok) => <span>{ok ? 'bien hecho' : 'el resultado es 42'}</span>}
      hint={<p>una pista útil</p>}
      solution={<p>la solución completa</p>}
    />,
  )
}

describe('NumericExercise (comprobador numérico, integración)', () => {
  it('respuesta correcta → estado verde (correct) con feedback', () => {
    setup()
    fireEvent.change(screen.getByLabelText('respuesta ='), { target: { value: '42' } })
    fireEvent.click(screen.getByRole('button', { name: /comprobar/i }))

    expect(screen.getByTestId('exercise')).toHaveAttribute('data-status', 'correct')
    expect(screen.getByTestId('checker-feedback')).toHaveTextContent(/correcto/i)
  })

  it('respuesta incorrecta → estado rojo (error) y la pista sigue disponible', () => {
    setup()
    fireEvent.change(screen.getByLabelText('respuesta ='), { target: { value: '41' } })
    fireEvent.click(screen.getByRole('button', { name: /comprobar/i }))

    expect(screen.getByTestId('exercise')).toHaveAttribute('data-status', 'error')

    // La pista está disponible (acordeón "Pista").
    fireEvent.click(screen.getByRole('button', { name: /^pista$/i }))
    expect(screen.getByText('una pista útil')).toBeInTheDocument()
  })

  it('cambiar la respuesta vuelve el estado a neutro (idle)', () => {
    setup()
    const input = screen.getByLabelText('respuesta =')
    fireEvent.change(input, { target: { value: '42' } })
    fireEvent.click(screen.getByRole('button', { name: /comprobar/i }))
    expect(screen.getByTestId('exercise')).toHaveAttribute('data-status', 'correct')

    fireEvent.change(input, { target: { value: '50' } })
    expect(screen.getByTestId('exercise')).toHaveAttribute('data-status', 'idle')
  })
})
