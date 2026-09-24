import { buildSparklinePath } from './sparkline'

describe('buildSparklinePath', () => {
  it('returns a flat mid-height line for an empty series', () => {
    expect(buildSparklinePath([], 100, 20)).toBe('M0 10 L100 10')
  })

  it('returns a flat mid-height line for a constant series (no fake variation)', () => {
    expect(buildSparklinePath([5, 5, 5], 100, 20)).toBe('M0.0 10.0 L50.0 10.0 L100.0 10.0')
  })

  it('maps the minimum value to the bottom and the maximum to the top', () => {
    const path = buildSparklinePath([0, 10], 100, 20)
    expect(path).toBe('M0.0 20.0 L100.0 0.0')
  })

  it('spaces points evenly across the width', () => {
    const path = buildSparklinePath([1, 2, 3, 4], 100, 20)
    const xs = path.match(/[ML]([\d.]+) /g)!.map((s) => s.trim().slice(1))
    expect(xs).toEqual(['0.0', '33.3', '66.7', '100.0'])
  })
})
