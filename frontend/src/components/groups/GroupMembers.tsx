'use client'

import { useState } from 'react'
import { UserPlus, UserMinus, Check } from 'lucide-react'
import { toast } from 'sonner'
import { useGroupMembers, useAddMember, useRemoveMember } from '@/lib/queries/groups.queries'
import { useMembers } from '@/lib/queries/members.queries'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'

interface GroupMembersProps {
  groupId: string
  courseId?: string
}

export function GroupMembers({ groupId, courseId }: GroupMembersProps) {
  const { data: membersData, isLoading } = useGroupMembers(groupId, courseId)
  const addMember = useAddMember(groupId, courseId)
  const removeMember = useRemoveMember(groupId, courseId)

  const { data: studentsData } = useMembers({ role: 'student', page: 1, page_size: 200 })
  const allStudents = studentsData?.data ?? []

  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isAdding, setIsAdding] = useState(false)

  const members = Array.isArray(membersData) ? membersData : []
  const memberIds = new Set(members.map((m) => m.student_id))
  const studentMap = new Map(allStudents.map((s) => [s.user_id, s]))

  const available = allStudents.filter((s) => {
    if (memberIds.has(s.user_id)) return false
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
  })

  const toggleStudent = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    const availableIds = available.map((s) => s.user_id)
    const allSelected = availableIds.every((id) => selectedIds.has(id))
    setSelectedIds(allSelected ? new Set() : new Set(availableIds))
  }

  const handleAdd = async () => {
    if (selectedIds.size === 0) return
    setIsAdding(true)
    const ids = Array.from(selectedIds)
    let successCount = 0
    let failCount = 0
    for (const id of ids) {
      try {
        await addMember.mutateAsync({ student_id: id })
        successCount++
      } catch {
        failCount++
      }
    }
    setIsAdding(false)
    setSelectedIds(new Set())
    setSearch('')
    if (successCount > 0) toast.success(`${successCount} member${successCount > 1 ? 's' : ''} added`)
    if (failCount > 0) toast.error(`${failCount} student${failCount > 1 ? 's' : ''} failed to add`)
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

  const allAvailableSelected = available.length > 0 && available.every((s) => selectedIds.has(s.user_id))

  return (
    <div className="space-y-4">
      {/* Add member panel */}
      <div className="rounded-xl border border-[#e4e2de] bg-[#fafaf9] p-3 space-y-2">
        <div className="flex items-center gap-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students by name or email…"
            className="border-[#e4e2de] bg-white text-sm h-9 flex-1"
          />
          {available.length > 0 && (
            <button
              onClick={toggleAll}
              className={`shrink-0 text-xs px-2.5 py-1.5 rounded-md border transition-colors ${
                allAvailableSelected
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-[#e4e2de] bg-white text-[#6b6b6b] hover:border-[#c4c2be]'
              }`}
            >
              {allAvailableSelected ? 'Deselect all' : 'Select all'}
            </button>
          )}
        </div>

        {/* Student list */}
        <div className="max-h-48 overflow-y-auto rounded-lg border border-[#e4e2de] bg-white divide-y divide-[#f0eeeb]">
          {available.length === 0 ? (
            <p className="text-xs text-[#9b9b9b] text-center py-3">
              {search.trim() ? 'No students match your search.' : 'All students are already members.'}
            </p>
          ) : (
            available.map((s) => {
              const isSelected = selectedIds.has(s.user_id)
              return (
                <button
                  key={s.user_id}
                  onClick={() => toggleStudent(s.user_id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                    isSelected ? 'bg-emerald-50' : 'hover:bg-[#f0eeeb]'
                  }`}
                >
                  <div className={`h-4 w-4 shrink-0 rounded border flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-[#c4c2be] bg-white'
                  }`}>
                    {isSelected && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#1a1a1a] truncate">{s.name}</p>
                    <p className="text-xs text-[#9b9b9b] truncate">{s.email}</p>
                  </div>
                </button>
              )
            })
          )}
        </div>

        <Button
          size="sm"
          onClick={handleAdd}
          disabled={isAdding || selectedIds.size === 0}
          className="bg-[#059669] hover:bg-[#047857] text-white w-full"
        >
          <UserPlus className="h-4 w-4 mr-1.5" />
          {selectedIds.size === 0
            ? 'Select students above'
            : isAdding
            ? 'Adding…'
            : `Add ${selectedIds.size} student${selectedIds.size > 1 ? 's' : ''}`}
        </Button>
      </div>

      {/* Current members */}
      {members.length === 0 ? (
        <p className="text-sm text-[#9b9b9b] text-center py-2">No members yet.</p>
      ) : (
        <div className="divide-y divide-[#f0eeeb] rounded-xl border border-[#e4e2de] overflow-hidden">
          {members.map((m) => {
            const student = studentMap.get(m.student_id)
            return (
              <div key={m.id} className="flex items-center justify-between px-4 py-3 bg-white">
                <div>
                  {student ? (
                    <>
                      <p className="text-sm font-medium text-[#1a1a1a]">{student.name}</p>
                      <p className="text-xs text-[#9b9b9b]">{student.email}</p>
                    </>
                  ) : (
                    <p className="text-xs font-mono text-[#1a1a1a]">{m.student_id}</p>
                  )}
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
            )
          })}
        </div>
      )}
    </div>
  )
}
