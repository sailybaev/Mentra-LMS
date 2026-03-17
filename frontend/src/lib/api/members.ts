import { apiClient } from './client'
import { MemberDTO, InviteMemberInput, UpdateMemberRoleInput, CSVImportResult } from '@/types/member'
import { PaginatedResponse } from '@/types/api'

export async function listMembers(params?: { page?: number; page_size?: number; role?: string }): Promise<PaginatedResponse<MemberDTO>> {
  const res = await apiClient.get<PaginatedResponse<MemberDTO>>('/members', { params })
  return res.data ?? { data: [], meta: { page: params?.page ?? 1, page_size: params?.page_size ?? 20, total: 0 } }
}

export async function inviteMember(input: InviteMemberInput): Promise<MemberDTO> {
  const res = await apiClient.post<{ data: MemberDTO }>('/members/invite', input)
  return res.data.data
}

export async function bulkImportMembers(file: File): Promise<CSVImportResult> {
  const formData = new FormData()
  formData.append('file', file)
  const res = await apiClient.post<{ data: CSVImportResult }>('/members/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data.data
}

export async function removeMember(id: string): Promise<void> {
  await apiClient.delete(`/members/${id}`)
}

export async function updateMemberRole(id: string, input: UpdateMemberRoleInput): Promise<MemberDTO> {
  const res = await apiClient.put<{ data: MemberDTO }>(`/members/${id}/role`, input)
  return res.data.data
}
