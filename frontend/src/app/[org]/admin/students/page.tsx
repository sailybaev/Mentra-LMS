'use client'

import { PageHeader } from '@/components/shared/PageHeader'
import { MemberTable } from './MemberTable'
import { InviteMemberDialog } from './InviteMemberDialog'
import { ImportCSVDialog } from './ImportCSVDialog'

export default function AdminMembersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Members" description="Manage organization members and roles" />
        <div className="flex items-center gap-2">
          <ImportCSVDialog />
          <InviteMemberDialog />
        </div>
      </div>
      <MemberTable />
    </div>
  )
}
