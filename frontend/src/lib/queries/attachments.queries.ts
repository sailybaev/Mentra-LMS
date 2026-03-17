import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as attachmentsApi from '@/lib/api/attachments'
import { CreateAttachmentInput } from '@/types/attachment'

export const attachmentKeys = {
  all: ['attachments'] as const,
  byRef: (refType: string, refId: string) => [...attachmentKeys.all, refType, refId] as const,
}

export function useAttachments(refType: string, refId: string) {
  return useQuery({
    queryKey: attachmentKeys.byRef(refType, refId),
    queryFn: () => attachmentsApi.listAttachments(refType, refId),
    enabled: !!(refType && refId),
  })
}

export function useCreateAttachment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAttachmentInput) => attachmentsApi.createAttachment(data),
    onSuccess: (_, { ref_type, ref_id }) => {
      qc.invalidateQueries({ queryKey: attachmentKeys.byRef(ref_type, ref_id) })
    },
  })
}

export function useDeleteAttachment(refType: string, refId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => attachmentsApi.deleteAttachment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: attachmentKeys.byRef(refType, refId) })
    },
  })
}
