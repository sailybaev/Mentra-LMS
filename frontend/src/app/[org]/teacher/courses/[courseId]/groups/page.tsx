'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Users } from 'lucide-react'
import { useCourse } from '@/lib/queries/courses.queries'
import { GroupList } from '@/components/groups/GroupList'
import { Skeleton } from '@/components/ui/skeleton'

export default function TeacherCourseGroupsPage() {
  const { org, courseId } = useParams<{ org: string; courseId: string }>()
  const { data: course, isLoading } = useCourse(courseId)

  if (isLoading) {
    return (
      <div className="max-w-4xl space-y-4 py-6">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl py-2">
      <Link
        href={`/${org}/teacher/courses/${courseId}`}
        className="inline-flex items-center gap-1 text-xs text-[#9b9b9b] hover:text-[#1a1a1a] transition-colors mb-5"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Back to Course
      </Link>

      <div className="mb-7">
        <div className="flex items-center gap-2.5 mb-1.5">
          <Users className="h-5 w-5 text-[#6b6b6b]" />
          <h1 className="text-[1.4rem] font-bold tracking-tight text-[#1a1a1a]">
            Groups — {course?.title}
          </h1>
        </div>
        <p className="text-sm text-[#6b6b6b]">Manage student groups, schedules, and teacher assignments.</p>
      </div>

      <GroupList courseId={courseId} />
    </div>
  )
}
