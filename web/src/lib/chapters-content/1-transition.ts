import type { ChapterData } from './index'

export const chapterContent: ChapterData = {
  slug: '1-transition',
  title: 'Cadre de la transition énergétique au Sénégal et présentation des sites',
  part: 'Partie I — Contexte physique et données',
  intro:
    "Ce chapitre présente le cadre énergétique du cas d'étude : le mix électrique sénégalais, la montée en puissance du renouvelable et le gisement solaire national. La dernière section est consacrée au site de Diass, première centrale solaire publique du pays, dont les choix techniques conditionnent les modèles de prévision.",
  sections: [
    {
      type: 'section',
      title: 'Contexte du secteur électrique sénégalais',
      blocks: [
        {
          type: 'text',
          content:
            "La SENELEC gère toute la chaîne électrique, de la production à la distribution. Les chiffres clés publiés pour 2022--2025 donnent le contexte du cas d'étude.",
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
            "Le thermique domine encore le mix. En 2025, il représente 1~711,14~MW en place, contre 1~264,30~MW en 2022. À lui seul, il a ajouté 447~MW au parc sur la période. La capacité totale en atteint 2~289,52~MW, soit 74,7~\\% de parts thermiques. La trajectoire suit des zigzags~: 1~789,00~MW en 2022, 1~960,14~MW en 2023, un repli à 1~903,81~MW en 2024, puis une reprise en 2025 (SENELEC, 2025). Le solaire progresse de 245~MW en 2022 à 292,47~MW en 2025, soit +19,4~\\%. L'éolien ne bouge pas ; le parc de Taïba Ndiaye compte 158,7~MW. L'hydraulique reste à 127~MW.",
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
            "La production brute totale, production propre plus achats, atteint 7~486,3~GWh en 2025. C'est 26,7~\\% de plus que les 5~908,3~GWh de 2022. (La somme des composantes publiées pour 2022 donne 5~894,2~GWh, soit environ 14~GWh de moins que le total publié par la SENELEC ; la source ne détaille pas l'écart.) La croissance vient surtout des achats. Ils pèsent 5~687,1~GWh en 2025, contre 4~238,7~GWh en 2022. En parts, cela représente 76,0~\\% du total publié en 2025, contre 71,7~\\% en 2022. La production propre du réseau interconnecté n'a crû que de 12,8~\\%, passant de 1~589,5 à 1~792,4~GWh. Les centrales régionales sont devenues marginales. Elles livrent environ 7~GWh par an depuis 2023 (SENELEC, 2025). La SENELEC a vendu 6~218,13~GWh d'électricité à ses clients en 2025, contre 4~862,58~GWh en 2022, soit +27,9~\\%. Production brute et ventes ne se recouvrent pas. La production compte l'énergie brute, produite ou achetée. Les ventes comptent l'énergie livrée aux clients, export compris. L'écart en 2025, environ 1~268~GWh, correspond pour l'essentiel aux pertes du réseau. En mai 2026, la production globale progresse de 7,7~\\% sur le mois et de 8,6~\\% sur l'année. Toute la hausse vient des achats, en progression de 10,6~\\% et de 12,3~\\% respectivement, tandis que la production interne recule de 2,1~\\% sur le mois et de 3,5~\\% sur l'année (SENELEC, 2026).",
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
            "En 2023, la production brute d’électricité s’établit à 6~654,02~GWh. Les renouvelables comptent pour 19,48~\\% de ce volume. Elles pèsent davantage dans la capacité installée, où elles représentent 27,35~\\%, avec 13,62~\\% de solaire, 8,10~\\% d’éolien et 6,17~\\% d’hydraulique, tandis que le thermique occupe les 72,11~\\% restants (Ministère de l’Énergie, du Pétrole et des Mines, 2026). (Le site du ministère donne aussi 27,89~\\% pour les renouvelables en capacité, onglet « Transition énergétique » ; nous reprenons 27,35~\\%.) Les renouvelables pèsent donc plus dans la capacité que dans la production. C’est l’effet de l’intermittence : les flux naturels ne sont pas continus. L’AIE rapporte pour 2022, 245~MW de solaire, soit 14~\\% de la capacité, et 159~MW d’éolien, soit 9~\\% (AIE, 2024).",
        },
        {
          type: 'text',
          content:
            "Les achats fournissent les trois quarts de l'énergie acheminée. La SENELEC n'en pilote donc pas la plus grande partie. À cela s'ajoute un parc solaire de 292,47~MW en 2025, variable par nature. La prévision sert à ajuster l'appel au thermique et à amortir ces à-coups. Sans prévision solide, le dispatching mobilise des réserves thermiques en permanence.",
        },
        {
          type: 'text',
          content:
            "Le réseau est synchronisé avec le Mali et la Guinée, via l'OMVS et l'OMVG. Les flux croisés lissent en partie les déséquilibres locaux. Le parc, lui, est très hétérogène. Les panneaux sont fixes à Ten Merina et à Diass, avec des modules Jinko et Renesola. À Kahone, les modules sont bifaciaux ; à Sakal, les structures sont motorisées par des suiveurs solaires. Aucun modèle unique ne peut convenir à la fois. Chaque site exige un calage sur ses spécificités techniques.",
        },
      ],
    },
    {
      type: 'section',
      title: "Contexte de l'énergie solaire",
      blocks: [
        {
          type: 'text',
          content:
            "À l'origine de la plupart des énergies propres, le rayonnement solaire est converti directement en électricité par effet photovoltaïque dans des matériaux semi-conducteurs (Ajzoul, s.d.).",
        },
        {
          type: 'text',
          content:
            "Le développement à l'échelle industrielle est récent. L'AIE date la mise en service des premières installations solaires sénégalaises de 2017 (AIE, 2024). Depuis, la capacité raccordée a augmenté chaque année. De 245~MW en 2022, elle est passée à 267~MW en 2023, puis 268,07~MW en 2024 et 292,47~MW en 2025 (SENELEC, 2025). Ces centrales sont pour la plupart des producteurs indépendants sous contrat d'achat, notamment Senergy, Ten Merina, Sakal, Kahone, Santhiou Mékhé et Malicounda. Diass reste la seule centrale publique. Les ventes atteignent 6~218,13~GWh en 2025. Elles sont soutenues par des achats de 5~687,1~GWh plus que par les 1~792,4~GWh produits en propre. Les trois quarts de l'énergie acheminée sont donc achetés, non produits. La SENELEC ne maîtrise pas la majorité de ce qui transite sur son réseau. C'est là que la prévision devient décisive. Anticiper la ressource intermittente réduit le recours aux réserves thermiques et aux achats de complément.",
        },
        {
          type: 'subsection',
          title: 'Défis de la production photovoltaïque',
          blocks: [
            {
              type: 'text',
              content:
                "Une prévision fine se justifie par deux réalités de terrain. D'abord, la production réelle d'un champ photovoltaïque reste inférieure aux prévisions nominales. La température des cellules, les ombrages, l'empoussièrement, l'usure du matériel et d'autres pertes en sont la cause (Ajzoul, s.d.). Ensuite, la ressource est volatile. Nuages et variations saisonnières imposent des fluctuations que les modèles du chapitre~3 cherchent à maîtriser.",
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
                'La première centrale solaire raccordée au réseau, Ten Merina, a été inaugurée en novembre 2017 à Mérina Dakhar, dans la région de Thiès, à 145~km au nord-est de Dakar. Le projet est porté par Meridiam et Eiffage, rejoints par le FONSIS à hauteur de 10~\\%. Le site affiche 29,5~MWc pour 92~000 panneaux polycristallins Jinko de 320~Wp, couplés à 12 stations de conversion. Lié à la SENELEC par un contrat de 25 ans, il produit environ 50~GWh chaque année.',
            },
            {
              type: 'text',
              content: "**D. Diass (23~MWc, centrale publique SENELEC, cas d'étude)**",
            },
            {
              type: 'text',
              content:
                "La centrale de Diass a été mise en service le 22 mai 2022 à Diass, dans le département de Mbour, à environ 40--50~km au sud-est de Dakar, près de l'aéroport Blaise Diagne. C'est la première centrale solaire publique du pays. Propriété de la SENELEC, qui l'exploite en direct, elle a été financée par un prêt de 18 milliards de FCFA de la KfW allemande. Le site couvre 40 hectares. Il regroupe 85~248 modules polycristallins sur structures fixes, épaulés par 36 onduleurs et 16 transformateurs. Elle injecte environ 34~GWh par an, avec un performance ratio publié qui varie entre 64,7 et 75,8~\\%. La centrale est implantée vers 14,65°N et 17,10°O. C'est sur cette centrale que repose le cas d'étude de ce mémoire.",
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
                "Kahone a été mise en service en mai 2021 dans la région de Kaolack, à environ 200~km au sud-est de Dakar. La centrale est portée par le consortium Meridiam/ENGIE/FONSIS. Elle s'est distinguée par un tarif record en Afrique subsaharienne, à 3,80 centimes d'euro par kWh sur un PPA de 25 ans. Elle est répartie sur 36 hectares et reliée au réseau par une liaison souterraine de 300~m. Elle produit près de 80~GWh par an.",
            },
            {
              type: 'text',
              content: '**G. Sakal (20~MWc, première centrale à trackers)**',
            },
            {
              type: 'text',
              content:
                "Sakal a été mise en service en 2018 dans la région de Louga. Développée en entier par InnoVent pour 17 millions d'euros, cette centrale de 20~MWc tient son originalité de son installation. Ses 62~100 panneaux reposent sur 240 suiveurs solaires mono-axe, qui pivotent au rythme du soleil, connectés à 354 onduleurs Delta. Le suivi dynamique optimise la production, qui atteint environ 41~800~MWh par an.",
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
                "Le gisement solaire national s'évalue à partir des données de la base NASA-SSE, moyennées sur 22 ans et 65 points d'observation répartis dans les 14 régions. Le rayonnement global horizontal y oscille entre 1~825 et 2~194~kWh/m²/an. La composante directe monte jusqu'à 2~325~kWh/m²/an ; la composante diffuse se situe entre 613 et 686~kWh/m²/an. On compte près de 3~000 heures d'ensoleillement par an. Sur le plan géographique, la ressource varie peu d'une région à l'autre, avec un léger gradient d'ouest en est. Le littoral Dakar--Thiès affiche les valeurs maximales, proches de 2~190~kWh/m²/an. Saint-Louis suit avec environ 2~179, puis la région centrale autour de 2~160 et l'est avec environ 2~127~kWh/m²/an.",
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
                "Les surfaces disponibles représentent environ 42~613~km², soit 21~\\% du pays. Si l'on exploitait seulement 3~\\% de ces espaces, avec une densité de 50~MW/km², des modules monocristallins à 15,64~\\% de rendement et un ratio de performance de 75~\\%, le potentiel installable atteindrait près de 63~920~MW. Le gisement se concentre à l'intérieur des terres. Tambacounda arrive largement en tête avec environ 20~879~MW, suivie de Kédougou, autour de 12~359~MW, et de Saint-Louis, autour de 10~628~MW.",
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
                "Ce potentiel est toutefois très mal réparti : à elles seules, trois régions concentrent près de 31~682~MW, soit la moitié du total national. L'est et le nord détiennent la quasi-totalité des réserves, tandis que des zones comme Dakar ($\\approx$ 50~MW) ou Diourbel ($\\approx$ 1~MW) disposent d'un foncier très restreint. Ce décalage géographique entre les zones de production massive et les grands pôles de consommation côtiers confirme tout le défi du transport de l'électricité à l'échelle nationale.",
            },
          ],
        },
      ],
    },
  ],
}
