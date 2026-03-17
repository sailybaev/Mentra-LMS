import { Link2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LinkViewerProps {
  linkUrl: string
  title: string
  content?: string
}

export function LinkViewer({ linkUrl, title, content }: LinkViewerProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[#e4e2de] bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0">
            <Link2 className="h-5 w-5 text-sky-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#1a1a1a]">{title}</p>
            {content && (
              <p className="mt-1.5 text-sm text-[#6b6b6b] leading-relaxed">{content}</p>
            )}
            <p className="mt-2 text-xs text-[#9b9b9b] truncate">{linkUrl}</p>
          </div>
        </div>
        <div className="mt-5">
          <Button
            onClick={() => window.open(linkUrl, '_blank', 'noopener,noreferrer')}
            className="bg-[#059669] hover:bg-[#047857] text-white gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Open Link
          </Button>
        </div>
      </div>
    </div>
  )
}
