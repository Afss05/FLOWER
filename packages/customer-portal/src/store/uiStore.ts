import { create } from 'zustand'

interface UIStore {
  language: 'en' | 'ta'
  setLanguage: (lang: 'en' | 'ta') => void
  isSidebarOpen: boolean
  toggleSidebar: () => void
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
}

export const useUIStore = create<UIStore>((set) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}))
