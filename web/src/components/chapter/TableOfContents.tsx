'use client'

import { useChapter } from './SectionProvider'

export default function TableOfContents() {
  const { toc } = useChapter()

  if (toc.length === 0) return null

  return (
    <nav
      aria-label="Sommaire du chapitre"
      className="sticky top-0 z-40 -mx-6 bg-db-bg/95 backdrop-blur border-b border-db-border"
    >
      <div className="flex items-center gap-1 overflow-x-auto py-2 px-6">
        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.18em] text-db-dim mr-2">
          Sommaire
        </span>
        {toc.map((sec) => (
          <div key={sec.id} className="group relative shrink-0">
            <a
              href={`#${sec.id}`}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-db-muted hover:text-db-text hover:bg-db-surface transition-colors"
            >
              <span className="font-mono text-[10px] text-db-accent">{sec.num}</span>
              <span className="max-w-[11rem] truncate">{sec.title}</span>
            </a>
            {sec.subs.length > 0 && (
              <div className="absolute left-0 top-full hidden group-hover:block group-focus-within:block min-w-[18rem] p-1.5 bg-db-panel border border-db-border rounded-lg shadow-2xl z-50">
                <div className="text-[10px] uppercase tracking-wider text-db-dim px-2.5 pt-1 pb-1.5">
                  {sec.num} — sous-sections
                </div>
                {sec.subs.map((sub) => (
                  <a
                    key={sub.id}
                    href={`#${sub.id}`}
                    className="flex items-baseline gap-2 px-2.5 py-1.5 rounded-md text-xs text-db-muted hover:text-db-text hover:bg-db-surface"
                  >
                    <span className="font-mono text-[10px] text-db-dim shrink-0">{sub.num}</span>
                    <span>{sub.title}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  )
}