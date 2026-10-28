'use client'

import { useRef } from 'react'
import { asset } from '@/lib/paths'

export default function VideoBlock() {
  const ref = useRef<HTMLVideoElement>(null)

  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <video
        ref={ref}
        controls
        preload="metadata"
        playsInline
        className="w-full aspect-video rounded-xl border border-db-border bg-black"
      >
        <source src={asset('/video/IA_Energie_au_Senegal.mp4')} type="video/mp4" />
      </video>
      <div>
        <h3 className="text-xl font-bold text-db-text uppercase tracking-tight">En quelques minutes</h3>
        <p className="text-sm text-db-muted mt-3 leading-relaxed">
          Le contexte du projet, la problématique, les données utilisées, les architectures étudiées
          et les objectifs de la plateforme.
        </p>
        <button
          onClick={() => ref.current?.play()}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-db-accent text-black text-sm font-semibold hover:bg-db-accent/85 transition-colors"
        >
          <span aria-hidden>▶</span>
          Regarder la présentation
        </button>
      </div>
    </div>
  )
}