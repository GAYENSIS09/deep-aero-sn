'use client'

/**
 * Deck de soutenance — Prévision probabiliste de la production photovoltaïque
 * par apprentissage profond : application à la centrale de Diass.
 *
 * Refonte éditoriale :
 *   01–02 : contenu conservé (page de titre et contexte / motivation).
 *   03    : plan en cinq parties, calqué sur le chapitre 7.
 *   04–05 : présentation du site.
 *   06–08 : jeux de données.
 *   09–12 : mise en œuvre (09 = vue d'ensemble Deep Aero, puis pipeline,
 *           anti-fuite, modèles, sortie probabiliste).
 *   13–16 : analyse des résultats (16 = la prévision batch comme intrant
 *           d'une chaîne d'aide à la décision).
 *   17–18 : conclusion et perspectives.
 *
 * Chaque figure est cliquable : un clic ouvre la figure en plein écran,
 * un second clic (ou Échap) referme l'agrandissement.
 *
 * Hauteurs de figures : toutes responsives (h-[Xvh] sm:h-[Yvh]) pour
 * éviter les débordements verticaux sur mobile et petit écran.
 */

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { asset } from '@/lib/paths'

/* -------------------------------------------------------------------------- */
/* Utilitaires typographiques                                                 */
/* -------------------------------------------------------------------------- */

export const fr = (s: string): string =>
  s
    .replace(/(\d) (?=\d{3}(?!\d))/g, '$1\u00A0')
    .replace(/ (?=[%‰°])/g, '\u00A0')
    .replace(/(\d) (?=(?:MWc|MW|GWh|kWh|Wh|Wc|W)\b)/g, '$1\u00A0')
    .replace(/(\d) (?=(?:h|s|heures|pas|époques|cycles|fenêtres|colonnes|variables|lignes|mois|jours|ans)\b)/g, '$1\u00A0')

const BODY = 'text-[clamp(0.92rem,1.25vw,1.12rem)] leading-relaxed text-db-muted'
const EYEBROW = 'font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-db-accent'

function Stat({
  value,
  label,
  tone = 'text-db-text',
}: {
  value: string
  label: string
  tone?: string
}) {
  return (
    <div className="min-w-0 border-t-2 border-db-accent/70 pt-2.5 sm:pt-3">
      <div className={`font-mono tabular-nums leading-none text-[clamp(1.25rem,2.4vw,2.3rem)] ${tone} break-words`}>
        {fr(value)}
      </div>
      <p className="mt-1.5 sm:mt-2 text-[clamp(0.8rem,1.05vw,1rem)] leading-snug text-db-muted">
        {fr(label)}
      </p>
    </div>
  )
}

function Takeaway({ children }: { children: ReactNode }) {
  return (
    <p className="mx-auto w-full max-w-5xl border-l-2 border-db-accent/70 pl-4 sm:pl-5 font-serif text-[clamp(0.95rem,1.55vw,1.35rem)] leading-snug text-db-text">
      {typeof children === 'string' ? fr(children) : children}
    </p>
  )
}

