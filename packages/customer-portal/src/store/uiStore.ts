import { create } from 'zustand'

interface UIStore {
  language: 'en' | 'ta'
  setLanguage: (lang: 'en' | 'ta') => void
  isSidebarOpen: boolean
  toggleSidebar: () => void
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
}

const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'light'

export const useUIStore = create<UIStore>((set, get) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  theme: savedTheme,
  setTheme: (theme) => {
    localStorage.setItem('theme', theme)
    set({ theme })
  },
  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', next)
    set({ theme: next })
  },
}))
