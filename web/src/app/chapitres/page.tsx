import Link from 'next/link'
import { chapters } from '@/lib/chapters'
import { ChevronRight } from 'lucide-react'

export default function ChapitresIndex() {
  return (
    <div className="min-h-screen bg-db-bg">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-db-text mb-2">Chapitres</h1>
        <p className="text-db-muted mb-10">
          Structure complète du mémoire — {chapters.length} chapitres et introduction
        </p>

        {chapters.map((ch) => (
          <div key={ch.slug} className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">
              {ch.part}
            </h2>
            <div className="space-y-3">
              <Link
                href={`/chapitres/${ch.slug}/`}
                className="flex items-center gap-4 bg-db-surface border border-db-border rounded-xl p-5 hover:border-db-accent/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold group-hover:bg-db-accent/20 transition">
                  {ch.num != null ? ch.num : '•'}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-db-text group-hover:text-db-accent transition">
                    {ch.title}
                  </h3>
                  <p className="text-sm text-db-muted">{ch.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-db-dim group-hover:text-db-accent transition" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
