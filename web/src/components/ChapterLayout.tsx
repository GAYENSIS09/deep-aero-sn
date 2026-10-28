'use client'

import Sidebar from './Sidebar'
import { ChapterProvider } from './chapter/SectionProvider'
import TableOfContents from './chapter/TableOfContents'

interface ChapterLayoutProps {
  part?: string
  chapterNum: number
  title: string
  children: React.ReactNode
  showHeader?: boolean
}

export default function ChapterLayout({ part, chapterNum, title, children, showHeader = true }: ChapterLayoutProps) {
  return (
    <div className="min-h-screen bg-db-bg">
      <Sidebar />
      <main className="lg:ml-72">
        <div className="max-w-4xl mx-auto px-6">
          <ChapterProvider chapterNum={chapterNum}>
            {showHeader && (
              <header className="pt-12 pb-5">
                {part && (
                  <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-db-dim mb-3">
                    {part}
                  </div>
                )}
                <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-db-accent mb-2">
                  Chapitre {String(chapterNum).padStart(2, '0')}
                </div>
                <h1 className="text-3xl md:text-[2.5rem] font-serif font-semibold text-db-text leading-[1.15] tracking-tight">
                  {title}
                </h1>
                <div className="w-28 h-[3px] bg-db-accent/70 mt-7 rounded-full" />
              </header>
            )}
            <TableOfContents />
            <article className="prose-db py-8 pb-20">{children}</article>
          </ChapterProvider>
        </div>
      </main>
    </div>
  )
}