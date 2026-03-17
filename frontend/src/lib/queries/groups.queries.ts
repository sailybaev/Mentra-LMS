import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as groupsApi from '@/lib/api/groups'
import {
  CreateGroupInput, UpdateGroupInput, CreateGroupScheduleInput, AddMemberInput,
} from '@/types/group'

export const groupKeys = {
  all: ['groups'] as const,
  lists: () => [...groupKeys.all, 'list'] as const,
  list: (courseId: string) => [...groupKeys.lists(), courseId] as const,
  details: () => [...groupKeys.all, 'detail'] as const,
  detail: (courseId: string, groupId: string) => [...groupKeys.details(), courseId, groupId] as const,
  members: (courseId: string, groupId: string) => [...groupKeys.detail(courseId, groupId), 'members'] as const,
  schedules: (courseId: string, groupId: string) => [...groupKeys.detail(courseId, groupId), 'schedules'] as const,
  myGroup: (courseId: string) => [...groupKeys.all, 'my-group', courseId] as const,
}

export function useGroups(courseId: string) {
  return useQuery({
    queryKey: groupKeys.list(courseId),
    queryFn: () => groupsApi.listGroups(courseId),
    enabled: !!courseId,
  })
}

export function useGroup(courseId: string, groupId: string) {
  return useQuery({
    queryKey: groupKeys.detail(courseId, groupId),
    queryFn: () => groupsApi.getGroup(courseId, groupId),
    enabled: !!(courseId && groupId),
  })
}

export function useCreateGroup(courseId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateGroupInput) => groupsApi.createGroup(courseId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: groupKeys.list(courseId) }),
  })
}

export function useUpdateGroup(courseId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateGroupInput }) =>
      groupsApi.updateGroup(courseId, id, input),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: groupKeys.list(courseId) })
      qc.invalidateQueries({ queryKey: groupKeys.detail(courseId, id) })
    },
  })
}

export function useDeleteGroup(courseId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (groupId: string) => groupsApi.deleteGroup(courseId, groupId),
    onSuccess: () => qc.invalidateQueries({ queryKey: groupKeys.list(courseId) }),
  })
}

export function useGroupMembers(courseId: string, groupId: string) {
  return useQuery({
    queryKey: groupKeys.members(courseId, groupId),
    queryFn: () => groupsApi.listMembers(courseId, groupId),
    enabled: !!(courseId && groupId),
  })
}

export function useAddMember(courseId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: AddMemberInput) => groupsApi.addMember(courseId, groupId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: groupKeys.members(courseId, groupId) }),
  })
}

export function useRemoveMember(courseId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (studentId: string) => groupsApi.removeMember(courseId, groupId, studentId),
    onSuccess: () => qc.invalidateQueries({ queryKey: groupKeys.members(courseId, groupId) }),
  })
}

export function useGroupSchedules(courseId: string, groupId: string) {
  return useQuery({
    queryKey: groupKeys.schedules(courseId, groupId),
    queryFn: () => groupsApi.listSchedules(courseId, groupId),
    enabled: !!(courseId && groupId),
  })
}

export function useAddSchedule(courseId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateGroupScheduleInput) => groupsApi.addSchedule(courseId, groupId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: groupKeys.schedules(courseId, groupId) }),
  })
}

export function useDeleteSchedule(courseId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (scheduleId: string) => groupsApi.deleteSchedule(courseId, groupId, scheduleId),
    onSuccess: () => qc.invalidateQueries({ queryKey: groupKeys.schedules(courseId, groupId) }),
  })
}

export function useMyGroup(courseId: string) {
  return useQuery({
    queryKey: groupKeys.myGroup(courseId),
    queryFn: () => groupsApi.getMyGroup(courseId),
    enabled: !!courseId,
    retry: false,
  })
}
