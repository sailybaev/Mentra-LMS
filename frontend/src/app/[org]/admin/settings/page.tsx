'use client'

import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/lib/stores/auth.store'

export default function AdminSettingsPage() {
  const { orgSlug, user } = useAuthStore()

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Settings" description="Organization configuration" />
      <Card>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-ink-muted">Slug</p>
            <p className="text-sm font-medium">{orgSlug}</p>
          </div>
          <div>
            <p className="text-xs text-ink-muted">Admin</p>
            <p className="text-sm font-medium">{user?.first_name} {user?.last_name}</p>
          </div>
          <div>
            <p className="text-xs text-ink-muted">Email</p>
            <p className="text-sm font-medium">{user?.email}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
