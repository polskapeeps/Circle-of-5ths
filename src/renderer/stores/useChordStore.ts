import { create } from 'zustand'

interface ChordState {
  hoveredChord: string | null
  selectedChord: string | null
  showDetail: boolean

  setHoveredChord: (chord: string | null) => void
  setSelectedChord: (chord: string | null) => void
  setShowDetail: (show: boolean) => void
}

export const useChordStore = create<ChordState>((set) => ({
  hoveredChord: null,
  selectedChord: null,
  showDetail: false,

  setHoveredChord: (chord) => set({ hoveredChord: chord }),
  setSelectedChord: (chord) => set({ selectedChord: chord, showDetail: chord !== null }),
  setShowDetail: (show) => set({ showDetail: show })
}))
