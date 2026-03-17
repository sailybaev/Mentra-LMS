'use client'

import { useParams, useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useCourses, useDeleteCourse } from '@/lib/queries/courses.queries'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { CourseGrid } from '@/components/courses/CourseGrid'

export default function TeacherCoursesPage() {
  const { org } = useParams<{ org: string }>()
  const router = useRouter()
  const { data, isLoading } = useCourses()
  const deleteCourse = useDeleteCourse()

  const handleDelete = async (id: string) => {
    try {
      await deleteCourse.mutateAsync(id)
      toast.success('Course deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Courses"
        actions={
          <Button onClick={() => router.push(`/${org}/teacher/courses/new`)}>
            <Plus className="h-4 w-4 mr-2" /> New Course
          </Button>
        }
      />
      <CourseGrid
        courses={data?.data ?? []}
        isLoading={isLoading}
        basePath={`/${org}/teacher`}
        onDelete={handleDelete}
      />
    </div>
  )
}
