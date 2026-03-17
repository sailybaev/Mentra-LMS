import { Suspense } from 'react'
import Link from 'next/link'
import { RegisterPageContent } from './RegisterPageContent'

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white font-bold text-lg">
            M
          </div>
          <h1 className="text-2xl font-semibold text-ink">Create account</h1>
          <p className="mt-1 text-sm text-ink-muted">Join your Mentra workspace</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <Suspense>
            <RegisterPageContent />
          </Suspense>
        </div>
        <p className="mt-4 text-center text-sm text-ink-muted">
          Already have an account?{' '}
          <Link href="/login" className="text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
