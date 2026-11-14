'use client'

/**
 * Soutenance — coquille du deck (chrome éditorial).
 *
 * Navigation : → / Espace / PageDown (suivant), ← / PageUp (précédent),
 * Début / Fin, O = sommaire, N = notes d'orateur, F = plein écran,
 * Échap = quitter le sommaire (et fermer les notes).
 * Zones de clic aux bords gauche / droit.
 *
 * Les raccourcis sont ignorés :
 *   — si une touche modificatrice est enfoncée (Cmd+O, Ctrl+N, …) ;
 *   — si l'utilisateur est dans un champ de saisie ;
 *   — pour Espace / Entrée / Retour arrière, si le focus est sur un
 *     contrôle interactif (bouton, lien, [role="button"]).
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { SLIDES, fr } from './deck'

const TOTAL = SLIDES.length

export default function PresentationPage() {
  const [index, setIndex] = useState(0)
  const [toc, setToc] = useState(false)
  const [notesOpen, setNotesOpen] = useState(false)
  const [startAt, setStartAt] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [hint, setHint] = useState(true)

  // Permet de viser une planche précise via l'URL (?slide=1..N), utile pour
  // l'export automatisé (captures d'écran, génération de .pptx, etc.).
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const raw = params.get('slide')
    if (raw) {
      const n = parseInt(raw, 10)
      if (!Number.isNaN(n)) {
        setIndex(Math.min(TOTAL - 1, Math.max(0, n - 1)))
      }
    }
  }, [])

  const tocRef = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)

  const go = useCallback((delta: number) => {
    setStartAt((s) => s ?? Date.now())
    setHint(false)
    setToc(false)
    setIndex((i) => Math.min(TOTAL - 1, Math.max(0, i + delta)))
  }, [])

  const jump = useCallback((n: number) => {
    setStartAt((s) => s ?? Date.now())
    setHint(false)
    setIndex(n)
    setToc(false)
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (typeof document === 'undefined') return
    try {
      if (!document.fullscreenElement) void document.documentElement.requestFullscreen?.()
      else void document.exitFullscreen?.()
    } catch {
      /* plein écran refusé : on continue normalement */
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // 1. Ne jamais intercepter les raccourcis navigateur / système.
      if (e.ctrlKey || e.metaKey || e.altKey) return

      // 2. Ne jamais intercepter la saisie dans un champ.
      const target = e.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return

      // 3. Navigation directionnelle — toujours active.
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault()
        go(1)
        return
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        go(-1)
        return
      }

      // 4. Espace / Entrée / Retour arrière — seulement hors contrôle focusable.
      const onControl = target?.closest('button, a, [role="button"]')
      if (!onControl) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          go(1)
          return
        }
        if (e.key === 'Backspace') {
          e.preventDefault()
          go(-1)
          return
        }
      }

      // 5. Sauts.
      if (e.key === 'Home') {
        e.preventDefault()
        setIndex(0)
        return
      }
      if (e.key === 'End') {
        e.preventDefault()
        setIndex(TOTAL - 1)
        return
      }

      // 6. Bascule des panneaux (lettres — insensibles à la casse).
      const k = e.key.toLowerCase()
      if (k === 'o') {
        setToc((v) => !v)
        return
      }
      if (k === 'n') {
        setNotesOpen((v) => !v)
        return
      }
      if (k === 'f') {
        toggleFullscreen()
        return
      }
      if (e.key === 'Escape') {
        // Ne pas preventDefault : le navigateur sort du plein écran nativement.
        setToc(false)
        setNotesOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, toggleFullscreen])

  useEffect(() => {
    if (startAt === null) return
    const t = window.setInterval(() => setElapsed(Math.floor((Date.now() - startAt) / 1000)), 1000)
    return () => window.clearInterval(t)
  }, [startAt])

  useEffect(() => {
    const t = window.setTimeout(() => setHint(false), 9000)
    return () => window.clearTimeout(t)
  }, [])

  // Gestion du focus pour le sommaire (dialog modal).
  useEffect(() => {
    if (toc) {
      previousFocus.current = document.activeElement as HTMLElement | null
      tocRef.current?.focus()
    } else if (previousFocus.current) {
      previousFocus.current.focus()
      previousFocus.current = null
    }
  }, [toc])

  const slide = SLIDES[index]
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const ss = String(elapsed % 60).padStart(2, '0')
  const progress = ((index + 1) / TOTAL) * 100

  return (
    <main className="fixed inset-0 select-none overflow-hidden bg-db-bg text-db-text">
      {/* ── folio courant (haut) ── */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex h-12 items-center justify-between px-6 md:px-10">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-db-dim">
          Soutenance Deep Aero SN
        </span>
        <span
          title={slide.title}
          className="max-w-[46vw] truncate font-mono text-[10px] uppercase tracking-[0.25em] text-db-dim"
        >
          {fr(slide.title)}
        </span>
      </header>

      {/* ── planche courante ── */}
      <section className="absolute inset-0 z-10 pt-12" aria-live="polite">
        <div key={slide.id} className="h-full slide-enter motion-reduce:animate-none">
          {slide.render()}
        </div>
      </section>

      {/* ── zones de clic — au-dessus de la planche pour rester cliquables ── */}
      <button
        tabIndex={-1}
        aria-hidden="true"
        onClick={() => go(-1)}
        className="absolute left-0 top-16 bottom-16 z-20 w-16 cursor-w-resize"
      />
      <button
        tabIndex={-1}
        aria-hidden="true"
        onClick={() => go(1)}
        className="absolute right-0 top-16 bottom-16 z-20 w-16 cursor-e-resize"
      />

      {/* ── rail de taquets ── */}
      <div className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-1.5 md:flex">
        {SLIDES.map((s, k) => {
          const isActive = k === index
          return (
            <button
              key={s.id}
              aria-label={`Planche ${k + 1} : ${s.title}`}
              aria-current={isActive ? 'step' : undefined}
              onClick={() => jump(k)}
              className={`w-px transition-all motion-reduce:transition-none ${
                isActive
                  ? 'h-7 bg-db-accent'
                  : k < index
                    ? 'h-4 bg-db-accent/40 hover:bg-db-accent/70'
                    : 'h-4 bg-db-border hover:bg-db-muted'
              }`}
            />
          )
        })}
      </div>

      {/* ── chrono + folio (bas droite) ── */}
      <div className="pointer-events-none absolute bottom-4 right-6 z-20 flex items-center gap-4 font-mono text-[10px] tabular-nums text-db-dim md:right-10">
        {startAt !== null && (
          <span className="text-db-muted">
            {mm}:{ss}
          </span>
        )}
        <span>
          {String(index + 1).padStart(2, '0')} sur {String(TOTAL).padStart(2, '0')}
        </span>
      </div>

      {/* ── notes d'orateur ── */}
      {notesOpen && (
        <aside
          role="dialog"
          aria-label={`Notes, planche ${index + 1} : ${slide.title}`}
          className="absolute inset-x-0 bottom-6 z-30 mx-auto max-w-3xl border border-db-border border-l-2 border-l-db-accent bg-db-bg/95 px-6 py-4 backdrop-blur-sm"
        >
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-db-accent">
            Notes, planche {String(index + 1).padStart(2, '0')} : {fr(slide.title)}
          </div>
          <p className="font-serif text-sm leading-relaxed text-db-muted">{slide.notes}</p>
        </aside>
      )}

      {/* ── sommaire façon table des matières ── */}
      {toc && (
        <div
          ref={tocRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="Sommaire"
          className="absolute inset-0 z-40 overflow-auto bg-db-bg outline-none"
        >
          <div className="mx-auto max-w-3xl px-8 py-14">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-db-dim">
                Sommaire
              </span>
              <button
                onClick={() => setToc(false)}
                className="font-mono text-[10px] uppercase tracking-widest text-db-muted hover:text-db-accent"
              >
                échap pour fermer
              </button>
            </div>
            <p className="mt-2 font-serif italic text-sm text-db-muted">
              dix-huit planches, quinze minutes
            </p>
            <div className="mt-8">
              {SLIDES.map((s, k) => {
                const isActive = k === index
                return (
                  <button
                    key={s.id}
                    onClick={() => jump(k)}
                    aria-current={isActive ? 'step' : undefined}
                    className="group flex w-full items-baseline gap-4 py-2.5 text-left"
                  >
                    <span className="w-7 shrink-0 font-mono text-[11px] text-db-dim tabular-nums">
                      {String(k + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`font-serif text-[15px] group-hover:text-db-accent ${
                        isActive ? 'text-db-accent' : 'text-db-text'
                      }`}
                    >
                      {fr(s.title)}
                    </span>
                    <span
                      aria-hidden
                      className="mx-1 flex-1 -translate-y-1 border-b border-dotted border-db-dim/40"
                    />
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── progression (filet de pied) ── */}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={TOTAL}
        aria-valuenow={index + 1}
        aria-label={`Planche ${index + 1} sur ${TOTAL}`}
        className="absolute inset-x-0 bottom-0 z-20 h-px bg-db-border"
      >
        <div
          className="h-full bg-db-accent transition-all duration-500 motion-reduce:transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>
    </main>
  )
}