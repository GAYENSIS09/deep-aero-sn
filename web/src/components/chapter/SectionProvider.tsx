'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

export interface TocSubEntry {
  id: string
  num: string
  title: string
}

export interface TocSectionEntry {
  id: string
  num: string
  title: string
  subs: TocSubEntry[]
}

interface ChapterCtx {
  chapterNum: number
  registerSection: (id: string, title: string) => string
  registerSubSection: (title: string) => string
  currentSectionId: () => string
  nextFigure: () => number
  nextTable: () => number
  toc: TocSectionEntry[]
}

const ChapterContext = createContext<ChapterCtx | null>(null)

export function useChapter(): ChapterCtx {
  const ctx = useContext(ChapterContext)
  if (!ctx) {
    throw new Error('useChapter doit être utilisé dans un ChapterProvider')
  }
  return ctx
}

export function ChapterProvider({
  chapterNum,
  children,
}: {
  chapterNum: number
  children: React.ReactNode
}) {
  const secCount = useRef(0)
  const figCount = useRef(0)
  const tabCount = useRef(0)
  const lastSectionId = useRef('')
  const registry = useRef<TocSectionEntry[]>([])
  const [toc, setToc] = useState<TocSectionEntry[]>([])

  useEffect(() => {
    setToc([...registry.current])
  }, [])

  const registerSection = useCallback(
    (id: string, title: string) => {
      secCount.current += 1
      const num = `${chapterNum}.${secCount.current}`
      lastSectionId.current = id
      registry.current.push({ id, num, title, subs: [] })
      return num
    },
    [chapterNum],
  )

  const registerSubSection = useCallback((title: string) => {
    const sec = registry.current[registry.current.length - 1]
    const num = `${sec.num}.${sec.subs.length + 1}`
    sec.subs.push({ id: `${sec.id}-s${sec.subs.length + 1}`, num, title })
    return num
  }, [])

  const currentSectionId = useCallback(() => lastSectionId.current, [])

  const nextFigure = useCallback(() => {
    figCount.current += 1
    return figCount.current
  }, [])

  const nextTable = useCallback(() => {
    tabCount.current += 1
    return tabCount.current
  }, [])

  const ctx = useMemo<ChapterCtx>(
    () => ({
      chapterNum,
      registerSection,
      registerSubSection,
      currentSectionId,
      nextFigure,
      nextTable,
      toc,
    }),
    [chapterNum, registerSection, registerSubSection, currentSectionId, nextFigure, nextTable, toc],
  )

  return <ChapterContext.Provider value={ctx}>{children}</ChapterContext.Provider>
}