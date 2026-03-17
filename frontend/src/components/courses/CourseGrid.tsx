import { CourseDTO } from '@/types/course'
import { CourseCard } from './CourseCard'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/shared/EmptyState'
import { BookOpen } from 'lucide-react'

interface CourseGridProps {
  courses: CourseDTO[]
  isLoading?: boolean
  basePath: string
  onDelete?: (id: string) => void
  emptyAction?: React.ReactNode
}

export function CourseGrid({ courses, isLoading, basePath, onDelete, emptyAction }: CourseGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No courses yet"
        description="Create your first course to get started"
        action={emptyAction}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} basePath={basePath} onDelete={onDelete} />
      ))}
    </div>
  )
}
