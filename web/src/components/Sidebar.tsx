'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import clsx from 'clsx'
import { asset } from '@/lib/paths'
import ThemeToggle from './ThemeToggle'

const isActive = (pathname: string, href: string) => {
  if (href === '/') return pathname === '/'
  return pathname.startsWith(href)
}

interface ChapterItem {
  href: string
  num: string
  label: string
}

interface MemoirPart {
  id: string
  num: string
  items: ChapterItem[]
}

/* ──────────────────────────────────────────────────────────────────── */
/* Sommaire du mémoire — la navigation est la table des matières        */
/* ──────────────────────────────────────────────────────────────────── */

const parts: MemoirPart[] = [
  {
    id: 'introduction',
    num: '0',
    items: [
      { href: '/chapitres/introduction/', num: '00', label: 'Introduction générale' },
    ],
  },
  {
    id: 'partie-i',
    num: 'I',
    items: [
      { href: '/chapitres/1-transition/', num: '01', label: 'Transition énergétique' },
      { href: '/chapitres/2-physique/', num: '02', label: 'Physique PV & éolien' },
    ],
  },
  {
    id: 'partie-ii',
    num: 'II',
    items: [
      { href: '/chapitres/4-fondations/', num: '04', label: 'Fondations ML' },
      { href: '/chapitres/5-modeles/', num: '05', label: 'Modèles temporels' },
      { href: '/chapitres/6-architectures/', num: '06', label: 'Architectures avancées' },
      { href: '/chapitres/7-strategies/', num: '07', label: 'Stratégies de prévision' },
    ],
  },
  {
    id: 'partie-iii',
    num: 'III',
    items: [
      { href: '/chapitres/8-etudes-cas/', num: '08', label: 'Étude de cas : Diass' },
    ],
  },
]

/* ──────────────────────────────────────────────────────────────────── */

export default function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const nav = (
    <nav className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-db-border">
        <div className="flex items-center justify-between gap-2">
          <Link href="/" className="block">
            <div className="text-sm font-semibold text-db-text tracking-tight">Deep Aero SN</div>
            <div className="text-[11px] text-db-dim mt-0.5">Mémoire de licence</div>
          </Link>
          <ThemeToggle />
        </div>
      </div>

      {/* Sommaire */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {parts.map((part, i) => (
          <div key={part.id} className={clsx(i > 0 && 'mt-3 pt-3 border-t border-db-border')}>
            <div className="space-y-0.5">
              {part.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    'flex items-baseline gap-3 px-3 py-1.5 text-sm rounded-md transition-colors',
                    isActive(pathname, item.href)
                      ? 'bg-db-accent/10 text-db-accent'
                      : 'text-db-muted hover:bg-db-surface hover:text-db-text'
                  )}
                >
                  <span
                    className={clsx(
                      'font-mono text-[11px] w-5 shrink-0',
                      isActive(pathname, item.href) ? 'text-db-accent' : 'text-db-dim'
                    )}
                  >
                    {item.num}
                  </span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Soutenance */}
      <div className="px-6 py-4 border-t border-db-border">
        <Link
          href="/presentation/"
          onClick={() => setMobileOpen(false)}
          className={clsx(
            'flex items-baseline gap-3 px-3 py-1.5 text-sm rounded-md transition-colors',
            isActive(pathname, '/presentation/')
              ? 'bg-db-accent/10 text-db-accent'
              : 'text-db-muted hover:bg-db-surface hover:text-db-text'
          )}
        >
          <span className="font-mono text-[11px] w-5 shrink-0 text-db-dim">PT</span>
          <span>Soutenance</span>
        </Link>
      </div>

      {/* Auteur */}
      <div className="px-6 py-4 border-t border-db-border flex items-center gap-3">
        <img
            src={asset('/images/author.png')}
          alt="Baye Mor Gaye"
          className="w-8 h-8 rounded-full object-cover border border-db-border"
        />
        <div className="text-xs text-db-muted">Baye Mor Gaye</div>
      </div>
    </nav>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-db-surface border border-db-border rounded-lg"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-screen w-64 bg-db-bg border-r border-db-border z-50 transition-transform lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {nav}
      </aside>
    </>
  )
}