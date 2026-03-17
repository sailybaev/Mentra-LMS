'use client'

import { ProgressDTO } from '@/types/progress'
import { CourseDTO } from '@/types/course'

interface StatsStripProps {
  progress: ProgressDTO[]
  courses: CourseDTO[]
}

export function StatsStrip({ progress, courses }: StatsStripProps) {
  const completed = progress.filter((p) => !!p.completed_at)
  const withScore = completed.filter((p) => p.score != null)
  const avgScore = withScore.length
    ? Math.round(withScore.reduce((s, p) => s + (p.score ?? 0), 0) / withScore.length)
    : null
  const activeCourses = courses.filter((c) => c.status === 'published').length
  const completionRate = progress.length > 0
    ? Math.round((completed.length / progress.length) * 100)
    : null

  const stats = [
    { label: 'Lessons completed', value: completed.length },
    { label: 'Average score', value: avgScore != null ? `${avgScore}%` : '—' },
    { label: 'Active courses', value: activeCourses },
    { label: 'Completion rate', value: completionRate != null ? `${completionRate}%` : '—' },
  ]

  return (
    <div className="grid grid-cols-4 divide-x divide-[#e8e8e6] border border-[#e8e8e6] rounded-lg overflow-hidden">
      {stats.map(({ label, value }) => (
        <div key={label} className="px-5 py-4 bg-[#fbfbfa]">
          <p className="text-[11px] text-[#9b9b9b] font-medium">{label}</p>
          <p className="mt-1 text-xl font-bold text-[#1a1a1a] tracking-tight">{value}</p>
        </div>
      ))}
    </div>
  )
}
