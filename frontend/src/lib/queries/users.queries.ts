import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as usersApi from '@/lib/api/users'
import { UpdateProfileInput } from '@/lib/api/users'

export const userKeys = {
  me: ['me'] as const,
}

export function useMe() {
  return useQuery({
    queryKey: userKeys.me,
    queryFn: () => usersApi.getMe(),
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateProfileInput) => usersApi.updateMe(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.me }),
  })
}
