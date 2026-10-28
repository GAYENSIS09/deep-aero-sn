'use client'

import React from 'react'
import clsx from 'clsx'
import { MathBlock } from './Math'

export type Accent = 'accent' | 'solar' | 'wind' | 'forecast' | 'info' | 'warn'

const accentStyles: Record<Accent, { text: string; border: string; bg: string; bar: string; dot: string }> = {
  accent: {
    text: 'text-db-accent',
    border: 'border-db-accent/40',
    bg: 'bg-db-accent/10',
    bar: 'bg-db-accent',
    dot: 'bg-db-accent',
  },
  solar: {
    text: 'text-db-solar',
    border: 'border-db-solar/40',
    bg: 'bg-db-solar/10',
    bar: 'bg-db-solar',
    dot: 'bg-db-solar',
  },
  wind: {
    text: 'text-db-wind',
    border: 'border-db-wind/40',
    bg: 'bg-db-wind/10',
    bar: 'bg-db-wind',
    dot: 'bg-db-wind',
  },
  forecast: {
    text: 'text-db-forecast',
    border: 'border-db-forecast/40',
    bg: 'bg-db-forecast/10',
    bar: 'bg-db-forecast',
    dot: 'bg-db-forecast',
  },
  info: {
    text: 'text-db-info',
    border: 'border-db-info/40',
    bg: 'bg-db-info/10',
    bar: 'bg-db-info',
    dot: 'bg-db-info',
  },
  warn: {
    text: 'text-db-warn',
    border: 'border-db-warn/40',
    bg: 'bg-db-warn/10',
    bar: 'bg-db-warn',
    dot: 'bg-db-warn',
  },
}

/* ------------------------------------------------------------------ */
/* Cover — large chapter opening                                       */
/* ------------------------------------------------------------------ */

export interface CoverStat {
  value: string
  label: string
  accent?: Accent
}

