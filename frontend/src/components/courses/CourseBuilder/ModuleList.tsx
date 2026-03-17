'use client'

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { BuilderModule, BuilderLesson } from './index'
import { ModuleItem } from './ModuleItem'

interface ModuleListProps {
  courseId: string
  modules: BuilderModule[]
  onModuleUpdate: (moduleId: string, updates: Partial<BuilderModule>) => void
  onLessonsChange: (moduleId: string, lessons: BuilderLesson[]) => void
}

export function ModuleList({ courseId, modules, onModuleUpdate, onLessonsChange }: ModuleListProps) {
  return (
    <SortableContext items={modules.map((m) => m.id)} strategy={verticalListSortingStrategy}>
      <div className="space-y-2">
        {modules.map((module) => (
          <ModuleItem
            key={module.id}
            courseId={courseId}
            module={module}
            onUpdate={(updates) => onModuleUpdate(module.id, updates)}
            onLessonsChange={(lessons) => onLessonsChange(module.id, lessons)}
          />
        ))}
        {modules.length === 0 && (
          <p className="text-sm text-ink-muted text-center py-8">
            No modules yet. Click &quot;Add Module&quot; to get started.
          </p>
        )}
      </div>
    </SortableContext>
  )
}
