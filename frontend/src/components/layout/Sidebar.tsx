'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  LayoutDashboard, BookOpen, Users, BarChart2, Sparkles, Settings,
  GraduationCap, Award, User,
} from 'lucide-react'
import { useAuthStore } from '@/lib/stores/auth.store'
import { NavItem } from './NavItem'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function Sidebar() {
  const { org } = useParams<{ org: string }>()
  const { role, user } = useAuthStore()

  const adminNav = [
    { href: `/${org}/admin`, label: 'Dashboard', icon: LayoutDashboard },
    { href: `/${org}/admin/courses`, label: 'Courses', icon: BookOpen },
    { href: `/${org}/admin/groups`, label: 'Groups', icon: Users },
    { href: `/${org}/admin/students`, label: 'Students', icon: Users },
    { href: `/${org}/admin/analytics`, label: 'Analytics', icon: BarChart2 },
    { href: `/${org}/admin/ai`, label: 'AI Tools', icon: Sparkles },
    { href: `/${org}/admin/settings`, label: 'Settings', icon: Settings },
  ]

  const teacherNav = [
    { href: `/${org}/teacher`, label: 'Dashboard', icon: LayoutDashboard },
    { href: `/${org}/teacher/courses`, label: 'My Courses', icon: BookOpen },
    { href: `/${org}/teacher/students`, label: 'Students', icon: Users },
    { href: `/${org}/teacher/analytics`, label: 'Analytics', icon: BarChart2 },
    { href: `/${org}/teacher/ai`, label: 'AI Tools', icon: Sparkles },
  ]

  const studentNav = [
    { href: `/${org}/student`, label: 'Dashboard', icon: LayoutDashboard },
    { href: `/${org}/student/courses`, label: 'My Courses', icon: BookOpen },
    { href: `/${org}/student/progress`, label: 'Progress', icon: GraduationCap },
    { href: `/${org}/student/ai`, label: 'Study AI', icon: Sparkles },
    { href: `/${org}/student/certificates`, label: 'Certificates', icon: Award },
    { href: `/${org}/student/profile`, label: 'Profile', icon: User },
  ]

  const navItems =
    role === 'admin' || role === 'super_admin' ? adminNav :
    role === 'teacher' ? teacherNav :
    studentNav

  const initials = user
    ? `${user.first_name[0] ?? ''}${user.last_name[0] ?? ''}`.toUpperCase()
    : 'U'

  const fullName = user ? `${user.first_name} ${user.last_name}` : 'User'

  return (
    <aside className="flex h-full w-56 flex-col bg-[#fbfbfa] border-r border-[#e8e8e6]">
      {/* Brand */}
      <div className="flex h-12 items-center gap-2.5 px-4">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#1a1a1a] text-white text-[11px] font-bold">
          M
        </div>
        <span className="text-sm font-semibold text-[#1a1a1a] tracking-tight">Mentra</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-1">
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-[#e8e8e6] px-2 py-2">
        <div className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-[#f0efed] transition-colors cursor-pointer">
          <Avatar className="h-5 w-5 shrink-0">
            <AvatarFallback className="bg-[#e8e8e6] text-[#6b6b6b] text-[9px] font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-[#3b3b3b] truncate">{fullName}</span>
        </div>
      </div>
    </aside>
  )
}
