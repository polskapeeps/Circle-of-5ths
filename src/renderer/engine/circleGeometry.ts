import type { Point, SegmentGeometry } from '../types/geometry'

const DEG_TO_RAD = Math.PI / 180

export function polarToCartesian(cx: number, cy: number, radius: number, angleDeg: number): Point {
  const rad = (angleDeg - 90) * DEG_TO_RAD
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad)
  }
}

export function describeArc(
  cx: number, cy: number,
  innerRadius: number, outerRadius: number,
  startAngle: number, endAngle: number
): string {
  const outerStart = polarToCartesian(cx, cy, outerRadius, startAngle)
  const outerEnd = polarToCartesian(cx, cy, outerRadius, endAngle)
  const innerStart = polarToCartesian(cx, cy, innerRadius, startAngle)
  const innerEnd = polarToCartesian(cx, cy, innerRadius, endAngle)

  const largeArc = endAngle - startAngle > 180 ? 1 : 0

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    'Z'
  ].join(' ')
}

export function getSegmentGeometry(
  cx: number, cy: number,
  innerRadius: number, outerRadius: number,
  index: number, total: number,
  gap: number = 1.5
): SegmentGeometry {
  const segmentAngle = 360 / total
  const startAngle = index * segmentAngle + gap / 2
  const endAngle = (index + 1) * segmentAngle - gap / 2
  const midAngle = (startAngle + endAngle) / 2
  const labelRadius = (innerRadius + outerRadius) / 2

  return {
    path: describeArc(cx, cy, innerRadius, outerRadius, startAngle, endAngle),
    labelPosition: polarToCartesian(cx, cy, labelRadius, midAngle),
    centerAngle: midAngle,
    innerRadius,
    outerRadius,
  }
}

export function getCircleConfig(size: number) {
  const cx = size / 2
  const cy = size / 2
  const outerRadius = size * 0.46
  const outerInner = size * 0.32
  const innerRadius = size * 0.30
  const innerInner = size * 0.18
  const centerRadius = size * 0.16

  return { cx, cy, outerRadius, outerInner, innerRadius, innerInner, centerRadius }
}
