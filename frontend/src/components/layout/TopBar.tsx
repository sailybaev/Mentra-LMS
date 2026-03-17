'use client'

import { useRouter, usePathname } from 'next/navigation'
import { LogOut, User, ChevronDown } from 'lucide-react'
import { useAuthStore } from '@/lib/stores/auth.store'
import { getRoleLabel } from '@/lib/utils/format'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const PAGE_TITLES: Record<string, string> = {
  '': 'Dashboard',
  'courses': 'My Courses',
  'progress': 'Progress',
  'ai': 'Study AI',
  'certificates': 'Certificates',
  'analytics': 'Analytics',
  'students': 'Students',
  'settings': 'Settings',
}

function usePageTitle(): string {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  const rest = segments.slice(2)
  if (rest.length === 0) return 'Dashboard'
  if (rest[0] === 'courses' && rest.length === 2) return 'Course Details'
  if (rest[0] === 'courses' && rest.length >= 4 && rest[2] === 'lessons') return 'Lesson'
  return PAGE_TITLES[rest[0]] ?? 'Page'
}

export function TopBar() {
  const router = useRouter()
  const { user, role, clearSession } = useAuthStore()
  const pageTitle = usePageTitle()

  const initials = user
    ? `${user.first_name[0] ?? ''}${user.last_name[0] ?? ''}`.toUpperCase()
    : 'U'

  const handleLogout = () => {
    clearSession()
    router.push('/login')
  }

  return (
    <header className="flex h-12 items-center justify-between border-b border-[#e8e8e6] bg-[#fbfbfa] px-5">
      <h1 className="text-sm font-semibold text-[#1a1a1a]">{pageTitle}</h1>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-7 px-2 gap-1.5 rounded-md hover:bg-[#f0efed] text-[#6b6b6b] hover:text-[#1a1a1a]"
          >
            <Avatar className="h-5 w-5">
              <AvatarFallback className="bg-[#e8e8e6] text-[#6b6b6b] text-[9px] font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium hidden sm:block">{user?.first_name}</span>
            <ChevronDown className="h-3 w-3 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="pb-1.5">
            <p className="text-xs font-semibold text-[#1a1a1a]">{user?.first_name} {user?.last_name}</p>
            <p className="text-[11px] text-[#9b9b9b] font-normal mt-0.5">{user?.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 text-xs">
            <User className="h-3.5 w-3.5" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="gap-2 text-xs text-destructive focus:text-destructive"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
