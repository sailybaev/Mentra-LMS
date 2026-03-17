'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { QuizQuestion } from '@/types/quiz'
import { Button } from '@/components/ui/button'

interface QuizViewerProps {
  questions: QuizQuestion[]
  onComplete?: (score: number) => void
}

export function QuizViewer({ questions, onComplete }: QuizViewerProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSelect = (questionId: string, answerId: string) => {
    if (submitted) return
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerId }))
  }

  const handleSubmit = () => {
    const correct = questions.filter((q) => {
      const selectedId = selectedAnswers[q.id]
      return q.answers.find((a) => a.id === selectedId)?.is_correct
    }).length
    const pct = Math.round((correct / questions.length) * 100)
    setScore(pct)
    setSubmitted(true)
    onComplete?.(pct)
  }

  const allAnswered = questions.every((q) => selectedAnswers[q.id])

  return (
    <div className="space-y-6">
      {questions.map((q, qi) => (
        <div key={q.id} className="space-y-3">
          <p className="text-sm font-medium">{qi + 1}. {q.text}</p>
          <div className="space-y-2">
            {q.answers.map((a) => {
              const isSelected = selectedAnswers[q.id] === a.id
              const isCorrect = a.is_correct
              let cls = 'flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer text-sm transition-colors '
              if (submitted) {
                if (isSelected && isCorrect) cls += 'border-green-500 bg-green-50 text-green-800'
                else if (isSelected && !isCorrect) cls += 'border-red-400 bg-red-50 text-red-700'
                else if (isCorrect) cls += 'border-green-300 bg-green-50/50 text-green-700'
                else cls += 'border-muted bg-muted/20 text-ink-muted'
              } else {
                cls += isSelected ? 'border-accent bg-accent-light text-accent' : 'border-input hover:border-accent/50 hover:bg-muted/30'
              }
              return (
                <div key={a.id} className={cls} onClick={() => handleSelect(q.id, a.id)}>
                  {submitted && isSelected && (isCorrect
                    ? <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                    : <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                  )}
                  {a.text}
                </div>
              )
            })}
          </div>
          {submitted && q.explanation && (
            <p className="text-xs text-ink-muted bg-muted/50 rounded px-3 py-2">{q.explanation}</p>
          )}
        </div>
      ))}
      {!submitted ? (
        <Button onClick={handleSubmit} disabled={!allAnswered}>
          Submit Quiz
        </Button>
      ) : (
        <div className="rounded-lg border bg-muted/30 p-4 text-center">
          <p className="text-2xl font-bold text-ink">{score}%</p>
          <p className="text-sm text-ink-muted mt-1">
            {score >= 70 ? 'Great job!' : 'Keep practicing!'}
          </p>
        </div>
      )}
    </div>
  )
}
