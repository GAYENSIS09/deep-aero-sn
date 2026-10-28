import React from 'react'
import { MathInline } from '@/components/Math'

/**
 * Parseur inline « texte enrichi léger ».
 * Syntaxe supportée (produite par la conversion LaTeX → TS) :
 *   **gras**       → <strong>
 *   *italique*     → <em>
 *   `code`         → <code>
 *   $math$         → <MathInline> (KaTeX)
 *   \n             → <br/>
 * Échappements hérités du LaTeX, appliqués hors maths :
 *   ~ → espace insécable, --- → —, -- → –,
 *   \% → %, \& → &, \_ → _, -> $, \\ → saut de ligne.
 * Les segments $...$ ne sont jamais pré-traités (KaTeX intact).
 */

interface ScanCtx {
  n: number
}

function textNodes(text: string, ctx: ScanCtx): React.ReactNode[] {
  const out: React.ReactNode[] = []
  const lines = text.split('\n')
  lines.forEach((line, i) => {
    if (line) out.push(<React.Fragment key={`t${ctx.n++}`}>{line}</React.Fragment>)
    if (i < lines.length - 1) out.push(<br key={`br${ctx.n++}`} />)
  })
  return out
}

function parseSegment(raw: string, ctx: ScanCtx): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  let buf = ''
  let i = 0

  const flush = () => {
    if (buf) {
      nodes.push(...textNodes(buf, ctx))
      buf = ''
    }
  }

  // Cherche le délimiteur de fermeture en ignorant les backslash échappés
  const findClose = (open: number, needle: string): number => {
    let k = open
    while (k < raw.length) {
      if (raw[k] === '\\') { k += 2; continue }
      const idx = raw.indexOf(needle, k)
      if (idx === -1) return -1
      // en maths, ignorer les delimiteurs précédés d'un backslash
      if (raw[idx - 1] === '\\') { k = idx + needle.length; continue }
      return idx
    }
    return -1
  }

  while (i < raw.length) {
    const c = raw[i]

    // Maths inline $...$
    if (c === '$') {
      const close = findClose(i + 1, '$')
      if (close === -1) {
        buf += c
        i++
        continue
      }
      flush()
      nodes.push(<MathInline key={`m${ctx.n++}`} tex={raw.slice(i + 1, close)} />)
      i = close + 1
      continue
    }

    // Code inline `...`
    if (c === '`') {
      let close = -1
      let k = i + 1
      while (k < raw.length) {
        if (raw[k] === '\\') { k += 2; continue }
        if (raw[k] === '`') { close = k; break }
        k++
      }
      if (close === -1) {
        buf += c
        i++
        continue
      }
      flush()
      nodes.push(
        <code
          key={`c${ctx.n++}`}
          className="px-1 py-0.5 rounded bg-db-surface border border-db-border/60 font-mono text-[0.9em] text-db-text"
        >
          {raw.slice(i + 1, close)}
        </code>,
      )
      i = close + 1
      continue
    }

    // Gras **...**
    if (c === '*' && raw[i + 1] === '*') {
      let close = -1
      let k = i + 2
      while (k < raw.length) {
        if (raw[k] === '*' && raw[k + 1] === '*' && raw[k - 1] !== '\\') { close = k; break }
        k++
      }
      if (close === -1) {
        buf += '**'
        i += 2
        continue
      }
      flush()
      nodes.push(
        <strong key={`b${ctx.n++}`} className="font-semibold text-db-text">
          {parseSegment(raw.slice(i + 2, close), ctx)}
        </strong>,
      )
      i = close + 2
      continue
    }

    // Italique *...*
    if (c === '*') {
      let close = -1
      let k = i + 1
      while (k < raw.length) {
        if (raw[k] === '*' && raw[k - 1] !== '\\') { close = k; break }
        k++
      }
      if (close === -1) {
        buf += c
        i++
        continue
      }
      flush()
      nodes.push(<em key={`i${ctx.n++}`}>{parseSegment(raw.slice(i + 1, close), ctx)}</em>)
      i = close + 1
      continue
    }

    // Échappements LaTeX hors maths
    if (c === '\\') {
      const nxt = raw[i + 1]
      if (nxt === '$' || nxt === '%' || nxt === '&' || nxt === '_') {
        buf += nxt
        i += 2
        continue
      }
      if (nxt === '\\') {
        flush()
        nodes.push(<br key={`br${ctx.n++}`} />)
        i += 2
        continue
      }
      buf += c
      i++
      continue
    }

    if (c === '~') {
      buf += '\u00A0'
      i++
      continue
    }

    if (c === '-') {
      if (raw[i + 1] === '-') {
        if (raw[i + 2] === '-') {
          buf += '\u2014'
          i += 3
        } else {
          buf += '\u2013'
          i += 2
        }
        continue
      }
      buf += '-'
      i++
      continue
    }

    buf += c
    i++
  }
  flush()
  return nodes
}

/** Rend un texte enrichi inline en nœuds React. */
export function renderInlineNodes(text?: string): React.ReactNode[] {
  if (!text) return []
  return parseSegment(text, { n: 0 })
}

/** Découpe un texte en paragraphes (séparés par une ligne vide) et les rend dans des <p>. */
export function renderParagraphs(text?: string): React.ReactNode[] {
  if (!text) return []
  const paras = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
  return paras.map((p, i) => (
    <p key={i} className="mb-4 leading-relaxed text-db-text last:mb-0">
      {parseSegment(p, { n: 0 })}
    </p>
  ))
}
