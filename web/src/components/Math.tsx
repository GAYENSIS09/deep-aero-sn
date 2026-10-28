'use client'

import { useEffect, useRef } from 'react'
import katex from 'katex'

interface MathProps {
  children: string
  display?: boolean
  className?: string
}

export function Math({ children, display = false, className = '' }: MathProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(children, ref.current, {
          displayMode: display,
          throwOnError: false,
          trust: true,
          strict: false,
          macros: {
            '\\R': '\\mathbb{R}',
            '\\indicator': '\\mathbf{1}',
          },
        })
      } catch {
        if (ref.current) {
          ref.current.textContent = children
        }
      }
    }
  }, [children, display])

  return display ? (
    <div className={`bg-db-surface border border-db-border rounded-xl p-5 my-6 overflow-x-auto ${className}`}>
      <span ref={ref} />
    </div>
  ) : (
    <span ref={ref} className={className} />
  )
}

export function MathBlock({ tex, className = '' }: { tex: string; className?: string }) {
  return <Math display className={className}>{tex}</Math>
}

export function MathInline({ tex, className = '' }: { tex: string; className?: string }) {
  return <Math className={className}>{tex}</Math>
}
