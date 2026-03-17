import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as membersApi from '@/lib/api/members'
import { InviteMemberInput, UpdateMemberRoleInput } from '@/types/member'

export const memberKeys = {
  all: ['members'] as const,
  lists: () => [...memberKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) => [...memberKeys.lists(), params] as const,
}

export function useMembers(params?: { page?: number; page_size?: number; role?: string }) {
  return useQuery({
    queryKey: memberKeys.list(params),
    queryFn: () => membersApi.listMembers(params),
  })
}

export function useInviteMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: InviteMemberInput) => membersApi.inviteMember(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: memberKeys.lists() }),
  })
}

export function useBulkImportMembers() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => membersApi.bulkImportMembers(file),
    onSuccess: () => qc.invalidateQueries({ queryKey: memberKeys.lists() }),
  })
}

export function useRemoveMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => membersApi.removeMember(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: memberKeys.lists() }),
  })
}

export function useUpdateMemberRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateMemberRoleInput }) =>
      membersApi.updateMemberRole(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: memberKeys.lists() }),
  })
}
