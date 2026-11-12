'use client'

/**
 * Deck de soutenance — Deep Aero SN.
 * 15 planches pour un exposé de 15 minutes.
 *
 * Version de soutenance : les chiffres sont alignés sur le mémoire
 * (main_261107.pdf) et sur le run du 6 octobre 2026. Les figures sont
 * présentées sur fond clair, sans inversion colorimétrique.
 */

import type { ReactNode } from 'react'

import { useEffect, useState } from 'react'
import { asset } from '@/lib/paths'

/* ───────────────────────── briques ───────────────────────── */

function Kicker({ children, tone = 'text-db-dim' }: { children: ReactNode; tone?: string }) {
  return <div className={`font-mono text-[11px] uppercase tracking-[0.25em] ${tone}`}>{children}</div>
}

function LedgerRow({
  v,
  l,
  tone = 'text-db-text',
}: {
  v: string
  l: string
  tone?: string
}) {
  return (
    <div className="flex items-baseline gap-5 py-2.5 border-t border-db-border/50">
      <span className={`w-32 sm:w-44 shrink-0 font-mono text-base md:text-lg tabular-nums leading-tight ${tone}`}>
        {v}
      </span>
      <span className="text-[13px] md:text-[15px] text-db-muted leading-snug">{l}</span>
    </div>
  )
}

function Coverage({
  label,
  pct,
  tone,
  strong = false,
}: {
  label: string
  pct: number
  tone: string
  strong?: boolean
}) {
  return (
    <div className="flex items-center gap-4 py-2.5">
      <span
        className={`w-28 md:w-36 shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] ${
          strong ? 'text-db-text' : 'text-db-muted'
        }`}
      >
        {label}
      </span>
      <div className="relative flex-1 h-[8px] bg-db-border/50">
        <div className={`h-full ${tone}`} style={{ width: `${pct}%` }} />
        <span aria-hidden className="absolute left-[80%] -top-2 -bottom-2 w-px bg-db-accent" />
      </div>
      <span
        className={`w-16 shrink-0 text-right font-mono text-sm tabular-nums ${
          strong ? 'text-db-text' : 'text-db-muted'
        }`}
      >
        {pct.toLocaleString('fr-FR', { minimumFractionDigits: 1 })} %
      </span>
    </div>
  )
}

function FigureZoom({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const guardKeys = new Set([
      'ArrowRight',
      'ArrowLeft',
      ' ',
      'Enter',
      'PageDown',
      'PageUp',
      'Backspace',
      'Escape',
      'Home',
      'End',
      'o',
      'n',
      'f',
      'O',
      'N',
      'F',
    ])
    const onKey = (e: KeyboardEvent) => {
      if (!guardKeys.has(e.key)) return
      e.stopPropagation()
      e.preventDefault()
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open])
  return (
    <>
      <img
        src={asset(src)}
        alt={alt}
        onClick={() => setOpen(true)}
        className="max-h-[62vh] w-full cursor-zoom-in object-contain"
      />
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-db-bg/95 p-6"
          onClick={() => setOpen(false)}
        >
          <img src={asset(src)} alt={alt} className="max-h-full max-w-full object-contain" />
          <button
            onClick={(e) => {
              e.stopPropagation()
              setOpen(false)
            }}
            className="absolute right-6 top-5 font-mono text-[11px] uppercase tracking-widest text-db-muted hover:text-db-accent"
          >
            fermer (échap) ×
          </button>
        </div>
      )}
    </>
  )
}

/** Figure sur fond clair : aucune inversion de couleurs. */
function Fig({
  src,
  alt,
  caption,
  maxH = 'max-h-64',
  className = '',
}: {
  src: string
  alt: string
  caption?: string
  maxH?: string
  className?: string
}) {
  return (
    <figure className={className}>
      <div className="bg-white p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
        <img src={src} alt={alt} className={`w-full object-contain ${maxH}`} />
      </div>
      {caption && (
        <figcaption className="mt-1.5 font-mono text-[11px] leading-snug text-db-dim">{caption}</figcaption>
      )}
    </figure>
  )
}

const fig = (name: string) => asset('/figures/' + encodeURIComponent(name))

/* ───────────────────────── définition des planches ───────────────────────── */

export type ActeId = 'I' | 'II' | 'III' | 'IV'

export interface ActeMeta {
  id: ActeId
  label: string
  titre: string
  temps: string
}

export const ACTES: ActeMeta[] = [
  { id: 'I', label: 'Acte I', titre: 'Le problème', temps: '0:00 – 4:00' },
  { id: 'II', label: 'Acte II', titre: 'La science', temps: '4:00 – 9:30' },
  { id: 'III', label: 'Acte III', titre: 'La preuve', temps: '9:30 – 13:30' },
  { id: 'IV', label: 'Acte IV', titre: 'Le bilan', temps: '13:30 – 15:00' },
]

export interface SlideDef {
  id: string
  title: string
  section: string
  acte: ActeId
  notes: string
  render: () => ReactNode
}

