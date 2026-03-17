'use client'

import { Building2, Users } from 'lucide-react'
import { useSystemStats } from '@/lib/queries/super-admin.queries'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

function StatCard({ title, value, icon: Icon }: {
  title: string
  value: string | number
  icon: React.ElementType
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-ink-muted">{title}</CardTitle>
        <Icon className="h-4 w-4 text-ink-muted" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-ink">{value}</div>
      </CardContent>
    </Card>
  )
}

export default function SuperAdminDashboard() {
  const { data: stats, isLoading } = useSystemStats()

  return (
    <div className="space-y-6">
      <PageHeader title="Platform Dashboard" description="System-wide overview" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-28" />)
        ) : (
          <>
            <StatCard title="Total Organizations" value={stats?.total_orgs ?? 0} icon={Building2} />
            <StatCard title="Total Users" value={stats?.total_users ?? 0} icon={Users} />
          </>
        )}
      </div>
    </div>
  )
}
