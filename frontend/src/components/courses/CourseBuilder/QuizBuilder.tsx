'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useQuizByLesson, useCreateQuiz, useUpdateQuiz } from '@/lib/queries/quiz.queries'
import { generateQuiz } from '@/lib/api/ai'

interface LocalAnswer {
  answer: string
  is_correct: boolean
}

interface LocalQuestion {
  question: string
  position: number
  answers: LocalAnswer[]
}

interface QuizBuilderProps {
  lessonId: string
}

function emptyQuestion(position: number): LocalQuestion {
  return {
    question: '',
    position,
    answers: [
      { answer: '', is_correct: false },
      { answer: '', is_correct: false },
    ],
  }
}

export function QuizBuilder({ lessonId }: QuizBuilderProps) {
  const { data: existingQuiz, isLoading } = useQuizByLesson(lessonId)
  const createQuiz = useCreateQuiz(lessonId)
  const updateQuiz = useUpdateQuiz(lessonId)

  const [title, setTitle] = useState('Quiz')
  const [questions, setQuestions] = useState<LocalQuestion[]>([emptyQuestion(0)])
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!isLoading && !initialized) {
      if (existingQuiz) {
        setTitle(existingQuiz.title)
        setQuestions(
          existingQuiz.questions.map((q) => ({
            question: q.question,
            position: q.position,
            answers: q.answers.map((a) => ({ answer: a.answer, is_correct: a.is_correct })),
          }))
        )
      }
      setInitialized(true)
    }
  }, [existingQuiz, isLoading, initialized])

  const addQuestion = () => {
    setQuestions((prev) => [...prev, emptyQuestion(prev.length)])
  }

  const removeQuestion = (qi: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== qi).map((q, i) => ({ ...q, position: i })))
  }

  const updateQuestion = (qi: number, text: string) => {
    setQuestions((prev) => prev.map((q, i) => (i === qi ? { ...q, question: text } : q)))
  }

  const addAnswer = (qi: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qi ? { ...q, answers: [...q.answers, { answer: '', is_correct: false }] } : q
      )
    )
  }

  const removeAnswer = (qi: number, ai: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qi ? { ...q, answers: q.answers.filter((_, j) => j !== ai) } : q
      )
    )
  }

  const updateAnswer = (qi: number, ai: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qi
          ? { ...q, answers: q.answers.map((a, j) => (j === ai ? { ...a, answer: text } : a)) }
          : q
      )
    )
  }

  const setCorrect = (qi: number, ai: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qi
          ? {
              ...q,
              answers: q.answers.map((a, j) => ({ ...a, is_correct: j === ai })),
            }
          : q
      )
    )
  }

  const handleSave = async () => {
    for (const q of questions) {
      if (!q.question.trim()) {
        toast.error('All questions must have text')
        return
      }
      if (q.answers.length < 2) {
        toast.error('Each question must have at least 2 answers')
        return
      }
      if (!q.answers.some((a) => a.is_correct)) {
        toast.error('Each question must have one correct answer')
        return
      }
    }

    setSaving(true)
    try {
      const payload = { title, questions }
      if (existingQuiz) {
        await updateQuiz.mutateAsync({ quizId: existingQuiz.id, data: payload })
      } else {
        await createQuiz.mutateAsync(payload)
      }
      toast.success('Quiz saved')
    } catch {
      toast.error('Failed to save quiz')
    } finally {
      setSaving(false)
    }
  }

  const handleGenerateAI = async () => {
    setGenerating(true)
    try {
      const result = await generateQuiz({ lesson_id: lessonId, num_questions: 5 })
      if (result.questions?.length) {
        setTitle(title || 'Quiz')
        setQuestions(
          result.questions.map((q, i) => ({
            question: q.question,
            position: i,
            answers: (q.answers || []).map((a) => ({
              answer: a.answer,
              is_correct: a.is_correct,
            })),
          }))
        )
        toast.success('Quiz generated — review and save')
      }
    } catch {
      toast.error('AI generation failed')
    } finally {
      setGenerating(false)
    }
  }

  if (isLoading) {
    return <p className="text-sm text-ink-muted py-2">Loading quiz…</p>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Quiz Builder</Label>
        <Button
          size="sm"
          variant="outline"
          onClick={handleGenerateAI}
          disabled={generating}
          className="gap-1.5"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {generating ? 'Generating…' : 'Generate with AI'}
        </Button>
      </div>

      <div className="space-y-1.5">
        <Label>Quiz Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Quiz title" />
      </div>

      <div className="space-y-3">
        {questions.map((q, qi) => (
          <div key={qi} className="rounded-md border p-3 space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-xs text-ink-muted pt-2 w-5 shrink-0">{qi + 1}.</span>
              <Input
                value={q.question}
                onChange={(e) => updateQuestion(qi, e.target.value)}
                placeholder="Question text"
                className="flex-1"
              />
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-destructive hover:text-destructive shrink-0"
                onClick={() => removeQuestion(qi)}
                disabled={questions.length <= 1}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="pl-7 space-y-1.5">
              {q.answers.map((a, ai) => (
                <div key={ai} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${qi}`}
                    checked={a.is_correct}
                    onChange={() => setCorrect(qi, ai)}
                    className="accent-accent-600 shrink-0"
                    title="Mark as correct answer"
                  />
                  <Input
                    value={a.answer}
                    onChange={(e) => updateAnswer(qi, ai, e.target.value)}
                    placeholder={`Answer ${ai + 1}`}
                    className="flex-1 h-8 text-sm"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive shrink-0"
                    onClick={() => removeAnswer(qi, ai)}
                    disabled={q.answers.length <= 2}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs gap-1 text-ink-muted"
                onClick={() => addAnswer(qi)}
              >
                <Plus className="h-3 w-3" />
                Add answer
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={addQuestion} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Add Question
        </Button>
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save Quiz'}
        </Button>
      </div>
    </div>
  )
}
