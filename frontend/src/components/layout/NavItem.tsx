'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface NavItemProps {
  href: string
  label: string
  icon: LucideIcon
}

export function NavItem({ href, label, icon: Icon }: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(href + '/')

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
        isActive
          ? 'bg-[#f0efed] text-[#1a1a1a] font-medium'
          : 'text-[#6b6b6b] hover:bg-[#f0efed] hover:text-[#3b3b3b] font-normal'
      )}
    >
      <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-[#3b3b3b]' : 'text-[#9b9b9b]')} />
      {label}
    </Link>
  )
}
