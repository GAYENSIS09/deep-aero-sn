'use client'

/**
 * Deck de soutenance — mémoire « Prévision probabiliste de la production
 * photovoltaïque par apprentissage profond : application à la centrale
 * de Diass » (version submission/, main.tex du 11 novembre 2026).
 *
 * L'ordre des planches suit EXACTEMENT celui du mémoire, chapitre par
 * chapitre et section par section (le kicker de chaque planche indique le
 * chapitre et le paragraphe correspondants) :
 *
 *   Introduction générale                     (planches 1–3)
 *   I   Potentiel solaire et technologie PV   (ch. 1–2, planches 4–6)
 *   II  Architectures d'apprentissage profond (ch. 3–6, planches 7–10)
 *   III Modélisation de la prévision PV       (ch. 7, 7.1 → 7.6, planches 11–29)
 *
 * Les chiffres sont ceux du mémoire. Chaque figure apparaît une seule fois,
 * dans l'ordre de sa numérotation.
 */

import type { ReactNode } from 'react'

import { useEffect, useState } from 'react'
import { asset } from '@/lib/paths'

/* ───────────────────────── briques ───────────────────────── */

const BODY = 'text-[clamp(1rem,1.55vw,1.3rem)] leading-snug text-db-muted'

function Kicker({ children, tone = 'text-db-dim' }: { children: ReactNode; tone?: string }) {
  return <div className={`font-mono text-[12px] uppercase tracking-[0.25em] ${tone}`}>{children}</div>
}

/** Chiffre clé en grand, avec son libellé. */
function Stat({ v, l, tone = 'text-db-text' }: { v: string; l: string; tone?: string }) {
  return (
    <div className="border-t-2 border-db-accent/70 pt-3">
      <div className={`font-mono tabular-nums leading-none text-[clamp(1.6rem,3vw,2.7rem)] ${tone}`}>{v}</div>
      <div className="mt-2 text-[clamp(0.9rem,1.25vw,1.1rem)] leading-snug text-db-muted">{l}</div>
    </div>
  )
}

function LedgerRow({ v, l, tone = 'text-db-text' }: { v: string; l: string; tone?: string }) {
  return (
    <div className="flex items-baseline gap-5 border-t border-db-border/50 py-2.5">
      <span className={`w-40 shrink-0 font-mono text-[clamp(1rem,1.5vw,1.3rem)] tabular-nums leading-tight sm:w-56 ${tone}`}>
        {v}
      </span>
      <span className="text-[clamp(0.95rem,1.4vw,1.2rem)] leading-snug text-db-muted">{l}</span>
    </div>
  )
}

/** Message à retenir : filet d'accent + serif. */
function Takeaway({ children }: { children: ReactNode }) {
  return (
    <p className="max-w-5xl border-l-2 border-db-accent/70 pl-5 font-serif text-[clamp(1.1rem,1.9vw,1.55rem)] leading-snug text-db-text">
      {children}
    </p>
  )
}

