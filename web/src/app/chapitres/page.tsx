import Link from 'next/link'
import { chapters } from '@/lib/chapters'
import type { ChapterMeta } from '@/lib/chapters'
import { ChevronRight } from 'lucide-react'

interface PartGroup {
  key: string
  roman: string
  title: string
  description: string
}

const partGroups: PartGroup[] = [
  {
    key: 'Introduction',
    roman: '0',
    title: 'Introduction',
    description: 'Contexte, problématique, objectifs et plan du mémoire.',
  },
  {
    key: 'Partie I — Contexte physique et données',
    roman: 'I',
    title: 'Contexte physique et données',
    description: 'Transition énergétique, gisement solaire et physique photovoltaïque.',
  },
  {
    key: 'Partie II — Modélisation et deep learning',
    roman: 'II',
    title: 'Modélisation et deep learning',
    description: 'Fondations, modèles pour séries temporelles, architectures et stratégies.',
  },
  {
    key: 'Partie III — Application et évaluation',
    roman: 'III',
    title: 'Application et évaluation',
    description: 'Validation du pipeline sur la centrale solaire de Diass (SENELEC).',
  },
]

export default function ChapitresIndex() {
  const grouped = partGroups
    .map((group) => ({
      ...group,
      chapters: chapters.filter((c) => c.part === group.key),
    }))
    .filter((group) => group.chapters.length > 0)

  return (
    <div className="min-h-screen bg-db-bg">
      <div className="max-w-3xl mx-auto px-6 py-14">
        {/* En-tête éditorial */}
        <header className="mb-12">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-db-dim mb-3">
            Sommaire
          </p>
          <h1 className="text-3xl md:text-4xl font-serif font-semibold text-db-text leading-tight tracking-tight">
            Structure du mémoire
          </h1>
          <p className="mt-3 text-db-muted leading-relaxed">
            {chapters.length} chapitres et introduction, des fondements physiques
            à l'étude de cas.
          </p>
        </header>

        {/* Parties et chapitres */}
        <div className="space-y-12">
          {grouped.map((group) => (
            <section key={group.key}>
              {/* Séparateur de partie */}
              <div className="flex items-baseline gap-4 mb-5 pb-3 border-b border-db-border">
                <span className="font-mono text-xs text-db-dim w-6 shrink-0">
                  {group.roman}
                </span>
                <div className="flex-1">
                  <h2 className="text-lg font-serif font-semibold text-db-text leading-tight">
                    {group.title}
                  </h2>
                  <p className="text-sm text-db-muted mt-1 leading-relaxed">
                    {group.description}
                  </p>
                </div>
              </div>

              {/* Liste compacte des chapitres */}
              <ul className="divide-y divide-db-border border-y border-db-border">
                {group.chapters.map((ch: ChapterMeta) => (
                  <li key={ch.slug}>
                    <Link
                      href={`/chapitres/${ch.slug}/`}
                      className="group flex items-baseline gap-4 py-4 px-1 transition-colors hover:bg-db-surface/40"
                    >
                      <span className="font-mono text-xs text-db-dim w-6 shrink-0 pt-1">
                        {ch.num != null ? String(ch.num).padStart(2, '0') : '—'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-serif font-medium text-db-text transition-colors">
                          {ch.title}
                        </h3>
                        <p className="text-sm text-db-muted mt-0.5 leading-relaxed">
                          {ch.description}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-db-dim shrink-0 self-center transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
