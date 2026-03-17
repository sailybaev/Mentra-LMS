'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { useCreateAnnouncement } from '@/lib/queries/announcements.queries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog'

interface AnnouncementFormProps {
  courseId: string
}

export function AnnouncementForm({ courseId }: AnnouncementFormProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const createAnnouncement = useCreateAnnouncement(courseId)

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return
    try {
      await createAnnouncement.mutateAsync({ title: title.trim(), content: content.trim() })
      toast.success('Announcement posted')
      setTitle('')
      setContent('')
      setOpen(false)
    } catch {
      toast.error('Failed to post announcement')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-[#059669] hover:bg-[#047857] text-white">
          <Plus className="h-4 w-4 mr-1.5" />
          New Announcement
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Announcement</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Announcement title..."
              className="border-[#e4e2de]"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Content</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              placeholder="Write your announcement..."
              className="border-[#e4e2de] resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={createAnnouncement.isPending || !title.trim() || !content.trim()}
            className="bg-[#059669] hover:bg-[#047857] text-white"
          >
            {createAnnouncement.isPending ? 'Posting...' : 'Post'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
