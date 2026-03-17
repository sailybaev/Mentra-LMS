'use client'

import { Megaphone, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAnnouncements, useDeleteAnnouncement } from '@/lib/queries/announcements.queries'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'

interface AnnouncementListProps {
  courseId: string
  canDelete?: boolean
}

export function AnnouncementList({ courseId, canDelete = false }: AnnouncementListProps) {
  const { data, isLoading } = useAnnouncements(courseId)
  const deleteAnnouncement = useDeleteAnnouncement(courseId)

  const announcements = Array.isArray(data?.data) ? data.data : []

  const handleDelete = async (id: string) => {
    try {
      await deleteAnnouncement.mutateAsync(id)
      toast.success('Announcement deleted')
    } catch {
      toast.error('Failed to delete announcement')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
      </div>
    )
  }

  if (announcements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center rounded-xl border border-dashed border-[#e4e2de]">
        <Megaphone className="h-7 w-7 text-[#d4d2ce] mb-2" />
        <p className="text-sm text-[#9b9b9b]">No announcements yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {announcements.map((a) => (
        <div key={a.id} className="rounded-xl border border-[#e4e2de] bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                <Megaphone className="h-4 w-4 text-amber-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#1a1a1a]">{a.title}</p>
                <p className="mt-1 text-sm text-[#6b6b6b] leading-relaxed whitespace-pre-wrap">{a.content}</p>
                <p className="mt-2 text-xs text-[#9b9b9b]">
                  {new Date(a.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
            {canDelete && (
              <ConfirmDialog
                trigger={
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-[#9b9b9b] hover:text-destructive shrink-0">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                }
                title="Delete announcement?"
                description={`"${a.title}" will be permanently deleted.`}
                confirmLabel="Delete"
                onConfirm={() => handleDelete(a.id)}
                destructive
              />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
