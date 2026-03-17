'use client'

import { PageHeader } from '@/components/shared/PageHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { QuizGenerator } from '@/components/ai/QuizGenerator'
import { LessonSummarizer } from '@/components/ai/LessonSummarizer'

export default function TeacherAIPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="AI Tools" description="AI-powered teaching assistants" />
      <Tabs defaultValue="quiz">
        <TabsList>
          <TabsTrigger value="quiz">Quiz Generator</TabsTrigger>
          <TabsTrigger value="summary">Lesson Summarizer</TabsTrigger>
        </TabsList>
        <TabsContent value="quiz" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Generate Quiz</CardTitle></CardHeader>
            <CardContent><QuizGenerator /></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="summary" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Summarize Lesson</CardTitle></CardHeader>
            <CardContent><LessonSummarizer /></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
