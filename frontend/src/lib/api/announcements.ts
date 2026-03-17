import { apiClient } from './client'
import { AnnouncementDTO, CreateAnnouncementInput } from '@/types/announcement'
import { PaginatedResponse } from '@/types/api'

export async function listAnnouncements(courseId: string, page = 1, pageSize = 20): Promise<PaginatedResponse<AnnouncementDTO>> {
  const res = await apiClient.get<PaginatedResponse<AnnouncementDTO>>(
    `/courses/${courseId}/announcements`,
    { params: { page, page_size: pageSize } },
  )
  return res.data
}

export async function createAnnouncement(courseId: string, input: CreateAnnouncementInput): Promise<AnnouncementDTO> {
  const res = await apiClient.post<AnnouncementDTO>(`/courses/${courseId}/announcements`, input)
  return res.data
}

export async function deleteAnnouncement(courseId: string, announcementId: string): Promise<void> {
  await apiClient.delete(`/courses/${courseId}/announcements/${announcementId}`)
}
