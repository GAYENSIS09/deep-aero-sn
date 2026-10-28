export interface ChapterMeta {
  slug: string
  num: number | null
  part: string
  title: string
  description: string
  icon: string
}

export const chapters: ChapterMeta[] = [
  {
    slug: 'introduction',
    num: null,
    part: 'Introduction',
    title: 'Introduction générale',
    description: 'Contexte, problématique, objectifs et plan du mémoire.',
    icon: 'book-open',
  },
  {
    slug: '1-transition',
    num: 1,
    part: 'Partie I — Contexte physique et données',
    title: 'Cadre de la transition énergétique au Sénégal et présentation des sites',
    description: 'Contexte du secteur électrique sénégalais, mix électrique, gisement solaire et présentation des centrales solaires.',
    icon: 'sun',
  },
  {
    slug: '2-physique',
    num: 2,
    part: 'Partie I — Contexte physique et données',
    title: 'Physique et technologie photovoltaïque',
    description: 'Physique du rayonnement solaire, conversion photovoltaïque, jonction PN, effet photovoltaïque.',
    icon: 'layers',
  },
  {
    slug: '4-fondations',
    num: 4,
    part: 'Partie II — Modélisation et deep learning',
    title: 'Fondations de l\'apprentissage supervisé et régularisation',
    description: 'Du perceptron au MLP, fonctions d\'activation et de coût, optimisation, régularisation.',
    icon: 'brain',
  },
  {
    slug: '5-modeles',
    num: 5,
    part: 'Partie II — Modélisation et deep learning',
    title: 'Modèles pour séries temporelles',
    description: 'CNN 1D, RNN, LSTM, GRU, attention, Transformer.',
    icon: 'cpu',
  },
  {
    slug: '6-architectures',
    num: 6,
    part: 'Partie II — Modélisation et deep learning',
    title: 'Architectures avancées appliquées',
    description: 'Temporal Fusion Transformer (TFT) et Temporal Convolutional Network (TCN).',
    icon: 'settings',
  },
  {
    slug: '7-strategies',
    num: 7,
    part: 'Partie II — Modélisation et deep learning',
    title: 'Stratégie MIMO et prévision probabiliste par quantiles',
    description: 'Prévision multi-horizon MIMO, régression quantile, perte hybride, recalibrage CQR.',
    icon: 'target',
  },
  {
    slug: '8-etudes-cas',
    num: 8,
    part: 'Partie III — Application et évaluation',
    title: 'Étude de cas : Diass (solaire)',
    description: 'Validation du pipeline sur la centrale solaire de Diass (SENELEC).',
    icon: 'file',
  },
]

export function getChapter(slug: string): ChapterMeta | undefined {
  return chapters.find((c) => c.slug === slug)
}
