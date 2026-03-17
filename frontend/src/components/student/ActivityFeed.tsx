'use client'

import { CheckCircle2, Circle } from 'lucide-react'
import { ProgressDTO } from '@/types/progress'
import { formatDate } from '@/lib/utils/format'

interface ActivityFeedProps {
  progress: ProgressDTO[]
}

export function ActivityFeed({ progress }: ActivityFeedProps) {
  const recent = [...progress]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8)

  return (
    <div className="flex flex-col">
      <p className="text-xs font-semibold text-[#6b6b6b] uppercase tracking-widest mb-3">Recent Activity</p>

      {recent.length === 0 ? (
        <p className="text-sm text-[#9b9b9b] py-2">No activity yet.</p>
      ) : (
        <div className="divide-y divide-[#e8e8e6] border border-[#e8e8e6] rounded-lg overflow-hidden">
          {recent.map((p) => (
            <div key={p.id} className="flex items-center gap-3 px-3.5 py-2.5">
              {p.completed
                ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#059669]" />
                : <Circle className="h-3.5 w-3.5 shrink-0 text-[#c9c9c9]" />
              }
              <span className="flex-1 text-sm text-[#3b3b3b] truncate">
                {p.completed ? 'Completed lesson' : 'Started lesson'}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                {p.score != null && (
                  <span className="text-xs font-semibold text-[#059669]">{p.score}%</span>
                )}
                <span className="text-[11px] text-[#9b9b9b]">{formatDate(p.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
