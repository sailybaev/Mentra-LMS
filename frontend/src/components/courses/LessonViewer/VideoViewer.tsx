'use client'

interface VideoViewerProps {
  videoUrl: string
  title: string
}

export function VideoViewer({ videoUrl, title }: VideoViewerProps) {
  return (
    <div className="space-y-4">
      <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
        <video
          controls
          className="h-full w-full"
          title={title}
        >
          <source src={videoUrl} />
          Your browser does not support the video element.
        </video>
      </div>
    </div>
  )
}
