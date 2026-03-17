import { apiClient } from './client'
import { FileAttachmentDTO, CreateAttachmentInput } from '@/types/attachment'

export async function listAttachments(refType: string, refId: string): Promise<FileAttachmentDTO[]> {
  const res = await apiClient.get<FileAttachmentDTO[]>('/attachments', {
    params: { ref_type: refType, ref_id: refId },
  })
  return res.data ?? []
}

export async function createAttachment(data: CreateAttachmentInput): Promise<FileAttachmentDTO> {
  const res = await apiClient.post<FileAttachmentDTO>('/attachments', data)
  return res.data
}

export async function deleteAttachment(id: string): Promise<void> {
  await apiClient.delete(`/attachments/${id}`)
}
