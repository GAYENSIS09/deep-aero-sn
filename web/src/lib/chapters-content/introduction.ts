import type { ChapterData } from './index'

export const chapterContent: ChapterData = {
  slug: 'introduction',
  title: 'Introduction générale',
  part: 'Introduction',
  intro:
    "Le secteur électrique sénégalais doit fournir une électricité fiable tout en intégrant davantage de renouvelables au réseau interconnecté de la SENELEC. Le pays s'y est engagé via le Partenariat pour une transition énergétique juste (JETP), signé le 22~juin 2023 avec la France, l'Allemagne, le Royaume-Uni, le Canada et l'Union européenne : d'ici 2030, les renouvelables doivent représenter 40~\\% de la capacité installée.",
  sections: [
    {
      type: 'section',
      title: 'Contexte et motivation',
      blocks: [
        {
          type: 'text',
          content:
            "Les parcs solaires de Ten Merina, Senergy, Santhiou Mékhé, Diass, Kahone, Malicounda et Sakal, plus l'éolien de Taïba N'Diaye (chapitre~1), ont levé une partie du verrou infrastructurel : la prévision de la production devient l'enjeu. Le climat sahélien la rend intermittente : saisons sèches et humides alternées, passages nuageux, harmattan de novembre à février, hivernage de juillet à septembre. Chaque erreur de prévision se traduit par des déséquilibres sur le réseau et par un appel aux réserves thermiques.\n\nCe travail construit un cadre d'apprentissage profond adapté au climat sénégalais : il produit des prévisions photovoltaïques à 72~heures et en quantifie l'incertitude.",
        },
      ],
    },
    {
      type: 'section',
      title: 'Problématique',
      blocks: [
        {
          type: 'text',
          content: "Le mémoire part donc d'une question centrale :",
        },
        {
          type: 'callout',
          variant: 'formalisation',
          content:
            "*Comment modéliser par apprentissage profond et quantifier l'incertitude de la production photovoltaïque à 72 heures pour sécuriser le pilotage du réseau électrique au Sénégal ?*",
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
            "Pour y répondre, le mémoire s'organise autour de trois objectifs complémentaires.\n\nLe premier consiste à construire un **référentiel unifié des variables** adapté à la centrale de Diass : il relie les grandeurs issues de la physique photovoltaïque aux spécificités météorologiques et climatiques du contexte sahélien, notamment l'harmattan, l'empoussièrement et l'hivernage. Ce référentiel est ensuite enrichi des covariables futures issues des modèles de prévision numérique du temps (NWP), avec une sélection par union conçue pour limiter les risques de fuite d'information.\n\nLe deuxième objectif est de **concevoir et comparer deux architectures d'apprentissage profond pour la prévision de séries temporelles longues** : le Temporal Convolutional Network (TCN) et le Temporal Fusion Transformer (TFT). Les deux modèles opèrent en prévision multi-horizon à 72~heures et produisent des intervalles quantiles qui représentent l'incertitude ; ces sorties sont ensuite recalibrées par la conformalized quantile regression (CQR).\n\nLe troisième objectif est **d'évaluer ces approches sur les données réelles de la centrale de Diass** et d'analyser la portée des résultats pour la prévision et la gestion de la production photovoltaïque par la SENELEC.\n\nCes trois objectifs forment une progression : construire le référentiel de données, puis modéliser et quantifier l'incertitude, enfin évaluer les résultats et en dégager la portée opérationnelle.",
        },
      ],
    },
    {
      type: 'section',
      title: 'Plan du mémoire',
      blocks: [
        {
          type: 'text',
          content: "Le mémoire s'organise en trois parties, du cadre physique à la modélisation, puis à l'évaluation expérimentale :",
        },
        {
          type: 'list',
          items: [
            "**La Partie I — Potentiel solaire et technologie photovoltaïque** présente le contexte énergétique sénégalais et les principales centrales solaires. Elle introduit ensuite les principes physiques de la conversion photovoltaïque, les sources de variabilité de la production et le référentiel unifié des variables retenu pour la centrale de Diass.",
            "**La Partie II — Architectures d'apprentissage profond** établit le cadre méthodologique. Elle rappelle les fondements de l'apprentissage supervisé et de la régularisation, présente les principaux modèles utilisés pour les séries temporelles, puis détaille les architectures TCN et TFT. Elle se termine par la stratégie de prévision multi-horizon et l'approche probabiliste par quantiles, avec son recalibrage par CQR.",
            "**La Partie III — Modélisation de la prévision photovoltaïque** met en œuvre la méthodologie sur les données de la centrale de Diass. Elle présente le site et les jeux de données, décrit la mise en œuvre expérimentale, puis analyse les performances obtenues et leurs implications pour la prévision de la production photovoltaïque.",
          ],
        },
      ],
    },
  ],
}
