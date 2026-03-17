'use client'

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { QuizDTO } from '@/types/quiz'
import { useGenerateQuiz } from '@/lib/queries/ai.queries'
import { useCourses } from '@/lib/queries/courses.queries'
import { useModules } from '@/lib/queries/modules.queries'
import { useLessons } from '@/lib/queries/lessons.queries'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { GeneratedQuizDisplay } from './GeneratedQuizDisplay'

export function QuizGenerator() {
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedModule, setSelectedModule] = useState('')
  const [selectedLesson, setSelectedLesson] = useState('')
  const [numQuestions, setNumQuestions] = useState(3)
  const [result, setResult] = useState<QuizDTO | null>(null)

  const { data: courses } = useCourses({ page: 1, page_size: 100 })
  const { data: modules = [] } = useModules(selectedCourse)
  const { data: lessons = [] } = useLessons(selectedModule)
  const generateQuiz = useGenerateQuiz()

  const handleGenerate = async () => {
    if (!selectedLesson) {
      toast.error('Select a lesson first')
      return
    }
    try {
      const quiz = await generateQuiz.mutateAsync({ lesson_id: selectedLesson, num_questions: numQuestions })
      setResult(quiz)
      toast.success('Quiz generated!')
    } catch {
      toast.error('Failed to generate quiz. Check that the lesson has content.')
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
          <Label>Questions</Label>
          <Input
            type="number"
            min={1}
            max={10}
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
          />
        </div>
      </div>
      <Button onClick={handleGenerate} disabled={!selectedLesson || generateQuiz.isPending}>
        {generateQuiz.isPending ? (
          <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
        ) : (
          <><Sparkles className="h-4 w-4 mr-2" /> Generate Quiz</>
        )}
      </Button>
      {result && <GeneratedQuizDisplay quiz={result} />}
    </div>
  )
}
