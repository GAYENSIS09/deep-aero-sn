'use client'

import { useI18n } from '@/components/I18nProvider'

export default function LangToggle() {
  const { lang, setLang } = useI18n()
  return (
    <button
      type="button"
      onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
      aria-label="Change language"
      className="inline-flex h-9 items-center rounded-lg border border-db-border bg-db-surface px-2 text-xs font-semibold text-db-muted transition-colors hover:text-db-accent"
    >
      {lang.toUpperCase()}
    </button>
  )
}
