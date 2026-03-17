import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as announcementsApi from '@/lib/api/announcements'
import { CreateAnnouncementInput } from '@/types/announcement'

export const announcementKeys = {
  all: ['announcements'] as const,
  lists: () => [...announcementKeys.all, 'list'] as const,
  list: (courseId: string) => [...announcementKeys.lists(), courseId] as const,
}

export function useAnnouncements(courseId: string) {
  return useQuery({
    queryKey: announcementKeys.list(courseId),
    queryFn: () => announcementsApi.listAnnouncements(courseId),
    enabled: !!courseId,
  })
}

export function useCreateAnnouncement(courseId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateAnnouncementInput) => announcementsApi.createAnnouncement(courseId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: announcementKeys.list(courseId) }),
  })
}

export function useDeleteAnnouncement(courseId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (announcementId: string) => announcementsApi.deleteAnnouncement(courseId, announcementId),
    onSuccess: () => qc.invalidateQueries({ queryKey: announcementKeys.list(courseId) }),
  })
}
