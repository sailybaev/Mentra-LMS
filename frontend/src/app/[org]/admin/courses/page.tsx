'use client'

import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { useCourses, useDeleteCourse } from '@/lib/queries/courses.queries'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { CourseGrid } from '@/components/courses/CourseGrid'

export default function AdminCoursesPage() {
  const { org } = useParams<{ org: string }>()
  const router = useRouter()
  const { data, isLoading } = useCourses()
  const deleteCourse = useDeleteCourse()

  const handleDelete = async (id: string) => {
    try {
      await deleteCourse.mutateAsync(id)
      toast.success('Course deleted')
    } catch {
      toast.error('Failed to delete course')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses"
        description="Manage all courses in your organization"
        actions={
          <Button onClick={() => router.push(`/${org}/admin/courses/new`)}>
            <Plus className="h-4 w-4 mr-2" /> New Course
          </Button>
        }
      />
      <CourseGrid
        courses={data?.data ?? []}
        isLoading={isLoading}
        basePath={`/${org}/admin`}
        onDelete={handleDelete}
        emptyAction={
          <Button onClick={() => router.push(`/${org}/admin/courses/new`)}>
            Create first course
          </Button>
        }
      />
    </div>
  )
}