export function ChapterCover({
  part,
  num,
  title,
  subtitle,
  stats,
}: {
  part: string
  num: string
  title: string
  subtitle: string
  stats?: CoverStat[]
}) {
  return (
    <div className="relative my-6 py-10 border-y border-db-border overflow-hidden">
      <div className="absolute right-0 top-0 bottom-0 w-2/3 energy-grid opacity-40 pointer-events-none" />
      <div className="absolute right-6 bottom-6 text-[10rem] font-black leading-none text-db-panel select-none pointer-events-none hidden md:block">
        {num}
      </div>
      <div className="relative">
        <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-db-dim mb-6">{part}</div>
        <div className="font-mono text-6xl md:text-7xl gradient-text leading-none mb-5">{num}</div>
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-db-text leading-[1.05]">
          {title}
        </h2>
        <p className="text-db-muted mt-5 max-w-2xl text-sm md:text-base leading-relaxed">{subtitle}</p>
        {stats && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
            {stats.map((s, i) => {
              const c = accentStyles[s.accent ?? 'accent']
              return (
                <div key={i} className="rounded-lg border border-db-border bg-db-surface/60 px-4 py-3">
                  <div className={`font-mono text-lg md:text-xl font-bold ${c.text}`}>{s.value}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-db-dim mt-1">{s.label}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Architecture divider — numbered section opener                      */
/* ------------------------------------------------------------------ */

export function ArchDivider({
  num,
  tag,
  title,
  subtitle,
  accent,
  children,
  id,
}: {
  num: string
  tag: string
  title: string
  subtitle: string
  accent: Accent
  children?: React.ReactNode
  id?: string
}) {
  const s = accentStyles[accent]
  return (
    <div id={id} className="mt-16 mb-8 scroll-mt-24">
      <div className="flex items-start gap-5 mb-6">
        <div className={clsx('font-mono text-5xl md:text-6xl leading-none', s.text)}>{num}</div>
        <div className="pt-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={clsx('inline-block w-1.5 h-1.5 rounded-full', s.dot)} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-db-dim">{tag}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-db-text tracking-tight uppercase leading-tight">
            {title}
          </h2>
          <p className="text-sm text-db-muted mt-2 max-w-2xl leading-relaxed">{subtitle}</p>
        </div>
      </div>
      {children && <div className="mt-8">{children}</div>}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Horizontal flow of pills with arrows                                */
/* ------------------------------------------------------------------ */

export function Flow({ steps, accent = 'accent' }: { steps: React.ReactNode[]; accent?: Accent }) {
  const s = accentStyles[accent]
  return (
    <div className="flex flex-wrap items-center gap-2 my-6">
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="text-db-dim text-sm select-none">→</span>}
          <div
            className={clsx(
              'px-3 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap',
              s.border,
              s.bg,
              s.text
            )}
          >
            {step}
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Equation — a KaTeX display block with a colored left bar            */
/* ------------------------------------------------------------------ */

export function Equation({
  tex,
  accent = 'accent',
  caption,
}: {
  tex: string
  accent?: Accent
  caption?: string
}) {
  const s = accentStyles[accent]
  return (
    <div className="relative">
      <div className={clsx('absolute inset-y-0 left-0 w-[3px] rounded-full', s.bar)} />
      <div className="pl-4">
        <MathBlock tex={tex} />
      </div>
      {caption && <p className="text-xs text-db-dim mt-2 pl-4 leading-relaxed">{caption}</p>}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Note — replaces the uniform Intuition/Formalisation/Interprétation  */
/* ------------------------------------------------------------------ */

export function Note({
  label,
  accent = 'accent',
  children,
}: {
  label?: string
  accent?: Accent
  children: React.ReactNode
}) {
  const s = accentStyles[accent]
  return (
    <div className={clsx('rounded-xl border p-5 my-6', s.border, 'bg-db-surface/60')}>
      {label && (
        <div className={clsx('inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] mb-3', s.text)}>
          <span className={clsx('inline-block w-1.5 h-1.5 rounded-full', s.dot)} />
          {label}
        </div>
      )}
      <div className="text-sm text-db-muted leading-relaxed">{children}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Pill — small chip                                                  */
/* ------------------------------------------------------------------ */

export function Pill({ accent = 'accent', children }: { accent?: Accent; children: React.ReactNode }) {
  const s = accentStyles[accent]
  return (
    <span className={clsx('px-2 py-0.5 rounded border text-[11px] font-medium', s.border, s.bg, s.text)}>
      {children}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Definition list — math-variable explanations                        */
/* ------------------------------------------------------------------ */

export function DefList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2 my-5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-sm text-db-muted leading-relaxed">
          <span className="text-db-accent mt-0.5 select-none">▸</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

/* ------------------------------------------------------------------ */
/* Two-column layout                                                   */
/* ------------------------------------------------------------------ */

export function TwoCol({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={clsx('grid md:grid-cols-2 gap-6 my-8 items-start', className)}>{children}</div>
}

/* ------------------------------------------------------------------ */
/* Vertical flow blocks — for GRN-style diagrams                       */
/* ------------------------------------------------------------------ */

export function VBlock({
  accent = 'accent',
  label,
  children,
}: {
  accent?: Accent
  label?: string
  children: React.ReactNode
}) {
  const s = accentStyles[accent]
  return (
    <div className={clsx('rounded-lg border px-4 py-3 text-center', s.border, s.bg)}>
      {label && <div className={clsx('text-[9px] uppercase tracking-widest mb-1', s.text)}>{label}</div>}
      <div className="font-mono text-[13px] text-db-text leading-snug">{children}</div>
    </div>
  )
}

export function VConnector() {
  return (
    <div className="flex justify-center py-0.5 text-db-dim text-sm select-none">|</div>
  )
}

/* ------------------------------------------------------------------ */
/* TCN dilation visualization                                          */
/* ------------------------------------------------------------------ */

export function Dilations() {
  const rows = [
    { d: 1, size: 7 },
    { d: 2, size: 13 },
    { d: 4, size: 25 },
  ]
  return (
    <div className="rounded-xl border border-db-border bg-db-surface p-6 my-8 overflow-x-auto">
      <div className="text-[10px] uppercase tracking-widest text-db-dim mb-5">Convolution dilatée — filtre k = 3</div>
      {rows.map(({ d, size }) => (
        <div key={d} className="flex items-center gap-4 mb-5 last:mb-0">
          <span className="font-mono text-sm text-db-accent w-12 shrink-0">d={d}</span>
          <div className="flex items-center">
            {Array.from({ length: size }).map((_, i) => {
              const t = size - 1 - i
              const active = t % d === 0
              const next = i > 0 ? (t - 1) % d === 0 : false
              return (
                <div key={i} className="relative">
                  {active && next && <div className="absolute top-1/2 right-full h-px w-[9px] bg-db-accent/70 -translate-y-1/2" />}
                  <div
                    className={clsx(
                      'w-2.5 h-2.5 rounded-full mx-0.5',
                      active ? 'bg-db-accent' : 'bg-db-border'
                    )}
                  />
                </div>
              )
            })}
            <span className="font-mono text-[10px] text-db-dim ml-3 select-none">t</span>
          </div>
        </div>
      ))}
      <p className="text-xs text-db-dim mt-4 leading-relaxed">
        Chaque point actif échantillonne l&apos;entrée à distance d dans le passé. En empilant les couches
        avec les dilatations [1, 2, 4, 8, 16], le champ réceptif croît exponentiellement avec un coût linéaire.
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Receptive-field chain 1 → 2 → 4 → 8 → 16                            */
/* ------------------------------------------------------------------ */

export function ReceptiveChain({ values }: { values: number[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 my-6">
      {values.map((v, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="text-db-accent text-sm select-none">→</span>}
          <span className="font-mono text-sm px-3 py-1.5 rounded-md border border-db-accent/30 bg-db-accent/5 text-db-accent">
            {v}
          </span>
        </React.Fragment>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* GNN site graph                                                      */
/* ------------------------------------------------------------------ */

export function SiteGraph() {
  const nodes = [
    { x: 200, y: 78, label: 'TAÏBA', sub: '158,7 MW', main: true },
    { x: 70, y: 42, label: 'SITE 02', sub: 'α = 0.41' },
    { x: 330, y: 34, label: 'SITE 03', sub: 'α = 0.32' },
    { x: 312, y: 186, label: 'SITE 04', sub: 'α = 0.18' },
    { x: 88, y: 176, label: 'SITE 05', sub: 'α = 0.09' },
  ]
  const center = nodes[0]
  return (
    <div className="rounded-xl border border-db-border bg-db-surface p-6 my-8">
      <div className="text-[10px] uppercase tracking-widest text-db-dim mb-4">
        Graphe du réseau — attention apprise entre les sites
      </div>
      <svg viewBox="0 0 400 220" className="w-full h-auto">
        <defs>
          <marker id="sg-arr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 8 4 L 0 8 z" fill="#7A7A72" />
          </marker>
        </defs>
        {nodes.slice(1).map((n) => (
          <line
            key={n.label}
            x1={center.x}
            y1={center.y}
            x2={n.x}
            y2={n.y}
            stroke="#3a3a3a"
            strokeWidth="1"
            markerEnd="url(#sg-arr)"
          />
        ))}
        {nodes.slice(1).map((n) => {
          const mx = (center.x + n.x) / 2 + 6
          const my = (center.y + n.y) / 2 - 6
          return (
            <text key={n.label} x={mx} y={my} textAnchor="middle" fill="#8b5cf6" fontSize="9">
              {n.sub}
            </text>
          )
        })}
        {nodes.map((n) => (
          <g key={n.label}>
            <circle
              cx={n.x}
              cy={n.y}
              r={n.main ? 26 : 20}
              fill="#0f0f0f"
              stroke={n.main ? '#AAFF00' : '#3b82f6'}
              strokeWidth={n.main ? 1.6 : 1.2}
            />
            <text
              x={n.x}
              y={n.main ? n.y - 3 : n.y - 2}
              textAnchor="middle"
              fill={n.main ? '#AAFF00' : '#A0A098'}
              fontSize={n.main ? 11 : 9}
              fontWeight={n.main ? 700 : 500}
            >
              {n.label}
            </text>
            <text x={n.x} y={n.main ? n.y + 10 : n.y + 9} textAnchor="middle" fill="#7A7A72" fontSize="8">
              {n.sub}
            </text>
          </g>
        ))}
      </svg>
      <p className="text-xs text-db-dim mt-4 leading-relaxed">
        Chaque nœud est un site de production. Les poids α sont appris par le GAT : le réseau décide
        lui-même quels voisins sont informatifs pour chaque site.
      </p>
    </div>
  )
}