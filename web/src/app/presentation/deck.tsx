'use client'

/**
 * Deck de soutenance — Deep Aero SN.
 * 15 planches pour un exposé de 12 à 15 minutes.
 *
 * Direction artistique : éditoriale — filets fins au lieu de boîtes,
 * compositions asymétriques, chiffres posés en typographie d'affiche,
 * une seule couleur d'accent par planche. Coquille : page.tsx.
 */

import type { ReactNode } from 'react'

import { useEffect, useState } from 'react'
import { MathInline } from '@/components/Math'
import { asset } from '@/lib/paths'

/* ───────────────────────── briques — filets & registres ───────────────────────── */

function Rule({ animate = false, className = '' }: { animate?: boolean; className?: string }) {
  return <div className={`h-px bg-db-border/70 ${animate ? 'rule-draw' : ''} ${className}`} />
}

function LedgerRow({ v, l, tone = 'text-db-text' }: { v: string; l: string; tone?: string }) {
  return (
    <div className="flex items-baseline gap-5 py-3 border-t border-db-border/50">
      <span className={`w-36 shrink-0 font-mono text-sm md:text-base tabular-nums ${tone}`}>{v}</span>
      <span className="text-xs md:text-sm text-db-muted leading-snug">{l}</span>
    </div>
  )
}

