'use client'

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { FlashcardDTO } from '@/lib/api/ai'
import { useGenerateFlashcards } from '@/lib/queries/ai.queries'
import { useCourses } from '@/lib/queries/courses.queries'
import { useModules } from '@/lib/queries/modules.queries'
import { useLessons } from '@/lib/queries/lessons.queries'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { FlashcardDeck } from './FlashcardDeck'

export function FlashcardGenerator() {
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedModule, setSelectedModule] = useState('')
  const [selectedLesson, setSelectedLesson] = useState('')
  const [numCards, setNumCards] = useState(8)
  const [result, setResult] = useState<FlashcardDTO[] | null>(null)

  const { data: courses } = useCourses({ page: 1, page_size: 100 })
  const { data: modules = [] } = useModules(selectedCourse)
  const { data: lessons = [] } = useLessons(selectedModule)
  const generateFlashcards = useGenerateFlashcards()

  const handleGenerate = async () => {
    if (!selectedLesson) {
      toast.error('Select a lesson first')
      return
    }
    try {
      const cards = await generateFlashcards.mutateAsync({ lessonId: selectedLesson, numCards })
      setResult(cards)
      toast.success('Flashcards generated!')
    } catch {
      toast.error('Failed to generate flashcards. Check that the lesson has content.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              {modules.map((m) => (
                <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Lesson</Label>
          <Select value={selectedLesson} onValueChange={setSelectedLesson} disabled={!selectedModule}>
            <SelectTrigger><SelectValue placeholder="Select lesson" /></SelectTrigger>
            <SelectContent>
              {lessons.map((l) => (
                <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Cards</Label>
          <Input
            type="number"
            min={3}
            max={20}
            value={numCards}
            onChange={(e) => setNumCards(Number(e.target.value))}
          />
        </div>
      </div>
      <Button onClick={handleGenerate} disabled={!selectedLesson || generateFlashcards.isPending}>
        {generateFlashcards.isPending ? (
          <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
        ) : (
          <><Sparkles className="h-4 w-4 mr-2" /> Generate Flashcards</>
        )}
      </Button>
      {result && result.length > 0 && <FlashcardDeck cards={result} />}
    </div>
  )
}
