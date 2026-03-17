'use client'

import { Users } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'

export default function TeacherStudentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Students" />
      <EmptyState
        icon={Users}
        title="Student list coming soon"
        description="View students enrolled in your courses"
      />
    </div>
  )
}
