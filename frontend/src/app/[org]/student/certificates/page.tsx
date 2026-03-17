'use client'

import { Award, BookOpen, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function StudentCertificatesPage() {
  const { org } = useParams<{ org: string }>()

  return (
    <div className="max-w-3xl">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#1a1a1a]">Certificates</h1>
        <p className="mt-1 text-sm text-[#9b9b9b]">Your earned certificates and achievements.</p>
      </div>

      {/* Empty state */}
      <div className="border border-[#e8e8e6] rounded-lg overflow-hidden">
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
          <Award className="h-10 w-10 text-[#c9c9c9] mb-4" />
          <h2 className="text-sm font-semibold text-[#1a1a1a]">No certificates yet</h2>
          <p className="mt-1.5 text-sm text-[#9b9b9b] max-w-xs leading-relaxed">
            Complete courses to earn certificates. They'll appear here once the feature launches.
          </p>

          {/* Steps */}
          <div className="mt-8 flex flex-col gap-2 w-full max-w-xs">
            {[
              { icon: BookOpen, label: 'Complete all lessons in a course' },
              { icon: Sparkles, label: 'Pass quizzes with a qualifying score' },
              { icon: Award, label: 'Receive your certificate' },
            ].map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex items-center gap-3 text-left px-3 py-2 rounded-md hover:bg-[#f7f7f5] transition-colors">
                <span className="text-[11px] font-semibold text-[#9b9b9b] w-4 shrink-0 text-center">
                  {i + 1}
                </span>
                <Icon className="h-3.5 w-3.5 text-[#9b9b9b] shrink-0" />
                <p className="text-xs text-[#6b6b6b]">{label}</p>
              </div>
            ))}
          </div>

          <Link
            href={`/${org}/student/courses`}
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#1a1a1a] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2a2a2a] transition-colors"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Browse Courses
          </Link>
        </div>
      </div>
    </div>
  )
}
