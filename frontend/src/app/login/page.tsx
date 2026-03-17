import { Suspense } from 'react'
import Link from 'next/link'
import { LoginPageContent } from './LoginPageContent'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white font-bold text-lg">
            M
          </div>
          <h1 className="text-2xl font-semibold text-ink">Welcome back</h1>
          <p className="mt-1 text-sm text-ink-muted">Super admin access</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <Suspense>
            <LoginPageContent />
          </Suspense>
        </div>
        <p className="mt-4 text-center text-sm text-ink-muted">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-accent hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
