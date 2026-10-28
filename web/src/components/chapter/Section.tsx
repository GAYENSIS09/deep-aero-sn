'use client'

import { useId, useRef } from 'react'
import { useChapter } from './SectionProvider'

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { registerSection } = useChapter()
  const rawId = useId()
  const id = `sec-${rawId.replace(/[^a-zA-Z0-9]/g, '')}`
  // Numérotation stable : enregistrée une seule fois.
  const numRef = useRef<string | null>(null)
  if (!numRef.current) numRef.current = registerSection(id, title)
  const num = numRef.current

  return (
    <section id={id} className="scroll-mt-28">
      <h2>
        <span className="section-num">{num}</span>
        {title}
      </h2>
      {children}
    </section>
  )
}

export function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  const { registerSubSection, currentSectionId } = useChapter()
  const rawId = useId()
  const id = `${currentSectionId()}-s${rawId.replace(/[^a-zA-Z0-9]/g, '')}`
  // Numérotation stable : enregistrée une seule fois.
  const numRef = useRef<string | null>(null)
  if (!numRef.current) numRef.current = registerSubSection(title)
  const num = numRef.current

  return (
    <div id={id} className="scroll-mt-28">
      <h3>
        <span className="section-num">{num}</span>
        {title}
      </h3>
      {children}
    </div>
  )
}