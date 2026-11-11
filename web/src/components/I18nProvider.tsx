'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Lang = 'fr' | 'en'

const dict: Record<Lang, Record<string, string>> = {
  fr: {
    'nav.home': 'Accueil',
    'nav.memoire': 'Le mémoire',
    'nav.soutenance': 'Soutenance',
    'nav.architectures': 'Architectures',
    'nav.resultats': 'Résultats',
    'nav.video': 'Présentation vidéo',
    'sidebar.memoire': 'Mémoire de licence',
    'sidebar.soutenance': 'Soutenance',
    'chapter.label': 'Chapitre',
    'chapters.title': 'Chapitres',
    'chapters.subtitle': 'Structure complète du mémoire — {n} chapitres et introduction',
    'home.readMemoire': 'Lire le mémoire',
    'home.viewSoutenance': 'Consulter la soutenance',
    'home.fullMemoire': 'Le mémoire intégral',
    'home.openPdf': 'Ouvrir le PDF dans un nouvel onglet ↗',
    'home.about': 'À propos',
    'home.supervision': 'Encadrement',
    'home.problem': 'Question de recherche',
    'home.objectives': 'De la donnée à la prévision',
    'home.readingPath': 'Parcours de lecture',
    'toggle.theme.dark': 'Passer en mode sombre',
    'toggle.theme.light': 'Passer en mode clair',
    'toggle.lang': 'Changer de langue',
  },
  en: {
    'nav.home': 'Home',
    'nav.memoire': 'The thesis',
    'nav.soutenance': 'Defense',
    'nav.architectures': 'Architectures',
    'nav.resultats': 'Results',
    'nav.video': 'Video presentation',
    'sidebar.memoire': 'Bachelor thesis',
    'sidebar.soutenance': 'Defense',
    'chapter.label': 'Chapter',
    'chapters.title': 'Chapters',
    'chapters.subtitle': 'Full structure of the thesis — {n} chapters and introduction',
    'home.readMemoire': 'Read the thesis',
    'home.viewSoutenance': 'View the defense',
    'home.fullMemoire': 'Full thesis',
    'home.openPdf': 'Open PDF in a new tab ↗',
    'home.about': 'About',
    'home.supervision': 'Supervision',
    'home.problem': 'Research question',
    'home.objectives': 'From data to forecast',
    'home.readingPath': 'Reading path',
    'toggle.theme.dark': 'Switch to dark mode',
    'toggle.theme.light': 'Switch to light mode',
    'toggle.lang': 'Change language',
  },
}

interface Ctx {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<Ctx | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fr')
  useEffect(() => {
    const stored = localStorage.getItem('lang') as Lang | null
    if (stored === 'fr' || stored === 'en') setLangState(stored)
  }, [])
  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('lang', l)
    document.documentElement.lang = l
  }
  const t = (key: string, params?: Record<string, string | number>) => {
    let s = dict[lang][key] ?? key
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        s = s.replace(`{${k}}`, String(v))
      }
    }
    return s
  }
  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
