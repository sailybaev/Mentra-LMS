'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth.store'
import { ReAuthModal } from '@/components/auth/ReAuthModal'

export default function OrgLayout({ children }: { children: React.ReactNode }) {
  const { org } = useParams<{ org: string }>()
  const setOrgSlug = useAuthStore((s) => s.setOrgSlug)

  useEffect(() => {
    if (org) setOrgSlug(org)
  }, [org, setOrgSlug])

  return (
    <>
      {children}
      <ReAuthModal />
    </>
  )
}
