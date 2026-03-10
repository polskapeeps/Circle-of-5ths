import { create } from 'zustand'

interface IdeaState {
  selectedIdeaId: string | null
  setSelectedIdea: (id: string | null) => void
}

export const useIdeaStore = create<IdeaState>((set) => ({
  selectedIdeaId: null,
  setSelectedIdea: (id) => set({ selectedIdeaId: id }),
}))
