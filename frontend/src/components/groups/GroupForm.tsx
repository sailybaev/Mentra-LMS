'use client'

import { useState, useEffect } from 'react'
import { GroupDTO, CreateGroupInput } from '@/types/group'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

interface GroupFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: CreateGroupInput) => Promise<void>
  defaultValues?: GroupDTO
  isPending?: boolean
}

export function GroupForm({ open, onOpenChange, onSubmit, defaultValues, isPending }: GroupFormProps) {
  const [name, setName] = useState('')
  const [teacherId, setTeacherId] = useState('')

  useEffect(() => {
    if (defaultValues) {
      setName(defaultValues.name)
      setTeacherId(defaultValues.teacher_id ?? '')
    } else {
      setName('')
      setTeacherId('')
    }
  }, [defaultValues, open])

  const handleSubmit = async () => {
    if (!name.trim()) return
    await onSubmit({
      name: name.trim(),
      teacher_id: teacherId.trim() || undefined,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{defaultValues ? 'Edit Group' : 'Create Group'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Group Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Group A"
              className="border-[#e4e2de]"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Teacher ID <span className="text-[#9b9b9b] font-normal">(optional)</span></Label>
            <Input
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              placeholder="UUID of assigned teacher"
              className="border-[#e4e2de]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !name.trim()}
            className="bg-[#059669] hover:bg-[#047857] text-white"
          >
            {isPending ? 'Saving...' : defaultValues ? 'Save Changes' : 'Create Group'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
