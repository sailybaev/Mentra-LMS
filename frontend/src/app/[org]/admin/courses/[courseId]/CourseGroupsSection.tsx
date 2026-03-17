'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Users, UserMinus, Link2 } from 'lucide-react'
import { useGroups, useOrgGroups, useAssignGroupToCourse, useUnassignGroupFromCourse } from '@/lib/queries/groups.queries'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'

function AssignGroupDialog({ courseId, assignedGroupIds }: { courseId: string; assignedGroupIds: string[] }) {
  const [open, setOpen] = useState(false)
  const { data: orgGroups } = useOrgGroups()
  const assign = useAssignGroupToCourse()

  const available = (orgGroups ?? []).filter((g) => !assignedGroupIds.includes(g.id))

  const handleAssign = async (groupId: string) => {
    try {
      await assign.mutateAsync({ groupId, input: { course_id: courseId } })
      toast.success('Group assigned')
      setOpen(false)
    } catch {
      toast.error('Failed to assign group')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#059669] hover:bg-[#047857] text-white gap-1.5" size="sm">
          <Link2 className="h-3.5 w-3.5" />
          Assign Group
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Assign Group to Course</DialogTitle>
        </DialogHeader>
        <div className="mt-2 space-y-1 max-h-72 overflow-y-auto">
          {available.length === 0 ? (
            <p className="text-sm text-[#9b9b9b] text-center py-4">
              No unassigned groups available. Create groups in the Groups page first.
            </p>
          ) : (
            available.map((group) => (
              <button
                key={group.id}
                onClick={() => handleAssign(group.id)}
                disabled={assign.isPending}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#f0eeeb] transition-colors text-left"
              >
                <div className="h-7 w-7 rounded-full bg-[#e4e2de] flex items-center justify-center shrink-0">
                  <Users className="h-3.5 w-3.5 text-[#6b6b6b]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#1a1a1a] truncate">{group.name}</p>
                  {group.teacher_id && (
                    <p className="text-xs text-[#9b9b9b]">Teacher assigned</p>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function CourseGroupsSection({ courseId }: { courseId: string }) {
  const { data: groups, isLoading } = useGroups(courseId)
  const unassign = useUnassignGroupFromCourse()

  const assignedIds = (groups ?? []).map((g) => g.id)

  const handleUnassign = async (groupId: string) => {
    if (!confirm('Remove this group from the course?')) return
    try {
      await unassign.mutateAsync(groupId)
      toast.success('Group removed from course')
    } catch {
      toast.error('Failed to remove group')
    }
  }

  return (
    <div className="rounded-xl border border-[#e4e2de] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#f0eeeb] flex items-center justify-center">
            <Users className="h-4 w-4 text-[#6b6b6b]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1a1a1a]">Assigned Groups</p>
            <p className="text-xs text-[#9b9b9b]">Groups of students enrolled in this course</p>
          </div>
        </div>
        <AssignGroupDialog courseId={courseId} assignedGroupIds={assignedIds} />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
        </div>
      ) : !groups || groups.length === 0 ? (
        <p className="text-sm text-[#9b9b9b]">No groups assigned yet</p>
      ) : (
        <div className="space-y-1">
          {groups.map((g) => (
            <div
              key={g.id}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#fafaf9] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-full bg-[#f0eeeb] flex items-center justify-center shrink-0">
                  <Users className="h-3.5 w-3.5 text-[#6b6b6b]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1a1a1a]">{g.name}</p>
                  {g.teacher_id && <p className="text-xs text-[#9b9b9b]">Teacher assigned</p>}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-[#9b9b9b] hover:text-red-500"
                onClick={() => handleUnassign(g.id)}
              >
                <UserMinus className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
