'use client'

import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { useMe, useUpdateProfile } from '@/lib/queries/users.queries'
import { useAuthStore } from '@/lib/stores/auth.store'
import { formatDate } from '@/lib/utils/format'
import { getRoleLabel } from '@/lib/utils/format'
import { toast } from 'sonner'

export default function StudentProfilePage() {
  const { data: profile, isLoading } = useMe()
  const { mutate: updateProfile, isPending } = useUpdateProfile()
  const { role } = useAuthStore()

  const [name, setName] = useState('')
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (profile) setName(profile.name)
  }, [profile])

  function handleSave() {
    const trimmed = name.trim()
    if (!trimmed) {
      toast.error('Name cannot be empty')
      return
    }
    updateProfile(
      { name: trimmed },
      {
        onSuccess: () => {
          toast.success('Profile updated')
          setEditing(false)
        },
        onError: (err) => {
          const message = (err as { response?: { data?: { error?: { message?: string } } } })
            .response?.data?.error?.message ?? 'Failed to update profile'
          toast.error(message)
        },
      }
    )
  }

  function handleCancel() {
    if (profile) setName(profile.name)
    setEditing(false)
  }

  return (
    <div className="max-w-2xl">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#1a1a1a]">Profile</h1>
        <p className="mt-1 text-sm text-[#9b9b9b]">Manage your account details.</p>
      </div>

      {/* Account section */}
      <div className="border border-[#e8e8e6] rounded-lg overflow-hidden mb-6">
        <div className="px-5 py-3 border-b border-[#e8e8e6] bg-[#fbfbfa]">
          <p className="text-xs font-semibold text-[#6b6b6b] uppercase tracking-widest">Account</p>
        </div>

        <div className="divide-y divide-[#e8e8e6]">
          {/* Name row */}
          <div className="flex items-center gap-4 px-5 py-3.5">
            <span className="w-28 text-xs font-medium text-[#9b9b9b] shrink-0">Name</span>
            {isLoading ? (
              <Skeleton className="h-4 w-40" />
            ) : editing ? (
              <div className="flex flex-1 items-center gap-2">
                <input
                  className="flex-1 rounded-md border border-[#e8e8e6] bg-white px-2.5 py-1 text-sm text-[#1a1a1a] outline-none focus:border-[#1a1a1a] transition-colors"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave()
                    if (e.key === 'Escape') handleCancel()
                  }}
                  autoFocus
                />
                <button
                  onClick={handleSave}
                  disabled={isPending}
                  className="rounded-md bg-[#1a1a1a] px-3 py-1 text-xs font-medium text-white hover:bg-[#2d2d2d] disabled:opacity-50 transition-colors"
                >
                  {isPending ? 'Saving…' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  className="rounded-md border border-[#e8e8e6] px-3 py-1 text-xs font-medium text-[#6b6b6b] hover:bg-[#f0efed] transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-between">
                <span className="text-sm text-[#1a1a1a]">{profile?.name ?? '—'}</span>
                <button
                  onClick={() => setEditing(true)}
                  className="text-xs text-[#9b9b9b] hover:text-[#3b3b3b] transition-colors"
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* Email row */}
          <div className="flex items-center gap-4 px-5 py-3.5">
            <span className="w-28 text-xs font-medium text-[#9b9b9b] shrink-0">Email</span>
            {isLoading ? (
              <Skeleton className="h-4 w-48" />
            ) : (
              <span className="text-sm text-[#3b3b3b]">{profile?.email ?? '—'}</span>
            )}
          </div>

          {/* Role row */}
          <div className="flex items-center gap-4 px-5 py-3.5">
            <span className="w-28 text-xs font-medium text-[#9b9b9b] shrink-0">Role</span>
            {isLoading ? (
              <Skeleton className="h-4 w-20" />
            ) : (
              <span className="text-sm text-[#3b3b3b]">{getRoleLabel(role ?? 'student')}</span>
            )}
          </div>
        </div>
      </div>

      {/* Metadata section */}
      <div className="border border-[#e8e8e6] rounded-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-[#e8e8e6] bg-[#fbfbfa]">
          <p className="text-xs font-semibold text-[#6b6b6b] uppercase tracking-widest">Membership</p>
        </div>

        <div className="divide-y divide-[#e8e8e6]">
          <div className="flex items-center gap-4 px-5 py-3.5">
            <span className="w-28 text-xs font-medium text-[#9b9b9b] shrink-0">Member since</span>
            {isLoading ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              <span className="text-sm text-[#3b3b3b]">
                {profile?.created_at ? formatDate(profile.created_at) : '—'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 px-5 py-3.5">
            <span className="w-28 text-xs font-medium text-[#9b9b9b] shrink-0">Last updated</span>
            {isLoading ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              <span className="text-sm text-[#3b3b3b]">
                {profile?.updated_at ? formatDate(profile.updated_at) : '—'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
