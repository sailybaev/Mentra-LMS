'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { LoginForm } from '@/components/auth/LoginForm'

export function OrgLoginContent() {
  const { org } = useParams<{ org: string }>()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') ?? ''

  return <LoginForm orgSlug={org} returnTo={returnTo} />
}
