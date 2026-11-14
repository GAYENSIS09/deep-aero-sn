'use client'

/**
 * Deck de soutenance — mémoire « Prévision probabiliste de la production
 * photovoltaïque par apprentissage profond : application à la centrale
 * de Diass » (Baye_Mor_Gaye.pdf).
 *
 * Le fil conducteur est celui du mémoire, suivi planche par planche :
 *
 *   1. Le verrou infrastructurel est levé (JETP, parcs solaires, éolien) ;
 *      la question se déplace vers la prévision de la production.
 *   2. Problématique (mot pour mot) : comment modéliser par apprentissage
 *      profond ET quantifier l'incertitude de la production PV à 72 h
 *      pour sécuriser le pilotage du réseau électrique au Sénégal.
 *   3. Trois objectifs qui forment une progression : construire le
 *      référentiel → modéliser et quantifier l'incertitude → évaluer et
 *      dégager la portée opérationnelle.
 *   4. Chaque partie apporte sa réponse ; la conclusion boucle le fil.
 *
 * Plan des planches (ordre exact du mémoire) :
 *   Ouverture  Introduction générale           (planches 1 à 3)
 *   Partie I   Potentiel solaire et techno PV  (ch. 1 et 2, planche 4)
 *   Partie II  Architectures d'apprentissage   (ch. 3 à 6, planches 5 à 7)
 *   Partie III Modélisation de la prévision    (ch. 7, planches 8 à 18)
 *
 * Épure : chaque planche porte son titre-message, sans autre indication
 * (chapitre, section, « Partie ») ; le chrome du haut reprend le titre de
 * la planche courante comme filet de lecture. La composition est pensée
 * planche par planche —
 * figure pleine page, asymétrie figure/texte, citation centrale, tableau
 * centré — plutôt qu'un gabarit unique.
 */

import type { ReactNode } from 'react'

import { useEffect, useState } from 'react'
import { asset } from '@/lib/paths'

/* ───────────────────────── briques ───────────────────────── */

/**
 * Espaces insécables à la française : avant %, ‰, ° et les unités, à
 * l'intérieur des milliers. Évite les coupures de ligne mal placées
 * (« 40 » orphelin en fin de ligne, « % » rejeté au début de la suivante).
 */
export const fr = (s: string): string =>
  s
    .replace(/(\d) (?=\d{3}(?!\d))/g, '$1\u00A0')
    .replace(/ (?=[%‰°])/g, '\u00A0')
    .replace(/(\d) (?=(?:MWc|MW|GWh|kWh|Wh|Wc|W)\b)/g, '$1\u00A0')
    .replace(/(\d) (?=(?:kWh|W)\/m²)/g, '$1\u00A0')
    .replace(
      /(\d) (?=(?:h|s|heures|pas|époques|cycles|fenêtres|colonnes|variables|lignes|mois|jours|ans)\b)/g,
      '$1\u00A0',
    )

const BODY = 'text-[clamp(1rem,1.5vw,1.25rem)] leading-snug text-db-muted'

/** Chiffre clé en grand, avec son libellé. */
function Stat({ v, l, tone = 'text-db-text' }: { v: string; l: string; tone?: string }) {
  return (
    <div className="border-t-2 border-db-accent/70 pt-3">
      <div className={`font-mono tabular-nums leading-none text-[clamp(1.6rem,3vw,2.7rem)] ${tone}`}>{fr(v)}</div>
      <div className="mt-2 text-[clamp(0.9rem,1.25vw,1.1rem)] leading-snug text-db-muted">{fr(l)}</div>
    </div>
  )
}

/** Message à retenir : filet d'accent + serif. */
function Takeaway({ children }: { children: ReactNode }) {
  return (
    <p className="max-w-5xl border-l-2 border-db-accent/70 pl-5 font-serif text-[clamp(1.1rem,1.9vw,1.55rem)] leading-snug text-db-text">
      {typeof children === 'string' ? fr(children) : children}
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
          alt={`Figure ${num} : ${caption}`}
          className="h-full w-full cursor-zoom-in object-contain"
        />
      </div>
      <figcaption className="mt-2 font-mono text-[12px] leading-snug text-db-dim">
        <span className="text-db-accent">Figure {num}</span> : {fr(caption)}
      </figcaption>
    </figure>
  )
}

const fig = (name: string) => asset('/figures/' + encodeURIComponent(name))

/**
 * Coquille de planche : le titre-message seul en tête (aucune autre
 * indication), contenu respirant dans l'espace restant.
 */
function Slide({
  title,
  gap = 'gap-7',
  children,
}: {
  title: ReactNode
  gap?: string
  children: ReactNode
}) {
  return (
    <div className={`flex h-full flex-col px-6 pb-10 pt-4 sm:px-10 md:px-20 ${gap}`}>
      <h2 className="max-w-6xl font-serif text-[clamp(2rem,3.7vw,3rem)] leading-[1.1] text-db-text">
        {typeof title === 'string' ? fr(title) : title}
      </h2>
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-6">{children}</div>
    </div>
  )
}

/* ───────────────────────── actes (parties du mémoire) ───────────────────────── */

export type ActeId = 'O' | 'I' | 'II' | 'III'

export interface ActeMeta {
  id: ActeId
  label: string
  titre: string
  temps: string
}

