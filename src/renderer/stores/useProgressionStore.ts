import { create } from 'zustand'
import type { Genre, Mood } from '../types/music'

interface ProgressionState {
  selectedGenres: Genre[]
  selectedMoods: Mood[]
  selectedNotes: string[]
  complexityRange: [number, number]
  selectedProgressionId: string | null

  toggleGenre: (genre: Genre) => void
  toggleMood: (mood: Mood) => void
  toggleNote: (note: string) => void
  setComplexityRange: (range: [number, number]) => void
  setSelectedProgression: (id: string | null) => void
  clearFilters: () => void
}

export const useProgressionStore = create<ProgressionState>((set) => ({
  selectedGenres: [],
  selectedMoods: [],
  selectedNotes: [],
  complexityRange: [1, 5],
  selectedProgressionId: null,

  toggleGenre: (genre) =>
    set((state) => ({
      selectedGenres: state.selectedGenres.includes(genre)
        ? state.selectedGenres.filter((g) => g !== genre)
        : [...state.selectedGenres, genre]
    })),

  toggleMood: (mood) =>
    set((state) => ({
      selectedMoods: state.selectedMoods.includes(mood)
        ? state.selectedMoods.filter((m) => m !== mood)
        : [...state.selectedMoods, mood]
    })),

  toggleNote: (note) =>
    set((state) => ({
      selectedNotes: state.selectedNotes.includes(note)
        ? state.selectedNotes.filter((selected) => selected !== note)
        : [...state.selectedNotes, note]
    })),

  setComplexityRange: (range) => set({ complexityRange: range }),
  setSelectedProgression: (id) => set({ selectedProgressionId: id }),
  clearFilters: () => set({ selectedGenres: [], selectedMoods: [], selectedNotes: [], complexityRange: [1, 5] })
}))
