'use client'

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { BuilderLesson } from './index'
import { LessonItem } from './LessonItem'

interface LessonListProps {
  moduleId: string
  lessons: BuilderLesson[]
  onLessonsChange: (lessons: BuilderLesson[]) => void
}

export function LessonList({ moduleId, lessons, onLessonsChange }: LessonListProps) {
  const handleLessonUpdate = (lessonId: string, updates: Partial<BuilderLesson>) => {
    onLessonsChange(lessons.map((l) => l.id === lessonId ? { ...l, ...updates, _dirty: true } : l))
  }

  const handleLessonDelete = (lessonId: string) => {
    onLessonsChange(lessons.filter((l) => l.id !== lessonId))
  }

  return (
    <SortableContext items={lessons.map((l) => l.id)} strategy={verticalListSortingStrategy}>
      <div className="space-y-1">
        {lessons.map((lesson) => (
          <LessonItem
            key={lesson.id}
            moduleId={moduleId}
            lesson={lesson}
            onUpdate={(updates) => handleLessonUpdate(lesson.id, updates)}
            onDelete={() => handleLessonDelete(lesson.id)}
          />
        ))}
        {lessons.length === 0 && (
          <p className="text-xs text-ink-muted py-2 pl-2">No lessons. Click + to add one.</p>
        )}
      </div>
    </SortableContext>
  )
}
