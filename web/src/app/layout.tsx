import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import 'katex/dist/katex.min.css'

export const metadata: Metadata = {
  title: 'Deep Aero SN — Prévision probabiliste photovoltaïque à 72 h par apprentissage profond',
  description: 'Mémoire de licence : application à la centrale de Diass (SENELEC). TCN et TFT probabilistes, calibration CQR — RMSE 1,707 MW, R² 0,877, couverture 79,8 %.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:ital,wght@0,400;0,600;0,700;1,400;1,600&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-db-bg text-db-text">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}