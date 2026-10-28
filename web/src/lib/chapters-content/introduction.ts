import type { ChapterData } from './index'

export const chapterContent: ChapterData = {
  slug: 'introduction',
  title: 'Introduction générale',
  part: 'Introduction',
  intro:
    "Le secteur électrique sénégalais fait face à un double défi stratégique : garantir l'accès universel à une électricité fiable tout en accélérant l'intégration des sources renouvelables dans le réseau interconnecté de la SENELEC. Conformément au Plan Sénégal Émergent (PSE) et à la Stratégie Nationale pour la Transition Énergétique, l'ambition nationale vise à porter la part des énergies renouvelables à 40~\\% du mix à l'horizon 2030.",
  sections: [
    {
      type: 'section',
      title: 'Contexte et motivation',
      blocks: [
        {
          type: 'text',
          content:
            "Avec la mise en service de plusieurs parcs solaires d'envergure comme Ten Merina, Senergy (24,35~MWc), Santhiou Mékhé (29,5~MWc), Diass (23~MWc), Kahone (44~MWc / 35~MWac), Malicounda (22~MWc) et Sakal (20~MWc), combinés au parc éolien de Taïba N'Diaye (158,7~MW), le principal verrou technologique et opérationnel ne réside plus dans le déploiement des infrastructures, mais dans la **prévision fiable de la production**. En raison de la forte variabilité climatique propre au Sahel (alternance de saisons sèches et humides, passages nuageux, ou encore les épisodes d'harmattan de novembre à février et d'hivernage de juillet à septembre), la production photovoltaïque est intrinsèquement intermittente. Des erreurs de prévision induisent des déséquilibres majeurs sur le réseau, contraignant le dispatching à mobiliser en urgence des réserves thermiques fossiles et alourdissant les coûts d'exploitation.\n\nCe mémoire propose d'apporter une réponse méthodologique et opérationnelle à cette problématique en concevant un cadre d'apprentissage profond adapté au contexte climatique sénégalais. Il vise à produire des prévisions photovoltaïques de court terme à 72 heures, tout en intégrant une gestion explicite des incertitudes par des approches probabilistes (prévision par quantiles).",
        },
      ],
    },
    {
      type: 'section',
      title: 'Problématique',
      blocks: [
        {
          type: 'text',
          content:
            "La problématique centrale de ce travail s'articule autour de la question suivante :",
        },
        {
          type: 'callout',
          variant: 'formalisation',
          content:
            "*Comment concevoir un modèle d'apprentissage profond capable de prédire, avec précision et robustesse, la production électrique solaire à court terme à 72~h dans le contexte climatique sénégalais, tout en intégrant et en quantifiant l'incertitude inhérente à cette source renouvelable intermittente ?*",
        },
      ],
    },
    {
      type: 'section',
      title: 'Objectifs et contributions',
      blocks: [
        {
          type: 'text',
          content:
            "Pour répondre à la problématique posee, les contributions de ce travail s'articulent autour d'une démarche globale, allant de l'analyse physique jusqu'à la validation opérationnelle.\n\nDans un premier temps, ce mémoire s'attache à **caractériser la variabilité physique** de la production photovoltaïque au Sénégal, qu'il s'agisse des cycles astronomiques, des facteurs stochastiques liés aux nuages, à l'impact des aérosols de l'harmattan, de la température ou encore du *soiling*, afin de structurer ces éléments au sein d'un référentiel unifié de variables. Sur le plan méthodologique, le travail intègre les covariables futures issues des modèles de prévision numérique meteorologique (NWP) à l'ensemble des pipelines d'entraînement, d'évaluation et de test, tout en s'appuyant sur des méthodes avancées de sélection de *features* par approche d'union finale.\n\nL'effort de modélisation se concrétise ensuite par l'**évaluation comparative d'architectures de deep learning** dédiées aux séries temporelles, telles que les TCN à convolutions causales dilatées et les Temporal Fusion Transformers (TFT) à attention interprétable. Conçues pour la prévision multi-horizon à $72\\,\\text{h}$, ces architectures délivrent une sortie probabiliste par quantiles ($q_{0{,}1}$ à $q_{0{,}9}$), dont l'enveloppe est finement recalibrée à l'aide de la méthode CQR (*Conformal Quantile Regression*) pour garantir des intervalles de confiance robustes. Enfin, le pipeline complet est rigoureusement validé sur le cas d'étude de la centrale de Diass : de l'exploration des données et du *feature engineering* causal (garantissant l'absence de fuite d'information) jusqu'à l'évaluation face aux modèles de référence par persistance.",
        },
      ],
    },
    {
      type: 'section',
      title: 'Plan du mémoire',
      blocks: [
        {
          type: 'text',
          content:
            'Le présent mémoire est structuré en trois grandes parties progressives :',
        },
        {
          type: 'list',
          items: [
            "**La Partie I** pose le cadre physique et contextuel de l'étude. Elle aborde d'abord, au chapitre~1, la transition énergétique et la configuration des parcs, puis, au chapitre~2, la physique de la conversion photovoltaïque, l'analyse approfondie de la variabilité et le référentiel unifié des variables.",
            "**La Partie II** plonge au cœur de la méthodologie algorithmique. Elle pose les fondements de l'apprentissage supervisé (Chapitre~4), explore les modèles dédiés aux séries temporelles (Chapitre~5), détaille les architectures avancées, le TFT et le TCN (Chapitre~6), et explicite les stratégies de prévision multi-horizon et probabiliste (Chapitre~7).",
            '**La Partie III** concrétise ces travaux par la mise en œuvre pratique et l\'évaluation globale sur la centrale de Diass (Chapitre~8). Elle conclut en ouvrant sur les perspectives et les implications opérationnelles directes de ces outils pour le gestionnaire de réseau SENELEC.',
          ],
        },
      ],
    },
  ],
}
