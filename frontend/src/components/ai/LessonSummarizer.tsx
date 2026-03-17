'use client'

import { useState } from 'react'
import { FileText, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useSummarizeLesson } from '@/lib/queries/ai.queries'
import { useCourses } from '@/lib/queries/courses.queries'
import { useModules } from '@/lib/queries/modules.queries'
import { useLessons } from '@/lib/queries/lessons.queries'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'

export function LessonSummarizer() {
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedModule, setSelectedModule] = useState('')
  const [selectedLesson, setSelectedLesson] = useState('')
  const [summary, setSummary] = useState('')

  const { data: courses } = useCourses({ page: 1, page_size: 100 })
  const { data: modules = [] } = useModules(selectedCourse)
  const { data: lessons = [] } = useLessons(selectedModule)
  const summarize = useSummarizeLesson()

  const handleSummarize = async () => {
    if (!selectedLesson) { toast.error('Select a lesson first'); return }
    try {
      const result = await summarize.mutateAsync(selectedLesson)
      setSummary(result.summary)
      toast.success('Summary generated!')
    } catch {
      toast.error('Failed to generate summary.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label>Course</Label>
          <Select value={selectedCourse} onValueChange={(v) => { setSelectedCourse(v); setSelectedModule(''); setSelectedLesson('') }}>
            <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
            <SelectContent>
              {(courses?.data ?? []).map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Module</Label>
          <Select value={selectedModule} onValueChange={(v) => { setSelectedModule(v); setSelectedLesson('') }} disabled={!selectedCourse}>
            <SelectTrigger><SelectValue placeholder="Select module" /></SelectTrigger>
            <SelectContent>
              {modules.map((m) => <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Lesson</Label>
          <Select value={selectedLesson} onValueChange={setSelectedLesson} disabled={!selectedModule}>
            <SelectTrigger><SelectValue placeholder="Select lesson" /></SelectTrigger>
            <SelectContent>
              {lessons.map((l) => <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={handleSummarize} disabled={!selectedLesson || summarize.isPending}>
        {summarize.isPending ? (
          <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Summarizing...</>
        ) : (
          <><FileText className="h-4 w-4 mr-2" /> Generate Summary</>
        )}
      </Button>
      {summary && (
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">{summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
