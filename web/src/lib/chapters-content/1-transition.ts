import type { ChapterData } from './index'

export const chapterContent: ChapterData = {
  slug: '1-transition',
  title: 'Cadre de la transition énergétique au Sénégal et présentation des sites',
  part: 'Partie I — Contexte physique et données',
  intro:
    "Ce chapitre pose le cadre du cas d'étude : le mix électrique sénégalais, la montée en puissance du renouvelable et le gisement solaire national. La dernière section revient sur Diass, première centrale solaire publique du pays, dont les choix techniques conditionnent les modèles de prévision.",
  sections: [
    {
      type: 'section',
      title: 'Mix énergétique sénégalais',
      blocks: [
        {
          type: 'text',
          content:
            "La SENELEC pilote toute la chaîne électrique, de la production à la distribution. Les chiffres clés qu'elle publie pour 2022--2025 cadrent le cas d'étude.",
        },
        {
          type: 'text',
          content: '**Puissances installées par source.**',
        },
        {
          type: 'figure',
          src: '/figures/ch1_puissances_senelec.png',
          caption:
            'Puissances installées par source, 2022--2025.',
          heightClass: 'h-80 md:h-96',
        },
        {
          type: 'text',
          content:
            "Le thermique domine encore le mix. En 2025, il pèse 1~711,14~MW, contre 1~264,30~MW en 2022 : à lui seul, il ajoute 447~MW au parc. La capacité totale atteint 2~289,52~MW, dont 74,7~\\% de thermique, avec une trajectoire en zigzag~: 1~789,00~MW en 2022, 1~960,14~MW en 2023, un repli à 1~903,81~MW en 2024, puis une reprise en 2025 (SENELEC, 2025). Le solaire, lui, progresse de 245~MW en 2022 à 292,47~MW en 2025, soit +19,4~\\%. L'éolien ne bouge pas : le parc de Taïba Ndiaye compte 158,7~MW, l'hydraulique restant à 127~MW.",
        },
        {
          type: 'text',
          content: '**Production et achats.**',
        },
        {
          type: 'figure',
          src: '/figures/ch1_production_senelec.png',
          caption:
            "Production et achats d'énergie, 2022--2025.",
          heightClass: 'h-80 md:h-96',
        },
        {
          type: 'text',
          content:
            "La production brute totale (production propre plus achats) atteint 7~486,3~GWh en 2025, soit 26,7~\\% de plus que les 5~908,3~GWh de 2022. (La somme des composantes publiées pour 2022 ne vaut que 5~894,2~GWh, soit environ 14~GWh de moins que le total annoncé ; la source ne détaille pas l'écart.) La croissance vient surtout des achats : 5~687,1~GWh en 2025 contre 4~238,7~GWh en 2022, soit 76,0~\\% du total publié contre 71,7~\\% en 2022. La production propre du réseau interconnecté, elle, ne crû que de 12,8~\\%, passant de 1~589,5 à 1~792,4~GWh, et les centrales régionales sont devenues marginales : environ 7~GWh par an depuis 2023 (SENELEC, 2025).\n\nLes ventes, elles, atteignent 6~218,13~GWh en 2025 contre 4~862,58~GWh en 2022, soit +27,9~\\%. Production brute et ventes ne se recouvrent pas : la première compte l'énergie produite ou achetée, la seconde l'énergie livrée aux clients, export compris. L'écart en 2025, environ 1~268~GWh, correspond pour l'essentiel aux pertes du réseau.\n\nEn mai 2026, la production globale progresse de 7,7~\\% sur le mois et de 8,6~\\% sur l'année, mais toute la hausse vient des achats (+10,6~\\% et +12,3~\\% respectivement), tandis que la production interne recule de 2,1~\\% sur le mois et de 3,5~\\% sur l'année (SENELEC, 2026).",
        },
      ],
    },
    {
      type: 'section',
      title: 'Analyse et constats sur la prévision',
      blocks: [
        {
          type: 'text',
          content:
            "En 2023, la production brute d’électricité s’établit à 6~654,02~GWh, dont les renouvelables assurent 19,48~\\%. Dans la capacité installée, leur poids est plus élevé : 27,35~\\%, répartis en 13,62~\\% de solaire, 8,10~\\% d’éolien et 6,17~\\% d’hydraulique, pour 72,11~\\% de thermique (Ministère de l’Énergie, du Pétrole et des Mines, 2026). (Le site du ministère annonce aussi 27,89~\\% de renouvelables en capacité, onglet « Transition énergétique » ; nous retenons 27,35~\\%.) L’écart capacité/production vient de l’intermittence : les flux naturels ne sont pas continus. L’AIE rapporte pour 2022 245~MW de solaire, soit 14~\\% de la capacité, et 159~MW d’éolien, soit 9~\\% (AIE, 2024).",
        },
        {
          type: 'text',
          content:
            "Les achats couvrent les trois quarts de l'énergie acheminée : la SENELEC ne pilote donc pas la majeure partie de ce qui circule sur son réseau. À cela s'ajoute un parc solaire de 292,47~MW en 2025, variable par nature. La prévision sert alors à ajuster l'appel au thermique et à amortir ces à-coups. Sans prévision fiable, le dispatching maintient les réserves thermiques en permanence.",
        },
        {
          type: 'text',
          content:
            "Le réseau est synchronisé avec le Mali et la Guinée via l'OMVS et l'OMVG ; ces flux croisés lissent en partie les déséquilibres locaux. Le parc, lui, reste très hétérogène : panneaux fixes à Ten Merina et à Diass (modules Jinko et Renesola), bifaciaux à Kahone, suiveurs solaires motorisés à Sakal. Aucun modèle unique ne peut convenir à tous les sites : chacun exige un calage sur ses spécificités techniques.",
        },
      ],
    },
    {
      type: 'section',
      title: "Défis de la production et potentiel photovoltaïque",
      blocks: [
        {
          type: 'text',
          content:
            "À l'origine de la plupart des énergies propres, le rayonnement solaire se convertit directement en électricité, par effet photovoltaïque, dans des matériaux semi-conducteurs (Ajzoul, s.d.).",
        },
        {
          type: 'text',
          content:
            "Le déploiement industriel du solaire est récent : l'AIE date les premières installations sénégalaises de 2017 (AIE, 2024). La capacité raccordée n'a depuis cessé de croître : 245~MW en 2022, 267~MW en 2023, 268,07~MW en 2024, puis 292,47~MW en 2025 (SENELEC, 2025). Ces centrales sont pour l'essentiel des producteurs indépendants sous contrat d'achat : Senergy, Ten Merina, Sakal, Kahone, Santhiou Mékhé et Malicounda ; Diass reste la seule centrale publique.\n\nLe même déséquilibre se lit dans les ventes : 6~218,13~GWh écoulés en 2025, dont 5~687,1~GWh d'achats contre seulement 1~792,4~GWh produits en propre. Les trois quarts de l'énergie qui transitent sur le réseau viennent donc de producteurs tiers. La SENELEC ne maîtrise pas ce qui passe sur son propre réseau : d'où le rôle décisif de la prévision, qui réduit le recours aux réserves thermiques et aux achats de complément.",
        },
        {
          type: 'subsection',
          title: 'Défis de la production photovoltaïque',
          blocks: [
            {
              type: 'text',
              content:
                "Deux réalités de terrain justifient une prévision fine. D'abord, la production réelle d'un champ photovoltaïque reste inférieure aux prévisions nominales : température des cellules, ombrages, empoussièrement, usure du matériel et autres pertes en sont la cause (Ajzoul, s.d.). Ensuite, la ressource est volatile : nuages et variations saisonnières imposent des fluctuations que les modèles du chapitre~3 cherchent à maîtriser.",
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Présentation des principales centrales solaires du Sénégal',
          blocks: [
            {
              type: 'text',
              content: '**A. Ten Merina (29,5~MWc, première centrale solaire du Sénégal)**',
            },
            {
              type: 'text',
              content:
                'Première centrale solaire raccordée au réseau, Ten Merina a été inaugurée en novembre 2017 à Mérina Dakhar, dans la région de Thiès, à 145~km au nord-est de Dakar. Meridiam et Eiffage portent le projet, rejoint par le FONSIS à hauteur de 10~\\%. Le site affiche 29,5~MWc : 92~000 panneaux polycristallins Jinko de 320~Wp couplés à 12 stations de conversion. Lié à la SENELEC par un contrat de 25 ans, il produit environ 50~GWh chaque année.',
            },
            {
              type: 'text',
              content: "**D. Diass (23~MWc, centrale publique SENELEC, cas d'étude)**",
            },
            {
              type: 'text',
              content:
                "Mise en service le 22 mai 2022 à Diass, dans le département de Mbour, la centrale se trouve à environ 40--50~km au sud-est de Dakar, près de l'aéroport Blaise Diagne. Elle est la première centrale solaire publique du pays : propriété de la SENELEC, qui l'exploite en direct, elle a été financée par un prêt de 18 milliards de FCFA de la KfW allemande. Le site couvre 40 hectares et regroupe 85~248 modules polycristallins sur structures fixes, épaulés par 36 onduleurs et 16 transformateurs. Il injecte environ 34~GWh par an, pour un performance ratio publié entre 64,7 et 75,8~\\%, et se situe vers 14,65°N et 17,10°O. C'est sur cette centrale que repose le cas d'étude du mémoire.",
            },
            {
              type: 'figure',
              src: '/figures/Central Solaire de Diass carte.png',
              caption: 'Localisation de la centrale solaire de Diass.',
              heightClass: 'h-96 md:h-[28rem]',
            },
            {
              type: 'text',
              content: '**E. Kahone (44~MWc, développée par un IPP)**',
            },
            {
              type: 'text',
              content:
                "Mise en service en mai 2021 dans la région de Kaolack, à environ 200~km au sud-est de Dakar, Kahone appartient au consortium Meridiam/ENGIE/FONSIS. La centrale a décroché un tarif record en Afrique subsaharienne : 3,80 centimes d'euro par kWh sur un PPA de 25 ans. Elle s'étend sur 36 hectares, reliée au réseau par une liaison souterraine de 300~m, et produit près de 80~GWh par an.",
            },
            {
              type: 'text',
              content: '**G. Sakal (20~MWc, première centrale à trackers)**',
            },
            {
              type: 'text',
              content:
                "Mise en service en 2018 dans la région de Louga, Sakal a été développée en entier par InnoVent pour 17 millions d'euros. Cette centrale de 20~MWc tient son originalité de son installation : ses 62~100 panneaux reposent sur 240 suiveurs solaires mono-axe, qui pivotent au rythme du soleil, raccordés à 354 onduleurs Delta. Ce suivi dynamique optimise la production, qui atteint environ 41~800~MWh par an.",
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Potentiel solaire du Sénégal',
          blocks: [
            {
              type: 'text',
              content:
                "Le gisement national s'appuie sur la base NASA-SSE : 22 ans de moyennes, 65 points de mesure répartis dans les 14 régions. Le rayonnement global horizontal y oscille entre 1~825 et 2~194~kWh/m²/an, la composante directe montant jusqu'à 2~325~kWh/m²/an et la composante diffuse se tenant entre 613 et 686~kWh/m²/an. On compte près de 3~000 heures d'ensoleillement par an.\n\nLa ressource varie peu d'une région à l'autre : un léger gradient d'ouest en est. Le littoral Dakar--Thiès affiche les valeurs maximales, proches de 2~190~kWh/m²/an ; Saint-Louis suit avec environ 2~179, la région centrale avec 2~160 et l'est avec environ 2~127~kWh/m²/an.",
            },
            {
              type: 'text',
              content: '**Cartes du gisement solaire (GHI, DNI, DHI).**',
            },
            {
              type: 'figure',
              src: '/figures/ghi_senegal.png',
              caption:
                'Gisement solaire du Sénégal : cartes des trois composantes du rayonnement (Global Solar Atlas, n.d.). Irradiance globale horizontale.',
              heightClass: 'h-72 md:h-80',
            },
            {
              type: 'figure',
              src: '/figures/dni_senegal.png',
              caption: 'Irradiance directe normale.',
              heightClass: 'h-72 md:h-80',
            },
            {
              type: 'figure',
              src: '/figures/dhi_senegal.png',
              caption: 'Irradiance diffuse horizontale.',
              heightClass: 'h-72 md:h-80',
            },
            {
              type: 'text',
              content:
                "Les surfaces disponibles représentent environ 42~613~km², soit 21~\\% du pays. En n'en exploitant que 3~\\%, avec une densité de 50~MW/km², des modules monocristallins à 15,64~\\% de rendement et un ratio de performance de 75~\\%, on atteindrait près de 63~920~MW de potentiel installable. Ce gisement se concentre à l'intérieur des terres : Tambacounda domine avec environ 20~879~MW, devant Kédougou, autour de 12~359~MW, et Saint-Louis, autour de 10~628~MW.",
            },
            {
              type: 'figure',
              src: '/figures/ch1_potentiel_solaire_region.png',
              caption:
                'Rayonnement solaire et potentiel photovoltaïque par région (adapté de Diaw, 2017).',
              heightClass: 'h-[26rem] md:h-[32rem]',
            },
            {
              type: 'text',
              content:
                "Ce potentiel est toutefois très mal réparti : à elles seules, trois régions concentrent près de 31~682~MW, soit la moitié du total national. L'est et le nord détiennent la quasi-totalité des réserves, quand des zones comme Dakar ($\\approx$ 50~MW) ou Diourbel ($\\approx$ 1~MW) manquent de foncier. Ce décalage entre les zones de production massive et les grands pôles de consommation côtiers fait tout le défi du transport d'électricité à l'échelle nationale.",
            },
          ],
        },
      ],
    },
    {
      type: 'section',
      title: 'Conclusion',
      blocks: [
        {
          type: 'text',
          content:
            "Le thermique domine toujours le mix : en 2025, il pèse 1 711,14~MW sur 2 289,52~MW installés, et le solaire atteint 292,47~MW, soit 12,8~\\% du total. La production brute totale passe de 5 908,3 à 7 486,3~GWh, en hausse de 26,7~\\%. Cette croissance repose à 76,0~\\% sur les achats aux producteurs indépendants, contre 71,7~\\% en 2022, tandis que la production propre du réseau interconnecté n'augmente que de 12,8~\\%. L'exploitant dépend donc de plus en plus d'une production qu'il ne pilote pas.\n\nEn 2023, les renouvelables représentent 27,35~\\% de la capacité, pour seulement 19,48~\\% de la production brute : la prévision sert alors à ajuster l'appel au thermique et les réserves. Les centrales de Ten Merina, Diass, Kahone et Sakal n'ont pas les mêmes configurations : modules fixes ici, bifaciaux ou suiveurs ailleurs. Aucun modèle unique n'est transposable d'un site à l'autre.\n\nLe gisement national, estimé entre 1 825 et 2 194~kWh/m²/an, représente près de 63 920~MW de potentiel, mais il se concentre à l'est et au nord, loin des zones de consommation. Diass, première centrale solaire publique du pays, fournit des données d'exploitation suffisantes pour servir de cas d'étude à la suite du mémoire.",
        },
      ],
    },
  ],
}
