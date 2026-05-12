'use client'

import { Sparkles, FileText, Layers } from 'lucide-react'
import { QuizGenerator } from '@/components/ai/QuizGenerator'
import { LessonSummarizer } from '@/components/ai/LessonSummarizer'
import { FlashcardGenerator } from '@/components/ai/FlashcardGenerator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const tabCls = 'h-8 rounded-none border-b-2 border-transparent px-4 gap-2 text-xs text-[#9b9b9b] font-medium data-[state=active]:border-[#1a1a1a] data-[state=active]:text-[#1a1a1a] data-[state=active]:bg-transparent data-[state=active]:shadow-none'

export default function StudentAIPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#1a1a1a]">Study AI</h1>
        <p className="mt-1 text-sm text-[#9b9b9b]">
          Generate quizzes, flashcards, and lesson summaries powered by Ollama.
        </p>
      </div>

      <Tabs defaultValue="quiz">
        <TabsList className="h-8 bg-transparent border-b border-[#e8e8e6] p-0 w-full justify-start rounded-none gap-0 mb-6">
          <TabsTrigger value="quiz" className={tabCls}>
            <Sparkles className="h-3.5 w-3.5" />
            Quiz Generator
          </TabsTrigger>
          <TabsTrigger value="flashcards" className={tabCls}>
            <Layers className="h-3.5 w-3.5" />
            Flashcards
          </TabsTrigger>
          <TabsTrigger value="summary" className={tabCls}>
            <FileText className="h-3.5 w-3.5" />
            Summarize Lesson
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quiz">
          <div className="border border-[#e8e8e6] rounded-lg overflow-hidden">
            <div className="border-b border-[#e8e8e6] px-5 py-3.5 bg-[#fbfbfa]">
              <p className="text-xs font-semibold text-[#6b6b6b] uppercase tracking-widest">Quiz Generator</p>
              <p className="text-xs text-[#9b9b9b] mt-0.5">Select a lesson and let AI generate practice questions.</p>
            </div>
            <div className="p-5"><QuizGenerator /></div>
          </div>
        </TabsContent>

        <TabsContent value="flashcards">
          <div className="border border-[#e8e8e6] rounded-lg overflow-hidden">
            <div className="border-b border-[#e8e8e6] px-5 py-3.5 bg-[#fbfbfa]">
              <p className="text-xs font-semibold text-[#6b6b6b] uppercase tracking-widest">Flashcard Generator</p>
              <p className="text-xs text-[#9b9b9b] mt-0.5">Generate term/definition cards to study key concepts.</p>
            </div>
            <div className="p-5"><FlashcardGenerator /></div>
          </div>
        </TabsContent>

        <TabsContent value="summary">
          <div className="border border-[#e8e8e6] rounded-lg overflow-hidden">
            <div className="border-b border-[#e8e8e6] px-5 py-3.5 bg-[#fbfbfa]">
              <p className="text-xs font-semibold text-[#6b6b6b] uppercase tracking-widest">Lesson Summarizer</p>
              <p className="text-xs text-[#9b9b9b] mt-0.5">Get a concise AI summary to review key concepts quickly.</p>
            </div>
            <div className="p-5"><LessonSummarizer /></div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
