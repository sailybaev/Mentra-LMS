'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { UserMinus, UserPlus, GraduationCap } from 'lucide-react'
import { useCourseTeachers, useAssignTeacher, useRemoveTeacher } from '@/lib/queries/courseTeachers.queries'
import { useMembers } from '@/lib/queries/members.queries'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'

function AssignTeacherDialog({ courseId, assignedTeacherIds }: { courseId: string; assignedTeacherIds: string[] }) {
  const [open, setOpen] = useState(false)
  const { data } = useMembers({ role: 'teacher', page: 1, page_size: 100 })
  const assign = useAssignTeacher(courseId)

  const available = (data?.data ?? []).filter((m) => !assignedTeacherIds.includes(m.user_id))

  const handleAssign = async (userId: string) => {
    try {
      await assign.mutateAsync({ teacher_id: userId })
      toast.success('Teacher assigned')
      setOpen(false)
    } catch {
      toast.error('Failed to assign teacher')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#059669] hover:bg-[#047857] text-white gap-1.5" size="sm">
          <UserPlus className="h-3.5 w-3.5" />
          Assign Teacher
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Assign Teacher</DialogTitle>
        </DialogHeader>
        <div className="mt-2 space-y-1 max-h-72 overflow-y-auto">
          {available.length === 0 ? (
            <p className="text-sm text-[#9b9b9b] text-center py-4">All teachers are already assigned</p>
          ) : (
            available.map((teacher) => (
              <button
                key={teacher.user_id}
                onClick={() => handleAssign(teacher.user_id)}
                disabled={assign.isPending}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#f0eeeb] transition-colors text-left"
              >
                <div className="h-7 w-7 rounded-full bg-[#e4e2de] flex items-center justify-center shrink-0">
                  <span className="text-xs font-semibold text-[#6b6b6b]">{teacher.name.charAt(0)}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#1a1a1a] truncate">{teacher.name}</p>
                  <p className="text-xs text-[#9b9b9b] truncate">{teacher.email}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function CourseTeachersSection({ courseId }: { courseId: string }) {
  const { data: teachers, isLoading } = useCourseTeachers(courseId)
  const { data: membersData } = useMembers({ role: 'teacher', page: 1, page_size: 100 })
  const removeTeacher = useRemoveTeacher(courseId)

  const teacherMap = new Map((membersData?.data ?? []).map((m) => [m.user_id, m]))
  const assignedIds = (teachers ?? []).map((t) => t.teacher_id)

  const handleRemove = async (teacherId: string) => {
    if (!confirm('Remove this teacher from the course?')) return
    try {
      await removeTeacher.mutateAsync(teacherId)
      toast.success('Teacher removed')
    } catch {
      toast.error('Failed to remove teacher')
    }
  }

  return (
    <div className="rounded-xl border border-[#e4e2de] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#f0eeeb] flex items-center justify-center">
            <GraduationCap className="h-4 w-4 text-[#6b6b6b]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1a1a1a]">Assigned Teachers</p>
            <p className="text-xs text-[#9b9b9b]">Teachers who can access this course</p>
          </div>
        </div>
        <AssignTeacherDialog courseId={courseId} assignedTeacherIds={assignedIds} />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
        </div>
      ) : !teachers || teachers.length === 0 ? (
        <p className="text-sm text-[#9b9b9b]">No teachers assigned yet</p>
      ) : (
        <div className="space-y-1">
          {teachers.map((t) => {
            const m = teacherMap.get(t.teacher_id)
            return (
              <div key={t.id} className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#fafaf9] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-full bg-[#f0eeeb] flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-[#6b6b6b]">
                      {m ? m.name.charAt(0) : '?'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1a1a1a]">{m?.name ?? t.teacher_id}</p>
                    {m && <p className="text-xs text-[#9b9b9b]">{m.email}</p>}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-[#9b9b9b] hover:text-red-500"
                  onClick={() => handleRemove(t.teacher_id)}
                >
                  <UserMinus className="h-3.5 w-3.5" />
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
