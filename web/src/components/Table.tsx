'use client'

import clsx from 'clsx'
import { useRef } from 'react'
import { useChapter } from './chapter/SectionProvider'

interface TableProps {
  caption?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function Table({ caption, children, className }: TableProps) {
  const { chapterNum, nextTable } = useChapter()
  // Numérotation stable : le compteur n'est incrémenté qu'au premier rendu.
  const n = useRef<number>(0)
  if (caption !== undefined && !n.current) n.current = nextTable()

  return (
    <div className={clsx('my-8', className)}>
      {caption && (
        <div className="text-sm text-db-muted mb-2 text-center">
          <span className="font-semibold text-db-text">Tableau {chapterNum}.{n.current}</span>
          <span className="mx-1.5 text-db-dim">—</span>
          {caption}
        </div>
      )}
      <div className="overflow-x-auto border border-db-border rounded-xl">
        <table className="w-full text-sm text-left">
          {children}
        </table>
      </div>
    </div>
  )
}

export function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={clsx('px-4 py-3 text-xs font-semibold uppercase tracking-wider text-db-dim bg-db-surface border-b border-db-border', className)}>
      {children}
    </th>
  )
}

export function Td({ children, className, colSpan }: { children?: React.ReactNode; className?: string; colSpan?: number }) {
  return (
    <td colSpan={colSpan} className={clsx('px-4 py-3 border-b border-db-border/50 text-db-muted', className)}>
      {children ?? '\u00A0'}
    </td>
  )
}

export function Tr({ children, className }: { children: React.ReactNode; className?: string }) {
  return <tr className={clsx('hover:bg-db-surface/50 transition', className)}>{children}</tr>
}