import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AdminAuthStore {
  token: string | null
  isAuthenticated: boolean
  setToken: (token: string) => void
  logout: () => void
}

export const useAdminAuthStore = create<AdminAuthStore>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      setToken: (token) => {
        localStorage.setItem('admin_token', token)
        set({ token, isAuthenticated: true })
      },
      logout: () => {
        localStorage.removeItem('admin_token')
        set({ token: null, isAuthenticated: false })
      },
    }),
    { name: 'admin-auth-store' },
  ),
)
