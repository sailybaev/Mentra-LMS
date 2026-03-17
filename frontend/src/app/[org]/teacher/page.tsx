'use client'

import { useParams, useRouter } from 'next/navigation'
import { BookOpen, Plus } from 'lucide-react'
import { useCourses } from '@/lib/queries/courses.queries'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { CourseGrid } from '@/components/courses/CourseGrid'

export default function TeacherDashboard() {
  const { org } = useParams<{ org: string }>()
  const router = useRouter()
  const { data, isLoading } = useCourses()

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Courses"
        description="Courses you're teaching"
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
        emptyAction={
          <Button onClick={() => router.push(`/${org}/teacher/courses/new`)}>Create first course</Button>
        }
      />
    </div>
  )
}
