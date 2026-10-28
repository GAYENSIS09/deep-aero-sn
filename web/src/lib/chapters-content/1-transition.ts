import type { ChapterData } from './index'

export const chapterContent: ChapterData = {
  slug: '1-transition',
  title: 'Cadre de la transition énergétique au Sénégal et présentation des sites',
  part: 'Partie I — Contexte physique et données',
  intro:
    "Ce chapitre décrit la transition énergétique au Sénégal : l'organisation de la SENELEC, l'évolution du mix électrique, la montée en puissance des sources renouvelables et le gisement solaire national, ainsi que les défis qu'elles posent à la prévision de production. Une place particulière est ensuite consacrée au site de Diass, première centrale solaire publique du pays, dont les choix techniques, l'environnement local et les paramètres physiques conditionnent les modèles de prévision.",
  sections: [
    {
      type: 'section',
      title: 'Contexte du secteur électrique sénégalais',
      blocks: [
        {
          type: 'text',
          content:
            "La Société nationale d'électricité du Sénégal (SENELEC) gère l'ensemble de la chaîne, de la production jusqu'à la distribution. Les chiffres clés de la période 2022--2025 permettent de mesurer la réalité du terrain sur lequel s'appuie la centrale photovoltaïque étudiée dans ce travail.",
        },
        {
          type: 'text',
          content: '**Puissances installées par source.**',
        },
        {
          type: 'figure',
          src: '/figures/ch1_puissances_senelec.png',
          caption:
            'Puissances installées SENELEC par source (MW), 2022--2025.',
          heightClass: 'h-80 md:h-96',
        },
        {
          type: 'text',
          content:
            "Le thermique reste le pilier central du mix énergétique avec près de 75~\\% de la capacité globale en 2025. Pour autant, le solaire trace sa route et progresse régulièrement, passant de 245~MW en 2022 à 292~MW en 2025, soit une augmentation de 19~\\%. De son côté, l'éolien ne bouge pas (porté par le parc de Taïba Ndiaye à 158,7~MW), tout comme l'hydraulique. Au total, la puissance installée globale bondit de 28~\\%, grimpant de 1~789 à 2~290~MW entre 2022 et 2025, une croissance essentiellement tirée par le thermique qui rajoute à lui seul 447~MW.",
        },
        {
          type: 'text',
          content: '**Production et achats.**',
        },
        {
          type: 'figure',
          src: '/figures/ch1_production_senelec.png',
          caption:
            "Production et achats d'énergie du réseau SENELEC (GWh), 2022--2025.",
          heightClass: 'h-80 md:h-96',
        },
        {
          type: 'text',
          content:
            "Côté volumes, l'énergie injectée sur le réseau interconnecté passe de 5~895 à 7~486~GWh, affichant une hausse de 27~\\% sur la même période. Ces évolutions traduisent une même réalité : la dépendance aux achats extérieurs s'accentue. Les achats auprès des producteurs indépendants pèsent 72~\\% du total en 2022 pour atteindre 76~\\% en 2025, tandis que la production en propre de la SENELEC stagne presque (+13~\\%). Les petites centrales régionales non interconnectées sont quant à elles devenues anecdotiques, avec environ 7~GWh par an depuis 2023. Le réseau dépend donc clairement de ces approvisionnements externes, dont une portion croissante provient du renouvelable. Plus récemment, en mai 2026, la production globale progresse de 7,7~\\% sur le mois et 8,6~\\% sur l'année, un dynamisme alimenté exclusivement par les achats (+10,6~\\% et +12,3~\\%), alors même que la production interne recule légèrement (-2,1~\\% et -3,5~\\%) (SENELEC, 2026).",
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
            "Le détail du mix énergétique et des volumes réels de 2022 (7~549~GWh produits au total selon l'ANSD et la SENELEC) confirme la domination du thermique fossile, qui fournit 77~\\% de la production, suivi du charbon (7,9~\\%), du solaire (7,9~\\%) et de l'éolien (5,2~\\%). Il ne faut pas confondre production effective (en GWh) et capacité installée (en MW) : les chiffres de 9~\\% pour l'éolien et de 15~\\% pour le solaire, souvent cités, désignent uniquement la puissance théorique installée, et non la production réelle, naturellement freinée par l'intermittence des flux naturels.",
        },
        {
          type: 'text',
          content:
            "Cette place prépondérante des achats d'énergie (76~\\% en 2025) couplée à un parc solaire de 292~MW met en lumière tout l'intérêt de la prévision. Mieux anticiper la ressource renouvelable permet d'ajuster l'appel au thermique et d'amortir les à-coups de production. Les énergies intermittentes imposent une instabilité structurelle quotidienne : le solaire suit une courbe nette (rien la nuit, un pic à midi, des chutes nettes au passage d'un nuage), tandis que le vent dicte sa loi à l'éolien. Sans prévision solide, les gestionnaires du dispatching doivent mobiliser en permanence des réserves thermiques.",
        },
        {
          type: 'text',
          content:
            "Le réseau interconnecté offre en outre une soupape de sécurité : la synchronisation avec les voisins maliens et guinéens via les organisations sous-régionales (OMVS, OMVG). Ces passerelles permettent des flux d'énergie croisés qui lissent en partie les déséquilibres locaux. Le pilotage de ce parc se heurte néanmoins à son hétérogénéité technologique : entre les panneaux polycristallins fixes de Ten Merina ou Diass (modules Jinko, Renesola), les modules bifaciaux de Kahone et les suiveurs solaires (trackers) de Sakal, aucun modèle de prévision unique ne convient. Chaque site exige une approche sur mesure, calée sur ses spécificités techniques.",
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
            "Au Sénégal, la filière a poussé à grande vitesse : de 2~MWc en 2007, le pays est monté à 113~MWc en 2017 pour atteindre 292,47~MWc connectés au réseau SENELEC en 2025 (Diouf, 2021 ; SENELEC, 2025). Les grandes centrales font désormais partie intégrante du paysage électrique. Ainsi, le réseau SENELEC a écoulé 6~218~GWh en 2025, soit 28~\\% de plus qu'en 2022 (4~863~GWh), une croissance soutenue par les achats d'énergie (5~687~GWh) face à une production propre de 1~792~GWh (SENELEC, 2025).",
        },
        {
          type: 'subsection',
          title: 'Défis de la production photovoltaïque',
          blocks: [
            {
              type: 'text',
              content:
                "L'utilité d'une prévision fine s'explique principalement par deux réalités de terrain. **Une écart entre théorie et l'environnement reel**, c'est a dire La production réelle d'un champ photovoltaïque est toujours inférieure aux prévisions nominales à cause de la température des cellules, des ombrages, de l'empoussièrement et de l'usure du matériel et d'autre facteurs de pertes d'energies (Ajzoul, s.d. ; Diouf, 2021). Mais aussi, **la volatilité de la ressource**. En effet la production subit de plein fouet les caprices de la météo a savoire les nuages, les variations saisonnières, donc des fluctuations que les modèles de prévision du chapitre~3 s'attachent à maîtriser.",
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
                'Inaugurée en novembre 2017 à Mérina Dakhar (région de Thiès, à 145~km au nord-est de Dakar), Ten Merina ouvre la marche des grandes centrales raccordées au réseau. Porté par Meridiam, Eiffage et le FONSIS (10~\\%), le site affiche 29,5~MWc. Sur ses 40 hectares, on compte 92~000 panneaux polycristallins Jinko de 320~Wp, couplés à 12 stations de conversion. Liée à la SENELEC par un contrat de 25 ans, elle produit environ 50~GWh chaque année.',
            },
            {
              type: 'text',
              content: "**D. Diass (23~MWc, centrale publique SENELEC, cas d'étude)**",
            },
            {
              type: 'text',
              content:
                "Mise en service le 22 mai 2022 à Diass (département de Mbour, à environ 40--50~km au sud-est de Dakar, près de l'aéroport Blaise Diagne), cette centrale de 23~MWc est la toute première centrale solaire publique du pays. Propriété de la SENELEC qui l'exploite en direct, elle a été financée par un prêt de 18 milliards de FCFA de la KfW allemande. Le site s'étale sur 40 hectares et regroupe 85~248 modules polycristallins sur structures fixes, épaulés par 36 onduleurs et 16 transformateurs. Elle injecte environ 34~GWh par an avec un performance ratio publié entre 64,7 et 75,8~\\%, pour une implantation vers 14,65°N et 17,10°O. C'est sur cette centrale que repose le cas d'étude de ce mémoire.",
            },
            {
              type: 'figure',
              src: '/figures/Central Solaire de Diass carte.png',
              caption: 'Localisation de la centrale solaire de Diass.',
              heightClass: 'h-96 md:h-[28rem]',
            },
            {
              type: 'text',
              content: '**E. Kahone (44~MWc, jumelle de Diass)**',
            },
            {
              type: 'text',
              content:
                "Mise en service en mai 2021 dans la région de Kaolack (à 200~km au sud-est de Dakar), Kahone est la sœur jumelle de Diass. Portée par le même consortium (Meridiam/ENGIE/FONSIS), elle s'est distinguée par un tarif record en Afrique subsaharienne de 3,80~c€/kWh sur un PPA de 25 ans. Répartie sur 36 hectares, elle est reliée au réseau via une liaison souterraine de 300~m et produit près de 80~GWh par an.",
            },
            {
              type: 'text',
              content: '**G. Sakal (20~MWc, première centrale à trackers)**',
            },
            {
              type: 'text',
              content:
                "Mise en service début 2018 dans la région de Louga, Sakal (20~MWc) a été entièrement développée par InnoVent pour 17 millions d'euros. Sa particularité réside dans son installation : ses 62~100 panneaux reposent sur 240 suiveurs solaires (trackers mono-axe) qui pivotent au rythme du soleil, connectés à 354 onduleurs Delta. Ce suivi dynamique optimise la production pour atteindre environ 41~800~MWh par an.",
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
                "Le gisement solaire national s'évalue à partir des données de la base NASA-SSE, moyennées sur 22 ans à travers 65 points d'observation répartis dans les 14 régions. Le rayonnement global horizontal y oscille entre 1~825 et 2~194~kWh/m²/an, avec une composante directe montant jusqu'à 2~325~kWh/m²/an et une composante diffuse comprise entre 613 et 686~kWh/m²/an, le tout baigné par près de 3~000 heures de soleil par an. Sur le plan géographique, la ressource reste homogène mais suit un léger gradient d'ouest en est : le littoral Dakar--Thiès affiche les valeurs maximales, proches de 2~190~kWh/m²/an, suivi de Saint-Louis avec environ 2~179, puis la région centrale autour de 2~160 et l'est avec environ 2~127~kWh/m²/an.",
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
                "En matière de potentiel exploitable, les surfaces disponibles représentent environ 42~613~km², soit 21~\\% du pays. En tablant sur l'utilisation de seulement 3~\\% de ces espaces (avec une densité de 50~MW/km², des modules monocristallins à 15,64~\\% de rendement et un ratio de performance de 75~\\%), le potentiel installable atteindrait près de 63~920~MW. Cet immense gisement se concentre massivement à l'intérieur des terres : Tambacounda arrive largement en tête avec environ 20~879~MW, suivie de Kédougou ($\\approx$ 12~359~MW) et de Saint-Louis ($\\approx$ 10~628~MW).",
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
