// Vérification KaTeX de toutes les formules des fichiers de contenu de chapitres.
// Extrait les literal strings du code source, unescape les échappements TS, puis :
//   - compile chaque value d'un `tex:` avec katex (display),
//   - compile chaque segment $...$ des autres strings (inline).
import katex from 'katex'
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = join(dirname(fileURLToPath(import.meta.url)), '../src/lib/chapters-content')
const files = readdirSync(dir).filter((f) => f.endsWith('.ts') && f !== 'index.ts')

function unescapeTs(s) {
  return s
    .replace(/\\(['"`])/g, '$1')
    .replace(/\\n/g, '\n')
    .replace(/\\\\/g, '\\')
}

const STR = /"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'/g

let problems = 0

const checkTex = (tex, label) => {
  if (!tex || !tex.trim()) return
  try {
    katex.renderToString(tex, { throwOnError: true, displayMode: true, strict: false, trust: true, macros: {
      '\\R': '\\mathbb{R}',
      '\\indicator': '\\mathbf{1}',
    } })
  } catch (e) {
    problems++
    console.log(`[ERREUR MATH] ${label}`)
    console.log(`    tex    : ${tex}`)
    console.log(`    cause : ${String(e.message || e).split('\n').slice(0, 4).join(' | ')}`)
  }
}

const checkInlines = (text, label) => {
  let last = 0
  while (last < text.length) {
    const open = text.indexOf('$', last)
    if (open === -1) break
    const close = text.indexOf('$', open + 1)
    if (close === -1) {
      problems++
      console.log(`[$ NON FERMÉ] ${label}`)
      console.log(`    autour : ${text.slice(Math.max(0, open - 40), open + 40)}`)
      break
    }
    checkTex(text.slice(open + 1, close), label)
    last = close + 1
  }
}

for (const f of files) {
  const src = readFileSync(join(dir, f), 'utf8')
  STR.lastIndex = 0
  let m
  while ((m = STR.exec(src)) !== null) {
    const raw = m[1] !== undefined ? m[1] : m[2]
    if (raw === undefined) continue
    const line = src.slice(0, m.index).split('\n').length
    const value = unescapeTs(raw)
    const before = src.slice(Math.max(0, m.index - 40), m.index)
    const isTex = /\btex\s*:\s*$/.test(before)
    if (isTex) checkTex(value, `${f}:${line} display`)
    else checkInlines(value, `${f}:${line}} inline`)
  }
}

console.log(problems === 0 ? `OK : toutes les formules des ${files.length} fichiers compilent.` : `${problems} problème(s) détecté(s).`)
