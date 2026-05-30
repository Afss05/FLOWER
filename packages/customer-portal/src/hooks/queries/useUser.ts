import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '@/api/auth'

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser,
    staleTime: 10 * 60 * 1000,
  })
}
