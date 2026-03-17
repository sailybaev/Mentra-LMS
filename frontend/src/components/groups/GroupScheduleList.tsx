'use client'

import { useState } from 'react'
import { Clock, MapPin, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useGroupSchedules, useAddSchedule, useDeleteSchedule } from '@/lib/queries/groups.queries'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

interface GroupScheduleListProps {
  courseId: string
  groupId: string
}

export function GroupScheduleList({ courseId, groupId }: GroupScheduleListProps) {
  const { data: schedulesData, isLoading } = useGroupSchedules(courseId, groupId)
  const addSchedule = useAddSchedule(courseId, groupId)
  const deleteSchedule = useDeleteSchedule(courseId, groupId)

  const [showForm, setShowForm] = useState(false)
  const [dayOfWeek, setDayOfWeek] = useState('1')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [location, setLocation] = useState('')

  const schedules = Array.isArray(schedulesData) ? schedulesData : []

  const handleAdd = async () => {
    if (!startTime || !endTime) return
    try {
      await addSchedule.mutateAsync({
        day_of_week: parseInt(dayOfWeek),
        start_time: startTime,
        end_time: endTime,
        location: location.trim() || undefined,
      })
      toast.success('Schedule added')
      setShowForm(false)
      setStartTime('')
      setEndTime('')
      setLocation('')
    } catch {
      toast.error('Failed to add schedule')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteSchedule.mutateAsync(id)
      toast.success('Schedule removed')
    } catch {
      toast.error('Failed to remove schedule')
    }
  }

  if (isLoading) {
    return <div className="space-y-2">{[1, 2].map((i) => <Skeleton key={i} className="h-12" />)}</div>
  }

  return (
    <div className="space-y-4">
      {schedules.length === 0 ? (
        <p className="text-sm text-[#9b9b9b] py-3 text-center">No schedule entries yet.</p>
      ) : (
        <div className="divide-y divide-[#f0eeeb] rounded-xl border border-[#e4e2de] overflow-hidden">
          {schedules.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-4 py-3 bg-white">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-[#1a1a1a] w-24">{DAYS[s.day_of_week]}</span>
                <div className="flex items-center gap-1 text-xs text-[#6b6b6b]">
                  <Clock className="h-3 w-3" />
                  {s.start_time} – {s.end_time}
                </div>
                {s.location && (
                  <div className="flex items-center gap-1 text-xs text-[#9b9b9b]">
                    <MapPin className="h-3 w-3" />
                    {s.location}
                  </div>
                )}
              </div>
              <ConfirmDialog
                trigger={
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-[#9b9b9b] hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                }
                title="Remove schedule?"
                description="This schedule entry will be deleted."
                confirmLabel="Remove"
                onConfirm={() => handleDelete(s.id)}
                destructive
              />
            </div>
          ))}
        </div>
      )}

      {showForm ? (
        <div className="rounded-xl border border-[#e4e2de] bg-white p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Day</Label>
              <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                <SelectTrigger className="border-[#e4e2de] h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map((d, i) => (
                    <SelectItem key={i} value={String(i)}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Location</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Room 101..."
                className="border-[#e4e2de] h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Start Time</Label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border-[#e4e2de] h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">End Time</Label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border-[#e4e2de] h-9 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={addSchedule.isPending || !startTime || !endTime}
              className="bg-[#059669] hover:bg-[#047857] text-white"
            >
              {addSchedule.isPending ? 'Adding...' : 'Add'}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <Button size="sm" variant="outline" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-1.5" />
          Add Schedule
        </Button>
      )}
    </div>
  )
}
