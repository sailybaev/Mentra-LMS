'use client'

import { Users, Pencil, Trash2 } from 'lucide-react'
import { GroupDTO } from '@/types/group'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'

interface GroupCardProps {
  group: GroupDTO
  courseId: string
  onEdit: (group: GroupDTO) => void
  onDelete: (groupId: string) => void
  onSelect: (group: GroupDTO) => void
}

export function GroupCard({ group, onEdit, onDelete, onSelect }: GroupCardProps) {
  return (
    <div
      className="rounded-xl border border-[#e4e2de] bg-white p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect(group)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-lg bg-[#f0eeeb] flex items-center justify-center shrink-0">
            <Users className="h-4 w-4 text-[#6b6b6b]" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#1a1a1a] truncate">{group.name}</p>
            {group.teacher_id && (
              <p className="text-xs text-[#9b9b9b] mt-0.5">Teacher assigned</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => onEdit(group)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <ConfirmDialog
            trigger={
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-[#9b9b9b] hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            }
            title="Delete group?"
            description={`"${group.name}" and all its members and schedules will be deleted.`}
            confirmLabel="Delete"
            onConfirm={() => onDelete(group.id)}
            destructive
          />
        </div>
      </div>
    </div>
  )
}
