import { FileText, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PDFViewerProps {
  fileUrl: string
  title: string
}

export function PDFViewer({ fileUrl, title }: PDFViewerProps) {
  const absoluteUrl = fileUrl.startsWith('http') ? fileUrl : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') ?? 'http://localhost:8080'}/${fileUrl.replace(/^\//, '')}`

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#9b9b9b]" />
          <span className="text-sm font-medium text-[#1a1a1a]">{title}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(absoluteUrl, '_blank')}
          className="gap-1.5"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open PDF
        </Button>
      </div>
      <div className="rounded-xl border border-[#e4e2de] overflow-hidden bg-[#f7f6f3]" style={{ height: '70vh' }}>
        <iframe
          src={absoluteUrl}
          title={title}
          className="w-full h-full"
          loading="lazy"
        />
      </div>
    </div>
  )
}