function Bar({ name, val, max, best = false }: { name: string; val: number; max: number; best?: boolean }) {
  const pct = Math.max(2, (val / max) * 100)
  const txt = val.toLocaleString('fr-FR', { minimumFractionDigits: 3 })
  return (
    <div className="flex items-center gap-4 py-2.5">
      <span className={`w-24 md:w-28 shrink-0 text-right font-mono text-[11px] ${best ? 'text-db-accent' : 'text-db-muted'}`}>
        {name}
      </span>
      <div className="flex-1 h-[5px]">
        <div className={`h-full ${best ? 'bg-db-accent' : 'bg-db-border'}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`w-14 shrink-0 text-right font-mono text-[11px] tabular-nums ${best ? 'text-db-accent' : 'text-db-dim'}`}>
        {txt}
      </span>
    </div>
  )
}

function Coverage({ label, pct, tone }: { label: string; pct: number; tone: string }) {
  return (
    <div className="flex items-center gap-4 py-3">
      <span className="w-24 md:w-28 shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-db-muted">{label}</span>
      <div className="relative flex-1 h-[6px] bg-db-border/50">
        <div className={`h-full ${tone}`} style={{ width: `${pct}%` }} />
        <span aria-hidden className="absolute left-[80%] -top-2 -bottom-2 w-px bg-db-accent" />
      </div>
      <span className="w-16 shrink-0 text-right font-mono text-[11px] tabular-nums text-db-muted">
        {pct.toLocaleString('fr-FR', { minimumFractionDigits: 1 })} %
      </span>
    </div>
  )
}

function SunArc({ className = 'mx-auto -mb-3 w-full max-w-md opacity-80' }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 190" fill="none" className={className} aria-hidden>
      <path d="M20 170 A 300 300 0 0 1 620 170" stroke="#262626" strokeWidth="1.5" />
      <path
        d="M20 170 A 300 300 0 0 1 620 170"
        stroke="#AAFF00"
        strokeWidth="1.75"
        strokeLinecap="round"
        className="arc-draw"
      />
      <path d="M8 170 H632" stroke="#262626" strokeWidth="1" />
      <circle r="6" fill="#AAFF00" className="sun-dot" style={{ offsetPath: 'path("M20 170 A 300 300 0 0 1 620 170")' }} />
      <g stroke="#262626" strokeWidth="1.5">
        <path d="M255 170 l12 -18 h30 l12 18" fill="none" />
        <path d="M345 170 l12 -18 h30 l12 18" fill="none" />
        <path d="M435 170 l12 -18 h30 l12 18" fill="none" />
      </g>
    </svg>
  )
}

/* Figure agrandissable : clic pour plein écran, Échap ou clic pour sortir */
function FigureZoom({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const guardKeys = new Set([
      'ArrowRight', 'ArrowLeft', ' ', 'Enter', 'PageDown', 'PageUp', 'Backspace',
      'Escape', 'Home', 'End', 'o', 'n', 'f', 'O', 'N', 'F',
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
        className="max-h-[calc(100vh-180px)] w-full cursor-zoom-in object-contain"
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
            className="absolute right-6 top-5 font-mono text-[10px] uppercase tracking-widest text-db-muted hover:text-db-accent"
          >
            fermer (échap) ×
          </button>
        </div>
      )}
    </>
  )
}

/* ───────────────────────── définition des planches ───────────────────────── */

export type ActeId = 'I' | 'II' | 'III' | 'IV'

export interface ActeMeta {
  id: ActeId
  label: string
  titre: string
  temps: string
}

export const ACTES: ActeMeta[] = [
  { id: 'I', label: 'Acte I', titre: 'Le pari', temps: '0:00 – 3:15' },
  { id: 'II', label: 'Acte II', titre: 'La méthode', temps: '3:15 – 11:00' },
  { id: 'III', label: 'Acte III', titre: 'Le verdict', temps: '11:00 – 13:45' },
  { id: 'IV', label: 'Acte IV', titre: 'Le bilan', temps: '13:45 – 15:00' },
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
    title: 'Couverture',
    section: 'Ouverture',
    acte: 'I',
    notes:
      "Bonjour à toutes et à tous. Monsieur le Président, chers membres du jury, merci de votre présence. Je vais vous présenter mon mémoire de licence : un système d'apprentissage profond qui prévoit, heure par heure et jusqu'à 72 heures à l'avance, la production de la centrale solaire de Diass — la première centrale solaire publique du Sénégal — avec une mesure honnête de l'incertitude. Une phrase de mise en situation, puis la méthode.",
    render: () => (
      <div className="h-full flex flex-col px-8 md:px-14">
        {/* logos institutionnels, comme la page de garde du mémoire */}
        <div className="pt-3 flex items-center gap-4">
          <img
            src={asset('/images/ucadLogo.png')}
            alt="UCAD"
            className="h-12 w-12 rounded-full object-contain bg-white/10 p-1"
          />
          <span className="flex-1 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-db-dim">
            Mémoire de licence — L3 Informatique&nbsp;·&nbsp;2025 – 2026
          </span>
          <img
            src={asset('/images/senelecLogo.png')}
            alt="SENELEC"
            className="h-12 w-12 rounded-full object-contain bg-white/10 p-1"
          />
        </div>
        <Rule animate className="mt-3" />
        <div className="flex-1 flex flex-col justify-center max-w-4xl">
          <h1 className="font-serif font-bold tracking-tight leading-[1.04] text-[clamp(2.6rem,6.5vw,5rem)] text-db-text">
            Prévoir le soleil
            <span className="block text-db-accent">à 72 heures.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-sm md:text-lg text-db-text/95 leading-relaxed">
            Prévision probabiliste de la production photovoltaïque à 72&nbsp;h par apprentissage
            profond&nbsp;: application à la centrale de Diass, Sénégal.
          </p>
        </div>
        <SunArc />
        <Rule className="mt-4" />
        {/* pied aligné à gauche — la zone droite reste libre pour le chrono */}
        <div className="py-3 pr-44 md:pr-56 space-y-1">
          <div className="font-mono text-[11px] text-db-muted">
            Baye Mor Gaye — UCAD · Section Informatique
          </div>
          <div className="font-mono text-[11px] leading-relaxed text-db-dim">
            Dr Ndiouma Bame (encadrant, UCAD) · Dr Saidou Abdoul Soumare · Dr Abdoulaye Ba (SENELEC)
          </div>
        </div>
      </div>
    ),
  },

  /* 02 — le pari */
  {
    id: 's02',
    title: 'Le pari du dispatching',
    section: 'Le pari',
    acte: 'I',
    notes:
      "Chaque matin, le dispatching de la SENELEC mise sur le soleil du lendemain. S'il se trompe par excès de réserve, on paie du fioul inutile ; par défaut, on frôle le délestage. Le solaire monte vite : Taïba N'Diaye apporte 158,7 MW d'éolien, Diass 24,48 MW en AC — et l'objectif national, conformément au Plan Sénégal Émergent, c'est 40 % d'énergies renouvelables dans le mix à l'horizon 2030. À cette échelle, la prévision n'est plus un gadget statistique : c'est un outil d'exploitation, qui conditionne l'entretien, les investissements et la sécurité du réseau.",
    render: () => (
      <div className="h-full px-8 md:px-14 grid grid-cols-12 gap-10 items-center">
        <div className="col-span-12 lg:col-span-7">
          <h2 className="font-serif text-[clamp(1.8rem,3.8vw,3.1rem)] leading-[1.15] text-db-text">
            Chaque matin, la SENELEC mise sur le <span className="text-db-solar">soleil de demain</span>.
          </h2>
          <p className="mt-7 max-w-xl text-sm md:text-base text-db-muted leading-relaxed">
            Mise ratée, la facture tombe : réserves thermiques fossiles mobilisées en urgence, coûts
            d'exploitation alourdis, déséquilibres fréquence–puissance qui mènent au{' '}
            <span className="text-db-error">délestage</span>.
          </p>
          <p className="mt-4 max-w-xl text-sm md:text-base text-db-muted leading-relaxed">
            À cette échelle, la prévision n'est plus un gadget statistique : c'est un outil
            d'exploitation — entretien, investissements, sécurité du réseau.
          </p>
        </div>
        <div className="col-span-12 lg:col-span-4 lg:col-start-9 border-b border-db-border/50">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-db-dim pb-2">Le pari en chiffres</div>
          <LedgerRow v="40 %" l="d'ENR visées dans le mix à l'horizon 2030 (PSE)" tone="text-db-accent" />
          <LedgerRow v="158,7 MW" l="parc éolien de Taïba N'Diaye" />
          <LedgerRow v="24,48 MW" l="puissance nominale AC de Diass" tone="text-db-solar" />
          <LedgerRow v="34 GWh/an" l="production annuelle de Diass" />
        </div>
      </div>
    ),
  },

  /* 03 — problématique */
  {
    id: 's03',
    title: 'La problématique',
    section: 'Problématique',
    acte: 'I',
    notes:
      "D'où la question centrale du mémoire, je la lis exactement : comment concevoir un modèle d'apprentissage profond capable de prédire, avec précision et robustesse, la production électrique solaire à court terme à 72 heures dans le contexte climatique sénégalais, tout en intégrant et en quantifiant l'incertitude inhérente à cette source renouvelable intermittente ? Trois contraintes rendent la question difficile : l'horizon long, une incertitude qui doit être livrée au dispatching plutôt que devinée, et le climat sahélien — harmattan en saison sèche, hivernage, passages nuageux qui durent parfois moins d'une heure.",
    render: () => (
      <div className="h-full px-8 md:px-14 flex flex-col justify-center">
        <div className="max-w-4xl font-serif text-[clamp(1.45rem,3vw,2.4rem)] leading-[1.55] italic text-db-text">
          <span className="not-italic text-db-accent">«&nbsp;</span>
          Comment concevoir un modèle d'apprentissage profond capable de prédire, avec précision et
          robustesse, la production électrique solaire à 72&nbsp;h dans le contexte climatique sénégalais,
          tout en intégrant et en quantifiant l'incertitude inhérente à cette source renouvelable
          intermittente&nbsp;?<span className="not-italic text-db-accent">&nbsp;»</span>
        </div>
        <div className="mt-12 flex flex-wrap items-baseline justify-between gap-4">
          <div className="font-mono text-[11px] tracking-wide text-db-dim">
            horizon 72 h&nbsp;&nbsp;·&nbsp;&nbsp;incertitude livrée, pas devinée&nbsp;&nbsp;·&nbsp;&nbsp;harmattan, hivernage, nuages &lt; 1 h
          </div>
          <div className="font-serif italic text-xs text-db-dim">— question de recherche, introduction</div>
        </div>
      </div>
    ),
  },

  /* 04 — pipeline */
  {
    id: 's04',
    title: 'Le pipeline en une image',
    section: 'Méthode · Vue d’ensemble',
    acte: 'II',
    notes:
      "Ma réponse tient en une image — la vue d'ensemble du système Deep Aero SN. Trois blocs : fabriquer les données, de l'export SCADA à 15 minutes et des réanalyses jusqu'au parquet de features. Apprendre, avec fenêtrage, modélisation probabiliste, calibration et traçabilité. Et prédire, en production : sélection du bon modèle et inférence batch avec enveloppe P10–P90. Trois blocs reliés par trois artefacts versionnés — les features, les modèles, les prévisions — ce qui rend chaque expérience reproductible par un simple identifiant de run.",
    render: () => (
      <div className="h-full px-6 md:px-10 flex flex-col justify-center">
        <FigureZoom
          src="/figures/Deep-Aero-SN-ensemble.drawio.png"
          alt="Vue d'ensemble du système Deep Aero SN"
        />
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-4">
          <span className="font-serif italic text-sm text-db-muted">
            Trois blocs, trois artefacts versionnés — chaque expérience reproductible par un run_id.
          </span>
          <span className="font-mono text-[10px] text-db-dim">
            data_pipeline&nbsp;/&nbsp;training_pipeline&nbsp;/&nbsp;inference_pipeline —{' '}
            <span className="text-db-accent">cliquer pour agrandir</span>
          </span>
        </div>
      </div>
    ),
  },

  /* 05 — la donnée */
  {
    id: 's05',
    title: 'Les données de Diass',
    section: 'Méthode · La donnée',
    acte: 'II',
    notes:
      "Sur Diass, une année complète de télémesure : 35 196 lignes à 15 minutes, ramenées par le pipeline à 8 800 lignes horaires et 428 colonnes, sur 367 jours d'exploitation. Trois choix que je revendique. D'abord, la traçabilité : chaque colonne garde son origine — mesure locale, réanalyse NASA POWER ou ERA5, CAMS pour les aérosols, variable calculée, paramètre d'installation. Ensuite, l'interruption réelle de décembre 2025 — six jours sans télémesure — est conservée comme absence, jamais reconstruite par interpolation : une absence de mesure n'est pas une production nulle. Enfin, les prévisions numériques d'ECMWF IFS HRES sont injectées comme covariables futures, F égale 3, avec une règle de disponibilité stricte : un run n'entre dans une fenêtre que s'il était disponible au moment de l'émission — la causalité est garantie par construction.",
    render: () => (
      <div className="h-full px-8 md:px-14 flex flex-col justify-center">
        <p className="font-serif italic text-lg md:text-xl text-db-dim">Une année complète de télémesure — sans maquillage.</p>
        <div className="mt-8 flex flex-wrap items-end gap-x-10 gap-y-8">
          <div>
            <div className="font-mono text-3xl md:text-4xl text-db-dim tabular-nums">35 196</div>
            <div className="mt-1 text-xs text-db-muted">lignes brutes · 15 min</div>
          </div>
          <span aria-hidden className="text-db-border text-2xl pb-4">→</span>
          <div>
            <div className="font-mono text-5xl md:text-6xl text-db-text tabular-nums leading-none">8 800 × 428</div>
            <div className="mt-2 text-xs text-db-muted">lignes horaires × variables</div>
          </div>
          <span aria-hidden className="text-db-border text-2xl pb-4">→</span>
          <div>
            <div className="font-mono text-3xl md:text-4xl text-db-dim tabular-nums">367 j</div>
            <div className="mt-1 text-xs text-db-muted">30/08/2025 → 31/08/2026</div>
          </div>
        </div>
        <div className="mt-14 max-w-5xl">
          {/* barre d'année — l'interruption est un segment rouge, pas une reconstruction.
              Calcul : 366 jours de plage (30/08/2025 → 31/08/2026, différence).
              Début interruption 09/12/2025 : 101 j après le début → 101/366 ≈ 27,6 %.
              Durée 6 j (09 → 15) → 6/366 ≈ 1,6 %. */}
          <div className="relative h-[5px] bg-db-border">
            <span
              aria-hidden
              className="absolute top-1/2 -translate-y-1/2 h-[5px] bg-db-error"
              style={{ left: '27.6%', width: '1.6%' }}
            />
          </div>
          <div className="mt-2.5 flex items-baseline justify-between font-mono text-[10px] text-db-dim">
            <span>30/08/2025</span>
            <span>31/08/2026</span>
          </div>
          <p className="ml-auto mt-5 max-w-sm text-right text-xs text-db-muted leading-snug">
            <span aria-hidden className="mr-2 inline-block h-2.5 w-4 -translate-y-px bg-db-error" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-db-error">
              Interruption — 9–15 déc. 2025
            </span>
            <span className="block mt-1">
              conservée comme <span className="font-serif italic text-db-text">absence</span>, jamais interpolée.
            </span>
          </p>
        </div>
        <p className="mt-8 font-mono text-[11px] leading-relaxed text-db-dim">
          SCADA Schneider ×6&nbsp;&nbsp;·&nbsp;&nbsp;NASA POWER / MERRA-2&nbsp;&nbsp;·&nbsp;&nbsp;ERA5&nbsp;&nbsp;·&nbsp;&nbsp;CAMS&nbsp;&nbsp;·&nbsp;&nbsp;
          ECMWF IFS HRES — covariables futures F&nbsp;=&nbsp;3, run disponible au moment de l'émission
        </p>
      </div>
    ),
  },

  /* 06 — anti-fuite */
  {
    id: 's06',
    title: 'Anti-fuite : variables causales',
    section: 'Méthode · Causalité',
    acte: 'II',
    notes:
      "Le point technique le plus important du mémoire : les variables électriques SCADA contemporaines sont interdites. La puissance AC, les courants, les tensions sont mesurés au même instant t que la cible — les utiliser, c'est apprendre une identité d'électrotechnique, pas prévoir le soleil. Et en production, à l'instant t pour prédire t+24 heures, ces télémesures sont par définition physiquement inexistantes : le modèle serait inutilisable en réel. Je les remplace donc par onze transformations causales : l'état électrique de la veille, décalé d'au moins 24 heures — ratio d'encrassement, rendement de conversion, stabilité réseau. Connu à t−24 h, donc légal en day-ahead. La causalité est vérifiée par construction, et l'exclusion automatique des fuites par corrélation la renforce.",
    render: () => (
      <div className="h-full px-8 md:px-14 flex flex-col justify-center">
        <div className="grid grid-cols-12 gap-10 md:gap-12">
          <div className="col-span-12 md:col-span-7 border-l-2 border-db-error/70 pl-6 md:pl-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-db-error">
              Interdit — mesuré au même instant t
            </div>
            <div className="relative mt-7 inline-block">
              <MathInline
                tex={'P_{ac} = V_{ac} \\times I_{ac} \\times \\cos(\\varphi) \\times \\sqrt{3}'}
                className="text-2xl md:text-4xl text-db-text/90"
              />
              <span aria-hidden className="absolute -left-3 -right-3 top-1/2 h-[2px] bg-db-error/80 -rotate-6" />
            </div>
            <p className="mt-6 max-w-md text-sm text-db-muted leading-relaxed">
              Une identité d'électrotechnique, pas une prévision. Et en production, à t pour prédire
              t&nbsp;+&nbsp;24&nbsp;h, ces télémesures <span className="text-db-text">n'existent pas</span>.
            </p>
          </div>
          <div className="col-span-12 md:col-span-5 border-l border-db-accent/60 pl-6 md:pl-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-db-accent">
              Légal — connu à t − 24 h
            </div>
            <div className="mt-6 border-b border-db-border/50">
              <div className="border-t border-db-border/50 pt-4">
                <code className="font-mono text-xs text-db-accent">I_dc_lag_24h</code>
                <span className="block mt-1 text-sm text-db-muted">indice d'encrassement — le soiling de la veille</span>
              </div>
              <div className="border-t border-db-border/50 pt-4 mt-4">
                <code className="font-mono text-xs text-db-accent">P_ac_lag_24h&nbsp;/&nbsp;P_dc_lag_24h</code>
                <span className="block mt-1 text-sm text-db-muted">rendement réel de l'onduleur</span>
              </div>
              <div className="border-t border-db-border/50 pt-4 mt-4">
                <code className="font-mono text-xs text-db-accent">V_ac_std_24h</code>
                <span className="block mt-1 text-sm text-db-muted">stabilité réseau / curtailment</span>
              </div>
            </div>
            <p className="mt-5 text-sm text-db-muted leading-relaxed">
              La veille ne prédit pas le soleil — elle décrit l'état de l'installation.
            </p>
          </div>
        </div>
        <p className="mt-10 font-mono text-[11px] text-db-dim">
          11 variables contemporaines interdites&nbsp;→&nbsp;11 transformations causales
        </p>
      </div>
    ),
  },

  /* 07 — variables */
  {
    id: 's07',
    title: 'Feature engineering',
    section: 'Méthode · Variables',
    acte: 'II',
    notes:
      "Ces variables passent dans une chaîne de sept plugins, exécutés en séquence déterministe — temporel, météo commune, fréquence réseau, physique solaire, météo solaire, électrique causal, lags et statistiques glissantes. En sortie : 543 features numériques. La sélection applique sept méthodes indépendantes — corrélation, information mutuelle, PCA, RFE, VIF, permutation, SHAP — et retient leur union, pas leur intersection. Pourquoi l'union ? Parce que le consensus inter-méthodes est faible : aucune feature n'est retenue par les sept, 194 par une seule. Un vote majoritaire éliminerait précisément les informations qu'une seule méthode sait isoler. Résultat : 424 features alimentent les modèles, après exclusion automatique des fuites et déduplication des redondances.",
    render: () => (
      <div className="h-full px-8 md:px-14 flex flex-col justify-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-db-dim">
          Sept plugins, en séquence déterministe
        </p>
        <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-2 font-mono text-[11px] tracking-wide text-db-muted">
          {['Temporal', 'CommonWeather', 'GridFrequency', 'SolarPhysical', 'SolarWeather', 'SolarElectrical', 'LagRolling'].map(
            (p, k, arr) => (
              <span key={p} className="flex items-baseline gap-3">
                <span>{p}</span>
                {k < arr.length - 1 && <span aria-hidden className="text-db-border">—</span>}
              </span>
            ),
          )}
        </div>
        <div className="mt-14 flex flex-wrap items-end gap-x-12 gap-y-8">
          <div>
            <div className="font-mono text-2xl md:text-3xl text-db-dim tabular-nums">58</div>
            <div className="mt-1 text-xs text-db-muted">colonnes brutes</div>
          </div>
          <span aria-hidden className="text-db-border text-xl pb-1">→</span>
          <div>
            <div className="font-mono text-4xl md:text-5xl text-db-info tabular-nums leading-none">543</div>
            <div className="mt-2 text-xs text-db-muted">features fabriquées</div>
          </div>
          <span aria-hidden className="text-db-border text-xl pb-1">→</span>
          <div>
            <div className="font-serif font-semibold text-[clamp(4rem,9vw,7rem)] leading-none text-db-accent">424</div>
            <div className="mt-2 text-xs text-db-muted">retenues — union des sept méthodes, dédoublonnées</div>
          </div>
        </div>
        <Rule className="mt-12 max-w-3xl" />
        <p className="mt-5 max-w-3xl text-sm text-db-muted leading-relaxed">
          Le consensus inter-méthodes est <span className="text-db-text">faible</span> : aucune feature n'est
          retenue par les sept, 194 par une seule. Un vote majoritaire éliminerait précisément ce qu'une
          seule méthode sait isoler — c'est pourquoi l'union, pas le vote.
        </p>
        <p className="mt-3 font-mono text-[11px] text-db-dim">
          corrélation 349&nbsp;/&nbsp;VIF 527&nbsp;/&nbsp;RFE 50&nbsp;/&nbsp;info. mutuelle 2&nbsp;/&nbsp;permutation 2&nbsp;/&nbsp;SHAP 2
        </p>
      </div>
    ),
  },

  /* 08 — MIMO */
  {
    id: 's08',
    title: 'MIMO & quantiles',
    section: 'Méthode · Modèles',
    acte: 'II',
    notes:
      "Côté modèles, la stratégie est MIMO : un seul réseau sort les 72 horizons d'un coup, ce qui garantit la cohérence entre horizons et évite la propagation d'erreurs d'une prédiction récursive. En sortie probabiliste, la sortie devient une matrice H fois Q : trois quantiles par horizon — 10, 50 et 90 %, soit une médiane et une enveloppe de confiance à 80 %. Et l'entraînement repose sur une perte hybride multi-tâche : la moitié exactitude ponctuelle — MSE sur la médiane —, la moitié calibration — pinball moyenné sur les quantiles. Le poids w_mse, fixé à 0,5 par défaut et exploré entre 0,3 et 0,8 par Optuna, est justifié par le climat sahélien : passages nuageux rapides et tempêtes de poussière rendent l'estimation de l'incertitude aussi critique que la prévision ponctuelle.",
    render: () => (
      <div className="h-full px-8 md:px-14 grid grid-cols-12 gap-10 items-center">
        <div className="col-span-12 lg:col-span-6">
          <h2 className="font-serif text-[clamp(1.6rem,3.2vw,2.6rem)] leading-[1.18] text-db-text">
            Un modèle,
            <br />
            <span className="text-db-accent">72 horizons</span>, trois quantiles.
          </h2>
          <div className="mt-8 space-y-4 max-w-md text-sm md:text-[15px] text-db-muted leading-relaxed">
            <p>
              Sortie MIMO — <MathInline tex={'\\hat{\\mathbf{Y}} \\in \\mathbb{R}^{H \\times Q}'} /> : les 72
              horizons sortent d'un seul réseau. Cohérence garantie, pas de récursivité qui propage l'erreur.
            </p>
            <p>
              Trois quantiles par horizon — <MathInline tex={'q_{0{,}1}'} />, <MathInline tex={'q_{0{,}5}'} />,{' '}
              <MathInline tex={'q_{0{,}9}'} /> : médiane et enveloppe P10–P90 à 80&nbsp;%.
            </p>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6 lg:col-start-7 border-t border-db-border/70 pt-9">
          <div className="text-center">
            <MathInline
              tex={
                '\\mathcal{L} = w_{\\text{mse}} \\cdot \\text{MSE}(\\hat{y}_{0.5},\\; y) + (1 - w_{\\text{mse}}) \\cdot \\overline{\\text{Pinball}}(\\hat{y}_q,\\; y)'
              }
              className="text-lg md:text-2xl"
            />
          </div>
          <p className="mt-7 text-center font-mono text-[11px] text-db-muted">
            w<sub>mse</sub> = 0,5 — moitié exactitude ponctuelle, moitié calibration
          </p>
          <p className="mt-2 text-center font-mono text-[10px] text-db-dim">
            poids exploré par Optuna sur [0,3&nbsp;;&nbsp;0,8] — justifié par le climat sahélien
          </p>
        </div>
      </div>
    ),
  },

  /* 09 — CQR */
  {
    id: 's09',
    title: 'Calibration CQR',
    section: 'Méthode · Calibration',
    acte: 'II',
    notes:
      "Une régression quantile brute n'est pas calibrée en échantillon fini. Le pipeline ajoute donc une étape de régression quantile conforme — le CQR, Conformalized Quantile Regression. Un score de non-conformité est mesuré sur un jeu de calibration disjoint : c'est la plus grande des deux erreurs de bord, au-dessus et en dessous. Puis chaque horizon reçoit une correction s_h, fonction croissante de l'horizon : on élargit quand le modèle est trop confiant, on resserre quand il est trop prudent. Effet concret sur le TCN de Diass : la couverture passe de 60,8 % à 79,8 %, pour une cible de 80 %, au prix d'une enveloppe qui passe de 1,67 à 2,6 MW — un échange largeur/validité assumé. Et les croisements de quantiles restent nuls sur le test.",
    render: () => (
      <div className="h-full px-8 md:px-14 flex flex-col justify-center">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-3">
          <MathInline
            tex={'s_i = \\max\\bigl\\{\\hat{y}^{\\text{bas}}_i - y_i,\\;\\; y_i - \\hat{y}^{\\text{haut}}_i\\bigr\\}'}
            className="text-xl md:text-3xl"
          />
          <span className="font-serif italic text-sm text-db-muted">
            score de non-conformité — jeu de calibration disjoint
          </span>
        </div>
        <div className="mt-12 max-w-3xl">
          <div className="flex items-baseline gap-4 font-mono text-[10px] uppercase tracking-wider text-db-dim">
            <span className="w-24 md:w-28 shrink-0" />
            <span>couverture P10–P90 (TCN)</span>
            <span className="ml-auto text-db-accent normal-case">│ cible 80 %</span>
          </div>
          <Coverage label="avant" pct={60.8} tone="bg-db-dim" />
          <Coverage label="après CQR" pct={79.8} tone="bg-db-accent" />
        </div>
        <div className="mt-8 max-w-3xl border-b border-db-border/50">
          <LedgerRow v="60,8 → 79,8 %" l="couverture — pour une cible de 80 %" tone="text-db-accent" />
          <LedgerRow v="1,67 → 2,60 MW" l="largeur d'enveloppe — un échange largeur / validité assumé" />
          <LedgerRow v="0 croisement" l="de quantiles sur le segment de test" />
        </div>
      </div>
    ),
  },

  /* 10 — verdict */
  {
    id: 's10',
    title: 'Résultats',
    section: 'Verdict · Métriques',
    acte: 'III',
    notes:
      "Les résultats, sur un segment de test jamais vu : 1 049 fenêtres, du 16 juillet au 28 août 2026, plus 72 heures d'horizon. La persistence — « demain sera comme aujourd'hui » — fait 6,905 MW d'erreur. Le MLP descend à 2,323, le LSTM à 2,043. Le TCN atteint 1,707 MW de RMSE avec un R² de 0,877 ; le TFT suit de près à 1,818 MW, R² 0,861. Un mot d'honnêteté sur la MAPE : elle explose près de zéro production — 3 282 % pour la persistence, 362 % pour le TCN — parce qu'un petit écart à l'aube pèse énormément en relatif. C'est une fragilité de la métrique, pas du modèle : je m'appuie donc sur le R² et la RMSE, et sur la couverture calibrée — 79,8 % pour le TCN, 74,2 % pour le TFT — qui départage le plus nettement les deux architectures.",
    render: () => (
      <div className="h-full px-8 md:px-14 grid grid-cols-12 gap-10 items-center">
        <div className="col-span-12 lg:col-span-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-db-dim">
            RMSE du TCN — 1&nbsp;049 fenêtres, jamais vues
          </div>
          <div className="mt-4 font-mono font-semibold text-[clamp(4.5rem,10vw,8rem)] leading-none text-db-accent tabular-nums">
            1,707
          </div>
          <div className="mt-3 font-mono text-xs text-db-muted">
            contre 6,905 MW pour la persistence — « demain sera comme aujourd'hui »
          </div>
          <div className="mt-8 border-b border-db-border/50">
            <LedgerRow v="R² 0,877" l="variance expliquée — meilleur modèle" />
            <LedgerRow v="79,8 %" l="couverture CQR (cible 80 %)" tone="text-db-accent" />
            <LedgerRow v="< 5 MW" l="exigence du dispatch — marge ≈ 3×" />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-7">
          <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-wider text-db-dim">
            <span>0 MW</span>
            <span>échelle commune — 6,905 MW</span>
          </div>
          <div className="mt-1 border-t border-db-border/70">
            <Bar name="persistence" val={6.905} max={6.905} />
            <Bar name="MLP" val={2.323} max={6.905} />
            <Bar name="LSTM" val={2.043} max={6.905} />
            <Bar name="TFT" val={1.818} max={6.905} />
            <Bar name="TCN" val={1.707} max={6.905} best />
          </div>
          <p className="mt-4 text-[11px] text-db-dim leading-relaxed">
            MAPE&nbsp;: 3&nbsp;282&nbsp;% (persistence) — artefact près de zéro production ;{' '}
            <span className="text-db-muted">R² et RMSE font foi</span>.
          </p>
        </div>
      </div>
    ),
  },

  /* 11 — le test */
  {
    id: 's11',
    title: 'Le test — fenêtres jamais vues',
    section: 'Verdict · Le test',
    acte: 'III',
    notes:
      "Voici le test, en images : trois fenêtres du segment jamais vu. La ligne bleue solide, c'est la prévision P50 ; le ruban bleu clair, l'enveloppe P10–P90 ; les pointillés rouges, la production réelle. À gauche le TCN, à droite le TFT. Le 16 juillet : le TCN fait 1,309 MW de MAE, le TFT 1,676. Le 7 août au petit matin : 0,741 contre 1,011 — le TCN écrase. Fin août, à 22 heures, fenêtre nocturne difficile : le TFT repasse devant, 0,918 contre 1,016. Sur l'ensemble des 1 049 fenêtres, le TCN gagne : RMSE 1,707 MW, MAE 0,989, R² 0,877. Les pics sont captés, les nuits plates aussi — et l'enveloppe épouse l'incertitude au fil de la fenêtre. La prévision affronte la réalité, et elle tient.",
    render: () => (
      <div className="h-full px-6 md:px-10 flex flex-col justify-center">
        <FigureZoom
          src="/figures/nb_diass/nb_diass_fenetres_test.png"
          alt="Fenêtres de test — P50 et enveloppe P10–P90 face à la production réelle (TCN vs TFT)"
        />
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-4">
          <span className="font-serif italic text-sm text-db-muted">
            Prévision P50 et enveloppe contre la production réelle — le modèle n'a jamais vu ces jours-là.
          </span>
          <span className="font-mono text-[10px] text-db-dim">
            1&nbsp;049 fenêtres&nbsp;·&nbsp;RMSE 1,707&nbsp;MW&nbsp;·&nbsp;R²&nbsp;0,877&nbsp;·&nbsp;MAE 0,989&nbsp;MW —{' '}
            <span className="text-db-accent">cliquer pour agrandir</span>
          </span>
        </div>
      </div>
    ),
  },

  /* 12 — implications */
  {
    id: 's12',
    title: 'Pour la SENELEC',
    section: 'Implications',
    acte: 'III',
    notes:
      "Ce que ça change pour l'exploitant. La marge d'erreur jugée acceptable pour le dispatch quotidien de Diass, c'est 5 MW — 22 % de la capacité publiée de 23,1 MW. Nos deux architectures font 1,71 et 1,82 MW : presque trois fois sous le seuil, une marge de sécurité confortable. Et l'intervalle P10–P90 est directement actionnable : la borne haute dimensionne la réserve de sécurité à mobiliser ; la borne basse donne le plancher de production sur lequel on peut compter, pour ne pas démarrer un thermique inutilement ; et la distribution des quantiles permet d'estimer la probabilité de franchir un seuil critique — par exemple 10 % de la capacité — information qu'une prévision ponctuelle ne donne pas. Combinée aux prévisions de charge, elle éclaire le niveau de production thermique à activer.",
    render: () => (
      <div className="h-full px-8 md:px-14 grid grid-cols-12 gap-10 items-center">
        <div className="col-span-12 lg:col-span-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-db-dim">seuil opérationnel</div>
          <div className="mt-2 font-mono text-2xl text-db-dim tabular-nums">
            5 MW <span className="text-[11px] text-db-dim/80 normal-case">(22 % de la capacité publiée, 23,1 MW)</span>
          </div>
          <div className="mt-10 font-mono text-[10px] uppercase tracking-[0.25em] text-db-muted">réalisé — TCN</div>
          <div className="font-mono font-semibold text-[clamp(4rem,9.5vw,7.5rem)] leading-none text-db-accent tabular-nums">
            1,71<span className="text-3xl md:text-5xl text-db-muted"> MW</span>
          </div>
          <p className="mt-4 text-sm text-db-muted">
            ≈ <span className="font-semibold text-db-accent">3× sous le seuil</span> — une marge de sécurité confortable.
          </p>
        </div>
        <div className="col-span-12 lg:col-span-5 lg:col-start-8 border-b border-db-border/50">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-db-dim pb-2">L'intervalle, actionnable</div>
          <LedgerRow v="P90" l="borne haute — dimensionne la réserve de sécurité" tone="text-db-warn" />
          <LedgerRow v="P10" l="plancher fiable — évite de démarrer un thermique inutile" tone="text-db-solar" />
          <LedgerRow v="P (seuil)" l="probabilité de franchir un seuil critique — croisée avec la charge, elle éclaire le thermique à activer" tone="text-db-info" />
        </div>
      </div>
    ),
  },

  /* 13 — limites */
  {
    id: 's13',
    title: 'Limites',
    section: 'Limites',
    acte: 'IV',
    notes:
      "Je préfère nommer les limites avant que vous ne le fassiez. Une année de données : suffisant pour valider le pipeline sur un site réel, insuffisant pour garantir que les hyperparamètres restent stables d'une saison à l'autre — la stabilité devra être vérifiée sur plusieurs années avant un déploiement opérationnel. Le pas horaire, ensuite : les passages nuageux sahéliens durent souvent moins d'une heure et sont lissés par le rééchantillonnage — la précision atteignable à 72 heures est mécaniquement plafonnée. Et le coût mémoire du TFT — attention quadratique sur la fenêtre d'entrée — reste un frein pratique à un déploiement embarqué, même si son interprétabilité, la sélection de variables et les cartes d'attention, en fait un outil précieux côté opérateur.",
    render: () => (
      <div className="h-full px-8 md:px-14 flex flex-col justify-center">
        <div className="max-w-4xl border-b border-db-border/50">
          {[
            {
              t: 'Une année de données',
              d: 'valide le pipeline, pas la stabilité saisonnière — à vérifier sur plusieurs années avant un déploiement.',
            },
            {
              t: 'Le pas horaire',
              d: "les nuages sahéliens durent souvent moins d'une heure et sont lissés — précision à 72 h mécaniquement plafonnée.",
            },
            {
              t: 'Le coût du TFT',
              d: "attention quadratique sur la fenêtre d'entrée — frein embarqué, malgré une interprétabilité précieuse (VSN, attention).",
            },
          ].map((x, k) => (
            <div key={x.t} className="flex items-baseline gap-6 py-5 border-t border-db-border/50">
              <span className="font-mono text-xs text-db-warn w-8 shrink-0">0{k + 1}</span>
              <span className="font-serif text-lg md:text-xl text-db-text shrink-0">{x.t}</span>
              <span className="text-sm md:text-[15px] text-db-muted leading-relaxed">— {x.d}</span>
            </div>
          ))}
        </div>
        <p className="mt-8 font-serif italic text-sm text-db-dim">Dites les limites avant que le jury ne le fasse.</p>
      </div>
    ),
  },

  /* 14 — perspectives */
  {
    id: 's14',
    title: 'Perspectives',
    section: 'Perspectives',
    acte: 'IV',
    notes:
      "Trois perspectives, directement actionnables. L'apprentissage par transfert vers un autre site solaire — le pipeline est déjà structuré par centrale, donc la mise à l'échelle est une question d'ingénierie, pas de recherche. Des modèles dédiés aux horizons courts, de 1 à 6 heures à résolution fine, 5 à 15 minutes — pour capturer ce que le pas horaire lisse. Et l'apprentissage fédéré multi-sites, sans partage des données brutes. L'étape opérationnelle suivante est claire : intégrer le pipeline au système de gestion du réseau de la SENELEC, en commençant par des phases pilotes sur Diass.",
    render: () => (
      <div className="h-full px-8 md:px-14 flex flex-col justify-center">
        <div className="max-w-4xl border-b border-db-border/50">
          {[
            { t: 'Transfert', d: 'vers un autre site solaire — le pipeline est déjà structuré par centrale.' },
            { t: 'Horizons courts', d: '1 à 6 h à pas fin (5–15 min) — capturer ce que le pas horaire lisse.' },
            { t: 'Fédéré multi-sites', d: 'apprendre ensemble, sans partager les données brutes.' },
          ].map((x, k) => (
            <div key={x.t} className="flex items-baseline gap-6 py-5 border-t border-db-border/50">
              <span className="font-mono text-xs text-db-dim w-8 shrink-0">0{k + 1}</span>
              <span className="font-serif text-lg md:text-xl text-db-text w-44 md:w-52 shrink-0">{x.t}</span>
              <span className="text-sm md:text-[15px] text-db-muted leading-relaxed">{x.d}</span>
            </div>
          ))}
        </div>
        <p className="mt-9 text-sm text-db-muted">
          Étape suivante&nbsp;: <span className="text-db-accent">phases pilotes sur Diass</span> — intégration au
          système de gestion du réseau de la SENELEC.
        </p>
      </div>
    ),
  },

  /* 15 — merci */
  {
    id: 's15',
    title: 'Merci',
    section: 'Clôture',
    acte: 'IV',
    notes:
      "Je conclus. Une année réelle de données de télémesure, une chaîne causale sans fuite d'information, deux architectures probabilistes calibrées, et des erreurs presque trois fois sous le seuil opérationnel du dispatch. Une année d'entraînement suffit pour montrer que le pipeline tient sur une vraie centrale — le mémoire entier, chapitre par chapitre, est consultable sur ce site. Merci de votre attention ; je suis à votre disposition pour vos questions.",
    render: () => (
      <div className="h-full flex flex-col items-center justify-center text-center px-8">
        <p className="font-serif italic text-base md:text-lg text-db-muted max-w-2xl leading-relaxed">
          Une année réelle de données, une chaîne causale sans fuite, deux architectures calibrées —
        </p>
        <h2 className="mt-4 font-serif font-bold leading-none tracking-tight text-[clamp(3.5rem,11vw,9rem)] text-db-text">
          Merci<span className="text-db-accent">.</span>
        </h2>
        <div className="mt-7 h-px w-24 bg-db-accent" />
        <p className="mt-6 font-mono text-[11px] text-db-dim">
          Le pipeline tient sur une vraie centrale — mémoire intégral sur ce site.
        </p>
        <SunArc className="mx-auto mt-10 w-64 opacity-60" />
      </div>
    ),
  },
]