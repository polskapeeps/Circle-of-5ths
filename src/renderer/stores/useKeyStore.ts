import { create } from 'zustand'
import type { Mode } from '../types/music'

interface KeyState {
  selectedRoot: string
  selectedMode: Mode
  hoveredKey: string | null

  setSelectedRoot: (root: string) => void
  setSelectedMode: (mode: Mode) => void
  setHoveredKey: (key: string | null) => void
}

export const useKeyStore = create<KeyState>((set) => ({
  selectedRoot: 'C',
  selectedMode: 'major',
  hoveredKey: null,

  setSelectedRoot: (root) => set({ selectedRoot: root }),
  setSelectedMode: (mode) => set({ selectedMode: mode }),
  setHoveredKey: (key) => set({ hoveredKey: key })
}))
