'use client'

import { useRouter } from 'next/navigation'
import { LayoutDashboard, Building2, Users, UserPlus, LogOut } from 'lucide-react'
import { useAuthStore } from '@/lib/stores/auth.store'
import { NavItem } from './NavItem'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const navItems = [
  { href: '/super-admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/super-admin/orgs', label: 'Organizations', icon: Building2 },
  { href: '/super-admin/users', label: 'All Users', icon: Users },
  { href: '/super-admin/invite', label: 'Invite Admin', icon: UserPlus },
]

export function SuperAdminSidebar() {
  const router = useRouter()
  const { user, clearSession } = useAuthStore()

  const initials = user
    ? `${user.first_name[0] ?? ''}${user.last_name[0] ?? ''}`.toUpperCase()
    : 'SA'

  const handleLogout = () => {
    clearSession()
    router.push('/login')
  }

  return (
    <aside className="flex h-full w-56 flex-col bg-[#fbfbfa] border-r border-[#e8e8e6]">
      <div className="flex h-12 items-center gap-2.5 px-4">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#1a1a1a] text-white text-[11px] font-bold">
          M
        </div>
        <span className="text-sm font-semibold text-[#1a1a1a] tracking-tight">Mentra Admin</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-1">
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      <div className="border-t border-[#e8e8e6] px-2 py-2 space-y-1">
        <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
          <Avatar className="h-5 w-5 shrink-0">
            <AvatarFallback className="bg-[#e8e8e6] text-[#6b6b6b] text-[9px] font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-[#3b3b3b] truncate">{user?.email}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-[#6b6b6b] hover:bg-[#f0efed] hover:text-[#1a1a1a] transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
