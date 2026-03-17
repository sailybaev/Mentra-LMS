'use client'

import Link from 'next/link'
import { BookOpen, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { CourseDTO } from '@/types/course'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { formatDate, truncate } from '@/lib/utils/format'

interface CourseCardProps {
  course: CourseDTO
  basePath: string
  onDelete?: (id: string) => void
}

export function CourseCard({ course, basePath, onDelete }: CourseCardProps) {
  return (
    <div className="group relative flex flex-col rounded-xl border border-[#e8e8e6] bg-white p-5 transition-all duration-200 hover:border-[#d0d0cc] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] cursor-pointer">
      <Link href={`${basePath}/courses/${course.id}`} className="absolute inset-0 rounded-xl" aria-label={course.title} />
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f0faf5] border border-[#d1f0e3]">
          <BookOpen className="h-4 w-4 text-[#059669]" />
        </div>
        {onDelete && (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative z-10 h-7 w-7 -mr-1 opacity-0 group-hover:opacity-100 transition-opacity text-[#9b9b9b] hover:text-[#1a1a1a]"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`${basePath}/courses/${course.id}`}>
                  <Pencil className="h-4 w-4 mr-2" /> Edit
                </Link>
              </DropdownMenuItem>
              <ConfirmDialog
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                }
                title="Delete course?"
                description={`"${course.title}" will be permanently deleted.`}
                confirmLabel="Delete"
                onConfirm={() => onDelete(course.id)}
                destructive
              />
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold text-[#1a1a1a] line-clamp-2 leading-snug">
          {course.title}
        </p>
        {course.description && (
          <p className="mt-2 text-[13px] text-[#8a8a8a] line-clamp-2 leading-relaxed">
            {truncate(course.description, 110)}
          </p>
        )}
      </div>

      <p className="mt-4 pt-4 border-t border-[#f0f0ee] text-[11px] text-[#b8b8b4] tracking-wide uppercase">
        Updated {formatDate(course.updated_at)}
      </p>
    </div>
  )
}
