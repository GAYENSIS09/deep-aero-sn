interface QuoteProps {
  author?: string
  children: React.ReactNode
}

export default function Quote({ author, children }: QuoteProps) {
  return (
    <blockquote className="border-l-4 border-db-accent/40 pl-4 py-2 my-6 italic text-db-muted">
      {children}
      {author && (
        <footer className="text-xs text-db-dim mt-2 not-italic">— {author}</footer>
      )}
    </blockquote>
  )
}
