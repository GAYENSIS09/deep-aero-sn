'use client'

interface VideoPlayerProps {
  src: string
  poster?: string
  title?: string
}

export default function VideoPlayer({ src, poster, title }: VideoPlayerProps) {
  return (
    <div className="my-8 rounded-2xl overflow-hidden border border-db-border bg-db-surface glow-sm">
      {title && (
        <div className="px-5 py-3 border-b border-db-border">
          <h3 className="text-sm font-semibold text-db-text">{title}</h3>
        </div>
      )}
      <video
        className="w-full aspect-video"
        controls
        preload="metadata"
        poster={poster}
      >
        <source src={src} type="video/mp4" />
        Votre navigateur ne supporte pas la lecture vidéo.
      </video>
    </div>
  )
}