export const ACTES: ActeMeta[] = [
  { id: 'O', label: 'Ouverture', titre: 'Contexte, problématique et objectifs', temps: '0:00 – 2:30' },
  { id: 'I', label: 'Partie I', titre: 'Potentiel solaire et technologie photovoltaïque', temps: '2:30 – 4:30' },
  { id: 'II', label: 'Partie II', titre: 'Architectures d’apprentissage profond', temps: '4:30 – 8:30' },
  { id: 'III', label: 'Partie III', titre: 'Modélisation de la prévision photovoltaïque', temps: '8:30 – 15:00' },
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
    acte: 'O',
    notes:
      "Bonjour à tous. Je vous présente mon mémoire de licence en informatique : prévision probabiliste de la production photovoltaïque par apprentissage profond, application à la centrale de Diass. Il a été encadré par le Dr Ndiouma Bame, et en stage à la SENELEC par le Dr Saidou Abdoul Soumare et le Dr Abdoulaye Ba. Je vais suivre le plan du mémoire : le contexte et la problématique, le cadre physique, les architectures, puis la modélisation sur Diass et ses résultats.",
    render: () => (
      <div className="flex h-full flex-col px-4 sm:px-8 md:px-14">
        <div className="flex items-center gap-5 pt-3">
          <img
            src={asset('/images/ucadLogo.png')}
            alt="UCAD"
            className="h-14 w-14 rounded-full bg-white/10 object-contain p-1"
          />
          <div className="flex-1 text-center font-mono text-[12px] uppercase leading-relaxed tracking-[0.2em] text-db-dim">
            <div className="text-db-muted">Université Cheikh Anta Diop de Dakar</div>
            <div>Faculté des Sciences et Techniques, Département Mathématiques et Informatique</div>
            <div>Section Informatique, Mémoire de Licence, de 2025 - 2026</div>
          </div>
          <img
            src={asset('/images/senelecLogo.png')}
            alt="SENELEC"
            className="h-14 w-14 rounded-full bg-white/10 object-contain p-1"
          />
        </div>
        <div className="flex max-w-6xl flex-1 flex-col justify-center">
          <h1 className="font-serif text-[clamp(2.2rem,5vw,4.2rem)] font-bold leading-[1.08] tracking-tight text-db-text">
            Prévision probabiliste de la production photovoltaïque par apprentissage profond
          </h1>
          <div className="mt-5 text-[clamp(1.3rem,2.7vw,2.1rem)] text-db-accent">Application à la centrale de Diass</div>
          <p className="mt-6 font-mono text-[13px] tracking-wide text-db-dim">
            Prévision multi-horizon à 72 heures par TCN et TFT, quantiles P10, P50 et P90 recalibrés par CQR
          </p>
        </div>
        <div className="flex flex-wrap items-start justify-center gap-x-16 gap-y-4 border-t border-db-border/40 pb-6 pt-4">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-db-dim">Présenté par</div>
            <div className="mt-1.5 font-mono text-[clamp(1rem,1.6vw,1.25rem)] text-db-text">Baye Mor Gaye</div>
          </div>
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-db-dim">Encadrant</div>
            <div className="mt-1.5 font-mono text-[clamp(1rem,1.6vw,1.25rem)] text-db-text">Dr Ndiouma Bame</div>
          </div>
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-db-dim">Maîtres de stage</div>
            <div className="mt-1.5 font-mono text-[clamp(1rem,1.6vw,1.25rem)] text-db-text">
              Dr Saidou Abdoul Soumare, Dr Abdoulaye Ba
            </div>
          </div>
        </div>
      </div>
    ),
  },

  /* 02 — contexte : trois chiffres, un constat. Composition : chiffres + message. */
  {
    id: 's02',
    title: 'Du verrou infrastructurel au verrou de la prévision',
    section: 'Introduction générale',
    acte: 'O',
    notes:
      "Le contexte tient en une idée : le verrou de l'infrastructure est levé, celui de la prévision reste. Dans le cadre du JETP signé le 22 juin 2023, le Sénégal vise 40 % de renouvelables dans la capacité installée d'ici 2030. Les parcs solaires et l'éolien de Taïba N'Diaye ont construit cette capacité, le solaire passe de 245 à 292 MW crête. Mais les renouvelables pèsent 27,35 % de la capacité contre 19,48 % seulement de la production brute : c'est l'effet de l'intermittence. Et la SENELEC achète 76 % de l'énergie acheminée : elle ne pilote pas l'essentiel de ce qui transite. Chaque erreur de prévision se traduit par des déséquilibres et un appel aux réserves thermiques.",
    render: () => (
      <Slide
        title="Les centrales sont construites ; la question se déplace vers la prévision"
        gap="gap-9"
      >
        <div className="grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          <Stat v="40 %" l="de capacité renouvelable visée d’ici 2030, dans le cadre du JETP signé le 22 juin 2023" />
          <Stat v="292,47 MWc" l="de solaire raccordé en 2025, contre 245 MW en 2022" />
          <Stat v="76,0 %" l="de l’énergie acheminée est achetée : la SENELEC ne pilote pas ce flux" />
        </div>
        <Takeaway>
          Le climat sahélien rend la production intermittente : harmattan, hivernage, passages nuageux. Les
          renouvelables pèsent 27,35 % de la capacité installée mais 19,48 % de la production brute : chaque erreur de
          prévision se traduit par des déséquilibres du réseau et un appel aux réserves thermiques.
        </Takeaway>
      </Slide>
    ),
  },

  /* 03 — problématique et objectifs : la question, puis les trois objectifs qui y répondent */
  {
    id: 's03',
    title: 'Problématique et objectifs',
    section: 'Introduction générale',
    acte: 'O',
    notes:
      "La problématique, telle qu'elle est posée dans le mémoire : comment modéliser par apprentissage profond et quantifier l'incertitude de la production photovoltaïque à 72 heures pour sécuriser le pilotage du réseau électrique au Sénégal ? Elle se décompose en trois sous-questions : comment modéliser, comment quantifier l'incertitude, et à quoi cela sert-il pour le pilotage du réseau. Pour y répondre, trois objectifs forment une progression. Un : construire un référentiel unifié de variables pour Diass, relié à la physique et au climat sahélien, enrichi des covariables futures NWP, avec une sélection par union contre les fuites. Deux : concevoir et comparer TCN et TFT, en multi-horizon 72 heures, sorties quantiles recalibrées par CQR. Trois : évaluer sur les données réelles de Diass et dégager la portée pour la SENELEC. Le plan suit les trois parties du mémoire : le cadre physique, les architectures, la modélisation sur Diass.",
    render: () => (
      <Slide title="Une question, trois objectifs" gap="gap-7">
        <p className="mx-auto max-w-5xl border-l-2 border-db-accent bg-db-border/10 py-5 pl-8 pr-8 font-serif text-[clamp(1.3rem,2.4vw,1.9rem)] leading-snug text-db-text">
          Comment modéliser par apprentissage profond et quantifier l’incertitude de la production photovoltaïque
          à 72 heures pour sécuriser le pilotage du réseau électrique au Sénégal ?
        </p>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              n: '1',
              t: 'Construire le référentiel',
              d: 'Variables unifiées de la centrale, du site et du climat sahélien, enrichies des covariables futures NWP ; sélection par union contre les fuites.',
            },
            {
              n: '2',
              t: 'Modéliser et quantifier',
              d: 'Concevoir et comparer TCN et TFT en prévision multi-horizon 72 h ; intervalles recalibrés par CQR.',
            },
            {
              n: '3',
              t: 'Évaluer et dégager la portée',
              d: 'Évaluer sur les données réelles de Diass, analyser les implications pour la gestion du réseau par la SENELEC.',
            },
          ].map((o) => (
            <div key={o.n}>
              <div className="font-mono text-[clamp(1.6rem,2.6vw,2.4rem)] leading-none text-db-accent">{o.n}</div>
              <div className="mt-2 font-serif text-[clamp(1.1rem,1.8vw,1.45rem)] leading-snug text-db-text">{o.t}</div>
              <p className={`mt-2 ${BODY}`}>{o.d}</p>
            </div>
          ))}
        </div>
      </Slide>
    ),
  },

  /* 04 — chapitres 1 et 2 : le cadre énergétique et le gisement, le pont vers la physique en message final */
  {
    id: 's04',
    title: 'Le cadre physique, du gisement à la part à prévoir',
    section: 'Chapitres 1 et 2',
    acte: 'I',
    notes:
      "Chapitres 1 et 2 : le cadre, puis la physique. Le thermique pèse 1 711 MW sur 2 290 installés, soit 74,7 %. La production brute atteint 7 486 GWh en 2025, dont 76 % d'achats aux producteurs indépendants : la SENELEC ne pilote pas la majorité de ce qui transite, d'où l'intérêt de la prévision. En face, le gisement national est l'un des meilleurs : GHI annuel de 1 825 à 2 194 kWh/m², potentiel estimé à 63 920 MW. Les centrales sont hétérogènes, modules fixes, bifaciaux, suiveurs : aucun modèle unique ne convient, chaque site exige un calage. Diass, première centrale solaire publique du pays, fournit des données d'exploitation suffisantes : c'est notre cas d'étude. Deuxième chapitre : la physique. Une part de la production se calcule exactement : la géométrie solaire, la déclinaison, l'angle d'incidence ; le pipeline reprend ces formules, figures 2.2 et 2.6 du mémoire. L'autre part est stochastique : passages nuageux, harmattan et empoussièrement, pertes thermiques. C'est cette part-là que le modèle doit apprendre. Pour l'encadrer, le chapitre fixe un référentiel unifié de variables en quatre familles : météo et climat, grandeurs électriques, exploitation et milieu, temporalité et features dérivées. Ce référentiel est la matière première de la partie III.",
    render: () => (
      <Slide
        title="Un réseau thermique sur l’un des meilleurs gisements d’Afrique"
        gap="gap-5"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
          <Stat v="74,7 %" l="de la capacité installée est thermique en 2025, soit 1 711 MW sur 2 290" />
          <Stat v="76,0 %" l="de l’énergie acheminée est achetée aux producteurs indépendants" />
          <Stat v="63 920 MW" l="de potentiel PV estimé ; GHI annuel de 1 825 à 2 194 kWh/m²" tone="text-db-accent" />
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8">
          <Fig
            src={fig('Central Solaire de Diass carte.png')}
            num="1.3"
            caption="Localisation de la centrale de Diass, première centrale solaire publique du pays."
            h="h-[26vh]"
          />
          <Fig
            src={fig('ghi_senegal.png')}
            num="1.4"
            caption="Gisement solaire du Sénégal : irradiance globale horizontale."
            h="h-[26vh]"
          />
        </div>
        <Takeaway>
          Une part de la production se calcule, l’autre se prévoit : c’est elle que le modèle doit apprendre.
          Le référentiel unifié, ses quatre familles de variables, est la matière première de la partie III.
        </Takeaway>
      </Slide>
    ),
  },

  /* 05 — chapitre 5 : le TFT, la figure à gauche et trois idées à droite */
  {
    id: 's05',
    title: 'TFT : sélection, attention interprétable, quantiles natifs',
    section: 'Chapitres 3 à 5',
    acte: 'II',
    notes:
      "Deuxième partie : les architectures. Les chapitres 3 et 4 posent d'abord l'état de l'art et le protocole : découpage chronologique, normalisation ajustée sur l'entraînement seul, validation walk-forward ; le passé prédit le futur, jamais l'inverse. Les briques, figures 3.1 et 4.3 du mémoire : la convolution causale dilatée, qui étend le champ réceptif sans regarder le futur, les réseaux récurrents LSTM, puis l'attention et le Transformer. Chapitre 5, le TFT : sa variable selection network pèse chaque variable à chaque pas de temps ; les blocs GRN à porte GLU lissent les représentations ; l'attention multi-têtes reste interprétable ; les covariables futures connues, nos prévisions météo, entrent nativement ; et la sortie est en quantiles. Sa valeur ajoutée est l'interprétabilité : l'opérateur voit pourquoi le modèle annonce une baisse à un horizon donné.",
    render: () => (
      <Slide title="Le TFT sélectionne les variables, puis pondère le passé par attention" gap="gap-6">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.5fr_1fr]">
          <Fig
            src={fig('TFT - Architecture Detaillee image.png')}
            num="5.1"
            caption="Architecture du Temporal Fusion Transformer."
            h="h-[46vh]"
          />
          <div className="space-y-7">
            <Stat v="VSN" l="chaque variable est pesée à chaque pas de temps" />
            <Stat v="Attention" l="multi-têtes et interprétable, les poids se lisent" tone="text-db-accent" />
            <Stat v="Quantiles natifs" l="la sortie donne P10, P50 et P90 ; les covariables météo futures entrent nativement" />
          </div>
        </div>
      </Slide>
    ),
  },

  /* 06 — chapitre 5 : le TCN, trois idées à gauche et la figure à droite */
  {
    id: 's06',
    title: 'TCN : convolutions causales dilatées, rapides et parallèles',
    section: 'Chapitre 5',
    acte: 'II',
    notes:
      "Le TCN ensuite : des convolutions causales dilatées, un noyau de 3 et dix couches portent le champ réceptif à 2 047 pas, plus de trois semaines d'historique horaire. La séquence est traitée en parallèle et la mémoire est linéaire : l'entraînement est rapide et stable. En contrepartie, pas de variables statiques natives ni d'interprétabilité native. Deux philosophies s'affrontent : le TFT choisit l'interprétabilité, le TCN la vitesse et la simplicité. Le chapitre 6 fixe le cadre commun pour les départager.",
    render: () => (
      <Slide title="Le TCN : des convolutions causales dilatées, rapides et parallèles" gap="gap-6">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1.5fr]">
          <div className="space-y-7">
            <Stat
              v="2 047 pas"
              l="champ réceptif : noyau 3, 10 couches dilatées, soit plus de trois semaines d’historique horaire"
              tone="text-db-accent"
            />
            <Stat v="Parallélisme total" l="séquence traitée d’un bloc, mémoire linéaire, sans le coût quadratique de l’attention" />
            <Stat v="En contrepartie" l="pas de variables statiques natives, pas d’interprétabilité native" />
          </div>
          <Fig
            src={fig('TCN architecture.png')}
            num="5.5"
            caption="Architecture du TCN : blocs résiduels à convolutions causales dilatées."
            h="h-[46vh]"
          />
        </div>
      </Slide>
    ),
  },

  /* 07 — chapitre 6 : la sortie MIMO, puis le recalibrage CQR qui la garantit */
  {
    id: 's07',
    title: 'Sortie MIMO et calibration CQR',
    section: 'Chapitre 6',
    acte: 'II',
    notes:
      "Chapitre 6 : la stratégie de prévision, commune aux deux architectures. La sortie est traitée en MIMO : un seul modèle reçoit la fenêtre d'historique et produit en une passe la matrice 72 horizons par 3 quantiles, soit 216 valeurs. J'ai écarté la prévision récursive : l'erreur s'accumule sur 72 pas et il faudrait 72 entraînements. La perte est hybride, w·MSE + (1−w)·pinball : une erreur quadratique sur la médiane, une perte pinball sur les quantiles. Les croisements de quantiles mesurés sur le test sont nuls. Les quantiles appris ne garantissent pas la couverture en échantillon fini : le recalibrage conformel CQR les corrige sans réentraînement. Sur un jeu de calibration, on mesure le plus grand dépassement des bornes, on en prend le quantile, puis on l'ajoute à la borne haute et on le retire de la borne basse. Avec alpha égal à 0,20, la couverture d'au moins 80 % est garantie sous échangeabilité. L'évaluation suit cinq étapes : couverture et largeur par horizon, score propre de Winkler, diagnostic de croisement, comparaison à la climatologie.",
    render: () => (
      <Slide
        title="Un modèle produit les 72 heures ; le recalibrage garantit l’enveloppe"
        gap="gap-5"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.5fr_1fr]">
          <Fig
            src={fig('mimo_flow.drawio.png')}
            num="6.1"
            caption="Flux MIMO : fenêtre d’historique, modèle unique, matrice H × Q."
            h="h-[36vh]"
          />
          <div className="space-y-5">
            <div className="border border-db-border/60 bg-db-border/10 px-5 py-4 text-center font-mono text-[clamp(0.95rem,1.5vw,1.2rem)] leading-relaxed text-db-text">
              I(x) = [ ŷ<sub>bas</sub> − q, ŷ<sub>haut</sub> + q ]
              <div className="mt-2 text-[0.75em] leading-snug text-db-muted">
                q = quantile des scores de non-conformité sur le jeu de calibration, avec α = 0,20
              </div>
            </div>
            <Stat v="72 × 3 = 216" l="quantiles P10, P50, P90 produits en une seule passe" />
            <Stat v="≥ 80 %" l="couverture garantie après recalibrage, sans réentraînement" tone="text-db-accent" />
          </div>
        </div>
        <Takeaway>
          Sans les prévisions météo futures, aucun modèle ne produira d’intervalle utile à 72 heures : le plafond vient de
          l’information d’entrée.
        </Takeaway>
      </Slide>
    ),
  },

  /* 08 — 7.1 : la figure système pleine largeur, la démarche en une ligne de trois temps */
  {
    id: 's08',
    title: 'Du capteur SCADA à la prévision batch : une démarche en trois temps',
    section: 'Chapitre 7',
    acte: 'III',
    notes:
      "Troisième partie : le chapitre 7 met la méthodologie à l'épreuve sur Diass. Trois objectifs d'étude : prévoir la production à 72 heures, accompagner chaque prévision d'une enveloppe P10–P90, comparer plusieurs architectures sur un protocole identique. La démarche, que montre la figure, se déroule en trois temps : construire les données, de l'export SCADA au fichier de features enrichi par les réanalyses ; apprendre, du découpage en fenêtres jusqu'à la calibration probabiliste ; puis inférer, qui sélectionne le modèle retenu et produit une prévision par lots avec son enveloppe. Les sections suivantes suivent ce fil.",
    render: () => (
      <Slide title="Du capteur SCADA à la prévision batch : une démarche en trois temps" gap="gap-7">
        <Fig
          src={fig('Deep-Aero-SN-ensemble.drawio.png')}
          num="7.1"
          caption="Vue d’ensemble du système Deep Aero SN."
          h="h-[46vh]"
          className="mx-auto w-full max-w-6xl"
        />
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 border-t border-db-border/40 pt-4 font-mono text-[clamp(0.85rem,1.3vw,1.05rem)] md:grid-cols-3">
          {['1. Construire les données', '2. Apprendre et calibrer', '3. Inférer : prévision batch 72 h'].map((s) => (
            <div key={s} className="text-db-text">{s}</div>
          ))}
        </div>
      </Slide>
    ),
  },

  /* 09 — 7.2 : trois chiffres du site, la figure de la pluie en appui */
  {
    id: 's09',
    title: 'Un site sahélien exigeant : quatre phénomènes à capturer',
    section: 'Chapitre 7',
    acte: 'III',
    notes:
      "Section 7.2 : le site. Diass compte 85 248 modules polycristallins de 320 Wc, soit 27,28 MWc crête pour 23,1 MW publiés, sur une structure fixe inclinée à 15 degrés plein sud, pour environ 34 gigawattheures par an. Quatre phénomènes structurent la production : le cycle diurne, la variabilité nuageuse de l'hivernage, les aérosols de l'harmattan (le DNI perd 15 à 30 %, l'empoussièrement 5 à 15 %) et les pertes thermiques, la température de cellule montant à 65–75 degrés. La figure montre l'effet de la pluie : 3,7 mégawatts en moyenne les jours de pluie contre 4,0 les jours secs, soit moins 6 %.",
    render: () => (
      <Slide title="Un site sahélien exigeant : quatre phénomènes à capturer" gap="gap-6">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          <Stat v="27,28 MWc" l="85 248 modules Jinko de 320 Wc, structure fixe inclinée à 15° plein sud, 23,1 MW publiés" />
          <Stat v="34 GWh" l="par an en moyenne ; mise en service en mai 2022, exploitée par la SENELEC" />
          <Stat v="Harmattan" l="DNI en baisse de 15 à 30 %, empoussièrement de 5 à 15 %" tone="text-db-accent" />
        </div>
        <div className="mx-auto w-full max-w-5xl">
          <Fig
            src={fig('nb_diass_effet_pluie.png')}
            num="7.2"
            caption="Production journalière moyenne : 3,7 MW les jours de pluie contre 4,0 les jours secs, soit 6 % de moins."
            h="h-[32vh]"
          />
        </div>
      </Slide>
    ),
  },

  /* 10 — 7.3 : les six sources à gauche, les chiffres de causalité et de volume à droite, plausibilité en message final */
  {
    id: 's10',
    title: 'Six sources hiérarchisées, des données physiquement plausibles',
    section: 'Chapitre 7',
    acte: 'III',
    notes:
      "Section 7.3 : les données, en six sources hiérarchisées. Le SCADA de la centrale, du 30 août 2025 au 31 août 2026 au pas de 15 minutes ; NASA POWER et ERA5 pour les réanalyses ; CAMS pour les aérosols ; ECMWF IFS pour les prévisions météo injectées comme covariables futures ; Ineichen–Perez pour le ciel clair. L'ordre de priorité va de la mesure locale à NASA POWER puis ERA5. L'interpolation est limitée à 24 heures, sans extrapolation, et la vraie coupure du 9 au 15 décembre 2025 reste manquante. La règle de causalité impose init plus six heures inférieur ou égal à l'heure d'émission : sur 1 461 cycles, 1 460 sont exploitables, 8 247 fenêtres valides. Jeu final : 8 800 heures, 428 colonnes. Et le contrôle IEC 61724 valide la plausibilité : gisement reproduit à 0,5 % près, performance ratio 64,8 % dans la plage publiée, énergie annualisée à plus 0,9 %.",
    render: () => (
      <Slide title="Six sources hiérarchisées, des données physiquement plausibles" gap="gap-6">
        <div className="mx-auto grid max-w-6xl gap-x-14 gap-y-8 lg:grid-cols-[1.05fr_1fr]">
          <div>
            {[
              { n: 'SCADA Schneider', d: 'mesure locale, du 30/08/2025 au 31/08/2026, pas 15 min' },
              { n: 'NASA POWER', d: 'réanalyse : GHI et météo' },
              { n: 'ERA5', d: 'DNI, DHI et nuages' },
              { n: 'CAMS', d: 'aérosols et poussières' },
              { n: 'ECMWF IFS', d: 'prévisions météo, injectées comme covariables futures' },
              { n: 'Ciel clair', d: 'modèle d’Ineichen et Perez' },
            ].map((s) => (
              <div key={s.n} className="flex flex-wrap items-baseline justify-between gap-x-6 border-t border-db-border/50 py-2">
                <span className="font-mono text-[clamp(0.9rem,1.2vw,1.05rem)] uppercase tracking-wider text-db-text">{s.n}</span>
                <span className="text-[clamp(0.9rem,1.2vw,1.05rem)] text-db-muted">{s.d}</span>
              </div>
            ))}
          </div>
          <div className="space-y-6">
            <Stat v="init + 6 h ≤ t" l="le run météo doit précéder l’émission ; 1 460 cycles exploitables sur 1 461" tone="text-db-accent" />
            <Stat v="8 800 h × 428" l="jeu final, à partir de 35 196 lignes SCADA et 58 colonnes" />
            <Stat v="Interpolation ≤ 24 h" l="sans extrapolation ; la coupure du 9 au 15 décembre 2025 reste manquante" />
          </div>
        </div>
        <Takeaway>
          Contrôle IEC 61724 : gisement reproduit à 0,5 % près, performance ratio de 64,8 % dans la plage publiée,
          énergie annualisée à +0,9 % ; les données peuvent servir de base à la modélisation.
        </Takeaway>
      </Slide>
    ),
  },

  /* 11 — EDA : trois figures, un seul message. Pas de chiffres parasites. */
  {
    id: 's11',
    title: 'L’arc diurne domine, et l’irradiance explique la production',
    section: 'Chapitre 7',
    acte: 'III',
    notes:
      "Avant de modéliser, j'explore les données : section 7.3.3. Le profil journalier moyen montre l'arc diurne attendu ; la semaine du 6 juin 2026 montre la production qui épouse l'irradiance, avec des chutes brutales au passage des nuages. La matrice de corrélation confirme : l'irradiance domine la production, la couverture nuageuse joue en sens inverse. Avec le modèle NOCT, la température de cellule moyenne est de 33,3 degrés, pour une perte thermique moyenne de 3,56 %. L'épaisseur optique des aérosols vaut 0,31 en moyenne et culmine en mai. Ces effets de l'atmosphère sont ceux que le modèle devra apprendre.",
    render: () => (
      <Slide title="L’arc diurne domine, et l’irradiance explique la production" gap="gap-6">
        <div className="mx-auto grid max-w-6xl grid-cols-3 gap-8">
          <Fig
            src={fig('nb_diass_profil_journalier.png')}
            num="7.3"
            caption="Profil journalier moyen."
            h="h-[32vh]"
          />
          <Fig
            src={fig('nb_diass_serie_semaine.png')}
            num="7.4"
            caption="Semaine du 6 juin 2026."
            h="h-[32vh]"
          />
          <Fig
            src={fig('nb_diass_matrice_correlations.png')}
            num="7.5"
            caption="Matrice de corrélation."
            h="h-[32vh]"
          />
        </div>
        <Takeaway>Les chutes brutales au passage des nuages sont la principale source d’erreur à court terme.</Takeaway>
      </Slide>
    ),
  },

  /* 12 — anti-fuite : la formule en majesté, trois garde-fous */
  {
    id: 's12',
    title: 'Empêcher le modèle de « tricher » : la formule électrique ne doit pas fuiter',
    section: 'Chapitre 7',
    acte: 'III',
    notes:
      "Section 7.4 : la mise en œuvre, qui commence par la prévention des fuites. Les variables électriques mesurées au même instant que la cible sont reliées à la production par une égalité stricte : P égale V fois I fois cosinus phi fois racine de trois. Un modèle qui les reçoit apprend cette formule au lieu d'anticiper la météo, et serait inutilisable en exploitation. Je ne supprime pas le SCADA : je le transforme en retards de 24 heures, des indicateurs d'état connus à t moins 24 h. Les onze variables brutes interdites deviennent onze variables transformées. Enfin, toute variable corrélée à plus de 0,99 avec la cible est exclue automatiquement, sauf les drivers physiques autorisés.",
    render: () => (
      <Slide title="Empêcher le modèle de « tricher » : la formule électrique ne doit pas fuiter" gap="gap-9">
        <div className="mx-auto w-full max-w-4xl border border-db-border/60 bg-db-border/10 px-10 py-7 text-center font-mono text-[clamp(1.2rem,2.2vw,1.8rem)] text-db-text">
          P<sub>ac</sub> = V<sub>ac</sub> × I<sub>ac</sub> × cos φ × √3
          <div className="mt-2 text-[0.65em] leading-snug text-db-muted">
            les mesures contemporaines de la cible donneraient la réponse au modèle
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
          <Stat v="Retards de 24 h" l="les mesures brutes deviennent des indicateurs d’état connus à t−24 h, soit 96 pas de retard" tone="text-db-accent" />
          <Stat v="11" l="variables brutes interdites, toutes remplacées par des variables transformées" />
          <Stat v="|ρ| > 0,99" l="exclusion automatique, sauf irradiance, position solaire, nuages" />
        </div>
      </Slide>
    ),
  },

  /* 13 — features puis sélection : le pipeline à gauche, la trajectoire de 58 à 424 variables à droite */
  {
    id: 's13',
    title: 'De 58 colonnes brutes à 424 variables retenues, sans fuite',
    section: 'Chapitre 7',
    acte: 'III',
    notes:
      "Sections 7.4.2 et 7.4.3 : l'ingénierie puis la sélection. Le pipeline exécute six opérations : rééchantillonnage horaire, contrôles Great Expectations, prétraitement avec interpolation limitée, sept étapes de construction de variables (encodage cyclique du temps, météo, fréquence réseau, physique solaire, électrique causal, retards), puis nettoyage et sélection. 58 colonnes brutes donnent 543 variables. La sélection applique sept méthodes indépendantes et retient leur union : 194 variables ne sont retenues que par une seule méthode, un vote majoritaire les écarterait. Après suppression de 118 redondances à corrélation supérieure à 0,90, 424 variables restent, et aucune famille n'est sacrifiée.",
    render: () => (
      <Slide title="De 58 colonnes brutes à 424 variables retenues, sans fuite" gap="gap-6">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.5fr_1fr]">
          <Fig
            src={fig('features_pipline_flow.drawio_.png')}
            num="7.9"
            caption="Pipeline de feature engineering et contrôles anti-fuite."
            h="h-[44vh]"
          />
          <div className="space-y-8">
            <Stat v="78,1 %" l="des variables construites sont retenues : 424 sur 543, à partir de 58 colonnes brutes" tone="text-db-accent" />
            <Stat v="Union de 7 méthodes" l="194 variables ne sont retenues que par une seule : le vote majoritaire les écarterait" />
            <Stat v="118" l="redondances supprimées, corrélations au-delà de 0,90 en valeur absolue" />
          </div>
        </div>
      </Slide>
    ),
  },

  /* 14 — entraînement : une figure (les courbes), trois chiffres resserrés */
  {
    id: 's14',
    title: 'Cinq modèles, un même protocole d’entraînement',
    section: 'Chapitre 7',
    acte: 'III',
    notes:
      "Sections 7.4.4 à 7.4.6 : l'apprentissage. Cinq modèles sur un protocole commun : la persistance comme repère minimal, le MLP et le LSTM comme repères appris, et le TCN et le TFT, seuls à recevoir les covariables météo futures et à produire des prévisions probabilistes avec la perte hybride. Les hyperparamètres sont cherchés par Optuna, échantillonneur TPE, dix essais, graine 42 figée, élagage par la médiane. La validation sert à arrêter tôt : patience de 25 époques, le TCN s'arrête à 57, le TFT va à 100 ; l'entraînement a coût 1 206 secondes au TCN et 2 016 au TFT. Les courbes montrent une convergence régulière, sans surapprentissage marqué. Enfin le recalibrage CQR, alpha 0,20, est appliqué sur la validation. Le pipeline complet de cette étape est la figure 7.13 du mémoire.",
    render: () => (
      <Slide title="Cinq modèles, un même protocole d’entraînement" gap="gap-8">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
          <Fig
            src={fig('nb_diass_learning_curves.png')}
            num="7.14"
            caption="Courbes d’entraînement du TCN et du TFT : convergence régulière, arrêt à 57 et 100 époques."
            h="h-[44vh]"
          />
          <div className="space-y-7">
            <Stat
              v="5 modèles"
              l="persistance, MLP, LSTM, TCN, TFT ; seuls TCN et TFT sont probabilistes"
            />
            <Stat v="57 puis 100" l="époques du TCN puis du TFT, patience de 25" tone="text-db-accent" />
            <Stat v="CQR" l="recalibrage appliqué sur la validation, α = 0,20" />
          </div>
        </div>
      </Slide>
    ),
  },

  /* 15 — inférence : la prévision à gauche, trois points à droite */
  {
    id: 's15',
    title: 'Une prévision batch de 72 heures, enveloppe P10 à P90 incluse',
    section: 'Chapitre 7',
    acte: 'III',
    notes:
      "Section 7.4.7 : l'inférence. Le pipeline sélectionne le modèle retenu, assemble l'historique jusqu'à la dernière heure disponible, ajoute les prévisions météo futures, et produit en mode batch une prévision à 72 heures avec son enveloppe P10–P90. Sur le run courant, la médiane de la prévision du site vaut 0,965 mégawatt. L'enveloppe s'élargit avec l'horizon : c'est attendu, la largeur étant un quantile absolu des résidus de calibration.",
    render: () => (
      <Slide title="Une prévision batch de 72 heures, enveloppe P10 à P90 incluse" gap="gap-6">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.5fr_1fr]">
          <Fig
            src={fig('nb_diass_prevision_batch_72h.png')}
            num="7.16"
            caption="Prévision batch à 72 heures : médiane P50 et enveloppe P10 à P90."
            h="h-[42vh]"
          />
          <div className="space-y-8">
            <Stat v="P50 = 0,965 MW" l="médiane de la prévision du site, run courant" />
            <Stat v="Enveloppe croissante" l="la largeur entre P10 et P90 augmente avec l’horizon" tone="text-db-accent" />
            <Stat v="Mode batch" l="modèle retenu, nouvelle prévision à chaque émission" />
          </div>
        </div>
      </Slide>
    ),
  },

  /* 16 — résultats : le tableau centré, les couvertures CQR en dessous, un message de jugement */
  {
    id: 's16',
    title: 'Sur 1 049 fenêtres, le TCN domine et son enveloppe couvre 79,8 % des observations',
    section: 'Chapitre 7',
    acte: 'III',
    notes:
      "Section 7.5 : les résultats, sur 1 049 fenêtres de test couvrant du 16 juillet au 28 août 2026. Le TCN est le plus précis : RMSE 1,707 MW, MAE 0,989, R carré 0,877. Le TFT suit de près : 1,818 MW, R carré 0,861. Les repères sont nettement en retrait : la persistance est à 6,9 MW avec un R carré négatif. La MAPE est très élevée pour tous car la production est presque nulle en début et fin de journée : je m'appuie donc sur le RMSE et le R carré. Côté incertitude : le TCN passe de 60,8 % de couverture à 79,8 % après CQR, proche de la cible de 80 % ; le TFT de 71 à 74,2 %. Aucun croisement de quantiles. L'écart entre les deux architectures est modeste : c'est la couverture calibrée qui les départage.",
    render: () => (
      <Slide
        title="Sur 1 049 fenêtres, le TCN domine et son enveloppe couvre 79,8 % des observations"
        gap="gap-6"
      >
        <div className="mx-auto w-full max-w-5xl">
          <div className="grid grid-cols-6 gap-4 border-b border-db-border/60 pb-2 font-mono text-[12px] uppercase tracking-widest text-db-dim">
            <span>Modèle</span>
            <span>RMSE, MW</span>
            <span>MAE, MW</span>
            <span>R²</span>
            <span>Couverture</span>
            <span>Largeur, MW</span>
          </div>
          {[
            ['Persistance', '6,905', '4,987', '−1,013', '', ''],
            ['MLP', '2,323', '1,275', '0,772', '', ''],
            ['LSTM', '2,043', '1,148', '0,824', '', ''],
            ['TCN', '1,707', '0,989', '0,877', '79,8 %', '2,596'],
            ['TFT', '1,818', '1,157', '0,861', '74,2 %', '2,646'],
          ].map((r) => (
            <div key={r[0]} className="grid grid-cols-6 gap-4 border-b border-db-border/40 py-2.5 font-mono text-[clamp(0.95rem,1.4vw,1.2rem)] tabular-nums text-db-text">
              <span className="text-db-accent">{r[0]}</span>
              <span>{r[1]}</span>
              <span>{r[2]}</span>
              <span>{r[3]}</span>
              <span>{fr(r[4])}</span>
              <span>{r[5]}</span>
            </div>
          ))}
          <p className={`mt-3 ${BODY}`}>
            Couverture et largeur mesurées après recalibrage, pour les seuls modèles probabilistes.
          </p>
        </div>
        <Takeaway>
          L’écart entre les deux architectures est modeste : c’est la couverture de l’enveloppe après CQR qui les
          départage.
        </Takeaway>
      </Slide>
    ),
  },

  /* 17 — SENELEC : les fenêtres de test à gauche, la lecture opérationnelle à droite */
  {
    id: 's17',
    title: 'Une erreur de 1,7 MW devant un seuil de dispatch de 5 MW',
    section: 'Chapitre 7',
    acte: 'III',
    notes:
      "La figure 7.18 montre des fenêtres de test : le TCN reproduit bien le cycle diurne et suit les variations rapides dues aux nuages ; ses écarts les plus nets apparaissent aux transitions jour–nuit. Section 7.5.5 : que valent ces résultats pour la SENELEC ? Le réseau a peu de marge de manœuvre. Comme hypothèse de travail, je retiens un seuil indicatif de 5 mégawatts pour le dispatch quotidien, soit 22 % de la capacité publiée : le TCN est à 1,7 MW, la marge est confortable. Concrètement, la borne haute P90 dimensionne la réserve de sécurité à mobiliser ; la borne basse P10 donne la production sur laquelle compter sans démarrer le thermique inutilement ; et la distribution des quantiles estime la probabilité de franchir un seuil critique, par exemple 10 % de la capacité.",
    render: () => (
      <Slide title="Une erreur de 1,7 MW devant un seuil de dispatch de 5 MW" gap="gap-6">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
          <Fig
            src={fig('nb_diass_fenetres_test.png')}
            num="7.18"
            caption="Fenêtres de test représentatives : médiane P50, enveloppe P10 à P90, production réelle."
            h="h-[40vh]"
          />
          <div>
            <div className="grid grid-cols-1 gap-7">
              <Stat v="5 MW" l="seuil indicatif de dispatch quotidien, retenu comme hypothèse de travail, soit 22 % de la capacité publiée" />
              <Stat v="1,707 MW" l="RMSE du TCN, largement sous le seuil" tone="text-db-accent" />
            </div>
            <ul className={`mt-7 space-y-3 ${BODY}`}>
              <li>
                <span className="text-db-text">P90</span> dimensionne la réserve de sécurité à mobiliser
              </li>
              <li>
                <span className="text-db-text">P10</span> donne la production sur laquelle compter sans démarrer le thermique
              </li>
              <li>
                {fr('les quantiles estiment la probabilité de franchir un seuil critique, par exemple 10 % de la capacité')}
              </li>
            </ul>
          </div>
        </div>
      </Slide>
    ),
  },

  /* 18 — conclusion : trois chiffres, la boucle du fil, limites et perspectives, merci */
  {
    id: 's18',
    title: 'Une chaîne validée de bout en bout sur les données réelles de Diass',
    section: 'Chapitre 7',
    acte: 'III',
    notes:
      "En conclusion, la chaîne complète est validée de bout en bout sur un site réel. Les trois objectifs sont tenus : un référentiel sans fuite (543 variables construites, 424 retenues) ; deux architectures comparées à enveloppe calibrée ; et une preuve sur données réelles avec une portée opérationnelle. Le TCN devance légèrement le TFT en précision et en couverture calibrée, tandis que le TFT conserve une interprétabilité que le TCN n'offre pas. Deux limites : une seule année d'entraînement, donc la stabilité des hyperparamètres d'une saison à l'autre n'est pas garantie ; le pas horaire lisse les nuages de moins d'une heure et plafonne la précision à 72 heures ; à quoi s'ajoute le coût mémoire de l'attention du TFT. Trois prolongements : transférer le pipeline à un autre site, un modèle dédié aux horizons de 1 à 6 heures au pas de 5 à 15 minutes, et l'apprentissage fédéré. Sur le plan opérationnel, une intégration progressive à la gestion du réseau de la SENELEC, avec des phases pilotes sur Diass. Merci de votre attention.",
    render: () => (
      <Slide title="Une chaîne validée de bout en bout sur les données réelles de Diass" gap="gap-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          <Stat v="1,707 MW" l="RMSE du TCN à 72 heures, R² de 0,877" tone="text-db-accent" />
          <Stat v="79,8 %" l="couverture recalibrée des bornes P10 et P90, cible de 80 %" tone="text-db-accent" />
          <Stat v="424 variables" l="retenues sur 543 construites, sans fuite" tone="text-db-accent" />
        </div>
        <div className="mx-auto grid max-w-6xl gap-x-12 gap-y-6 border-t border-db-border/40 pt-6 md:grid-cols-3">
          <div>
            <div className="font-mono text-[12px] uppercase tracking-[0.25em] text-db-accent">Objectifs tenus</div>
            <p className={`mt-3 ${BODY}`}>
              Un référentiel sans fuite, deux architectures comparées à enveloppe calibrée, une preuve sur
              données réelles pour la SENELEC.
            </p>
          </div>
          <div>
            <div className="font-mono text-[12px] uppercase tracking-[0.25em] text-db-accent">Limites</div>
            <ul className={`mt-3 space-y-2 ${BODY}`}>
              <li>Une seule année d’entraînement</li>
              <li>Les nuages brefs échappent au pas horaire</li>
              <li>Coût mémoire de l’attention du TFT</li>
            </ul>
          </div>
          <div>
            <div className="font-mono text-[12px] uppercase tracking-[0.25em] text-db-accent">Perspectives</div>
            <ul className={`mt-3 space-y-2 ${BODY}`}>
              <li>Transférer le pipeline vers un autre site solaire</li>
              <li>Court terme, de 1 à 6 heures au pas de 5 à 15 minutes</li>
              <li>Apprentissage fédéré, puis pilote à la SENELEC</li>
            </ul>
          </div>
        </div>
        <p className="text-center font-mono text-[12px] uppercase tracking-[0.3em] text-db-dim">
          Merci de votre attention
        </p>
      </Slide>
    ),
  },
]
