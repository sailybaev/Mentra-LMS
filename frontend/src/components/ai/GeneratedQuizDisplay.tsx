'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { QuizDTO } from '@/types/quiz'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface GeneratedQuizDisplayProps {
  quiz: QuizDTO
}

export function GeneratedQuizDisplay({ quiz }: GeneratedQuizDisplayProps) {
  const [showAnswers, setShowAnswers] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{quiz.questions.length} questions generated</p>
        <button
          onClick={() => setShowAnswers(!showAnswers)}
          className="text-xs text-accent hover:underline"
        >
          {showAnswers ? 'Hide answers' : 'Show answers'}
        </button>
      </div>
      {quiz.questions.map((q, qi) => (
        <Card key={q.id}>
          <CardContent className="pt-4 pb-4">
            <p className="text-sm font-medium mb-3">{qi + 1}. {q.question}</p>
            <div className="space-y-1.5">
              {q.answers.map((a) => (
                <div
                  key={a.id}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                    showAnswers && a.is_correct
                      ? 'bg-green-50 text-green-800'
                      : 'bg-muted/50'
                  }`}
                >
                  {showAnswers && (
                    a.is_correct
                      ? <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                      : <XCircle className="h-4 w-4 text-ink-subtle shrink-0" />
                  )}
                  <span>{a.answer}</span>
                  {showAnswers && a.is_correct && (
                    <Badge variant="success" className="ml-auto text-xs">Correct</Badge>
                  )}
                </div>
              ))}
            </div>
            {showAnswers && q.explanation && (
              <p className="mt-3 text-xs text-ink-muted border-t pt-2">{q.explanation}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
