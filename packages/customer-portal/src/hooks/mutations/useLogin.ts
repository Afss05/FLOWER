import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'

export function useLogin() {
  const queryClient = useQueryClient()
  const { setToken, setUser } = useAuthStore()

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.token) {
        setToken(data.token)
      }
      if (data.user) {
        setUser(data.user)
      }
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}
