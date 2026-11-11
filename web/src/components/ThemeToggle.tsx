'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const [light, setLight] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const isLight = stored === 'light'
    setLight(isLight)
    document.documentElement.classList.toggle('light', isLight)
    document.documentElement.classList.toggle('dark', !isLight)
  }, [])

  const toggle = () => {
    const next = !light
    setLight(next)
    document.documentElement.classList.toggle('light', next)
    document.documentElement.classList.toggle('dark', !next)
    localStorage.setItem('theme', next ? 'light' : 'dark')
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={light ? 'Passer en mode sombre' : 'Passer en mode clair'}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-db-border bg-db-surface text-db-muted transition-colors hover:text-db-accent"
    >
      {light ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  )
}
