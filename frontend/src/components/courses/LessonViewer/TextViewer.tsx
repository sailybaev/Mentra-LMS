interface TextViewerProps {
  content: string
}

export function TextViewer({ content }: TextViewerProps) {
  return (
    <div className="prose prose-sm max-w-none text-ink leading-relaxed">
      <div className="whitespace-pre-wrap">{content}</div>
    </div>
  )
}
