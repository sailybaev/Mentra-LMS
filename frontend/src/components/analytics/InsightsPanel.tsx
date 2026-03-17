'use client'

import { Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface InsightsPanelProps {
  insights?: string
  isLoading?: boolean
}

export function InsightsPanel({ insights, isLoading }: InsightsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Sparkles className="h-4 w-4 text-accent" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        ) : insights ? (
          <p className="text-sm text-ink-muted leading-relaxed whitespace-pre-wrap">{insights}</p>
        ) : (
          <p className="text-sm text-ink-muted">No insights available. Generate them from the AI Tools page.</p>
        )}
      </CardContent>
    </Card>
  )
}
