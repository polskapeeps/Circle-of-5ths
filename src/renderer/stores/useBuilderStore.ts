import { create } from 'zustand'
import { randomChordInKey, randomNoteFromScale, randomNoteChromatically, generateRandomProgression } from '../engine/generativeEngine'
import type { BuilderSlot, Mode, Note, RandomOptions, ResolvedChordStep } from '../types/music'

let slotCounter = 0
function makeSlotId(): string {
  return `slot-${++slotCounter}-${Date.now()}`
}

function createEmptySlot(): BuilderSlot {
  return { id: makeSlotId(), chord: null, locked: false, source: 'manual' }
}

const DEFAULT_SLOT_COUNT = 4
const MAX_SLOTS = 16

interface BuilderState {
  slots: BuilderSlot[]
  randomNote: Note | null
  chromaticMode: boolean

  addSlot: () => void
  removeSlot: (id: string) => void
  clearAll: () => void
  setSlotChord: (id: string, chord: ResolvedChordStep, source?: BuilderSlot['source']) => void
  clearSlot: (id: string) => void
  toggleSlotLock: (id: string) => void
  randomizeSlot: (id: string, rootName: string, mode: Mode, options: RandomOptions) => void
  randomizeAllUnlocked: (rootName: string, mode: Mode, options: RandomOptions) => void
  loadProgression: (steps: ResolvedChordStep[]) => void
  randomizeNote: (rootName: string, mode: Mode) => void
  clearRandomNote: () => void
  setChromaticMode: (chromatic: boolean) => void
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  slots: Array.from({ length: DEFAULT_SLOT_COUNT }, () => createEmptySlot()),
  randomNote: null,
  chromaticMode: false,

  addSlot: () =>
    set((state) => {
      if (state.slots.length >= MAX_SLOTS) return state
      return { slots: [...state.slots, createEmptySlot()] }
    }),

  removeSlot: (id) =>
    set((state) => ({
      slots: state.slots.filter((s) => s.id !== id),
    })),

  clearAll: () =>
    set({
      slots: Array.from({ length: DEFAULT_SLOT_COUNT }, () => createEmptySlot()),
      randomNote: null,
    }),

  setSlotChord: (id, chord, source = 'manual') =>
    set((state) => ({
      slots: state.slots.map((s) =>
        s.id === id ? { ...s, chord, source } : s
      ),
    })),

  clearSlot: (id) =>
    set((state) => ({
      slots: state.slots.map((s) =>
        s.id === id ? { ...s, chord: null, locked: false, source: 'manual' } : s
      ),
    })),

  toggleSlotLock: (id) =>
    set((state) => ({
      slots: state.slots.map((s) =>
        s.id === id ? { ...s, locked: !s.locked } : s
      ),
    })),

  randomizeSlot: (id, rootName, mode, options) =>
    set((state) => ({
      slots: state.slots.map((s) => {
        if (s.id !== id) return s
        const chord = randomChordInKey(rootName, mode, options)
        return { ...s, chord, source: 'random' as const }
      }),
    })),

  randomizeAllUnlocked: (rootName, mode, options) =>
    set((state) => ({
      slots: state.slots.map((s) => {
        if (s.locked) return s
        const chord = randomChordInKey(rootName, mode, options)
        return { ...s, chord, source: 'random' as const }
      }),
    })),

  loadProgression: (steps) =>
    set({
      slots: steps.map((chord) => ({
        id: makeSlotId(),
        chord,
        locked: false,
        source: 'curated' as const,
      })),
    }),

  randomizeNote: (rootName, mode) =>
    set((state) => ({
      randomNote: state.chromaticMode
        ? randomNoteChromatically()
        : randomNoteFromScale(rootName, mode),
    })),

  clearRandomNote: () => set({ randomNote: null }),

  setChromaticMode: (chromatic) => set({ chromaticMode: chromatic }),
}))
