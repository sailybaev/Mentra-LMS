'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { AssignmentViewer } from '@/components/courses/AssignmentViewer'

export default function StudentAssignmentPage() {
  const { org, courseId, assignmentId } = useParams<{ org: string; courseId: string; assignmentId: string }>()

  return (
    <div className="max-w-2xl">
      <Link
        href={`/${org}/student/courses/${courseId}`}
        className="inline-flex items-center gap-1 text-xs text-[#9b9b9b] hover:text-[#1a1a1a] transition-colors mb-6"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Back to Course
      </Link>
      <AssignmentViewer assignmentId={assignmentId} />
    </div>
  )
}
