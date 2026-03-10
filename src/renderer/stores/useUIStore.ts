import { create } from 'zustand'

interface UIState {
  sidebarCollapsed: boolean
  panelCollapsed: boolean
  pianoRollCollapsed: boolean
  pianoRollFocusMode: boolean
  animationsEnabled: boolean

  toggleSidebar: () => void
  togglePanel: () => void
  togglePianoRoll: () => void
  togglePianoRollFocusMode: () => void
  setAnimationsEnabled: (enabled: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  panelCollapsed: false,
  pianoRollCollapsed: false,
  pianoRollFocusMode: false,
  animationsEnabled: true,

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  togglePanel: () => set((state) => ({ panelCollapsed: !state.panelCollapsed })),
  togglePianoRoll: () => set((state) => {
    const nextCollapsed = !state.pianoRollCollapsed

    return {
      pianoRollCollapsed: nextCollapsed,
      pianoRollFocusMode: nextCollapsed ? false : state.pianoRollFocusMode,
    }
  }),
  togglePianoRollFocusMode: () => set((state) => ({
    pianoRollCollapsed: false,
    pianoRollFocusMode: !state.pianoRollFocusMode,
  })),
  setAnimationsEnabled: (enabled) => set({ animationsEnabled: enabled })
}))
