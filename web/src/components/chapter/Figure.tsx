'use client'

import { useRef } from 'react'
import { useChapter } from './SectionProvider'
import { asset } from '@/lib/paths'

interface FigureProps {
  src?: string
  alt?: string
  caption: React.ReactNode
  children?: React.ReactNode
  heightClass?: string
}

export default function Figure({ src, alt = '', caption, children, heightClass = 'h-72 md:h-80' }: FigureProps) {
  const { chapterNum, nextFigure } = useChapter()
  // Numérotation stable : le compteur n'est incrémenté qu'au premier rendu.
  const n = useRef<number>(0)
  if (!n.current) n.current = nextFigure()

  return (
    <figure className="my-10">
      <div
        className={`${heightClass} rounded-xl border border-db-border bg-db-surface/60 p-3 flex items-center justify-center overflow-hidden`}
      >
        {src ? (
          <img src={asset(src)} alt={alt} className="max-w-full max-h-full object-contain" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">{children}</div>
        )}
      </div>
      <figcaption className="mt-3 text-sm text-db-muted text-center">
        <span className="font-medium text-db-text">Figure {chapterNum}.{n.current}</span>
        <span className="mx-1.5 text-db-dim">—</span>
        {caption}
      </figcaption>
    </figure>
  )
}