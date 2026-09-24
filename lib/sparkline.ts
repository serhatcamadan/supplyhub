/**
 * Builds an SVG path `d` attribute from a numeric series, mapped onto a width x height viewBox.
 * Linear segments only — real search-volume series here are short and sparse, so a smoothed
 * curve would imply more precision than the underlying data has.
 */
export function buildSparklinePath(series: number[], width = 100, height = 20): string {
  if (series.length === 0) return `M0 ${height / 2} L${width} ${height / 2}`

  const min = Math.min(...series)
  const max = Math.max(...series)
  const range = max - min

  const points = series.map((value, i) => {
    const x = (i / (series.length - 1 || 1)) * width
    const y = range === 0 ? height / 2 : height - ((value - min) / range) * height
    return `${x.toFixed(1)} ${y.toFixed(1)}`
  })

  return `M${points[0]} L${points.slice(1).join(' L')}`
}
