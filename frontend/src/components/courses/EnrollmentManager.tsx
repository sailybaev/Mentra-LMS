'use client'

import { Users } from 'lucide-react'
import { useEnrollments } from '@/lib/queries/enrollments.queries'
import { EmptyState } from '@/components/shared/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils/format'

interface EnrollmentManagerProps {
  courseId: string
}

export function EnrollmentManager({ courseId }: EnrollmentManagerProps) {
  const { data: enrollments = [], isLoading } = useEnrollments(courseId)

  if (isLoading) {
    return <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-muted">{enrollments.length} enrolled students</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button size="sm" disabled>Enroll Student</Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>Coming soon — enrollment endpoints not yet available</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {enrollments.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students enrolled"
          description="Enrollment management coming soon"
        />
      ) : (
        <div className="divide-y rounded-lg border">
          {enrollments.map((enrollment) => (
            <div key={enrollment.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium">{enrollment.user_id}</p>
                <p className="text-xs text-ink-muted">Enrolled {formatDate(enrollment.enrolled_at)}</p>
              </div>
              <Badge variant={enrollment.status === 'active' ? 'success' : 'secondary'}>
                {enrollment.status}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
