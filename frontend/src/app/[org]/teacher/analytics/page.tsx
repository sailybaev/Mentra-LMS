'use client'

import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProgressChart } from '@/components/analytics/ProgressChart'

const mockData = [
  { label: 'Week 1', value: 8 },
  { label: 'Week 2', value: 14 },
  { label: 'Week 3', value: 11 },
  { label: 'Week 4', value: 19 },
]

export default function TeacherAnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Your course performance" />
      <Card>
        <CardHeader><CardTitle className="text-sm">Student Activity</CardTitle></CardHeader>
        <CardContent><ProgressChart data={mockData} /></CardContent>
      </Card>
    </div>
  )
}
