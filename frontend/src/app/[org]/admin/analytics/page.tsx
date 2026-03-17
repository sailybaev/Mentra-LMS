'use client'

import { BarChart2, BookOpen, TrendingUp, Users } from 'lucide-react'
import { useCourses } from '@/lib/queries/courses.queries'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/analytics/StatCard'
import { ProgressChart } from '@/components/analytics/ProgressChart'
import { ScoreDistribution } from '@/components/analytics/ScoreDistribution'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Mock data — replace with real API when analytics endpoints are added
const mockProgressData = [
  { label: 'Mon', value: 12 },
  { label: 'Tue', value: 19 },
  { label: 'Wed', value: 15 },
  { label: 'Thu', value: 27 },
  { label: 'Fri', value: 22 },
  { label: 'Sat', value: 8 },
  { label: 'Sun', value: 5 },
]

const mockScoreData = [
  { range: '0-20', count: 2 },
  { range: '21-40', count: 5 },
  { range: '41-60', count: 12 },
  { range: '61-80', count: 18 },
  { range: '81-100', count: 9 },
]

export default function AdminAnalyticsPage() {
  const { data: courses } = useCourses({ page: 1, page_size: 100 })
  const totalCourses = courses?.meta?.total ?? 0

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Organization-wide learning metrics" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Courses" value={totalCourses} icon={BookOpen} />
        <StatCard title="Active Learners" value="—" icon={Users} description="Coming soon" />
        <StatCard title="Avg. Completion" value="—" icon={TrendingUp} description="Coming soon" />
        <StatCard title="Avg. Score" value="—" icon={BarChart2} description="Coming soon" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressChart data={mockProgressData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ScoreDistribution data={mockScoreData} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
