'use client'

import { useState } from 'react'
import { UserPlus, UserMinus } from 'lucide-react'
import { toast } from 'sonner'
import { useGroupMembers, useAddMember, useRemoveMember } from '@/lib/queries/groups.queries'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'

interface GroupMembersProps {
  courseId: string
  groupId: string
}

export function GroupMembers({ courseId, groupId }: GroupMembersProps) {
  const { data: membersData, isLoading } = useGroupMembers(courseId, groupId)
  const addMember = useAddMember(courseId, groupId)
  const removeMember = useRemoveMember(courseId, groupId)
  const [studentId, setStudentId] = useState('')

  const members = Array.isArray(membersData) ? membersData : []

  const handleAdd = async () => {
    if (!studentId.trim()) return
    try {
      await addMember.mutateAsync({ student_id: studentId.trim() })
      toast.success('Member added')
      setStudentId('')
    } catch (err) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })
        ?.response?.data?.error?.message
      toast.error(msg ?? 'Failed to add member')
    }
  }

  const handleRemove = async (sid: string) => {
    try {
      await removeMember.mutateAsync(sid)
      toast.success('Member removed')
    } catch {
      toast.error('Failed to remove member')
    }
  }

  if (isLoading) {
    return <div className="space-y-2">{[1, 2].map((i) => <Skeleton key={i} className="h-10" />)}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          placeholder="Student UUID..."
          className="border-[#e4e2de] text-sm"
          onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
        />
        <Button
          size="sm"
          onClick={handleAdd}
          disabled={addMember.isPending || !studentId.trim()}
          className="bg-[#059669] hover:bg-[#047857] text-white shrink-0"
        >
          <UserPlus className="h-4 w-4 mr-1.5" />
          Add
        </Button>
      </div>

      {members.length === 0 ? (
        <p className="text-sm text-[#9b9b9b] py-3 text-center">No members yet.</p>
      ) : (
        <div className="divide-y divide-[#f0eeeb] rounded-xl border border-[#e4e2de] overflow-hidden">
          {members.map((m) => (
            <div key={m.id} className="flex items-center justify-between px-4 py-3 bg-white">
              <div>
                <p className="text-xs font-mono text-[#1a1a1a]">{m.student_id}</p>
                <p className="text-xs text-[#9b9b9b] mt-0.5">
                  Joined {new Date(m.joined_at).toLocaleDateString()}
                </p>
              </div>
              <ConfirmDialog
                trigger={
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-[#9b9b9b] hover:text-destructive">
                    <UserMinus className="h-3.5 w-3.5" />
                  </Button>
                }
                title="Remove member?"
                description="This student will be removed from the group."
                confirmLabel="Remove"
                onConfirm={() => handleRemove(m.student_id)}
                destructive
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
