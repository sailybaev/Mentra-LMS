'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthSession, Role, UserDTO } from '@/types/auth'

interface AuthState {
  token: string | undefined
  user: UserDTO | undefined
  role: Role | undefined
  orgSlug: string | undefined
  expiresAt: string | undefined
  setSession: (session: AuthSession) => void
  setOrgSlug: (slug: string) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: undefined,
      user: undefined,
      role: undefined,
      orgSlug: undefined,
      expiresAt: undefined,

      setSession: (session: AuthSession) => {
        set({
          token: session.token,
          user: session.user,
          role: session.role,
          orgSlug: session.orgSlug,
          expiresAt: session.expiresAt,
        })
        // Set cookie so Next.js middleware can read role
        if (typeof document !== 'undefined') {
          document.cookie = `mentra-role=${session.role}; path=/; max-age=${60 * 60 * 24 * 7}`
          document.cookie = `mentra-org=${session.orgSlug}; path=/; max-age=${60 * 60 * 24 * 7}`
        }
      },

      setOrgSlug: (slug: string) => {
        set({ orgSlug: slug })
      },

      clearSession: () => {
        set({
          token: undefined,
          user: undefined,
          role: undefined,
          orgSlug: undefined,
          expiresAt: undefined,
        })
        if (typeof document !== 'undefined') {
          document.cookie = 'mentra-role=; path=/; max-age=0'
          document.cookie = 'mentra-org=; path=/; max-age=0'
        }
      },
    }),
    {
      name: 'mentra-auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        role: state.role,
        orgSlug: state.orgSlug,
        expiresAt: state.expiresAt,
      }),
    }
  )
)
