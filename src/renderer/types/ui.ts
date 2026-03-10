export interface UIState {
  sidebarCollapsed: boolean
  panelCollapsed: boolean
  activeChordDetail: string | null
  animationsEnabled: boolean
}

export interface CircleInteraction {
  hoveredSegment: number | null
  selectedSegment: number | null
  hoveredRing: 'major' | 'minor' | null
}
