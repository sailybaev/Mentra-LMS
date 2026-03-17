'use client'

import { useSearchParams } from 'next/navigation'
import { RegisterForm } from '@/components/auth/RegisterForm'

export function RegisterPageContent() {
  const searchParams = useSearchParams()
  const org = searchParams.get('org') ?? ''
  return <RegisterForm defaultOrgSlug={org} />
}