function Slide({
  title,
  kicker,
  gap = 'gap-4 sm:gap-6',
  children,
}: {
  title: ReactNode
  kicker?: string
  gap?: string
  children: ReactNode
}) {
  return (
    <div
      className={`flex h-full flex-col overflow-hidden px-4 pb-5 pt-4 sm:px-7 sm:pb-7 sm:pt-4 md:px-12 md:pb-8 md:pt-5 lg:px-20 ${gap}`}
    >
      {kicker && <div className={EYEBROW}>{kicker}</div>}
      <h2 className="max-w-6xl font-serif text-[clamp(1.3rem,2.9vw,2.6rem)] leading-[1.1] tracking-tight text-db-text">
        {typeof title === 'string' ? fr(title) : title}
      </h2>
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-4 sm:gap-6">
        {children}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Zoom plein écran d'une figure                                              */
/* -------------------------------------------------------------------------- */

function FigureZoom({
  src,
  alt,
  className = '',
  onError,
}: {
  src: string
  alt: string
  className?: string
  onError?: () => void
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
      <img
        src={src}
        alt={alt}
        onClick={() => setOpen(true)}
        className={`cursor-zoom-in ${className}`}
        onError={onError}
      />
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-db-bg/95 p-4 sm:p-6"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <img
            src={src}
            alt={alt}
            className="max-h-full max-w-full bg-white object-contain p-2 sm:p-3 shadow-2xl"
          />
        </div>
      )}
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* Figures : chemin explicite + placeholder si la ressource manque            */
/* -------------------------------------------------------------------------- */

function Fig({
  file,
  number,
  caption,
  height = 'h-[24vh] sm:h-[32vh]',
  className = '',
}: {
  file: string
  number: string
  caption: string
  height?: string
  className?: string
}) {
  const [missing, setMissing] = useState(false)
  const src = asset(`/figures/${encodeURIComponent(file)}`)

  return (
    <figure className={`min-w-0 ${className}`}>
      <div className={`${height} relative overflow-hidden rounded-sm border border-db-border/50 bg-white p-1.5 sm:p-2`}>
        {!missing ? (
          <FigureZoom
            src={src}
            alt={`Figure ${number} — ${caption}`}
            className="h-full w-full object-contain"
            onError={() => setMissing(true)}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 bg-[#f4f2ec] px-3 text-center text-[#343434]">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#8a6b36]">
              Figure à intégrer
            </div>
            <div className="max-w-full break-all font-mono text-xs">{file}</div>
            <div className="hidden text-[10px] text-[#666] sm:block">
              Extraire la figure {number} du chapitre 7 du PDF.
            </div>
          </div>
        )}
      </div>
      <figcaption className="mt-1.5 sm:mt-2 font-mono text-[10px] sm:text-[11px] leading-snug text-db-dim">
        <span className="text-db-accent">Figure {number}</span> — {fr(caption)}
      </figcaption>
    </figure>
  )
}

function NumberedFlow({ items }: { items: { title: string; text: string }[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
      {items.map((item, index) => (
        <div key={item.title} className="border-t border-db-border/60 pt-2.5 sm:pt-3">
          <div className="font-mono text-xl sm:text-2xl text-db-accent">{String(index + 1).padStart(2, '0')}</div>
          <h3 className="mt-1.5 sm:mt-2 font-serif text-lg sm:text-xl text-db-text">{item.title}</h3>
          <p className={`mt-1.5 sm:mt-2 ${BODY}`}>{item.text}</p>
        </div>
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Métadonnées des cinq parties                                               */
/* -------------------------------------------------------------------------- */

export type ActeId = 'O' | 'I' | 'II' | 'III' | 'IV' | 'V'

export interface ActeMeta {
  id: ActeId
  label: string
  titre: string
  temps: string
}

export const ACTES: ActeMeta[] = [
  { id: 'O', label: 'Ouverture', titre: 'Titre et contexte', temps: '0:00 – 1:30' },
  { id: 'I', label: 'Partie 1', titre: 'Présentation du site', temps: '1:30 – 3:00' },
  { id: 'II', label: 'Partie 2', titre: 'Jeux de données', temps: '3:00 – 5:00' },
  { id: 'III', label: 'Partie 3', titre: 'Mise en œuvre', temps: '5:00 – 9:00' },
  { id: 'IV', label: 'Partie 4', titre: 'Analyse des résultats', temps: '9:00 – 13:00' },
  { id: 'V', label: 'Partie 5', titre: 'Conclusion et perspectives', temps: '13:00 – 15:00' },
]

export interface SlideDef {
  id: string
  title: string
  section: string
  acte: ActeId
  notes: string
  render: () => ReactNode
}

/* -------------------------------------------------------------------------- */
/* Slides                                                                     */
/* -------------------------------------------------------------------------- */

export const SLIDES: SlideDef[] = [
  /* 01 — page de titre */
  {
    id: 's01',
    title: 'Page de titre',
    section: 'Introduction',
    acte: 'O',
    notes:
      "Bonjour à tous. Je vous présente mon mémoire de licence en informatique : prévision probabiliste de la production photovoltaïque par apprentissage profond, application à la centrale de Diass. Il a été encadré par le Dr Ndiouma Bame, et en stage à la SENELEC par le Dr Saidou Abdoul Soumare et le Dr Abdoulaye Ba. Je vais suivre le plan du mémoire : le contexte et la problématique, le cadre physique, les architectures, puis la modélisation sur Diass et ses résultats.",
    render: () => (
      <div className="flex h-full flex-col overflow-hidden px-3 sm:px-6 md:px-12">
        <div className="flex items-center gap-3 pt-2 sm:gap-5 sm:pt-3">
          <img
            src={asset('/images/ucadLogo.png')}
            alt="UCAD"
            className="h-10 w-10 sm:h-14 sm:w-14 shrink-0 rounded-full bg-white/10 object-contain p-1"
          />
          <div className="flex-1 min-w-0 text-center font-mono text-[10px] sm:text-[12px] uppercase leading-relaxed tracking-[0.15em] sm:tracking-[0.2em] text-db-dim">
            <div className="text-db-muted">Université Cheikh Anta Diop de Dakar</div>
            <div className="hidden sm:block">Faculté des Sciences et Techniques, Département Mathématiques et Informatique</div>
            <div className="sm:hidden">FST, Département Mathématiques et Informatique</div>
            <div>Section Informatique, Mémoire de Licence, de 2025 - 2026</div>
          </div>
          <img
            src={asset('/images/senelecLogo.png')}
            alt="SENELEC"
            className="h-10 w-10 sm:h-14 sm:w-14 shrink-0 rounded-full bg-white/10 object-contain p-1"
          />
        </div>
        <div className="flex max-w-6xl flex-1 flex-col justify-center">
          <h1 className="font-serif text-[clamp(1.6rem,4.2vw,4rem)] font-bold leading-[1.1] tracking-tight text-db-text">
            Prévision probabiliste de la production photovoltaïque par apprentissage profond
          </h1>
          <div className="mt-3 sm:mt-5 text-[clamp(1.1rem,2.3vw,2rem)] text-db-accent">
            Application à la centrale de Diass
          </div>
          <p className="mt-3 sm:mt-6 font-mono text-[11px] sm:text-[13px] tracking-wide text-db-dim">
            Prévision multi-horizon à 72 heures par TCN et TFT, quantiles P10, P50 et P90 recalibrés par CQR
          </p>
        </div>
        <div className="flex flex-wrap items-start justify-center gap-x-8 gap-y-3 border-t border-db-border/40 pb-4 pt-3 sm:gap-x-16 sm:pb-6 sm:pt-4">
          <div className="min-w-0 text-center">
            <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-db-dim">Présenté par</div>
            <div className="mt-1 font-mono text-[clamp(0.9rem,1.5vw,1.2rem)] text-db-text break-words">Baye Mor Gaye</div>
          </div>
          <div className="min-w-0 text-center">
            <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-db-dim">Encadrant</div>
            <div className="mt-1 font-mono text-[clamp(0.9rem,1.5vw,1.2rem)] text-db-text break-words">Dr Ndiouma Bame</div>
          </div>
          <div className="min-w-0 max-w-full text-center">
            <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-db-dim">Maîtres de stage</div>
            <div className="mt-1 font-mono text-[clamp(0.9rem,1.5vw,1.2rem)] text-db-text break-words">
              Dr Saidou Abdoul Soumare, Dr Abdoulaye Ba
            </div>
          </div>
        </div>
      </div>
    ),
  },

  /* 02 — contexte et motivation */
  {
    id: 's02',
    title: 'Contexte et motivation',
    section: 'Introduction générale',
    acte: 'O',
    notes:
      "Le contexte tient en une idée : le Sénégal a levé le verrou de l'infrastructure, pas celui de la prévision. Le JETP de juin 2023 vise 40 % de renouvelables dans la capacité installée d'ici 2030. Les parcs solaires et l'éolien de Taïba N'Diaye ont construit cette capacité : le solaire passe de 245 à 292 MW crête. Mais les renouvelables pèsent 27,35 % de la capacité contre 19,48 % seulement de la production brute : c'est l'effet de l'intermittence. Et la SENELEC achète 76 % de l'énergie acheminée : elle ne pilote pas l'essentiel de ce qui transite. Chaque erreur de prévision se traduit par des déséquilibres et un appel aux réserves thermiques. C'est là que la prévision devient décisive.",
    render: () => (
      <Slide
        title="Le verrou infrastructurel est levé ; la prévision devient le maillon critique"
        gap="gap-6 sm:gap-9"
      >
        <div className="grid max-w-6xl grid-cols-1 gap-5 sm:gap-8 md:grid-cols-3">
          <Stat value="40 %" label="de capacité renouvelable visée d'ici 2030, dans le cadre du JETP signé le 22 juin 2023" />
          <Stat value="292,47 MWc" label="de solaire raccordé en 2025, contre 245 MW en 2022" />
          <Stat value="76,0 %" label="de l'énergie acheminée est achetée : la SENELEC ne pilote pas ce flux" />
        </div>
        <Takeaway>
          Le climat sahélien rend la production intermittente : harmattan, hivernage, passages nuageux. Les
          renouvelables pèsent 27,35 % de la capacité installée mais 19,48 % de la production brute : chaque erreur
          de prévision se traduit par des déséquilibres du réseau et un appel aux réserves thermiques. C'est là que
          la prévision devient décisive.
        </Takeaway>
      </Slide>
    ),
  },

  /* 03 — plan en cinq parties */
  {
    id: 'plan',
    title: 'Plan de présentation',
    section: 'Plan',
    acte: 'O',
    notes:
      "Après le contexte, la présentation suit le déroulement du chapitre consacré au cas de Diass. Je commence par le site et les phénomènes physiques qui influencent sa production. Je présente ensuite les données, leur origine et leur préparation. La troisième partie explique la mise en œuvre expérimentale, puis j'analyse les résultats avant de conclure sur les apports, les limites et les perspectives.",
    render: () => (
      <Slide title="Cinq étapes pour passer du site aux résultats" kicker="Fil conducteur">
        <div className="mx-auto w-full max-w-5xl">
          {[
            ['01', 'Présentation du site', 'Le terrain d’étude et les phénomènes à représenter'],
            ['02', 'Jeux de données', 'Sources, qualité, synchronisation et variables'],
            ['03', 'Mise en œuvre', 'Vue d’ensemble du système, préparation, architectures, entraînement, calibration'],
            ['04', 'Analyse des résultats', 'Précision, incertitude et interprétation opérationnelle'],
            ['05', 'Conclusion et perspectives', 'Contributions, limites et prolongements'],
          ].map(([n, title, description]) => (
            <div key={n} className="grid grid-cols-[2.6rem_1fr] gap-3 border-t border-db-border/50 py-3 sm:grid-cols-[4rem_1fr] sm:gap-4 sm:py-4">
              <div className="pt-0.5 font-mono text-xl sm:text-2xl text-db-accent">{n}</div>
              <div className="min-w-0">
                <h3 className="font-serif text-[clamp(1rem,1.7vw,1.4rem)] text-db-text">{title}</h3>
                <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-db-muted">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </Slide>
    ),
  },

  /* PARTIE 1 — PRÉSENTATION DU SITE */
  {
    id: 's04',
    title: 'Diass : une centrale solaire raccordée au réseau national',
    section: 'Partie 1 — Présentation du site',
    acte: 'I',
    notes:
      "La centrale de Diass constitue le terrain d'application de ce travail. Le mémoire décrit une centrale photovoltaïque raccordée au réseau, mise en service en 2022 et exploitée par la SENELEC. Le parc comprend 85 248 modules Jinko de 320 Wc, soit une puissance crête calculée de 27,28 MWc, tandis que la puissance publiée est de 23,1 MW. Cette distinction entre puissance DC installée et puissance AC publiée doit être conservée. Le site est retenu parce qu'il permet d'étudier la prévision à partir de données d'exploitation réelles.",
    render: () => (
      <Slide title="Diass : le terrain d’étude et ses caractéristiques" kicker="01 / Site">
        <div className="grid items-center gap-5 sm:gap-8 lg:grid-cols-[1.15fr_.85fr]">
          <Fig
            file="Central Solaire de Diass carte.png"
            number="7.x"
            caption="Localisation de la centrale solaire de Diass."
            height="h-[30vh] sm:h-[44vh]"
          />
          <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:gap-x-7 sm:gap-y-8">
            <Stat value="85 248" label="modules photovoltaïques installés" />
            <Stat value="320 Wc" label="puissance nominale d’un module Jinko" />
            <Stat value="27,28 MWc" label="puissance crête DC calculée à partir des modules" tone="text-db-accent" />
            <Stat value="23,1 MW" label="puissance publiée côté centrale" />
          </div>
        </div>
        <Takeaway>Le cas d’étude repose sur une installation réelle : les prévisions sont évaluées à partir de son comportement d’exploitation.</Takeaway>
      </Slide>
    ),
  },
  {
    id: 's05',
    title: 'Le climat local impose une production fortement variable',
    section: 'Partie 1 — Présentation du site',
    acte: 'I',
    notes:
      "La production de Diass ne dépend pas uniquement du cycle solaire. Elle est affectée par le passage des nuages, particulièrement pendant l'hivernage, par les aérosols et les poussières associés à l'harmattan, ainsi que par l'échauffement des modules. Ces facteurs modifient l'irradiance reçue et le rendement de conversion. La figure de comparaison des jours pluvieux et secs illustre un écart moyen de production. Il faut toutefois présenter cette différence comme une observation descriptive du jeu étudié, et non comme une loi universelle.",
    render: () => (
      <Slide title="Quatre phénomènes structurent la variabilité de la production" kicker="01 / Climat">
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {[
            ['Cycle diurne', 'La géométrie solaire fixe la forme générale de la journée.'],
            ['Nuages', 'Les passages nuageux provoquent des variations rapides.'],
            ['Harmattan', 'Les aérosols et poussières atténuent le rayonnement.'],
            ['Température', 'L’échauffement des cellules réduit le rendement.'],
          ].map(([title, text], i) => (
            <div key={title} className="border-t-2 border-db-accent/60 pt-2.5 sm:pt-3">
              <div className="font-mono text-2xl sm:text-3xl text-db-accent">0{i + 1}</div>
              <h3 className="mt-1.5 sm:mt-3 font-serif text-base sm:text-xl text-db-text">{title}</h3>
              <p className={`mt-1 sm:mt-2 ${BODY}`}>{text}</p>
            </div>
          ))}
        </div>
        <div className="mx-auto w-full max-w-4xl">
          <Fig
            file="nb_diass_effet_pluie.png"
            number="7.2"
            caption="Production journalière moyenne selon les conditions de pluie."
            height="h-[20vh] sm:h-[26vh]"
          />
        </div>
        <Takeaway>Le modèle doit apprendre les écarts à la production solaire théorique, pas seulement reproduire le cycle jour–nuit.</Takeaway>
      </Slide>
    ),
  },

  /* PARTIE 2 — JEUX DE DONNÉES */
  {
    id: 's06',
    title: 'Des mesures locales complétées par des sources météorologiques',
    section: 'Partie 2 — Jeux de données',
    acte: 'II',
    notes:
      "Le jeu de données combine les mesures SCADA de la centrale et des sources météorologiques et atmosphériques complémentaires. Le SCADA fournit la référence locale de production et les variables d'exploitation. NASA POWER et ERA5 apportent des variables météorologiques de réanalyse ; CAMS décrit les aérosols ; ECMWF IFS fournit des prévisions météorologiques utilisables dans le futur ; le modèle de ciel clair sert de référence physique. Il faut distinguer les observations ou réanalyses des prévisions disponibles à la date d'émission : seules ces dernières peuvent alimenter légitimement un horizon futur en exploitation.",
    render: () => (
      <Slide title="Une chaîne de données multi-sources, organisée par rôle" kicker="02 / Sources">
        <div className="grid gap-2 sm:gap-3 md:grid-cols-2">
          {[
            ['SCADA Schneider', 'Mesures locales de la centrale et production de référence.'],
            ['NASA POWER', 'Rayonnement et variables météorologiques complémentaires.'],
            ['ERA5', 'Réanalyses atmosphériques et météorologiques.'],
            ['CAMS', 'Aérosols et indicateurs liés aux poussières.'],
            ['ECMWF IFS', 'Prévisions météo destinées aux covariables futures.'],
            ['Ineichen–Perez', 'Estimation du rayonnement de ciel clair comme référence physique.'],
          ].map(([name, description]) => (
            <div key={name} className="flex flex-col gap-0.5 border-t border-db-border/50 py-2 sm:flex-row sm:gap-4 sm:py-3">
              <div className="font-mono text-[11px] sm:text-sm uppercase tracking-wide text-db-accent sm:w-36 sm:shrink-0">
                {name}
              </div>
              <p className={`min-w-0 ${BODY}`}>{description}</p>
            </div>
          ))}
        </div>
        <Takeaway>La valeur du référentiel vient de la complémentarité des sources, mais aussi de la maîtrise de leur disponibilité temporelle.</Takeaway>
      </Slide>
    ),
  },
 
  {
    id: 's08',
    title: 'Explorer les données avant de construire les modèles',
    section: 'Partie 2 — Jeux de données',
    acte: 'II',
    notes:
      "L'analyse exploratoire vérifie que les séries présentent des comportements physiquement cohérents. Le profil journalier moyen fait apparaître l'arc diurne. La série sur une semaine met en évidence les variations liées aux nuages. La matrice de corrélation montre le lien fort entre irradiance et production ainsi que l'effet inverse de la couverture nuageuse. Cette étape n'est pas une simple illustration : elle sert à repérer les incohérences, comprendre les facteurs dominants et orienter l'ingénierie des variables.",
    render: () => (
      <Slide title="Le signal solaire domine, mais la météo explique ses écarts" kicker="02 / Exploration">
        <div className="grid grid-cols-1 gap-3 sm:gap-5 lg:grid-cols-3">
          <Fig
            file="nb_diass_profil_journalier.png"
            number="7.3"
            caption="Profil journalier moyen."
            height="h-[18vh] sm:h-[28vh]"
          />
          <Fig
            file="nb_diass_serie_semaine.png"
            number="7.4"
            caption="Évolution sur une semaine représentative."
            height="h-[18vh] sm:h-[28vh]"
          />
          <Fig
            file="nb_diass_matrice_correlations.png"
            number="7.5"
            caption="Matrice de corrélation des variables."
            height="h-[18vh] sm:h-[28vh]"
          />
        </div>
        <Takeaway>Le cycle diurne donne la structure ; les nuages, les aérosols et la température expliquent une partie des écarts à cette structure.</Takeaway>
      </Slide>
    ),
  },

  /* PARTIE 3 — MISE EN ŒUVRE */

  /* Vue d'ensemble Deep Aero */
  {
    id: 's08a',
    title: "Vue d'ensemble du système Deep Aero SN",
    section: 'Partie 3 — Mise en œuvre',
    acte: 'III',
    notes:
      "Avant d'entrer dans le détail du pipeline, la vue d'ensemble du système. La figure montre la chaîne complète, du capteur SCADA à la prévision batch. Trois temps structurent la démarche : construire les données, en assemblant les réanalyses et les prévisions météorologiques avec la mesure locale ; apprendre et calibrer, en entraînant le TCN et le TFT puis en recalibrant les quantiles par CQR ; inférer enfin, en produisant les 72 heures de prévision avec leurs enveloppes P10–P90. C'est cette vue d'ensemble que les planches suivantes vont détailler, étape par étape.",
    render: () => (
      <Slide
        title="Du capteur SCADA à la prévision batch : une chaîne en trois temps"
        kicker="03 / Vue d'ensemble"
        gap="gap-4 sm:gap-5"
      >
        <Fig
          file="Deep-Aero-SN-ensemble.drawio.png"
          number="7.1"
          caption="Vue d’ensemble du système Deep Aero SN : données, apprentissage, inférence."
          height="h-[22vh] sm:h-[34vh]"
          className="mx-auto w-full max-w-6xl"
        />
        <NumberedFlow
          items={[
            { title: 'Construire les données', text: 'Export SCADA, réanalyses météorologiques et prévisions futures assemblés en un référentiel unique.' },
            { title: 'Apprendre et calibrer', text: 'Entraînement chronologique du TCN et du TFT, puis recalibrage CQR des quantiles.' },
            { title: 'Inférer', text: 'Prévisions batch 72 h avec leurs enveloppes P10–P90, prêtes pour l’analyse opérationnelle.' },
          ]}
        />
        <Takeaway>
          Cette vue d’ensemble fixe le fil de la mise en œuvre : les planches suivantes détaillent chacune des trois étapes.
        </Takeaway>
      </Slide>
    ),
  },

  {
    id: 's09',
    title: 'Le pipeline transforme les mesures en variables exploitables',
    section: 'Partie 3 — Mise en œuvre',
    acte: 'III',
    notes:
      "La mise en œuvre commence par une chaîne reproductible : contrôle des données, harmonisation, traitement des valeurs manquantes, calcul des variables physiques et temporelles, puis constitution des fenêtres d'apprentissage. Les variables sont organisées pour distinguer les informations passées, les variables connues à l'avance et les covariables météorologiques futures réellement disponibles. La figure du pipeline montre les transformations dans leur ordre d'exécution, plutôt qu'une liste de bibliothèques logicielles.",
    render: () => (
      <Slide title="Du flux brut au référentiel d’apprentissage" kicker="03 / Pipeline" gap="gap-4 sm:gap-6">
        <Fig
          file="features_pipline_flow.drawio_.png"
          number="7.9"
          caption="Pipeline de préparation et de construction des variables."
          height="h-[22vh] sm:h-[34vh]"
          className="mx-auto w-full max-w-6xl"
        />
        <NumberedFlow items={[
          { title: 'Contrôler', text: 'Vérifier les horodatages, les plages physiques et les valeurs manquantes.' },
          { title: 'Transformer', text: 'Construire les variables temporelles, solaires, météorologiques et causales.' },
          { title: 'Assembler', text: 'Former les séquences historiques et les covariables futures admissibles.' },
        ]} />
      </Slide>
    ),
  },
  {
    id: 's10',
    title: 'Écarter les variables qui révèlent directement la cible',
    section: 'Partie 3 — Mise en œuvre',
    acte: 'III',
    notes:
      "Un point central de la mise en œuvre est la prévention de la tautologie. Certaines mesures électriques contemporaines sont algébriquement liées à la puissance active. Si elles sont fournies au modèle au même instant que la cible, celui-ci peut reconstituer la réponse au lieu d'anticiper la production. Le protocole doit donc distinguer les variables disponibles à l'instant de prévision des variables qui ne sont connues qu'après mesure. Les variables opérationnelles ne sont pas nécessairement supprimées : elles peuvent être décalées dans le passé si ce décalage correspond à une information réellement disponible.",
    render: () => (
      <Slide title="Éviter que le modèle retrouve la réponse dans les entrées" kicker="03 / Contrôle des variables" gap="gap-5 sm:gap-8">
        <div className="mx-auto w-full max-w-4xl border border-db-border/60 bg-db-border/10 px-4 py-4 sm:px-6 sm:py-6 text-center">
          <div className="font-mono text-[clamp(1rem,1.9vw,1.6rem)] text-db-text">
            P<sub>ac</sub> = √3 × V<sub>ac</sub> × I<sub>ac</sub> × cos φ
          </div>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-db-muted">Relation électrique : les mesures contemporaines peuvent révéler directement la cible.</p>
        </div>
        <div className="grid gap-4 sm:gap-7 md:grid-cols-3">
          <Stat value="Disponibilité" label="Ne conserver que les informations connues à l’instant de prévision." />
          <Stat value="Décalage" label="Transformer certaines mesures d’exploitation en historiques causaux." tone="text-db-accent" />
          <Stat value="Redondance" label="Repérer et retirer les variables redondantes ou tautologiques." />
        </div>
        <Takeaway>Le critère n’est pas seulement la corrélation : c’est la disponibilité réelle de chaque variable au moment où la prévision est produite.</Takeaway>
      </Slide>
    ),
  },
  {
    id: 's11',
    title: 'Comparer TCN et TFT dans un protocole commun',
    section: 'Partie 3 — Mise en œuvre',
    acte: 'III',
    notes:
      "Deux architectures principales sont comparées. Le TCN exploite des convolutions causales dilatées et des blocs résiduels ; il traite efficacement les séquences et permet un calcul parallèle. Le TFT combine sélection de variables, blocs de représentation et attention temporelle ; il est conçu pour intégrer des covariables futures connues et offrir des éléments d'interprétabilité. Les deux modèles doivent recevoir des entrées comparables, être évalués sur les mêmes fenêtres et produire les mêmes horizons afin que la comparaison soit pertinente.",
    render: () => (
      <Slide title="Deux architectures, deux façons de modéliser la dépendance temporelle" kicker="03 / Modèles">
        <div className="grid gap-5 sm:gap-8 lg:grid-cols-2">
          <div className="space-y-2.5 sm:space-y-4">
            <Fig
              file="TCN architecture.png"
              number="5.x"
              caption="Architecture TCN : convolutions causales dilatées et blocs résiduels."
              height="h-[20vh] sm:h-[28vh]"
            />
            <h3 className="font-serif text-lg sm:text-2xl text-db-text">TCN</h3>
            <p className={`${BODY} hidden sm:block`}>Convolutions causales et dilatées, traitement parallèle des séquences, architecture relativement compacte.</p>
            <p className={`${BODY} sm:hidden`}>Convolutions causales dilatées, traitement parallèle des séquences.</p>
          </div>
          <div className="space-y-2.5 sm:space-y-4">
            <Fig
              file="TFT - Architecture Detaillee image.png"
              number="5.x"
              caption="Architecture Temporal Fusion Transformer."
              height="h-[20vh] sm:h-[28vh]"
            />
            <h3 className="font-serif text-lg sm:text-2xl text-db-text">TFT</h3>
            <p className={`${BODY} hidden sm:block`}>Sélection de variables, mécanismes d’attention et intégration de covariables futures connues.</p>
            <p className={`${BODY} sm:hidden`}>Sélection de variables, attention, covariables futures connues.</p>
          </div>
        </div>
        <Takeaway>La comparaison porte sur la précision et la qualité probabiliste, mais aussi sur le coût de calcul et l’interprétabilité.</Takeaway>
      </Slide>
    ),
  },
  {
    id: 's12',
    title: 'Produire 72 heures de prévisions et calibrer leur incertitude',
    section: 'Partie 3 — Mise en œuvre',
    acte: 'III',
    notes:
      "Le problème est formulé en prévision multi-horizon : une fenêtre historique alimente le modèle, qui produit directement les 72 échéances futures. La sortie probabiliste comprend les quantiles P10, P50 et P90. P50 représente la trajectoire centrale ; P10 et P90 encadrent une plage d'incertitude. Le recalibrage conformel CQR ajuste les bornes à partir d'un jeu de calibration séparé. La couverture observée doit ensuite être mesurée sur le jeu de test, sans présenter une garantie théorique comme une preuve automatique de couverture empirique dans toutes les conditions.",
    render: () => (
      <Slide title="Une sortie multi-horizon, trois quantiles et un recalibrage" kicker="03 / Prévision probabiliste">
        <div className="grid items-center gap-5 sm:gap-8 lg:grid-cols-[1.1fr_.9fr]">
          <Fig
            file="mimo_flow.drawio.png"
            number="6.1"
            caption="Schéma de prévision directe multi-horizon de type MIMO."
            height="h-[24vh] sm:h-[36vh]"
          />
          <div className="space-y-4 sm:space-y-7">
            <Stat value="72 h" label="horizon de prévision, produit directement par le modèle" tone="text-db-accent" />
            <Stat value="P10 · P50 · P90" label="quantiles bas, central et haut de la distribution prédite" />
            <Stat value="CQR" label="recalibrage des bornes à partir d’un jeu de calibration distinct" />
          </div>
        </div>
        <Takeaway>La médiane répond à « quelle production attendre ? » ; l’intervalle répond à « quelle incertitude faut-il anticiper ? »</Takeaway>
      </Slide>
    ),
  },

  /* PARTIE 4 — ANALYSE DES RÉSULTATS */
  {
    id: 's13',
    title: 'Le TCN obtient la meilleure précision ponctuelle',
    section: 'Partie 4 — Analyse des résultats',
    acte: 'IV',
    notes:
      "Sur les fenêtres de test rapportées dans le mémoire, le TCN obtient le meilleur RMSE et le meilleur coefficient de détermination parmi les modèles comparés. Le TFT reste proche, tandis que les modèles de référence sont moins performants. Il faut commenter les métriques qui sont interprétables pour une série comportant des périodes nocturnes de production quasi nulle. La MAPE peut devenir instable lorsque la valeur réelle est proche de zéro ; le RMSE, le MAE et R² sont donc plus utiles pour la lecture principale.",
    render: () => (
      <Slide title="Le TCN arrive en tête sur les métriques de précision" kicker="04 / Résultats">
        <div className="mx-auto w-full max-w-5xl">
          <div className="grid grid-cols-4 gap-1.5 sm:gap-3 border-b border-db-border/60 pb-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-db-dim">
            <span>Modèle</span><span>RMSE (MW)</span><span>MAE (MW)</span><span>R²</span>
          </div>
          {[
            ['Persistance', '6,905', '4,987', '−1,013'],
            ['MLP', '2,323', '1,275', '0,772'],
            ['LSTM', '2,043', '1,148', '0,824'],
            ['TCN', '1,707', '0,989', '0,877'],
            ['TFT', '1,818', '1,157', '0,861'],
          ].map((row) => (
            <div key={row[0]} className={`grid grid-cols-4 gap-1.5 sm:gap-3 border-b border-db-border/40 py-2.5 sm:py-3 font-mono text-[clamp(0.8rem,1.3vw,1.1rem)] tabular-nums ${row[0] === 'TCN' ? 'text-db-accent' : 'text-db-text'}`}>
              {row.map((cell) => <span key={cell} className="break-words">{cell}</span>)}
            </div>
          ))}
        </div>
        <Takeaway>Le TCN réduit l’erreur quadratique moyenne à 1,707 MW et atteint R² = 0,877 sur le jeu de test rapporté.</Takeaway>
      </Slide>
    ),
  },
  {
    id: 's14',
    title: 'La calibration rapproche la couverture de la cible nominale',
    section: 'Partie 4 — Analyse des résultats',
    acte: 'IV',
    notes:
      "La qualité probabiliste se juge notamment par la couverture de l'intervalle P10–P90 et par sa largeur. Pour le TCN, le mémoire rapporte une couverture qui passe de 60,8 % avant recalibrage à 79,8 % après CQR, proche de la cible nominale de 80 %. Pour le TFT, la couverture après recalibrage rapportée est de 74,2 %. Cette différence doit être présentée avec prudence : une couverture proche de 80 % est un résultat agrégé sur le test, elle ne garantit pas une couverture uniforme à chaque horizon ou dans chaque régime météo. La largeur doit être lue conjointement à la couverture.",
    render: () => (
      <Slide title="Le recalibrage améliore la couverture du TCN" kicker="04 / Incertitude">
        <div className="grid gap-5 sm:gap-8 md:grid-cols-2">
          <div className="space-y-4 sm:space-y-6">
            <div className="font-serif text-lg sm:text-xl text-db-text">TCN — couverture P10–P90</div>
            <div className="space-y-3">
              <div>
                <div className="mb-1 flex justify-between font-mono text-xs sm:text-sm text-db-muted"><span>Avant CQR</span><span>60,8 %</span></div>
                <div className="h-2.5 sm:h-3 bg-db-border/50"><div className="h-2.5 sm:h-3 bg-db-muted" style={{ width: '60.8%' }} /></div>
              </div>
              <div>
                <div className="mb-1 flex justify-between font-mono text-xs sm:text-sm text-db-muted"><span>Après CQR</span><span>79,8 %</span></div>
                <div className="h-2.5 sm:h-3 bg-db-border/50"><div className="h-2.5 sm:h-3 bg-db-accent" style={{ width: '79.8%' }} /></div>
              </div>
              <div className="border-t border-db-border/50 pt-2 sm:pt-3 font-mono text-xs sm:text-sm text-db-dim">Cible nominale : 80 %</div>
            </div>
          </div>
          <div className="space-y-4 sm:space-y-6">
            <div className="font-serif text-lg sm:text-xl text-db-text">Comparaison après CQR</div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <Stat value="79,8 %" label="couverture TCN" tone="text-db-accent" />
              <Stat value="74,2 %" label="couverture TFT" />
            </div>
            <p className={BODY}>La couverture doit toujours être interprétée avec la largeur des intervalles et leur comportement selon l’horizon.</p>
          </div>
        </div>
        <Takeaway>Le recalibrage améliore l’alignement entre l’intervalle annoncé et sa couverture empirique, sans réentraîner le modèle.</Takeaway>
      </Slide>
    ),
  },
  {
    id: 's15',
    title: 'Les trajectoires prédites suivent le cycle solaire et ses variations',
    section: 'Partie 4 — Analyse des résultats',
    acte: 'IV',
    notes:
      "La lecture graphique complète les métriques agrégées. Les courbes doivent montrer la production réelle, la médiane prédite et l'enveloppe P10–P90 sur des fenêtres de test représentatives. On vérifie si le modèle reproduit le cycle diurne, suit les variations rapides et encadre correctement les observations. Les transitions jour-nuit et les épisodes nuageux constituent des situations particulièrement intéressantes à commenter. La figure exacte du mémoire doit être utilisée ici, sans redessiner artificiellement des résultats.",
    render: () => (
      <Slide title="Lire les prévisions sur des fenêtres de test réelles" kicker="04 / Diagnostic visuel">
        <Fig
          file="nb_diass_fenetres_test.png"
          number="7.18"
          caption="Fenêtres de test : production observée, médiane P50 et enveloppe P10–P90."
          height="h-[30vh] sm:h-[46vh]"
          className="mx-auto w-full max-w-6xl"
        />
        <Takeaway>Les métriques résument la performance ; les fenêtres temporelles montrent où le modèle réussit et dans quelles situations il reste en difficulté.</Takeaway>
      </Slide>
    ),
  },
  {
    id: 's16',
    title: 'Un résultat utile, à interpréter dans son domaine de validité',
    section: 'Partie 4 — Analyse des résultats',
    acte: 'IV',
    notes:
      "Le résultat principal est une preuve de faisabilité sur les données réelles de Diass, et non encore un système de dispatch autonome. Le TCN présente la meilleure précision et la meilleure couverture recalibrée dans les résultats rapportés. Le TFT conserve un intérêt grâce à ses mécanismes de sélection et d'attention, qui peuvent aider à analyser les facteurs utilisés par le modèle. Pour une utilisation réseau, les quantiles peuvent alimenter des scénarios de production basse, centrale et haute. Toute traduction en décision opérationnelle nécessite toutefois une validation avec les contraintes du réseau, les coûts de réserve et les opérateurs.",
    render: () => (
      <Slide title="De la prévision batch à l’aide à la décision : une étape supplémentaire reste nécessaire" kicker="04 / Portée">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-6">
          <div className="border-t-2 border-db-accent/70 pt-2.5 sm:pt-3">
            <div className="font-mono text-xl sm:text-2xl text-db-accent">P10</div>
            <h3 className="mt-1 sm:mt-2 font-serif text-base sm:text-xl text-db-text">Scénario bas</h3>
            <p className={`mt-1 sm:mt-2 ${BODY}`}>Estimation prudente de la production disponible.</p>
          </div>
          <div className="border-t-2 border-db-accent/70 pt-2.5 sm:pt-3">
            <div className="font-mono text-xl sm:text-2xl text-db-accent">P50</div>
            <h3 className="mt-1 sm:mt-2 font-serif text-base sm:text-xl text-db-text">Scénario central</h3>
            <p className={`mt-1 sm:mt-2 ${BODY}`}>Trajectoire médiane de production attendue.</p>
          </div>
          <div className="border-t-2 border-db-accent/70 pt-2.5 sm:pt-3">
            <div className="font-mono text-xl sm:text-2xl text-db-accent">P90</div>
            <h3 className="mt-1 sm:mt-2 font-serif text-base sm:text-xl text-db-text">Scénario haut</h3>
            <p className={`mt-1 sm:mt-2 ${BODY}`}>Scénario haut utile à l’analyse des marges d’incertitude.</p>
          </div>
        </div>
        <Fig
          file="fig_ch9_prevision_batch.png"
          number="7.19"
          caption=" : la prévision batch produit les quantiles qui alimentent les scénarios de décision."
          height="h-[18vh] sm:h-[26vh]"
          className="mx-auto w-full max-w-4xl"
        />
        <Takeaway>Le modèle fournit une information probabiliste exploitable ; la décision finale doit rester intégrée aux contraintes et outils de conduite du réseau.</Takeaway>
      </Slide>
    ),
  },

  /* PARTIE 5 — CONCLUSION ET PERSPECTIVES */
  {
    id: 's17',
    title: 'Le travail apporte une chaîne de prévision testée sur un site réel',
    section: 'Partie 5 — Conclusion et perspectives',
    acte: 'V',
    notes:
      "Ce travail a construit et évalué une chaîne de prévision probabiliste de la production photovoltaïque sur le site de Diass. Il articule la constitution d'un référentiel de données, la prévention des variables tautologiques, la comparaison de deux architectures et l'évaluation de la couverture des intervalles. Le TCN obtient les meilleurs résultats rapportés, avec un RMSE de 1,707 MW, un R² de 0,877 et une couverture après CQR de 79,8 %. Le TFT reste une alternative intéressante lorsque l'interprétabilité des variables et des dépendances temporelles est prioritaire.",
    render: () => (
      <Slide title="Trois contributions, un résultat principal" kicker="05 / Bilan">
        <div className="grid gap-4 sm:gap-8 md:grid-cols-3">
          <Stat value="Données" label="Un référentiel multi-source harmonisé et documenté pour le cas de Diass." />
          <Stat value="Modèles" label="Une comparaison expérimentale TCN / TFT dans un cadre multi-horizon." />
          <Stat value="Incertitude" label="Des intervalles P10–P90 évalués et recalibrés par CQR." />
        </div>
        <div className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-4 sm:gap-8 border-t border-db-border/50 pt-4 sm:pt-6">
          <Stat value="1,707 MW" label="RMSE du TCN sur le test" tone="text-db-accent" />
          <Stat value="79,8 %" label="couverture P10–P90 après CQR" tone="text-db-accent" />
        </div>
        <Takeaway>Le résultat central est une preuve expérimentale de prévision probabiliste à 72 heures sur des données réelles de centrale.</Takeaway>
      </Slide>
    ),
  },
  {
    id: 's18',
    title: 'Des perspectives orientées vers la robustesse et le déploiement',
    section: 'Partie 5 — Conclusion et perspectives',
    acte: 'V',
    notes:
      "Les résultats doivent être replacés dans leurs limites. La période d'observation couvre environ une année et ne suffit pas à établir une robustesse interannuelle. Le pas horaire ne permet pas de résoudre les fluctuations très rapides liées aux nuages. Enfin, une validation sur un seul site ne démontre pas encore la transférabilité à d'autres centrales. Les perspectives sont donc : prolonger l'historique, tester le transfert vers d'autres sites, développer un modèle de très court terme à une résolution de cinq à quinze minutes, étudier l'apprentissage fédéré et conduire un pilote opérationnel avec les équipes de la SENELEC. Merci de votre attention.",
    render: () => (
      <Slide title="Consolider, transférer, puis intégrer" kicker="05 / Perspectives">
        <div className="grid gap-5 sm:gap-7 md:grid-cols-2">
          <div>
            <div className={EYEBROW}>Limites à prendre en compte</div>
            <ul className={`mt-3 sm:mt-4 space-y-2 sm:space-y-3 ${BODY}`}>
              <li>Une période d’observation encore limitée à environ une année.</li>
              <li>Une résolution horaire qui lisse les fluctuations infra-horaires.</li>
              <li>Une validation centrée sur un seul site photovoltaïque.</li>
            </ul>
          </div>
          <div>
            <div className={EYEBROW}>Perspectives de recherche</div>
            <ul className={`mt-3 sm:mt-4 space-y-2 sm:space-y-3 ${BODY}`}>
              <li>Étendre l’historique et tester la robustesse saisonnière.</li>
              <li>Évaluer le transfert du pipeline vers d’autres centrales.</li>
              <li>Développer une prévision très court terme à 5–15 minutes.</li>
              <li>Étudier l’apprentissage fédéré et un pilote avec la SENELEC.</li>
            </ul>
          </div>
        </div>
        <div className="mt-3 sm:mt-5 border-t border-db-border/50 pt-4 sm:pt-6 text-center">
          <p className="font-serif text-[clamp(1.4rem,2.6vw,2.4rem)] text-db-text">Merci de votre attention.</p>
          <p className="mt-1.5 sm:mt-2 font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-db-dim">Questions et discussion</p>
        </div>
      </Slide>
    ),
  },
]