function FigureZoom({
  src,
  alt,
  className = 'max-h-[62vh] w-full cursor-zoom-in object-contain',
}: {
  src: string
  alt: string
  className?: string
}) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const guardKeys = new Set([
      'ArrowRight', 'ArrowLeft', ' ', 'Enter', 'PageDown', 'PageUp',
      'Backspace', 'Escape', 'Home', 'End', 'o', 'n', 'f', 'O', 'N', 'F',
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
      <img src={src} alt={alt} onClick={() => setOpen(true)} className={className} />
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-db-bg/95 p-6"
          onClick={() => setOpen(false)}
        >
          <img src={src} alt={alt} className="max-h-full max-w-full bg-white object-contain p-3" />
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

/** Figure du mémoire sur fond blanc, cliquable (zoom), avec son numéro LaTeX. */
function Fig({
  src,
  num,
  caption,
  h = 'h-[40vh]',
  className = '',
}: {
  src: string
  num: string
  caption: string
  h?: string
  className?: string
}) {
  return (
    <figure className={className}>
      <div className={`rounded-sm bg-white p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] ${h}`}>
        <FigureZoom
          src={src}
          alt={`Figure ${num} — ${caption}`}
          className="h-full w-full cursor-zoom-in object-contain"
        />
      </div>
      <figcaption className="mt-2 font-mono text-[12px] leading-snug text-db-dim">
        <span className="text-db-accent">Figure {num}</span> — {caption}
      </figcaption>
    </figure>
  )
}

const fig = (name: string) => asset('/figures/' + encodeURIComponent(name))

/** Coquille de planche : titre-message ancré en haut, contenu centré dans l'espace restant. */
function Slide({
  kicker,
  title,
  gap = 'gap-5',
  children,
}: {
  kicker: string
  title: ReactNode
  gap?: string
  children: ReactNode
}) {
  return (
    <div className={`flex h-full flex-col px-4 pb-8 pt-2 sm:px-8 md:px-14 ${gap}`}>
      <div>
        <Kicker>{kicker}</Kicker>
        <h2 className="mt-2 max-w-6xl font-serif text-[clamp(1.8rem,3.3vw,2.7rem)] leading-[1.12] text-db-text">
          {title}
        </h2>
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-5">{children}</div>
    </div>
  )
}

/* ───────────────────────── actes (parties du mémoire) ───────────────────────── */

export type ActeId = 'I' | 'II' | 'III'

export interface ActeMeta {
  id: ActeId
  label: string
  titre: string
  temps: string
}

export const ACTES: ActeMeta[] = [
  { id: 'I', label: 'Partie I', titre: 'Potentiel solaire et technologie photovoltaïque', temps: '0:00 – 3:00' },
  { id: 'II', label: 'Partie II', titre: 'Architectures d’apprentissage profond', temps: '3:00 – 6:00' },
  { id: 'III', label: 'Partie III', titre: 'Modélisation de la prévision photovoltaïque', temps: '6:00 – 15:00' },
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
  /* 01 — page de titre (reprend la couverture du mémoire) */
  {
    id: 's01',
    title: 'Page de titre',
    section: 'Introduction',
    acte: 'I',
    notes:
      "Bonjour à tous. Je vous présente mon mémoire de licence en informatique : prévision probabiliste de la production photovoltaïque par apprentissage profond, application à la centrale de Diass. Il a été encadré par le Dr Ndiouma Bame, et en stage par le Dr Saidou Abdoul Soumare et le Dr Abdoulaye Ba, de la SENELEC. Je vais suivre le plan du mémoire : le contexte, les méthodes, puis l'application à Diass.",
    render: () => (
      <div className="flex h-full flex-col px-4 sm:px-8 md:px-14">
        <div className="flex items-center gap-5 pt-3">
          <img
            src={asset('/images/ucadLogo.png')}
            alt="UCAD"
            className="h-16 w-16 rounded-full bg-white/10 object-contain p-1"
          />
          <div className="flex-1 text-center font-mono text-[12px] uppercase leading-relaxed tracking-[0.2em] text-db-dim">
            <div className="text-db-muted">Université Cheikh Anta Diop de Dakar</div>
            <div>Faculté des Sciences et Techniques · Département Mathématiques et Informatique</div>
            <div>Section Informatique · Mémoire de Licence · 2025–2026</div>
          </div>
          <img
            src={asset('/images/senelecLogo.png')}
            alt="SENELEC"
            className="h-16 w-16 rounded-full bg-white/10 object-contain p-1"
          />
        </div>
        <div className="flex max-w-6xl flex-1 flex-col justify-center">
          <h1 className="font-serif text-[clamp(2.2rem,5vw,4.2rem)] font-bold leading-[1.08] tracking-tight text-db-text">
            Prévision probabiliste de la production photovoltaïque par apprentissage profond
          </h1>
          <div className="mt-5 text-[clamp(1.3rem,2.7vw,2.1rem)] text-db-accent">Application à la centrale de Diass</div>
          <p className="mt-7 font-mono text-[13px] tracking-wide text-db-dim">
            TCN · TFT · MIMO 72 h · Quantiles P10 / P50 / P90 · Calibration CQR
          </p>
        </div>
        <div className="space-y-1.5 py-4 pr-4 md:pr-40">
          <div className="font-mono text-sm text-db-text">Présenté par Baye Mor Gaye</div>
          <div className="font-mono text-[12px] leading-relaxed text-db-dim">
            Encadrant : Dr Ndiouma Bame · Maîtres de stage : Dr Saidou Abdoul Soumare, Dr Abdoulaye Ba
          </div>
        </div>
      </div>
    ),
  },

  /* 02 — introduction : contexte et problématique */
  {
    id: 's02',
    title: 'Contexte et problématique',
    section: 'Introduction générale',
    acte: 'I',
    notes:
      "Le Sénégal s'est engagé, dans le cadre du JETP signé en juin 2023, à porter les renouvelables à 40 % de la capacité installée d'ici 2030. Le solaire est passé à 292 mégawatts-crête en 2025. Mais le climat sahélien rend la production intermittente : harmattan de novembre à février, hivernage de juillet à septembre, passages nuageux. Chaque erreur de prévision se traduit par un déséquilibre du réseau et un appel aux réserves thermiques. D'où ma problématique : comment modéliser par apprentissage profond, et quantifier l'incertitude de, la production photovoltaïque à 72 heures pour sécuriser le pilotage du réseau ?",
    render: () => (
      <Slide kicker="Introduction générale · contexte et problématique" title="Un solaire en forte croissance, mais intermittent" gap="gap-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Stat v="40 %" l="de capacité renouvelable visée d’ici 2030 (accord JETP, juin 2023)" />
          <Stat v="292,47 MWc" l="de solaire raccordé au réseau en 2025" />
          <Stat v="2 saisons" l="harmattan (nov.–fév.) et hivernage (juil.–sept.) : une production intermittente" />
        </div>
        <div className="max-w-6xl border border-db-border/60 bg-db-border/10 px-6 py-5">
          <div className="font-mono text-[12px] uppercase tracking-[0.25em] text-db-accent">Problématique</div>
          <p className="mt-3 font-serif text-[clamp(1.2rem,2.3vw,1.9rem)] leading-snug text-db-text">
            Comment modéliser par apprentissage profond, et quantifier l’incertitude de, la production
            photovoltaïque à 72 heures pour sécuriser le pilotage du réseau électrique au Sénégal ?
          </p>
        </div>
      </Slide>
    ),
  },

  /* 03 — introduction : objectifs et plan */
  {
    id: 's03',
    title: 'Objectifs et plan',
    section: 'Introduction générale',
    acte: 'I',
    notes:
      "Je réponds en trois objectifs, qui forment une progression. Un : construire un référentiel de variables unifié, enrichi de prévisions météo futures, avec une sélection conçue pour éviter les fuites d'information. Deux : concevoir et comparer le TCN et le TFT en prévision multi-horizon à 72 heures, avec des quantiles recalibrés par CQR. Trois : évaluer sur les données réelles de Diass et analyser la portée pour la SENELEC. Le plan suit trois parties : le potentiel solaire et la physique, les architectures, puis la modélisation sur Diass.",
    render: () => (
      <Slide kicker="Introduction générale · objectifs et plan du mémoire" title="Trois objectifs, trois parties" gap="gap-7">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { n: '1', t: 'Un référentiel sans fuite', d: 'Variables unifiées, prévisions météo futures, sélection par union.' },
            { n: '2', t: 'TCN contre TFT', d: 'Même protocole, sortie 72 h, quantiles recalibrés par CQR.' },
            { n: '3', t: 'Preuve sur Diass', d: 'Évaluation sur données réelles, portée pour la SENELEC.' },
          ].map((o) => (
            <div key={o.n} className="border-t-2 border-db-accent/70 pt-3">
              <div className="font-mono text-[clamp(2rem,3.6vw,3.2rem)] leading-none text-db-accent">{o.n}</div>
              <div className="mt-2 font-serif text-[clamp(1.2rem,2vw,1.6rem)] leading-snug text-db-text">{o.t}</div>
              <p className={`mt-1 ${BODY}`}>{o.d}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {[
            { p: 'Partie I', t: 'Potentiel solaire et technologie PV', c: 'Chapitres 1–2' },
            { p: 'Partie II', t: 'Architectures d’apprentissage profond', c: 'Chapitres 3–6' },
            { p: 'Partie III', t: 'Modélisation de la prévision PV', c: 'Chapitre 7 · Diass' },
          ].map((x, k) => (
            <div key={x.p} className="flex items-start gap-3 border border-db-border/60 px-4 py-3">
              <span className="font-mono text-[12px] uppercase tracking-widest text-db-accent">{k + 1}</span>
              <div>
                <div className="font-mono text-[12px] uppercase tracking-widest text-db-dim">{x.p} · {x.c}</div>
                <div className="mt-1 text-[clamp(0.95rem,1.3vw,1.1rem)] text-db-text">{x.t}</div>
              </div>
            </div>
          ))}
        </div>
      </Slide>
    ),
  },

  /* 04 — chapitre 1 : mix, centrales, gisement */
  {
    id: 's04',
    title: 'Cadre énergétique et gisement solaire',
    section: 'Chapitre 1',
    acte: 'I',
    notes:
      "Premier chapitre : le cadre énergétique. Le thermique domine encore, 74,7 % de la capacité installée en 2025, et 76 % de l'énergie acheminée est achetée aux producteurs indépendants : la SENELEC ne pilote pas la majorité de ce qui transite sur son réseau, d'où l'intérêt de la prévision. Le gisement solaire national est l'un des plus réguliers : le GHI annuel va de 1 825 à 2 194 kWh par mètre carré, avec un potentiel estimé à 63 920 MW. Et notre cas d'étude, Diass, est la première centrale solaire publique du pays, dont vous voyez la localisation à gauche.",
    render: () => (
      <Slide kicker="Chapitre 1 · 1.1 mix énergétique, 1.3 centrales et potentiel" title="Le thermique domine, le gisement est excellent, Diass est notre cas d’étude">
        <div className="grid grid-cols-3 gap-6">
          <Stat v="74,7 %" l="de la capacité installée est thermique (2025)" />
          <Stat v="76,0 %" l="de l’énergie acheminée est achetée aux producteurs indépendants" />
          <Stat v="63 920 MW" l="de potentiel PV estimé ; GHI de 1 825 à 2 194 kWh/m²/an" tone="text-db-accent" />
        </div>
        <div className="grid grid-cols-[1fr_2fr] gap-8">
          <Fig src={fig('Central Solaire de Diass carte.png')} num="1.3" caption="Localisation de la centrale de Diass." h="h-[30vh]" />
          <figure>
            <div className="grid h-[30vh] grid-cols-3 gap-2 rounded-sm bg-white p-2">
              {['ghi_senegal.png', 'dni_senegal.png', 'dhi_senegal.png'].map((f) => (
                <img key={f} src={fig(f)} alt="Carte du gisement solaire" className="h-full w-full object-contain" />
              ))}
            </div>
            <figcaption className="mt-2 font-mono text-[12px] text-db-dim">
              <span className="text-db-accent">Figure 1.4</span> — Gisement solaire du Sénégal : GHI, DNI et DHI.
            </figcaption>
          </figure>
        </div>
      </Slide>
    ),
  },

  {
    id: 's04b',
    title: 'Mix énergétique sénégalais',
    section: 'Chapitre 1',
    acte: 'I',
    notes:
      "Le thermique pèse 1 711,14 MW sur 2 289,52 MW en 2025. Le solaire passe de 245 MW en 2022 à 292,47 MW en 2025, soit plus 19,4 %. La production brute totale atteint 7 486,3 GWh, dont 76 % d'achats. En 2023, les renouvelables pèsent 27,35 % de la capacité mais seulement 19,48 % de la production brute : c'est l'effet de l'intermittence.",
    render: () => (
      <Slide kicker="Chapitre 1 · mix énergétique" title="Un mix à 75 % thermique, où le solaire progresse de 19 % en trois ans" gap="gap-4">
        <div className="max-w-5xl">
          <LedgerRow v="1 711 / 2 290 MW" l="capacité thermique sur capacité totale en 2025 (74,7 %)" />
          <LedgerRow v="245 → 292,47 MW" l="solaire installé de 2022 à 2025 (+19,4 %)" />
          <LedgerRow v="7 486,3 GWh" l="production brute totale 2025, dont 5 687,1 GWh d’achats (76,0 %)" />
          <LedgerRow v="27,35 % / 19,48 %" l="renouvelables en capacité contre en production brute (2023)" />
        </div>
      </Slide>
    ),
  },

  /* 05 — chapitre 2 : physique */
  {
    id: 's05',
    title: 'Physique du PV et variabilité',
    section: 'Chapitre 2',
    acte: 'I',
    notes:
      "Deuxième chapitre : la physique. Une part de la production se calcule exactement : la géométrie solaire, l'angle d'incidence, à partir des éphémérides. L'autre est stochastique : passages nuageux, harmattan, empoussièrement. La figure de droite montre les chutes d'irradiance au passage des nuages. C'est cette part-là que les modèles d'apprentissage profond doivent capturer, à partir du référentiel de variables présenté en fin de chapitre.",
    render: () => (
      <Slide kicker="Chapitre 2 · 2.1 rayonnement, 2.3 variabilité" title="Une part de la production se calcule, l’autre se prévoit : c’est elle que le modèle doit apprendre">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <Fig src={fig('fig_ch2_geometrie_solaire.png')} num="2.2" caption="Géométrie solaire et angles du panneau." h="h-[40vh]" />
            <p className={`mt-3 ${BODY}`}>
              <span className="text-db-text">Déterministe</span> : éphémérides, angle d’incidence.
            </p>
          </div>
          <div>
            <Fig src={fig('fig_ch4_variabilite_court_terme.png')} num="2.6" caption="Variabilité liée aux passages nuageux." h="h-[40vh]" />
            <p className={`mt-3 ${BODY}`}>
              <span className="text-db-text">Stochastique</span> : nuages, harmattan, empoussièrement.
            </p>
          </div>
        </div>
      </Slide>
    ),
  },

  /* 06 — chapitres 3 et 4 : fondations et séries temporelles */
  {
    id: 's06',
    title: 'Fondations et modèles pour séries temporelles',
    section: 'Chapitres 3–4',
    acte: 'II',
    notes:
      "Deuxième partie : les architectures. Les chapitres 3 et 4 posent les fondations. Chapitre 3 : la boucle d'apprentissage supervisé, avec un protocole strict pour les séries temporelles : découpage chronologique, normalisation ajustée sur l'entraînement seul, validation walk-forward. Le passé prédit le futur, jamais l'inverse. Chapitre 4 : les briques pour les séries temporelles, la convolution causale dilatée, qui étend le champ réceptif sans regarder le futur, les réseaux récurrents LSTM, puis l'attention et le Transformer. TFT et TCN combinent ces briques.",
    render: () => (
      <Slide kicker="Chapitre 3 · fondations — Chapitre 4 · séries temporelles" title="Le passé prédit le futur, jamais l’inverse">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <Fig src={fig('boucle_apprentissage_supervise.jpg')} num="3.1" caption="Boucle d’apprentissage supervisé." h="h-[36vh]" />
            <p className={`mt-3 ${BODY}`}>
              Découpage chronologique, <span className="text-db-text">scaler ajusté sur l’entraînement seul</span>, validation walk-forward.
            </p>
          </div>
          <div>
            <Fig src={fig('1d_dilated_conv.PNG')} num="4.3" caption="Convolutions dilatées causales (d = 1, 2, 4, 8)." h="h-[36vh]" />
            <p className={`mt-3 ${BODY}`}>
              Convolution causale, <span className="text-db-text">LSTM</span>, attention et Transformer : les briques du TFT et du TCN.
            </p>
          </div>
        </div>
      </Slide>
    ),
  },

  /* 07 — chapitre 5 : TFT puis TCN (ordre du mémoire) */
  {
    id: 's07',
    title: 'TFT et TCN',
    section: 'Chapitre 5',
    acte: 'II',
    notes:
      "Chapitre 5 : les deux architectures, dans l'ordre du mémoire. Le Temporal Fusion Transformer d'abord : sélection de variables par la VSN, blocs GRN à porte GLU, attention multi-têtes interprétable, entrées futures connues et sortie en quantiles native. Sa valeur ajoutée est l'interprétabilité. Ensuite le TCN : convolutions causales dilatées, avec un noyau de 3 et 10 couches le champ réceptif atteint 2 047 pas, plus de trois semaines d'historique horaire, avec un entraînement entièrement parallélisable. En contrepartie, pas de variables statiques natives ni d'interprétabilité native.",
    render: () => (
      <Slide kicker="Chapitre 5 · 5.1 TFT, 5.2 TCN" title="Deux façons de lire l’historique : attention interprétable ou convolutions causales">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <Fig src={fig('TFT - Architecture Detaillee image.png')} num="5.1" caption="Architecture du TFT." h="h-[38vh]" />
            <p className={`mt-3 ${BODY}`}>
              <span className="text-db-text">TFT</span> — sélection de variables, attention interprétable, quantiles natifs.
            </p>
          </div>
          <div>
            <Fig src={fig('TCN architecture.png')} num="5.5" caption="Architecture du TCN." h="h-[38vh]" />
            <p className={`mt-3 ${BODY}`}>
              <span className="text-db-text">TCN</span> — champ réceptif de <span className="font-mono text-db-text">2 047 pas</span>, entraînement parallèle.
            </p>
          </div>
        </div>
      </Slide>
    ),
  },

  /* 08 — chapitre 6 : MIMO et perte hybride */
  {
    id: 's08',
    title: 'Stratégie MIMO et perte hybride',
    section: 'Chapitre 6',
    acte: 'II',
    notes:
      "Chapitre 6 : la stratégie de prévision. La sortie est traitée en MIMO : un seul modèle reçoit une fenêtre d'historique et produit en une passe la matrice 72 horizons par 3 quantiles, soit 216 valeurs. J'ai écarté la prévision récursive : l'erreur s'accumule sur 72 pas et il faudrait 72 entraînements. La perte est hybride : une erreur quadratique sur la médiane et une perte pinball sur les quantiles 10, 50 et 90. Les croisements de quantiles mesurés sur le test sont nuls.",
    render: () => (
      <Slide kicker="Chapitre 6 · 6.1 MIMO, 6.2–6.3 quantiles et perte hybride" title="Un seul modèle produit les 72 heures, avec leurs bornes">
        <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Fig src={fig('mimo_flow.drawio.png')} num="6.1" caption="Flux MIMO : fenêtre d’historique, modèle unique, matrice H × Q." h="h-[46vh]" />
          <div className="space-y-6">
            <Stat v="72 × 3 = 216" l="quantiles (P10, P50, P90) produits en une seule passe" />
            <Stat v="w·MSE + (1−w)·Pinball" l="médiane par l’erreur quadratique, bornes par la perte en quantiles" />
            <Stat v="0 croisement" l="de quantiles, mesuré sur le test" tone="text-db-accent" />
          </div>
        </div>
      </Slide>
    ),
  },

  /* 09 — chapitre 6 : CQR et protocole d'évaluation */
  {
    id: 's09',
    title: 'Calibration CQR et protocole d’évaluation',
    section: 'Chapitre 6',
    acte: 'II',
    notes:
      "Toujours au chapitre 6 : les quantiles appris ne garantissent pas la couverture en échantillon fini. La calibration conformelle CQR les corrige sans réentraînement. Sur un jeu de calibration, on mesure le plus grand dépassement des bornes, on prend son quantile, puis on le retire de la borne basse et on l'ajoute à la borne haute. Avec alpha égal à 20 %, la couverture d'au moins 80 % est garantie sous échangeabilité. L'évaluation suit cinq étapes : couverture et largeur par horizon, score propre de Winkler, diagnostic de croisement, comparaison à la climatologie. Un point clé : sans covariables météo futures, aucun modèle ne produit d'intervalle utile à 72 heures.",
    render: () => (
      <Slide kicker="Chapitre 6 · 6.4 CQR, 6.5–6.6 scores et protocole" title="Recalibrer les bornes pour garantir 80 % de couverture" gap="gap-6">
        <div className="max-w-6xl border border-db-border/60 bg-db-border/10 px-6 py-5 font-mono text-[clamp(0.95rem,1.6vw,1.35rem)] leading-relaxed text-db-text">
          I(x) = [ ŷ<sub>bas</sub> − q , ŷ<sub>haut</sub> + q ]
          <div className="mt-1 text-[0.8em] text-db-muted">q = quantile des scores de non-conformité sur le jeu de calibration · α = 0,20</div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Stat v="Sans réentraînement" l="le recalibrage s’applique au modèle déjà appris" />
          <Stat v="≥ 80 %" l="couverture garantie sous échangeabilité" tone="text-db-accent" />
          <Stat v="5 étapes" l="couverture, largeur, Winkler, croisements, climatologie" />
        </div>
        <Takeaway>Sans les prévisions météo futures, aucun modèle ne produira d’intervalle utile à 72 h : le plafond vient de l’information d’entrée.</Takeaway>
      </Slide>
    ),
  },

  /* 10 — 7.1 objectifs et méthodologie */
  {
    id: 's10',
    title: 'Objectifs et méthodologie',
    section: 'Chapitre 7 · 7.1',
    acte: 'III',
    notes:
      "Troisième partie : le chapitre 7 met tout cela à l'épreuve sur Diass. Section 7.1 : les objectifs sont de prévoir la production à 72 heures, d'y associer une enveloppe P10–P90, et de comparer plusieurs architectures sur un protocole identique. La démarche tient en trois temps, que montre la figure : construire les données, de l'export SCADA au fichier de features ; apprendre, du découpage jusqu'à la calibration ; puis l'inférence, qui produit une prévision par lots avec son enveloppe. Les sections suivantes suivent ce fil.",
    render: () => (
      <Slide kicker="Chapitre 7 · 7.1 objectifs et méthodologie" title="Du capteur SCADA à la prévision batch : trois temps">
        <Fig
          src={fig('Deep-Aero-SN-ensemble.drawio.png')}
          num="7.1"
          caption="Vue d’ensemble du système Deep Aero SN."
          h="h-[50vh]"
          className="mx-auto w-full max-w-6xl"
        />
        <div className="grid grid-cols-3 gap-6 font-mono text-[clamp(0.85rem,1.3vw,1.1rem)]">
          {['1 · Construire les données', '2 · Apprendre et calibrer', '3 · Inférer : prévision batch 72 h'].map((s) => (
            <div key={s} className="border-t-2 border-db-accent/70 pt-2 text-db-text">{s}</div>
          ))}
        </div>
      </Slide>
    ),
  },

  /* 11 — 7.2 site de Diass */
  {
    id: 's11',
    title: 'Le site de Diass',
    section: 'Chapitre 7 · 7.2',
    acte: 'III',
    notes:
      "Section 7.2 : le site. Diass compte 85 248 modules polycristallins, soit 27,28 MWc en continu, sur une structure fixe inclinée à 15 degrés plein sud, pour environ 34 gigawattheures par an. Le climat impose quatre phénomènes : le cycle diurne, la variabilité nuageuse de l'hivernage, les aérosols de l'harmattan avec un DNI qui perd de 15 à 30 %, et les pertes thermiques, la température de cellule montant à 65–75 degrés. La figure montre l'effet de la pluie : 3,7 mégawatts en moyenne les jours de pluie contre 4,0 les jours secs, soit moins 6 %.",
    render: () => (
      <Slide kicker="Chapitre 7 · 7.2 présentation du site" title="Un site sahélien exigeant : l’harmattan et l’hivernage pèsent sur la production">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <Stat v="27,28 MWc" l="85 248 modules, structure fixe 15° plein sud" />
          <Stat v="≈ 34 GWh/an" l="production, mise en service en mai 2022" />
          <Stat v="DNI −15 à −30 %" l="en période d’harmattan" tone="text-db-accent" />
          <Stat v="−6 %" l="de production moyenne les jours de pluie (3,7 contre 4,0 MW)" tone="text-db-accent" />
        </div>
        <Fig
          src={fig('nb_diass_effet_pluie.png')}
          num="7.2"
          caption="Production journalière moyenne selon les périodes pluvieuses et sèches."
          h="h-[34vh]"
          className="mx-auto w-full max-w-5xl"
        />
      </Slide>
    ),
  },

  /* 12 — 7.3.1–7.3.2 jeux de données */
  {
    id: 's12',
    title: 'Jeux de données',
    section: 'Chapitre 7 · 7.3.1–7.3.2',
    acte: 'III',
    notes:
      "Section 7.3 : les données. Elles viennent de six sources hiérarchisées : le SCADA de la centrale, NASA POWER et ERA5 pour les réanalyses, CAMS pour les aérosols, ECMWF IFS pour les prévisions météo, et Ineichen–Perez pour le ciel clair. L'ordre de priorité va de la mesure locale à NASA POWER puis ERA5. L'interpolation est limitée à 24 heures, sans extrapolation, et la vraie coupure du 9 au 15 décembre 2025 est conservée. Pour les prévisions météo, la règle de causalité impose que l'initialisation du run plus six heures précède l'heure d'émission. Sur 1 461 cycles demandés, 1 460 sont exploitables, et 8 247 fenêtres sont valides. Le jeu final fait 8 800 heures et 428 colonnes.",
    render: () => (
      <Slide kicker="Chapitre 7 · 7.3.1 origine des données, 7.3.2 ingestion" title="Six sources hiérarchisées, un référentiel sans fuite d’information">
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 md:grid-cols-3">
          {[
            { n: 'SCADA Schneider', d: 'mesure locale, pas de 15 min' },
            { n: 'NASA POWER', d: 'réanalyse : GHI, météo' },
            { n: 'ERA5', d: 'DNI, DHI, nuages' },
            { n: 'CAMS', d: 'aérosols et poussières' },
            { n: 'ECMWF IFS', d: 'prévisions météo (NWP)' },
            { n: 'Ineichen–Perez', d: 'ciel clair théorique' },
          ].map((s) => (
            <div key={s.n} className="border-t border-db-border/50 py-2.5">
              <div className="font-mono text-[clamp(0.9rem,1.3vw,1.1rem)] uppercase tracking-wider text-db-text">{s.n}</div>
              <div className="mt-0.5 text-[clamp(0.9rem,1.25vw,1.05rem)] text-db-muted">{s.d}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Stat v="init + 6 h ≤ t" l="règle de causalité : le run météo doit précéder l’émission" tone="text-db-accent" />
          <Stat v="1 460 / 1 461" l="cycles NWP exploitables ; 8 247 fenêtres valides" />
          <Stat v="8 800 h × 428" l="volume final du jeu de features (427 variables)" />
        </div>
      </Slide>
    ),
  },

  /* 13 — 7.3.3 EDA : profils temporels et corrélations */
  {
    id: 's13',
    title: 'EDA : profils temporels et corrélations',
    section: 'Chapitre 7 · 7.3.3',
    acte: 'III',
    notes:
      "Avant de modéliser, j'explore les données : section 7.3.3. Le profil journalier moyen montre l'arc diurne attendu : l'irradiance et la production culminent vers midi, la température suit avec environ deux heures de retard. La semaine du 6 juin 2026 montre que la production épouse l'irradiance, avec des chutes brutales au passage des nuages, qui sont la principale source d'erreur à court terme. Enfin la matrice de corrélation confirme que l'irradiance domine la production et que la couverture nuageuse joue en sens inverse.",
    render: () => (
      <Slide kicker="Chapitre 7 · 7.3.3 analyse exploratoire — profils temporels et corrélations" title="L’arc diurne domine, et l’irradiance explique la production">
        <div className="grid grid-cols-3 gap-6">
          <Fig src={fig('nb_diass_profil_journalier.png')} num="7.3" caption="Profil journalier moyen." h="h-[40vh]" />
          <Fig src={fig('nb_diass_serie_semaine.png')} num="7.4" caption="Semaine du 6 juin 2026." h="h-[40vh]" />
          <Fig src={fig('nb_diass_matrice_correlations.png')} num="7.5" caption="Matrice de corrélation." h="h-[40vh]" />
        </div>
        <Takeaway>Les chutes brutales au passage des nuages sont la principale source d’erreur à court terme.</Takeaway>
      </Slide>
    ),
  },

  /* 13b — 7.3.3 EDA : relations physiques */
  {
    id: 's13b',
    title: 'EDA : relations physiques',
    section: 'Chapitre 7 · 7.3.3',
    acte: 'III',
    notes:
      "La relation entre GHI et production est quasi linéaire sous ciel clair et se disperse dès que le ciel se couvre. Avec le modèle NOCT, la température de cellule moyenne est de 33,3 degrés pour une perte thermique moyenne de 3,56 %. La variabilité du GHI augmente avec la couverture nuageuse, ce qui justifie des retards courts d'irradiance. Enfin l'épaisseur optique des aérosols vaut 0,31 en moyenne et atteint son maximum en mai. Ces effets de l'atmosphère sont ceux que le modèle devra apprendre.",
    render: () => (
      <Slide kicker="Chapitre 7 · 7.3.3 analyse exploratoire — relations physiques" title="La variabilité vient de l’atmosphère : nuages, aérosols, température">
        <div className="grid grid-cols-3 gap-6">
          <Stat v="33,3 °C" l="température de cellule moyenne (max 70,8 °C), perte thermique moyenne de −3,56 %" />
          <Stat v="Nuages" l="la variabilité du GHI augmente avec la couverture nuageuse" />
          <Stat v="AOD 0,31" l="épaisseur optique des aérosols moyenne, maximum en mai" tone="text-db-accent" />
        </div>
        <div className="grid grid-cols-3 gap-6">
          <Fig src={fig('nb_diass_ghi_vs_production.png')} num="7.6" caption="Relation GHI–production, colorée par la température." h="h-[34vh]" />
          <Fig src={fig('nb_diass_effet_nuages.png')} num="7.7" caption="Effet de la couverture nuageuse sur le GHI." h="h-[34vh]" />
          <Fig src={fig('nb_diass_effet_aerosols.png')} num="7.8" caption="GHI selon l’épaisseur optique des aérosols." h="h-[34vh]" />
        </div>
      </Slide>
    ),
  },

  /* 13c — 7.3.3 statistiques, rythmes et contrôle IEC */
  {
    id: 's13c',
    title: 'Statistiques, rythmes et contrôle IEC 61724',
    section: 'Chapitre 7 · 7.3.3',
    acte: 'III',
    notes:
      "Les statistiques confirment les ordres de grandeur : GHI moyen de 242 watts par mètre carré, production moyenne de 3,9 mégawatts avec des pointes à 18,45. Quatre rythmes se dégagent : le cycle diurne domine, le cycle hebdomadaire est faible, le saisonnier oppose saison sèche et hivernage, et des perturbations ponctuelles s'y ajoutent. Les pas nocturnes seront masqués à l'évaluation. Ensuite, le contrôle selon la norme IEC 61724 : le gisement de référence est reproduit à 0,5 % près, le performance ratio de 64,8 % tombe dans la plage publiée, et l'énergie annualisée est à plus 0,9 %. Les données sont donc plausibles et peuvent servir de base à la modélisation.",
    render: () => (
      <Slide kicker="Chapitre 7 · 7.3.3 statistiques descriptives, rythmes, contrôle IEC 61724" title="Des données physiquement plausibles : le gisement est reproduit à 0,5 % près" gap="gap-6">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <Stat v="242 W/m²" l="GHI moyen (max 1 059,53)" />
          <Stat v="3,90 MW" l="production moyenne (max 18,45 MW)" />
          <Stat v="−0,5 %" l="écart sur Yref (5,80 contre 5,83 h/j)" tone="text-db-accent" />
          <Stat v="PR 64,8 %" l="dans la plage publiée 64,65–75,82 %" tone="text-db-accent" />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            ['Jour', 'cycle diurne dominant'],
            ['Semaine', 'cycle faible mais mesurable'],
            ['Saison', 'saison sèche contre hivernage'],
            ['Perturbations', 'nuages, harmattan, encrassement'],
          ].map(([t, d]) => (
            <div key={t} className="border border-db-border/60 px-4 py-3">
              <div className="font-mono text-[12px] uppercase tracking-widest text-db-accent">{t}</div>
              <div className="mt-1 text-[clamp(0.9rem,1.25vw,1.05rem)] text-db-muted">{d}</div>
            </div>
          ))}
        </div>
        <Takeaway>Énergie annualisée à +0,9 % de la valeur publiée : les données peuvent servir de base à la modélisation.</Takeaway>
      </Slide>
    ),
  },

  /* 14 — 7.4.1 prévention du data leakage */
  {
    id: 's14',
    title: 'Prévention du data leakage',
    section: 'Chapitre 7 · 7.4.1',
    acte: 'III',
    notes:
      "Section 7.4 : la mise en œuvre, qui commence par la prévention des fuites. Le problème : les variables électriques mesurées au même instant que la cible, courants, tensions, puissances, sont reliées à la production par une égalité stricte, P égale V fois I fois cosinus phi fois racine de trois. Un modèle qui les reçoit apprend cette formule au lieu d'anticiper la météo, et serait inutilisable en exploitation. Je ne supprime pas le SCADA : je le transforme en variables causales, des retards de 24 heures. Les onze variables brutes interdites sont remplacées par onze variables transformées. Enfin, toute variable corrélée à plus de 0,99 avec la cible est exclue automatiquement, sauf les drivers physiques autorisés.",
    render: () => (
      <Slide kicker="Chapitre 7 · 7.4.1 prévention du data leakage" title="Empêcher le modèle de « tricher » : la formule électrique ne doit pas fuiter" gap="gap-6">
        <div className="max-w-6xl border border-db-border/60 bg-db-border/10 px-6 py-5 font-mono text-[clamp(1rem,1.8vw,1.5rem)] text-db-text">
          P<sub>ac</sub> = V<sub>ac</sub> × I<sub>ac</sub> × cos φ × √3
          <div className="mt-1 text-[0.7em] text-db-muted">les mesures contemporaines de la cible donneraient la réponse au modèle</div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Stat v="Retards 24 h" l="les mesures brutes deviennent des indicateurs d’état connus à t−24 h (96 pas)" tone="text-db-accent" />
          <Stat v="11 → 11" l="variables brutes interdites, remplacées par des variables transformées" />
          <Stat v="|ρ| > 0,99" l="exclusion automatique, sauf irradiance, position solaire, nuages" />
        </div>
      </Slide>
    ),
  },

  /* 15 — 7.4.2 ingénierie des variables */
  {
    id: 's15',
    title: 'Ingénierie des variables',
    section: 'Chapitre 7 · 7.4.2',
    acte: 'III',
    notes:
      "Section 7.4.2 : l'ingénierie des variables. Le pipeline charge le fichier brut et exécute six opérations : rééchantillonnage horaire, contrôles Great Expectations, prétraitement avec interpolation limitée, sept étapes de construction de variables, nettoyage, puis sélection. Les sept étapes couvrent l'encodage cyclique du temps, la météo, la fréquence réseau, la physique solaire, la transformation électrique causale et les retards. En bilan : 58 colonnes brutes entrent, 543 variables sortent à la sélection.",
    render: () => (
      <Slide kicker="Chapitre 7 · 7.4.2 ingénierie des variables" title="Un pipeline en six opérations : 58 colonnes brutes, 543 variables construites">
        <div className="grid items-center gap-8 lg:grid-cols-[1.5fr_1fr]">
          <Fig
            src={fig('features_pipline_flow.drawio_.png')}
            num="7.9"
            caption="Pipeline de feature engineering et contrôles anti-fuite."
            h="h-[46vh]"
          />
          <div className="space-y-6">
            <Stat v="6 opérations" l="rééchantillonnage, contrôles, prétraitement, construction, nettoyage, sélection" />
            <Stat v="7 étapes" l="de construction : temps, météo, réseau, physique solaire, électrique causal, retards" />
            <Stat v="58 → 543" l="colonnes brutes puis variables construites" tone="text-db-accent" />
          </div>
        </div>
      </Slide>
    ),
  },

  /* 16 — 7.4.3 sélection */
  {
    id: 's16',
    title: 'Sélection de variables',
    section: 'Chapitre 7 · 7.4.3',
    acte: 'III',
    notes:
      "Section 7.4.3 : la sélection. Sept méthodes indépendantes sont appliquées, et la sélection finale est leur union : corrélation, information mutuelle, ACP, élimination récursive, VIF, permutation et SHAP. Elles s'accordent peu : aucune variable n'est retenue par les sept, et 194 ne le sont que par une seule. Un vote majoritaire écarterait ce que seule une méthode sait isoler, donc je garde l'union. De 543 variables, 424 sont retenues, après suppression de 118 redondances à corrélation supérieure à 0,90. La répartition par famille montre qu'aucune famille n'est sacrifiée. Je détaille la sélection par méthode à la planche suivante.",
    render: () => (
      <Slide kicker="Chapitre 7 · 7.4.3 sélection de variables" title="Sept méthodes, une union : 424 variables retenues sur 543">
        <div className="grid grid-cols-2 gap-8">
          <Fig src={fig('nb_diass_sel_volume.png')} num="7.10" caption="Variables retenues par méthode de sélection." h="h-[40vh]" />
          <Fig src={fig('nb_diass_sel_familles.png')} num="7.12" caption="Répartition des 424 variables par famille." h="h-[40vh]" />
        </div>
        <div className="grid grid-cols-3 gap-6">
          <Stat v="194" l="variables ne sont retenues que par une seule méthode" />
          <Stat v="118" l="redondances supprimées (|r| > 0,90)" />
          <Stat v="424 (78,1 %)" l="variables retenues, aucune famille sacrifiée" tone="text-db-accent" />
        </div>
      </Slide>
    ),
  },

  {
    id: 's16b',
    title: 'Sélection : détail par méthode',
    section: 'Chapitre 7 · 7.4.3',
    acte: 'III',
    notes:
      "le tableau 7.7. Corrélation 349 variables, RFE 50, VIF 527, et 2 chacune pour l'information mutuelle, la permutation et SHAP, 0 pour l'ACP. Union brute de 542, dédupliquée à 424. Répartition par famille : lags et fenêtres J moins 1 : 137, réanalyse : 123, autres : 62, météo locale : 54, physique PV : 23, rendement onduleur : 15, temporel : 10.",
    render: () => (
      <Slide kicker="Chapitre 7 · 7.4.3 sélection — détail par méthode" title="Aucune famille n’est sacrifiée : 543 variables deviennent 424" gap="gap-3">
        <Fig
          src={fig('nb_diass_sel_top12.png')}
          num="7.11"
          caption="Top-12 des features par méthode de sélection."
          h="h-[42vh]"
          className="mx-auto w-full max-w-5xl"
        />
        <p className="text-[clamp(0.9rem,1.25vw,1.05rem)] leading-snug text-db-muted">
          Corrélation 349 · RFE 50 · VIF 527 · MI, permutation, SHAP : 2 chacune · PCA : 0 · union brute 542 → 424.
          Familles : lags J−1 137 · réanalyse 123 · autres 62 · météo locale 54 · physique PV 23 · onduleur 15 · temporel 10.
        </p>
      </Slide>
    ),
  },

  /* 17 — 7.4.4–7.4.6 algorithmes, entraînement, validation */
  {
    id: 's17',
    title: 'Algorithmes, entraînement et validation',
    section: 'Chapitre 7 · 7.4.4–7.4.6',
    acte: 'III',
    notes:
      "Sections 7.4.4 à 7.4.6. Je compare cinq modèles sur un protocole commun : la persistance comme repère minimal, le MLP et le LSTM comme repères appris, et le TCN et le TFT, seuls à recevoir les prévisions météo futures et à produire des prévisions probabilistes, avec la perte hybride. Les hyperparamètres sont cherchés par Optuna, échantillonneur TPE, dix essais, et le meilleur essai est figé avec la graine 42. La validation sert à arrêter l'entraînement, avec une patience de 25 époques : le TCN s'arrête à l'époque 57, le TFT va jusqu'aux 100. Les courbes montrent une convergence régulière sans surapprentissage marqué. Le recalibrage CQR, alpha égal à 0,20, est ensuite appliqué sur la validation. Les hyperparamètres retenus suivent.",
    render: () => (
      <Slide kicker="Chapitre 7 · 7.4.4 algorithmes, 7.4.5 entraînement, 7.4.6 validation" title="Cinq modèles, même protocole, hyperparamètres cherchés par Optuna">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <Stat v="5 modèles" l="persistance, MLP, LSTM, TCN, TFT" />
          <Stat v="Optuna" l="TPE, 10 essais, graine 42, meilleur essai figé" />
          <Stat v="57 / 100" l="époques du TCN / du TFT (patience 25)" />
          <Stat v="1 206 / 2 016 s" l="temps d’entraînement du TCN / du TFT" />
        </div>
        <div className="grid grid-cols-2 gap-8">
          <Fig src={fig('puml_03_pipeline_training.png')} num="7.13" caption="Pipeline d’entraînement : découpage, Optuna, early stopping, CQR." h="h-[34vh]" />
          <Fig src={fig('nb_diass_learning_curves.png')} num="7.14" caption="Courbes d’entraînement du TCN et du TFT." h="h-[34vh]" />
        </div>
      </Slide>
    ),
  },

  {
    id: 's17b',
    title: 'Hyperparamètres et temps',
    section: 'Chapitre 7 · 7.4.5',
    acte: 'III',
    notes:
      "le tableau 7.9. TCN : poids w de 0,765, canaux 64-128-256-256, noyau 5, dropout 0,252, lots de 64, montée cosinus de 5 époques, taux 3,29e-4. TFT : w de 0,617, dimension 256 sur 2 têtes, dropout 0,15, lots de 128, plateau, taux 6,92e-4. Temps : 3 secondes pour la persistance, 519 pour le MLP, 863 pour le LSTM, 1 206 pour le TCN, 2 016 pour le TFT.",
    render: () => (
      <Slide kicker="Chapitre 7 · 7.4.5 hyperparamètres" title="Hyperparamètres retenus : le TCN s’entraîne en 20 min, le TFT en 34 min" gap="gap-4">
        <div className="grid items-start gap-8 lg:grid-cols-2">
          <div>
            <div className="font-mono text-[12px] uppercase tracking-[0.25em] text-db-accent">TCN</div>
            <LedgerRow v="w" l="0,765" />
            <LedgerRow v="Canaux" l="64, 128, 256, 256 ; noyau 5" />
            <LedgerRow v="Dropout" l="0,252 ; lots de 64" />
            <LedgerRow v="Optimiseur" l="taux 3,29e−4 ; montée cosinus de 5 époques" />
          </div>
          <div>
            <div className="font-mono text-[12px] uppercase tracking-[0.25em] text-db-accent">TFT</div>
            <LedgerRow v="w" l="0,617" />
            <LedgerRow v="Dimension" l="256 sur 2 têtes d’attention" />
            <LedgerRow v="Dropout" l="0,15 ; lots de 128" />
            <LedgerRow v="Optimiseur" l="taux 6,92e−4 ; plateau" />
          </div>
        </div>
        <p className="text-[clamp(0.9rem,1.25vw,1.05rem)] text-db-muted">
          Temps : persistance 3 s · MLP 519 s · LSTM 863 s · TCN 1 206 s · TFT 2 016 s.
        </p>
      </Slide>
    ),
  },

  {
    id: 's18a',
    title: 'Pipeline de serving',
    section: 'Chapitre 7 · 7.4.7',
    acte: 'III',
    notes:
      "Le pipeline de serving et d'inférence batch de la section 7.4.7, de la requête du client jusqu'au fichier de prévisions.",
    render: () => (
      <Slide kicker="Chapitre 7 · 7.4.7 pipeline de serving" title="De la requête au fichier de prévisions : un pipeline batch à 72 h">
        <Fig
          src={fig('puml_04_serving_inference.png')}
          num="7.15"
          caption="Pipeline de serving et d’inférence batch."
          h="h-[56vh]"
          className="mx-auto w-full max-w-6xl"
        />
      </Slide>
    ),
  },

  /* 18 — 7.4.7 inférence */
  {
    id: 's18',
    title: 'Inférence : prévision batch à 72 h',
    section: 'Chapitre 7 · 7.4.7',
    acte: 'III',
    notes:
      "Section 7.4.7 : l'inférence. Le pipeline sélectionne le modèle retenu, assemble les données jusqu'à la dernière heure disponible, ajoute les prévisions météo futures et produit en mode batch une prévision à 72 heures avec son enveloppe P10–P90. Sur le run courant, la médiane de la prévision du site vaut 0,965 mégawatt. L'enveloppe s'élargit avec l'horizon : c'est attendu, car la largeur est un quantile absolu des résidus de calibration.",
    render: () => (
      <Slide kicker="Chapitre 7 · 7.4.7 inférence" title="Une prévision batch de 72 h, enveloppe P10–P90 incluse">
        <div className="grid items-center gap-8 lg:grid-cols-[1.5fr_1fr]">
          <Fig src={fig('nb_diass_prevision_batch_72h.png')} num="7.16" caption="Prévision batch à 72 h : P50 et enveloppe P10–P90." h="h-[46vh]" />
          <div className="space-y-6">
            <Stat v="P50 = 0,965 MW" l="médiane de la prévision du site, run courant" />
            <Stat v="Enveloppe croissante" l="la largeur P10–P90 augmente avec l’horizon" tone="text-db-accent" />
            <Stat v="Mode batch" l="modèle retenu, nouvelle prévision à chaque émission" />
          </div>
        </div>
      </Slide>
    ),
  },

  /* 19 — 7.5.1 performances ponctuelles */
  {
    id: 's19',
    title: 'Résultats : performances ponctuelles',
    section: 'Chapitre 7 · 7.5.1 et 7.5.4',
    acte: 'III',
    notes:
      "Section 7.5 : les résultats, sur 1 049 fenêtres de test couvrant du 16 juillet au 28 août 2026. Le TCN est le plus précis : RMSE de 1,707 mégawatt, MAE de 0,989, R carré de 0,877. Le TFT le suit de près, avec 1,818 et un R carré de 0,861. Les repères sont nettement en retrait : la persistance est à 6,9 mégawatts. Le MAPE est très élevé pour tous car la production est presque nulle en début et fin de journée : je m'appuie donc sur le RMSE et le R carré. Que le TCN devance le TFT est une hypothèse : la convolution dilatée capte mieux le motif diurne et il a moins de paramètres, mais je n'ai pas mené d'étude d'ablation.",
    render: () => (
      <Slide kicker="Chapitre 7 · 7.5.1 performances ponctuelles, 7.5.4 discussion" title="Le TCN est le plus précis : RMSE de 1,707 MW sur 1 049 fenêtres de test">
        <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Fig src={fig('nb_diass_comparaison_metriques.png')} num="7.17" caption="Comparaison des métriques RMSE, MAE et R² sur le test." h="h-[42vh]" />
          <div>
            <div className="font-mono text-[12px] uppercase tracking-[0.25em] text-db-accent">RMSE (MW)</div>
            {[
              ['Persistance', '6,905', false],
              ['MLP', '2,323', false],
              ['LSTM', '2,043', false],
              ['TCN', '1,707', true],
              ['TFT', '1,818', false],
            ].map(([m, v, hi]) => (
              <div key={m as string} className="flex items-baseline justify-between border-t border-db-border/50 py-2">
                <span className={`font-mono text-[clamp(1rem,1.5vw,1.3rem)] ${hi ? 'text-db-accent' : 'text-db-muted'}`}>{m}</span>
                <span className={`font-mono text-[clamp(1.1rem,1.8vw,1.6rem)] tabular-nums ${hi ? 'text-db-accent' : 'text-db-text'}`}>{v}</span>
              </div>
            ))}
            <div className="mt-3 text-[clamp(0.9rem,1.25vw,1.05rem)] text-db-muted">
              R² : <span className="font-mono text-db-text">0,877</span> (TCN), <span className="font-mono text-db-text">0,861</span> (TFT)
            </div>
          </div>
        </div>
        <Takeaway>Le TCN devance le TFT : hypothèse (motif diurne, moins de paramètres), sans étude d’ablation.</Takeaway>
      </Slide>
    ),
  },

  {
    id: 's19b',
    title: 'Métriques complètes',
    section: 'Chapitre 7 · 7.5.1–7.5.2',
    acte: 'III',
    notes:
      "les tableaux 7.10 et 7.11. Le R carré de la persistance est négatif, moins 1,013 : elle est pire que la moyenne sur ces séries très variables. Le MAPE n'est pas fiable près de zéro. Avant recalibrage, la couverture du TCN est de 0,608 pour une largeur de 1,670 mégawatt ; après CQR, 0,798 pour 2,596. Pour le TFT, 0,713 pour 2,456 avant, 0,742 pour 2,646 après.",
    render: () => (
      <Slide kicker="Chapitre 7 · 7.5.1–7.5.2 métriques complètes" title="Sur 1 049 fenêtres, le TCN domine à toutes les métriques ponctuelles" gap="gap-4">
        <div className="max-w-5xl">
          <div className="grid grid-cols-5 gap-4 border-b border-db-border/60 pb-2 font-mono text-[12px] uppercase tracking-widest text-db-dim">
            <span>Modèle</span>
            <span>RMSE (MW)</span>
            <span>MAE (MW)</span>
            <span>nRMSE</span>
            <span>R²</span>
          </div>
          {[
            ['Persistance', '6,905', '4,987', '0,444', '−1,013'],
            ['MLP', '2,323', '1,275', '0,149', '0,772'],
            ['LSTM', '2,043', '1,148', '0,131', '0,824'],
            ['TCN', '1,707', '0,989', '0,110', '0,877'],
            ['TFT', '1,818', '1,157', '0,117', '0,861'],
          ].map((r) => (
            <div key={r[0]} className="grid grid-cols-5 gap-4 border-b border-db-border/40 py-2.5 font-mono text-[clamp(0.95rem,1.4vw,1.2rem)] tabular-nums text-db-text">
              <span className="text-db-accent">{r[0]}</span>
              <span>{r[1]}</span>
              <span>{r[2]}</span>
              <span>{r[3]}</span>
              <span>{r[4]}</span>
            </div>
          ))}
        </div>
        <div className="grid max-w-5xl gap-x-10 md:grid-cols-2">
          <LedgerRow v="TCN" l="couverture 0,608 → 0,798 ; largeur 1,670 → 2,596 MW" />
          <LedgerRow v="TFT" l="couverture 0,713 → 0,742 ; largeur 2,456 → 2,646 MW" />
        </div>
      </Slide>
    ),
  },

  /* 20 — 7.5.2–7.5.3 performances probabilistes et fenêtres de test */
  {
    id: 's20',
    title: 'Résultats : performances probabilistes',
    section: 'Chapitre 7 · 7.5.2–7.5.3',
    acte: 'III',
    notes:
      "Côté incertitude : avant recalibrage, la couverture P10–P90 du TCN n'est que de 60,8 %, ses quantiles bruts sont trop étroits. Après CQR elle atteint 79,8 %, proche de la cible de 80 %. Pour le TFT, la couverture passe d'environ 71 % à 74,2 %, un peu sous la cible. Le recalibrage a donc plus d'effet sur le TCN. Aucun croisement de quantiles n'apparaît. La figure montre des fenêtres de test représentatives : le TCN reproduit bien le cycle diurne et suit les variations rapides dues aux nuages, ses écarts les plus nets étant aux transitions jour–nuit.",
    render: () => (
      <Slide kicker="Chapitre 7 · 7.5.2 performances probabilistes, 7.5.3 fenêtres de test" title="Après recalibrage CQR, l’enveloppe du TCN couvre 79,8 % des observations">
        <div className="grid grid-cols-3 gap-6">
          <Stat v="60,8 % → 79,8 %" l="TCN : couverture P10–P90 avant puis après CQR (cible 80 %)" tone="text-db-accent" />
          <Stat v="71 % → 74,2 %" l="TFT : couverture avant puis après CQR" />
          <Stat v="0 croisement" l="de quantiles, pour les deux modèles" />
        </div>
        <Fig
          src={fig('nb_diass_fenetres_test.png')}
          num="7.18"
          caption="Fenêtres de test représentatives : P50, P10–P90 et production réelle."
          h="h-[38vh]"
          className="mx-auto w-full max-w-5xl"
        />
      </Slide>
    ),
  },

  /* 21 — 7.5.5 implications pour la SENELEC */
  {
    id: 's21',
    title: 'Implications pour la SENELEC',
    section: 'Chapitre 7 · 7.5.5',
    acte: 'III',
    notes:
      "Section 7.5.5 : que valent ces résultats pour la SENELEC ? Le réseau a peu de marge de manœuvre. Comme hypothèse de travail, je retiens un seuil indicatif de 5 mégawatts acceptable pour le dispatch quotidien, soit 22 % de la capacité publiée : les deux architectures le respectent largement, avec 1,7 pour le TCN. Concrètement, la borne haute P90 dimensionne la réserve de sécurité à mobiliser. La borne basse P10 indique la production sur laquelle on peut compter sans démarrer de thermique inutilement. Et la distribution des quantiles permet d'estimer la probabilité de franchir un seuil critique, ce que la seule prévision ponctuelle ne donne pas.",
    render: () => (
      <Slide kicker="Chapitre 7 · 7.5.5 implications pour la SENELEC" title="Une erreur de 1,7 MW devant un seuil de dispatch de 5 MW" gap="gap-7">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Stat v="5 MW" l="seuil indicatif de dispatch quotidien (hypothèse de travail, 22 % de la capacité publiée)" />
          <Stat v="1,707 MW" l="RMSE du TCN, largement sous le seuil" tone="text-db-accent" />
          <Stat v="23,1 MW" l="capacité publiée de Diass (27,3 MWc installés)" />
        </div>
        <div className="max-w-6xl">
          <LedgerRow v="P90" l="borne haute : dimensionne la réserve de sécurité à mobiliser" tone="text-db-accent" />
          <LedgerRow v="P10" l="borne basse : production sur laquelle compter sans thermique inutile" tone="text-db-accent" />
          <LedgerRow v="Quantiles" l="probabilité de franchir un seuil critique (par exemple 10 % de la capacité)" tone="text-db-accent" />
        </div>
      </Slide>
    ),
  },

  /* 22 — 7.6 conclusion et perspectives */
  {
    id: 's22',
    title: 'Conclusion et perspectives',
    section: 'Chapitre 7 · 7.6',
    acte: 'III',
    notes:
      "En conclusion, l'étude de Diass valide la chaîne complète, de l'exploration des données à l'évaluation probabiliste. Le feature engineering fournit 543 variables dont 424 retenues. Le TCN devance légèrement le TFT en précision et en couverture calibrée, tandis que le TFT conserve une interprétabilité que le TCN n'offre pas. Deux limites : une seule année d'entraînement, donc la stabilité des hyperparamètres d'une saison à l'autre n'est pas garantie, et le pas horaire qui lisse les nuages de moins d'une heure et plafonne la précision à 72 heures ; à quoi s'ajoute le coût mémoire de l'attention du TFT. Trois prolongements : transférer le pipeline à un autre site, un modèle dédié aux horizons de 1 à 6 heures au pas de 5 à 15 minutes, et l'apprentissage fédéré. Sur le plan opérationnel, une intégration progressive à la gestion du réseau de la SENELEC, avec des phases pilotes sur Diass. Merci de votre attention.",
    render: () => (
      <Slide kicker="Chapitre 7 · 7.6 conclusion et perspectives" title="Une chaîne validée de bout en bout sur les données réelles de Diass" gap="gap-7">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Stat v="1,707 MW" l="RMSE du TCN à 72 h (R² = 0,877)" tone="text-db-accent" />
          <Stat v="79,8 %" l="couverture P10–P90 recalibrée (cible 80 %)" tone="text-db-accent" />
          <Stat v="424 / 543" l="variables retenues, sans fuite" tone="text-db-accent" />
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="border border-db-border/60 px-6 py-5">
            <div className="font-mono text-[12px] uppercase tracking-[0.25em] text-db-accent">Limites</div>
            <ul className={`mt-3 space-y-2 ${BODY}`}>
              <li>Une seule année d’entraînement</li>
              <li>Pas horaire : les nuages brefs échappent au modèle</li>
              <li>Coût mémoire de l’attention du TFT</li>
            </ul>
          </div>
          <div className="border border-db-border/60 px-6 py-5">
            <div className="font-mono text-[12px] uppercase tracking-[0.25em] text-db-accent">Perspectives</div>
            <ul className={`mt-3 space-y-2 ${BODY}`}>
              <li>Transfert vers un autre site solaire</li>
              <li>Modèle dédié 1–6 h, pas de 5–15 min</li>
              <li>Apprentissage fédéré, intégration pilote à la SENELEC</li>
            </ul>
          </div>
        </div>
        <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-db-dim">Merci de votre attention</p>
      </Slide>
    ),
  },


]