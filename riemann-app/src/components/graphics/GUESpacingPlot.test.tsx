import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

const { reactSpy } = vi.hoisted(() => ({ reactSpy: vi.fn() }))
vi.mock('plotly.js-basic-dist-min', () => ({
  default: {
    react: (...args: unknown[]) => {
      reactSpy(...args)
      return Promise.resolve()
    },
    newPlot: () => Promise.resolve(),
    purge: () => {},
    Plots: { resize: () => {} },
  },
}))

import GUESpacingPlot from './GUESpacingPlot'

beforeEach(() => {
  reactSpy.mockClear()
})

describe('GUESpacingPlot (G7)', () => {
  it('monta y dibuja el histograma + la curva GUE', () => {
    render(<GUESpacingPlot />)
    expect(reactSpy).toHaveBeenCalled()
    // Dos trazas: histograma (bar) y curva GUE (scatter line).
    const traces = reactSpy.mock.calls.at(-1)?.[1] as Array<{ type: string }>
    expect(traces.some((t) => t.type === 'bar')).toBe(true)
    expect(traces.some((t) => t.type === 'scatter')).toBe(true)
  })

  it('el control de N actualiza el histograma (el dato cambia)', () => {
    render(<GUESpacingPlot />)
    const before = reactSpy.mock.calls.length
    fireEvent.change(screen.getByRole('slider'), { target: { value: '1000' } })
    expect(screen.getByText('1000 ceros')).toBeInTheDocument()
    expect(reactSpy.mock.calls.length).toBeGreaterThan(before)
  })
})
