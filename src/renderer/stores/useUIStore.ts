import { create } from 'zustand'

interface UIState {
  sidebarCollapsed: boolean
  panelCollapsed: boolean
  pianoRollCollapsed: boolean
  animationsEnabled: boolean

  toggleSidebar: () => void
  togglePanel: () => void
  togglePianoRoll: () => void
  setAnimationsEnabled: (enabled: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  panelCollapsed: false,
  pianoRollCollapsed: false,
  animationsEnabled: true,

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  togglePanel: () => set((state) => ({ panelCollapsed: !state.panelCollapsed })),
  togglePianoRoll: () => set((state) => ({ pianoRollCollapsed: !state.pianoRollCollapsed })),
  setAnimationsEnabled: (enabled) => set({ animationsEnabled: enabled })
}))