export const SLIDES: SlideDef[] = [
  /* 01 — couverture */
  {
    id: 's01',
    title: 'Prévoir le soleil à 72 h',
    section: 'Ouverture',
    acte: 'I',
    notes:
      "Bonjour. Je présente un mémoire de licence : une chaîne complète de prévision probabiliste qui prévoit, heure par heure et jusqu'à 72 heures à l'avance, la production de la centrale solaire de Diass — la première centrale solaire publique du Sénégal. L'enjeu n'est pas seulement la précision : c'est de rendre l'incertitude exploitable pour le dispatch. TCN · TFT · MIMO · P10/P50/P90 · CQR.",
    render: () => (
      <div className="h-full flex flex-col px-4 sm:px-8 md:px-14">
        <div className="pt-3 flex items-center gap-5">
          <img
            src={asset('/images/ucadLogo.png')}
            alt="UCAD"
            className="h-14 w-14 rounded-full object-contain bg-white/10 p-1"
          />
          <span className="flex-1 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-db-dim">
            Mémoire de licence — L3 Informatique · 2025 – 2026
          </span>
          <img
            src={asset('/images/senelecLogo.png')}
            alt="SENELEC"
            className="h-14 w-14 rounded-full object-contain bg-white/10 p-1"
          />
        </div>
        <div className="flex-1 flex flex-col justify-center max-w-5xl">
          <h1 className="font-serif font-bold tracking-tight leading-[0.95] text-[clamp(3rem,8vw,6.5rem)] text-db-text">
            Prévoir le soleil
            <span className="block text-db-accent">à 72 heures.</span>
          </h1>
          <p className="mt-6 max-w-3xl text-base md:text-xl text-db-text/95 leading-relaxed">
            Prévision probabiliste de la production photovoltaïque à 72 h par apprentissage profond :
            application à la centrale de Diass, Sénégal.
          </p>
          <p className="mt-4 font-mono text-xs text-db-dim tracking-wide">
            TCN · TFT · MIMO · Quantiles P10/P50/P90 · CQR
          </p>
        </div>
        <div className="py-4 pr-4 md:pr-44 space-y-1.5">
          <div className="font-mono text-xs text-db-muted">Baye Mor Gaye — UCAD · Section Informatique</div>
          <div className="font-mono text-xs leading-relaxed text-db-dim">
            Dr Ndiouma Bame (encadrant, UCAD) · Dr Saidou Abdoul Soumare · Dr Abdoulaye Ba (SENELEC)
          </div>
        </div>
      </div>
    ),
  },

  /* 02 — pourquoi 72 heures + problématique + objectifs */
  {
    id: 's02',
    title: 'Pourquoi 72 heures ?',
    section: 'Contexte · problématique',
    acte: 'I',
    notes:
      "Chaque matin, le dispatching mise sur le soleil du lendemain. Excès de réserve : fioul inutile. Défaut : délestage. Le solaire sénégalais atteint 292,47 MWc en 2025 et 76 % de l'énergie acheminée est achetée. La question n'est donc pas seulement combien produira Diass, mais avec quelle confiance. C'est la problématique du mémoire, et elle se décompose en trois objectifs : construire un référentiel causal, comparer TCN et TFT, calibrer l'incertitude.",
    render: () => (
      <div className="h-full px-4 sm:px-8 md:px-14 flex flex-col justify-center gap-5">
        <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
          <div className="col-span-12 lg:col-span-7">
            <Kicker>Contexte réseau · problématique · objectifs</Kicker>
            <h2 className="mt-2 font-serif text-[clamp(2rem,4vw,3.3rem)] leading-[1.1] text-db-text">
              Pourquoi 72 heures ?
            </h2>
            <p className="mt-4 text-[15px] md:text-[17px] text-db-muted leading-relaxed max-w-2xl">
              Le solaire sénégalais atteint <span className="text-db-text">292,47 MWc</span> en 2025 ;{' '}
              <span className="text-db-text">76 %</span> de l’énergie acheminée est achetée. Chaque erreur de
              prévision se paie en réserve thermique, en curtailment ou en délestage.
            </p>
            <div className="mt-5 border-l-2 border-db-accent/70 pl-5">
              <p className="font-serif italic text-lg md:text-[22px] text-db-text leading-snug">
                Combien produira Diass demain et après-demain — et avec quelle confiance ?
              </p>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-5">
            <Kicker>Chaîne de conséquence</Kicker>
            <div className="mt-3 space-y-1.5 font-mono text-[12px] md:text-[13px] text-db-muted leading-relaxed">
              {[
                'PRODUCTION SOLAIRE',
                '↓',
                'intermittence — nuages · harmattan · hivernage',
                '↓',
                'erreur de prévision',
                '↓',
                'décision réseau difficile',
                '↓',
                'réserve thermique · coût · délestage',
              ].map((l, k) => (
                <div key={k} className={l === '↓' ? 'text-db-accent' : ''}>
                  {l}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-y border-db-border/60 py-3.5">
          <Kicker tone="text-db-accent">Problématique</Kicker>
          <p className="mt-1.5 font-serif text-base md:text-[19px] text-db-text leading-snug max-w-5xl">
            Comment prévoir, heure par heure et jusqu’à 72 h, la production d’une centrale PV réelle, tout en
            quantifiant l’incertitude, avec des variables réellement disponibles au moment de l’émission ?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              n: '01',
              t: 'Référentiel causal',
              d: '35 196 mesures → 8 800 h → 543 → 424 variables, sans fuite temporelle.',
            },
            {
              n: '02',
              t: 'Comparer TCN et TFT',
              d: 'Même protocole MIMO 72 h, 1 049 fenêtres, mêmes baselines.',
            },
            {
              n: '03',
              t: 'Calibrer l’incertitude',
              d: 'P10/P50/P90 + CQR : couverture, largeur, score de Winkler.',
            },
          ].map((x) => (
            <div key={x.n} className="border-t border-db-border/60 pt-2.5">
              <div className="font-mono text-[11px] text-db-accent">{x.n}</div>
              <div className="mt-0.5 font-serif text-base md:text-lg text-db-text">{x.t}</div>
              <p className="mt-1 text-[13px] md:text-sm text-db-muted leading-snug">{x.d}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  /* 03 — Diass : une centrale réelle */
  {
    id: 's03',
    title: 'Diass : une centrale réelle',
    section: 'Le site',
    acte: 'I',
    notes:
      "Diass : première centrale solaire publique du Sénégal, propriété et exploitation directe de la SENELEC. 85 248 modules polycristallins 320 W, 36 onduleurs Schneider, 16 transformateurs, 40 ha, mise en service le 22/05/2022. 27,28 MWc installés (85 248 × 320 W) contre 23,114 MW publiés : 15 % d'écart non résolu, signalé plutôt qu'ajusté. Données SCADA réelles : 35 196 observations à 15 min, 367 jours. Contrôle IEC 61724 : gisement −0,5 %, rendement final −4,8 %, PR 64,8 % dans la plage publiée, énergie annualisée +0,9 %. Le cas physique est cohérent avant d'être un problème d'apprentissage.",
    render: () => (
      <div className="h-full px-4 sm:px-8 md:px-14 grid grid-cols-12 gap-6 md:gap-10 items-center">
        <div className="col-span-12 lg:col-span-7">
          <Kicker>Le site · données réelles</Kicker>
          <h2 className="mt-2 font-serif text-[clamp(1.9rem,3.7vw,3.1rem)] leading-[1.12] text-db-text">
            Diass : une centrale réelle
          </h2>
          <p className="mt-3 text-[15px] md:text-base text-db-muted leading-relaxed">
            Première centrale solaire publique du Sénégal, propriété et exploitation directe de la SENELEC.
            Pas un dataset académique : une installation instrumentée, avec ses pannes et ses absences.
          </p>
          <div className="mt-3 border-t border-db-border/50">
            <LedgerRow v="85 248" l="modules polycristallins 320 W · structures fixes" />
            <LedgerRow v="36 · 16" l="onduleurs Schneider XC-680 · transformateurs" />
            <LedgerRow v="40 ha" l="40–50 km au sud-est de Dakar · mise en service 22/05/2022" />
            <LedgerRow v="27,28 / 23,114" l="MWc installés / MW publiés — écart de 15 % non résolu" tone="text-db-solar" />
            <LedgerRow v="35 196" l="observations SCADA à 15 min · 367 jours (30/08/2025 → 31/08/2026)" tone="text-db-accent" />
          </div>

          <div className="mt-4 border border-db-border/60 px-4 py-3">
            <Kicker tone="text-db-accent">Contrôle physique — IEC 61724</Kicker>
            <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 font-mono text-[12px] md:text-[13px] text-db-muted">
              <span>
                Y<sub>ref</sub> 5,80 / 5,83 h/j <span className="text-db-text">(−0,5 %)</span>
              </span>
              <span>
                Y<sub>f</sub> 3,76 / 3,95 h/j <span className="text-db-text">(−4,8 %)</span>
              </span>
              <span>
                PR 64,8 % <span className="text-db-dim">(plage 64,65–75,82)</span>
              </span>
              <span>
                E 33,6 / 33,3 GWh <span className="text-db-text">(+0,9 %)</span>
              </span>
            </div>
            <p className="mt-2 text-[13px] text-db-dim leading-snug">
              Le gisement et le PR sont cohérents avec la littérature : le modèle apprend sur un cas physique valide.
            </p>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <Fig
            src={fig('Central Solaire de Diass carte.png')}
            alt="Carte de la centrale solaire de Diass"
            maxH="max-h-[300px]"
            caption="Diass — 14,65° N, 17,10° O · première centrale solaire publique du pays"
          />
        </div>
      </div>
    ),
  },

  /* 04 — physique → features */
  {
    id: 's04',
    title: 'Avant le modèle : la physique',
    section: 'Physique PV',
    acte: 'II',
    notes:
      "La sélection des variables ne part pas de la corrélation : elle part des mécanismes. Chaîne physique : position solaire, GHI/DNI/DHI, irradiance POA, température de cellule, conversion PV, puissance AC. Chaque famille de features correspond à un mécanisme mesurable à Diass : les aérosols de l'harmattan deviennent AOD, dust et PM10 ; les nuages deviennent l'indice de ciel clair ; la température devient NOCT et température de cellule ; l'empoussièrement devient le soiling ratio. C'est cela qui distingue un référentiel physique d'un simple feature engineering statistique.",
    render: () => (
      <div className="h-full px-4 sm:px-8 md:px-14 grid grid-cols-12 gap-6 md:gap-10 items-center">
        <div className="col-span-12 lg:col-span-5">
          <Kicker>Physique → variables</Kicker>
          <h2 className="mt-2 font-serif text-[clamp(1.9rem,3.7vw,3.1rem)] leading-[1.12] text-db-text">
            Avant le modèle : la physique
          </h2>
          <p className="mt-3 text-[15px] md:text-base text-db-muted leading-relaxed">
            Chaque famille de variables vient d’un mécanisme, pas d’une corrélation.
          </p>

          <div className="mt-4 font-mono text-[12px] md:text-[13px] text-db-muted leading-relaxed">
            {[
              'Position solaire',
              '↓',
              'GHI / DNI / DHI',
              '↓',
              'Irradiance POA',
              '↓',
              'Température cellule',
              '↓',
              'Conversion PV → puissance AC',
            ].map((l, k) => (
              <div key={k} className={l === '↓' ? 'text-db-accent' : ''}>
                {l}
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-1.5 text-[13px] md:text-sm text-db-muted leading-snug">
            <p>
              <span className="font-mono text-db-text">Aérosols · harmattan</span> → AOD, dust, PM10
            </p>
            <p>
              <span className="font-mono text-db-text">Nuages</span> → indice de ciel clair
            </p>
            <p>
              <span className="font-mono text-db-text">Température</span> → NOCT, T<sub>cell</sub> (33,3 °C moy. · 70,8 °C max)
            </p>
            <p>
              <span className="font-mono text-db-text">Empoussièrement</span> → soiling ratio
            </p>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7 space-y-3">
          <Fig
            src={fig('nb_diass_effet_aerosols.png')}
            alt="Effet des aérosols sur la production à Diass"
            maxH="max-h-[135px]"
            caption="Aérosols et poussières : une perte mesurable, pas une hypothèse."
          />
          <Fig
            src={fig('nb_diass_effet_nuages.png')}
            alt="Effet des passages nuageux sur la production à Diass"
            maxH="max-h-[135px]"
            caption="Passages nuageux : la variabilité que le pas horaire lisse en partie."
          />
        </div>
      </div>
    ),
  },

  /* 05 — data leakage */
  {
    id: 's05',
    title: 'Le problème que le modèle aurait pu tricher',
    section: 'Causalité',
    acte: 'II',
    notes:
      "Point scientifique le plus important. Les exports SCADA contiennent des variables électriques instantanées mesurées au même instant que la cible : P_ac, I_ac, V_ac, V_dc, cos phi. Elles sont liées par P_ac = V_ac × I_ac × cos(phi) × racine(3). Les utiliser, c'est apprendre une identité d'électrotechnique, pas prévoir le soleil. Formulation exacte : au moment de l'émission t, aucune mesure de l'instant cible t+h n'est encore acquise. On exclut donc les 11 variables contemporaines et on les remplace par 11 transformations causales à lag ≥ 24 h — un choix de conception qui interdit au modèle de recopier la persistance. Garde-fous : exclusion si |rho| > 0,99, disponibilité NWP init+6h ≤ t, split chronologique, scaler ajusté sur train seul.",
    render: () => (
      <div className="h-full px-4 sm:px-8 md:px-14 grid grid-cols-12 gap-6 md:gap-10 items-center">
        <div className="col-span-12 md:col-span-4">
          <Kicker>Causalité · ce que contient le SCADA</Kicker>
          <h2 className="mt-2 font-serif text-[clamp(1.5rem,2.5vw,2.15rem)] leading-[1.15] text-db-text">
            Le modèle aurait pu tricher
          </h2>
          <div className="mt-3 text-sm md:text-base text-db-muted leading-relaxed font-mono">
            V<sub>ac</sub> · I<sub>ac</sub> · P<sub>ac</sub> · V<sub>dc</sub> · I<sub>dc</sub> · cos φ …
          </div>
          <div className="mt-5">
            <Kicker tone="text-db-error">Le problème</Kicker>
            <p className="mt-2 text-[15px] md:text-base text-db-muted leading-relaxed">
              Data leakage : le modèle pourrait apprendre la puissance au lieu de la prévoir.
            </p>
          </div>
        </div>

        <div className="col-span-12 md:col-span-8 border-l border-db-error/60 pl-6 md:pl-8">
          <div className="relative inline-block max-w-full">
            <span className="text-lg md:text-[26px] text-db-text/90 font-mono whitespace-nowrap">
              P<sub>ac</sub> = V<sub>ac</sub> × I<sub>ac</sub> × cos(φ) × √3
            </span>
            <span aria-hidden className="absolute -left-2 -right-2 top-1/2 h-[2px] bg-db-error/80 -rotate-3" />
          </div>

          <p className="mt-4 text-[15px] md:text-base text-db-muted leading-relaxed">
            Une identité d’électrotechnique, pas une prévision. Au moment de l’émission <span className="font-mono text-db-text">t</span>,
            aucune mesure de l’instant cible <span className="font-mono text-db-text">t+h</span> n’est encore acquise.
          </p>

          <div className="mt-4 font-mono text-[12px] md:text-[13px] text-db-dim leading-relaxed">
            <div>t (émission) ───────────→ t+1 … t+72&nbsp;&nbsp;<span className="text-db-error">❌ aucune mesure</span></div>
            <div>t−24 h ─────────────────→ t+72 h&nbsp;&nbsp;<span className="text-db-accent">✓ features causales + NWP</span></div>
          </div>

          <div className="mt-4 border-t border-db-border/50">
            <LedgerRow v="11 → 11" l="variables contemporaines exclues → transformations causales (lag ≥ 24 h)" tone="text-db-accent" />
            <LedgerRow v="|ρ| > 0,99" l="exclusion automatique des fuites résiduelles" />
            <LedgerRow v="init + 6 h ≤ t" l="disponibilité NWP · scaler ajusté sur train seul" />
          </div>
        </div>
      </div>
    ),
  },

  /* 06 — pipeline données */
  {
    id: 's06',
    title: 'De 35 196 mesures à 424 variables',
    section: 'Données',
    acte: 'II',
    notes:
      "Une année complète de télémesure : 35 196 lignes à 15 minutes et 58 colonnes brutes, dont 55 hors imputation. Le rééchantillonnage horaire produit 8 800 lignes et 428 colonnes. Trois familles de sources : SCADA Schneider, réanalyses NASA POWER / ERA5 / CAMS, et NWP ECMWF IFS HRES. Le feature engineering produit 543 features ; la sélection en retient 424, soit 425 entrées modèle avec la cible. L'interruption réelle du 9 au 15 décembre 2025 est conservée comme absence, jamais interpolée.",
    render: () => (
      <div className="h-full px-4 sm:px-8 md:px-14 flex flex-col justify-center">
        <Kicker>Données · de la mesure à la représentation</Kicker>
        <h2 className="mt-2 font-serif text-[clamp(1.8rem,3.5vw,2.9rem)] leading-[1.12] text-db-text">
          De 35 196 mesures à 424 variables
        </h2>

        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[
            { n: '35 196 × 58', t: 'SCADA 15 min', d: '55 colonnes hors imputation', tone: 'text-db-text' },
            { n: '8 800 × 428', t: 'horaire', d: '367 jours rééchantillonnés', tone: 'text-db-text' },
            { n: '543', t: 'features', d: '7 plugins en séquence', tone: 'text-db-info' },
            { n: '424', t: 'retenues', d: '425 entrées modèle (cible incluse)', tone: 'text-db-accent' },
          ].map((x) => (
            <div key={x.n} className="border-t-2 border-db-border/70 pt-3">
              <div className={`font-mono text-2xl md:text-[34px] tabular-nums leading-none ${x.tone}`}>{x.n}</div>
              <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-db-muted">{x.t}</div>
              <div className="mt-1 text-[13px] text-db-dim leading-snug">{x.d}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-y border-db-border/50 py-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-[13px] text-db-muted leading-snug">
          <div>
            <Kicker>Sources</Kicker>
            <p className="mt-1">NASA POWER · ERA5 · CAMS · ECMWF IFS HRES</p>
          </div>
          <div>
            <Kicker>Absence</Kicker>
            <p className="mt-1">9–15 déc. 2025 conservée comme absence, jamais interpolée.</p>
          </div>
          <div>
            <Kicker>Provenance</Kicker>
            <p className="mt-1">Chaque colonne garde son origine : mesure, réanalyse, calcul, installation.</p>
          </div>
        </div>

        <p className="mt-4 font-serif italic text-base md:text-lg text-db-text/90">
          Le deep learning n’arrive pas sur un fichier Excel : il arrive sur un référentiel construit.
        </p>
      </div>
    ),
  },

  /* 07 — 424 variables */
  {
    id: 's07',
    title: 'Pourquoi 424 variables ?',
    section: 'Variables',
    acte: 'II',
    notes:
      "Sept plugins en séquence déterministe : temporel, météo commune, fréquence réseau, physique solaire, météo solaire, électrique causal, lags et statistiques glissantes. 58 colonnes brutes deviennent 543 features, puis la sélection combine 7 méthodes indépendantes : corrélation, information mutuelle, PCA, RFE, VIF, permutation, SHAP. On prend l'union, pas l'intersection. Aucune feature n'est retenue par les sept, 194 le sont par une seule. La déduplication à |r| > 0,90 ramène à 424. Le VIF sélectionne par colinéarité, pas par pertinence : c'est une perspective complémentaire, pas un juge final.",
    render: () => (
      <div className="h-full px-4 sm:px-8 md:px-14 flex flex-col justify-center">
        <Kicker>Variables · sept plugins, sept méthodes</Kicker>
        <h2 className="mt-2 font-serif text-[clamp(1.8rem,3.5vw,2.9rem)] leading-[1.12] text-db-text">
          Pourquoi 424 variables ?
        </h2>

        <div className="mt-5 flex flex-wrap items-end gap-x-10 gap-y-6">
          <div>
            <div className="font-mono text-3xl md:text-4xl text-db-dim tabular-nums">58</div>
            <div className="mt-1 text-[13px] text-db-muted">colonnes brutes</div>
          </div>
          <span aria-hidden className="text-db-border text-2xl pb-1">→</span>
          <div>
            <div className="font-mono text-5xl md:text-6xl text-db-info tabular-nums leading-none">543</div>
            <div className="mt-2 text-[13px] text-db-muted">features fabriquées</div>
          </div>
          <span aria-hidden className="text-db-border text-2xl pb-1">→</span>
          <div>
            <div className="font-serif font-semibold text-[clamp(4rem,9vw,7rem)] leading-none text-db-accent">424</div>
            <div className="mt-2 text-[13px] text-db-muted">retenues — union des 7 méthodes, dédoublonnées</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-2 max-w-4xl">
          {[
            { m: 'Corrélation', n: '349' },
            { m: 'MI', n: '2' },
            { m: 'PCA', n: '0' },
            { m: 'RFE', n: '50' },
            { m: 'VIF', n: '527' },
            { m: 'Permutation', n: '2' },
            { m: 'SHAP', n: '2' },
            { m: 'Union finale', n: '424' },
          ].map((x) => (
            <div key={x.m} className="border border-db-border/50 px-3 py-2">
              <div className="font-mono text-[11px] text-db-dim">{x.m}</div>
              <div className="font-mono text-base md:text-lg text-db-muted tabular-nums">{x.n}</div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[15px] md:text-base text-db-muted leading-relaxed max-w-4xl">
          Aucune méthode ne mesure la même chose. L’union privilégie le rappel, puis les redondances sont
          éliminées. Aucune feature n’est retenue par les sept, 194 par une seule — le VIF sélectionne par
          colinéarité, pas par pertinence.
        </p>
      </div>
    ),
  },

  /* 08 — TCN vs TFT */
  {
    id: 's08',
    title: 'Deux architectures, une même expérience',
    section: 'Modèles',
    acte: 'II',
    notes:
      "Deux architectures, deux philosophies. TCN : convolutions causales dilatées, champ réceptif qui couvre largement les 168 h d'historique, entraînement parallèle, peu de paramètres. TFT : Variable Selection Network, GRN à porte GLU, attention interprétable, sortie quantile native. Question expérimentale : lequel exploite le mieux l'information disponible à Diass ? Le MIMO sort les 72 horizons d'un seul réseau. Précision sur le champ réceptif : 2 047 pas est la valeur théorique pour k=3 et L=10 ; le run retenu utilise k=5, donc un champ plus large encore. Ce qui compte est qu'il dépasse les 168 h.",
    render: () => (
      <div className="h-full px-4 sm:px-8 md:px-14 flex flex-col justify-center">
        <Kicker>Modèles · même protocole, même test</Kicker>
        <h2 className="mt-2 font-serif text-[clamp(1.8rem,3.5vw,2.9rem)] leading-[1.12] text-db-text">
          Deux architectures, une même expérience
        </h2>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="border-t-2 border-db-accent/70 pt-4">
            <h3 className="font-serif text-2xl md:text-3xl text-db-accent">TCN</h3>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.22em] text-db-dim">
              convolutions causales dilatées
            </p>
            <ul className="mt-3 space-y-2 text-[14px] md:text-[15px] text-db-muted leading-snug">
              <li>Champ réceptif qui couvre largement les 168 h d’historique.</li>
              <li>Entraînement parallèle, mémoire linéaire, peu de paramètres.</li>
              <li>Pas d’interprétabilité native.</li>
            </ul>
          </div>

          <div className="border-t-2 border-db-info/70 pt-4">
            <h3 className="font-serif text-2xl md:text-3xl text-db-info">TFT</h3>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.22em] text-db-dim">
              VSN · GRN · attention
            </p>
            <ul className="mt-3 space-y-2 text-[14px] md:text-[15px] text-db-muted leading-snug">
              <li>Sélection de variables et attention lisibles par l’opérateur.</li>
              <li>Sortie quantile native.</li>
              <li>Attention quadratique : coût mémoire au déploiement.</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 border-y border-db-border/50 py-3 font-mono text-[12px] md:text-[13px] text-db-muted">
          168 h d’historique&nbsp;&nbsp;→&nbsp;&nbsp;TCN / TFT&nbsp;&nbsp;→&nbsp;&nbsp;MIMO 72 h&nbsp;&nbsp;→&nbsp;&nbsp;P10 · P50 · P90
        </div>

        <p className="mt-4 font-serif italic text-base md:text-lg text-db-text/90">
          Question expérimentale : lequel exploite le mieux l’information disponible à Diass ?
        </p>
      </div>
    ),
  },

  /* 09 — quantiles */
  {
    id: 's09',
    title: 'Pourquoi prédire une distribution ?',
    section: 'Probabiliste',
    acte: 'II',
    notes:
      "Sortie MIMO : un seul réseau produit les 72 horizons, ce qui garantit la cohérence entre horizons. Sortie probabiliste : une matrice H × Q, trois quantiles par horizon (10, 50, 90 %). Perte hybride : w_mse × MSE sur la médiane + (1−w_mse) × Pinball, avec w_mse = 0,5. Une seule valeur ne permet pas de dimensionner l'incertitude. P10 : production prudente. P50 : prévision centrale. P90 : scénario favorable.",
    render: () => (
      <div className="h-full px-4 sm:px-8 md:px-14 grid grid-cols-12 gap-6 md:gap-10 items-center">
        <div className="col-span-12 lg:col-span-6">
          <Kicker>Sortie probabiliste</Kicker>
          <h2 className="mt-2 font-serif text-[clamp(1.7rem,3.3vw,2.7rem)] leading-[1.15] text-db-text">
            Pourquoi prédire une distribution ?
          </h2>

          <div className="mt-4 space-y-3 text-[15px] md:text-base text-db-muted leading-relaxed max-w-lg">
            <p>
              <span className="text-db-text">MIMO</span> — Ŷ ∈ R<sup>72×3</sup> : les 72 horizons sortent d’un seul réseau.
              Cohérence garantie entre horizons.
            </p>
            <p>
              <span className="text-db-text">Trois quantiles par horizon</span> — q<sub>0,1</sub>, q<sub>0,5</sub>, q<sub>0,9</sub> :
              médiane et enveloppe P10–P90 à 80 %.
            </p>
            <p className="font-mono text-[13px] md:text-sm text-db-dim">
              L = w·MSE(ŷ<sub>0,5</sub>, y) + (1−w)·Pinball(ŷ<sub>q</sub>, y), w = 0,5
            </p>
          </div>

          <div className="mt-5 border-t border-db-border/50 max-w-lg">
            <LedgerRow v="P10" l="production prudente — scénario bas" tone="text-db-solar" />
            <LedgerRow v="P50" l="prévision centrale — médiane" />
            <LedgerRow v="P90" l="scénario favorable — borne haute" tone="text-db-warn" />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6">
          <Fig
            src={fig('ch6_tft_quantile.png')}
            alt="Prévision par quantiles P10, P50 et P90"
            maxH="max-h-[320px]"
            caption="Une valeur ne suffit pas : le modèle fournit une plage de production plausible."
          />
        </div>
      </div>
    ),
  },

  /* 10 — CQR */
  {
    id: 's10',
    title: 'Le CQR : quand le modèle n’est pas assez sûr',
    section: 'Calibration',
    acte: 'III',
    notes:
      "Une régression quantile brute n'est pas calibrée en échantillon fini. Le CQR ajoute un score de non-conformité sur un jeu de calibration disjoint, sans réentraîner le réseau. Effet sur le TCN : couverture 60,8 % → 79,8 % pour une cible de 80 %, largeur 1,670 → 2,596 MW, Winkler 5,742. Sur le TFT : 71,2 % → 74,2 %, largeur 2,456 → 2,646 MW, Winkler 5,964. Le TCN est donc meilleur sur la couverture ET sur le score propre, avec une enveloppe plus étroite. 0 croisement de quantiles. Attention : la garantie conformelle est théorique sous échangeabilité ; ici elle est vérifiée empiriquement sur un segment temporel.",
    render: () => (
      <div className="h-full px-4 sm:px-8 md:px-14 flex flex-col justify-center">
        <Kicker>Calibration · au-delà de la régression quantile</Kicker>
        <h2 className="mt-2 font-serif text-[clamp(1.8rem,3.5vw,2.9rem)] leading-[1.12] text-db-text">
          Le CQR : quand le modèle n’est pas assez sûr
        </h2>

        <div className="mt-5 max-w-4xl">
          <div className="flex items-baseline gap-4 font-mono text-[11px] uppercase tracking-wider text-db-dim">
            <span className="w-28 md:w-36 shrink-0" />
            <span>couverture P10–P90</span>
            <span className="ml-auto text-db-accent normal-case">│ cible 80 %</span>
          </div>
          <Coverage label="TCN avant" pct={60.8} tone="bg-db-dim" />
          <Coverage label="TCN CQR" pct={79.8} tone="bg-db-accent" strong />
          <Coverage label="TFT avant" pct={71.2} tone="bg-db-info/40" />
          <Coverage label="TFT CQR" pct={74.2} tone="bg-db-info" />
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl">
          <table className="w-full text-[13px] md:text-sm font-mono">
            <thead>
              <tr className="text-db-dim">
                <th className="text-left py-1.5 font-normal">Modèle</th>
                <th className="text-right py-1.5 font-normal">Couverture</th>
                <th className="text-right py-1.5 font-normal">Largeur</th>
                <th className="text-right py-1.5 font-normal">Winkler</th>
              </tr>
            </thead>
            <tbody className="text-db-muted">
              <tr className="border-t border-db-border/40">
                <td className="py-1.5 text-db-accent">TCN</td>
                <td className="text-right">60,8 → 79,8 %</td>
                <td className="text-right">1,670 → 2,596 MW</td>
                <td className="text-right">5,742</td>
              </tr>
              <tr className="border-t border-db-border/40">
                <td className="py-1.5 text-db-info">TFT</td>
                <td className="text-right">71,2 → 74,2 %</td>
                <td className="text-right">2,456 → 2,646 MW</td>
                <td className="text-right">5,964</td>
              </tr>
            </tbody>
          </table>
          <div className="text-[14px] md:text-[15px] text-db-muted leading-relaxed">
            <p>
              Le CQR amène le TCN à <span className="text-db-text">0,2 point</span> de la cible. À couverture
              supérieure, son enveloppe reste <span className="text-db-text">plus étroite</span> que celle du
              TFT et son score propre est meilleur.
            </p>
            <p className="mt-2 text-[13px] text-db-dim leading-snug">
              Garantie sous échangeabilité ; vérifiée empiriquement sur 1 049 fenêtres temporelles.
              0 croisement de quantiles.
            </p>
          </div>
        </div>
      </div>
    ),
  },

  /* 11 — protocole test */
  {
    id: 's11',
    title: 'Le test : 1 049 fenêtres × 72 heures',
    section: 'Protocole',
    acte: 'III',
    notes:
      "Segment de test jamais vu : 1 049 fenêtres, du 16/07 au 28/08/2026, soit l'hivernage. Historique de 168 h pour 72 h de prévision. Fenêtres glissantes au pas horaire : chaque prévision n'utilise que l'information disponible à son instant d'émission. Découpage chronologique 70/15/15, scaler ajusté sur le train seul. Point d'honnêteté : les fenêtres se chevauchent fortement, donc la couverture est une estimation sur des observations corrélées, pas 1 049 tirages indépendants.",
    render: () => (
      <div className="h-full px-4 sm:px-8 md:px-14 grid grid-cols-12 gap-6 md:gap-10 items-center">
        <div className="col-span-12 lg:col-span-7">
          <Kicker>Protocole · segment jamais vu</Kicker>
          <h2 className="mt-2 font-serif text-[clamp(1.8rem,3.5vw,2.9rem)] leading-[1.12] text-db-text">
            Le test : 1 049 fenêtres × 72 heures
          </h2>

          <div className="mt-5 font-mono text-[12px] md:text-[13px] text-db-muted leading-relaxed">
            <div>Historique 168 h ────────→ Futur 72 h</div>
            <div>
              ████████████████████████ <span className="text-db-dim">→</span>{' '}
              <span className="text-db-accent">░░░░░░░░░░░░░░░░░░░░</span>
            </div>
            <div className="text-db-dim">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;P10 · P50 · P90
            </div>
          </div>

          <div className="mt-4 border-t border-db-border/50 max-w-2xl">
            <LedgerRow v="1 049" l="fenêtres de test, jamais vues" tone="text-db-accent" />
            <LedgerRow v="16/07 → 28/08" l="segment de test 2026 — hivernage uniquement" />
            <LedgerRow v="168 h" l="d’historique pour 72 h de prévision" />
            <LedgerRow v="70 / 15 / 15" l="split chronologique · scaler ajusté sur train seul" />
          </div>

          <p className="mt-3 text-[13px] text-db-dim leading-snug max-w-2xl">
            Fenêtres glissantes au pas horaire : chaque prévision n’utilise que l’information disponible à son
            instant d’émission. Elles se chevauchent, donc la couverture est estimée sur des observations corrélées.
          </p>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <Fig
            src={fig('fig_ch14_diass_test_window.png')}
            alt="Fenêtre de test à Diass"
            maxH="max-h-[330px]"
            caption="Une fenêtre : 168 h de passé, 72 h de futur."
          />
        </div>
      </div>
    ),
  },

  /* 12 — prévision réelle */
  {
    id: 's12',
    title: 'Une vraie prévision à 72 h',
    section: 'La preuve',
    acte: 'III',
    notes:
      "Voici le test en images : une fenêtre du segment jamais vu. P50 en trait plein, enveloppe P10–P90 en ruban, production réelle en pointillés. Trois choses à regarder : la nuit, où le modèle ne produit rien ; la rampe du matin ; les décrochages liés aux nuages. L'enveloppe s'élargit avec l'horizon, conformément à la croissance de l'incertitude. Sur 1 049 fenêtres, le TCN obtient RMSE 1,707 MW, MAE 0,989, R² 0,877.",
    render: () => (
      <div className="h-full px-4 sm:px-6 md:px-10 grid grid-cols-12 gap-5 md:gap-8 items-center">
        <div className="col-span-12 lg:col-span-7">
          <div className="bg-white p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
            <FigureZoom
              src="/figures/nb_diass/nb_diass_fenetres_test.png"
              alt="Fenêtres de test — P50 et enveloppe P10–P90 face à la production réelle"
            />
          </div>
          <p className="mt-2 font-mono text-[11px] text-db-dim">
            Prévision P50 et enveloppe contre la production réelle — le modèle n’a jamais vu ces jours-là.
          </p>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <Kicker>Ce qu’il faut regarder</Kicker>
          <h2 className="mt-2 font-serif text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.15] text-db-text">
            Une vraie prévision à 72 h
          </h2>
          <div className="mt-4 space-y-2.5 text-[14px] md:text-[15px] text-db-muted leading-snug">
            <p>
              <span className="font-mono text-db-text">Nuit</span> — production nulle, pas de faux positif.
            </p>
            <p>
              <span className="font-mono text-db-text">Rampe du matin</span> — le modèle suit la montée réelle.
            </p>
            <p>
              <span className="font-mono text-db-text">Nuages</span> — les décrochages sont captés, avec l’incertitude qui augmente.
            </p>
          </div>
          <div className="mt-5 border-t border-db-border/50 pt-3">
            <p className="font-serif italic text-base md:text-lg text-db-text/90 leading-snug">
              Le modèle ne fournit pas seulement une valeur : il fournit une plage.
            </p>
            <p className="mt-2 font-mono text-[12px] text-db-dim">
              1 049 fenêtres · RMSE 1,707 MW · R² 0,877 · MAE 0,989 MW
            </p>
          </div>
        </div>
      </div>
    ),
  },

  /* 13 — verdict */
  {
    id: 's13',
    title: 'Le verdict expérimental',
    section: 'Résultats',
    acte: 'III',
    notes:
      "Sur 1 049 fenêtres jamais vues : persistance 6,905 MW, MLP 2,323, LSTM 2,043, TCN 1,707 (R² 0,877, nRMSE 0,110), TFT 1,818 (R² 0,861). Le gain est d'environ 75 % de réduction de la RMSE par rapport à la persistance. Le TCN s'arrête à l'époque 57, le TFT va au terme des 100 époques : 1 206 s contre 2 016 s, à budget Optuna égal de dix essais. MAPE explosive près de zéro : c'est la fragilité de la métrique, pas du modèle. Pas d'étude d'ablation : l'explication par la convolution dilatée reste une hypothèse.",
    render: () => (
      <div className="h-full px-4 sm:px-8 md:px-14 grid grid-cols-12 gap-5 md:gap-8 items-center">
        <div className="col-span-12 lg:col-span-4">
          <Kicker>Résultats · 1 049 fenêtres jamais vues</Kicker>
          <h2 className="mt-2 font-serif text-[clamp(1.5rem,2.5vw,2.15rem)] leading-[1.15] text-db-text">
            Le verdict expérimental
          </h2>
          <div className="mt-3 font-mono font-semibold text-[clamp(3.6rem,8vw,6.2rem)] leading-none text-db-accent tabular-nums">
            1,707
          </div>
          <div className="mt-2 font-mono text-xs text-db-muted">MW de RMSE — contre 6,905 MW pour la persistance</div>
          <div className="mt-3 font-mono text-base md:text-lg text-db-accent tabular-nums">≈ 75 % de réduction</div>

          <div className="mt-4 border-t border-db-border/50">
            <LedgerRow v="R² 0,877" l="variance expliquée — meilleur modèle" />
            <LedgerRow v="nRMSE 0,110" l="erreur normalisée" />
            <LedgerRow v="1 206 / 2 016 s" l="TCN / TFT — 10 essais Optuna chacun" />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <table className="w-full text-[13px] md:text-sm font-mono">
            <thead>
              <tr className="text-db-dim">
                <th className="text-left py-1.5 font-normal">Modèle</th>
                <th className="text-right py-1.5 font-normal">RMSE</th>
                <th className="text-right py-1.5 font-normal">MAE</th>
                <th className="text-right py-1.5 font-normal">R²</th>
                <th className="text-right py-1.5 font-normal">nRMSE</th>
              </tr>
            </thead>
            <tbody className="text-db-muted">
              <tr className="border-t border-db-border/40"><td className="py-1.5">Persistence</td><td className="text-right">6,905</td><td className="text-right">4,987</td><td className="text-right">−1,013</td><td className="text-right">0,444</td></tr>
              <tr className="border-t border-db-border/40"><td className="py-1.5">MLP</td><td className="text-right">2,323</td><td className="text-right">1,275</td><td className="text-right">0,772</td><td className="text-right">0,149</td></tr>
              <tr className="border-t border-db-border/40"><td className="py-1.5">LSTM</td><td className="text-right">2,043</td><td className="text-right">1,148</td><td className="text-right">0,824</td><td className="text-right">0,131</td></tr>
              <tr className="border-t border-db-border/40 text-db-accent"><td className="py-1.5">TCN</td><td className="text-right">1,707</td><td className="text-right">0,989</td><td className="text-right">0,877</td><td className="text-right">0,110</td></tr>
              <tr className="border-t border-db-border/40"><td className="py-1.5">TFT</td><td className="text-right">1,818</td><td className="text-right">1,157</td><td className="text-right">0,861</td><td className="text-right">0,117</td></tr>
            </tbody>
          </table>

          <Fig
            src={fig('fig_ch14_diass_metriques_horizon.png')}
            alt="Métriques par horizon pour le TCN et le TFT"
            maxH="max-h-[120px]"
            className="mt-3"
            caption="Métriques par horizon, de J+1 à J+3."
          />

          <p className="mt-2 text-[12px] text-db-dim leading-snug">
            MAPE : 3 282 % pour la persistance — artefact près de zéro ; R², RMSE et nRMSE font foi.
            L’explication du gain TCN (convolution dilatée, moins de paramètres) reste une hypothèse : aucune
            ablation n’a été menée.
          </p>
        </div>
      </div>
    ),
  },

  /* 14 — SENELEC */
  {
    id: 's14',
    title: 'Ce que P10–P90 change pour le dispatch',
    section: 'Implications',
    acte: 'IV',
    notes:
      "Un intervalle P10–P90 est directement exploitable. P10, borne basse : production quasi garantie, donc le thermique à maintenir en réserve pour couvrir le risque de sous-production. P50 : production attendue, pour le programme d'échange et la maintenance. P90, borne haute : scénario favorable, donc risque de surproduction et de curtailment. La largeur P10–P90 mesure le besoin de flexibilité. Le seuil de 5 MW est un ordre de grandeur retenu dans le mémoire, pas une exigence contractuelle : les deux modèles le respectent. Le modèle est un outil d'aide à l'anticipation, pas un système autonome de dispatch.",
    render: () => (
      <div className="h-full px-4 sm:px-8 md:px-14 flex flex-col justify-center">
        <Kicker>Implications · de la prévision à la décision</Kicker>
        <h2 className="mt-2 font-serif text-[clamp(1.8rem,3.5vw,2.9rem)] leading-[1.12] text-db-text">
          Ce que P10–P90 change pour le dispatch
        </h2>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              q: 'P10',
              tone: 'text-db-solar',
              bar: 'bg-db-solar',
              t: 'production quasi garantie',
              d: 'Thermique à maintenir en réserve : risque de sous-production.',
            },
            {
              q: 'P50',
              tone: 'text-db-text',
              bar: 'bg-db-text',
              t: 'production attendue',
              d: 'Programme d’échange, maintenance, anticipation.',
            },
            {
              q: 'P90',
              tone: 'text-db-warn',
              bar: 'bg-db-warn',
              t: 'production favorable',
              d: 'Risque de surproduction : curtailment, réserve basse.',
            },
          ].map((x) => (
            <div key={x.q} className="border-t-2 border-db-border/70 pt-3">
              <div className={`font-mono text-3xl md:text-4xl tabular-nums ${x.tone}`}>{x.q}</div>
              <div className="mt-2 font-serif text-base md:text-lg text-db-text">{x.t}</div>
              <div className={`mt-2 h-[3px] w-14 ${x.bar}`} />
              <p className="mt-2 text-[13px] md:text-sm text-db-muted leading-snug">{x.d}</p>
            </div>
          ))}
        </div>

        <p className="mt-5 font-serif italic text-base md:text-lg text-db-text/90">
          La largeur P10–P90 mesure le besoin de flexibilité.
        </p>

        <div className="mt-4 border-t border-db-border/50 pt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Kicker>Ordre de grandeur</Kicker>
            <p className="mt-1 text-[13px] md:text-sm text-db-muted leading-snug">
              Seuil indicatif de <span className="text-db-text">5 MW</span> (≈ 22 % de 23,1 MW publiés), retenu
              dans le mémoire — pas une exigence contractuelle. TCN 1,71 MW · TFT 1,82 MW : les deux le respectent.
            </p>
          </div>
          <div>
            <Kicker tone="text-db-accent">Portée</Kicker>
            <p className="mt-1 text-[13px] md:text-sm text-db-muted leading-snug">
              Un <span className="text-db-accent">outil d’aide à l’anticipation</span>, pas un système autonome
              de dispatch.
            </p>
          </div>
        </div>
      </div>
    ),
  },

  /* 15 — réponse finale */
  {
    id: 's15',
    title: 'La réponse finale',
    section: 'Conclusion',
    acte: 'IV',
    notes:
      "Sur des données réelles de Diass, nous avons construit une chaîne de prévision à 72 h qui respecte la causalité temporelle, transforme les mesures opérationnelles en variables prédictives, compare TCN et TFT, et associe à la prévision centrale une incertitude calibrée. Le TCN atteint 1,707 MW de RMSE et son intervalle P10–P90 couvre 79,8 % des observations après CQR, pour une cible de 80 %. Limites : une année de données, test estival uniquement, résolution horaire, absence d'ablation, absence de second site. Perspectives : transfert vers un autre site, résolution 5–15 min, intégration pilote SENELEC.",
    render: () => (
      <div className="h-full px-4 sm:px-8 md:px-14 flex flex-col justify-center">
        <Kicker>Conclusion</Kicker>
        <h2 className="mt-2 font-serif text-[clamp(1.8rem,3.5vw,2.9rem)] leading-[1.12] text-db-text">
          La réponse finale
        </h2>
        <p className="mt-2 font-mono text-[12px] md:text-[13px] text-db-muted leading-snug max-w-4xl">
          Comment prévoir la production photovoltaïque à 72 h tout en quantifiant son incertitude ?
        </p>

        <div className="mt-4 border-t border-db-border/50 max-w-4xl">
          {[
            { t: '1 — Représentation causale', d: '35 196 → 8 800 → 543 → 424 variables, sans fuite temporelle.' },
            { t: '2 — Deux architectures', d: 'TCN vs TFT, même expérience, même protocole.' },
            { t: '3 — Prévision probabiliste', d: 'P10 · P50 · P90 + CQR, incertitude calibrée.' },
          ].map((x, k) => (
            <div key={k} className="flex items-baseline gap-5 py-2.5 border-t border-db-border/50">
              <span className="font-mono text-[12px] md:text-[13px] text-db-accent w-44 shrink-0">{x.t}</span>
              <span className="text-[14px] md:text-[15px] text-db-muted leading-snug">{x.d}</span>
            </div>
          ))}
        </div>

        <p className="mt-4 font-serif italic text-lg md:text-xl text-db-text/90 leading-relaxed max-w-4xl">
          Sur des données réelles de Diass : RMSE 1,707 MW · R² 0,877 · couverture P10–P90 79,8 % (cible 80 %),
          pour une prévision à 72 heures.
        </p>

        <div className="mt-4 max-w-4xl border-t border-db-border/50 pt-3 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Kicker tone="text-db-warn">Limites</Kicker>
            <p className="mt-1 text-[13px] md:text-sm text-db-muted leading-snug">
              Une année → stabilité saisonnière non prouvée · test estival (hivernage) uniquement · pas horaire
              qui lisse les nuages de moins d’une heure · pas d’ablation · pas de second site.
            </p>
          </div>
          <div>
            <Kicker tone="text-db-accent">Suite</Kicker>
            <p className="mt-1 text-[13px] md:text-sm text-db-muted leading-snug">
              Transfert multi-site · résolution 5–15 min · intégration pilote SENELEC.
            </p>
          </div>
        </div>

        <p className="mt-4 font-serif text-base md:text-lg text-db-text/90 leading-snug max-w-4xl">
          La contribution n’est pas un meilleur RMSE : c’est une chaîne de prévision causale dont l’incertitude
          est vérifiable.
        </p>
      </div>
    ),
  },
]
