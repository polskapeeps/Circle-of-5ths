export interface Point {
  x: number
  y: number
}

export interface ArcPath {
  d: string
  startAngle: number
  endAngle: number
  midAngle: number
}

export interface SegmentGeometry {
  path: string
  labelPosition: Point
  centerAngle: number
  innerRadius: number
  outerRadius: number
}
