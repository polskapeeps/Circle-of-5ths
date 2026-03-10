import { create } from 'zustand'

interface UIState {
  sidebarCollapsed: boolean
  panelCollapsed: boolean
  animationsEnabled: boolean

  toggleSidebar: () => void
  togglePanel: () => void
  setAnimationsEnabled: (enabled: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  panelCollapsed: false,
  animationsEnabled: true,

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  togglePanel: () => set((state) => ({ panelCollapsed: !state.panelCollapsed })),
  setAnimationsEnabled: (enabled) => set({ animationsEnabled: enabled })
}))
