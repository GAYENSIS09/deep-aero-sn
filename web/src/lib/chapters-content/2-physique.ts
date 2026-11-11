import type { ChapterData } from './index'

export const chapterContent: ChapterData = {
  slug: '2-physique',
  title: 'Physique et technologie photovoltaïque',
  part: 'Partie I — Contexte physique et données',
  intro:
    "Ce chapitre décrit la chaîne physique de la production photovoltaïque : du rayonnement solaire jusqu'au comportement de la cellule semi-conductrice. Chaque maillon y expose les grandeurs clés qu'un modèle de prévision doit capturer.",
  sections: [
    {
      type: 'section',
      title: 'Physique du rayonnement solaire',
      blocks: [
        {
          type: 'subsection',
          title: 'Structure et fonctionnement du Soleil',
          blocks: [
            {
              type: 'text',
              content:
                "Le Soleil est une étoile d'environ **1~400~000~km de diamètre**. Des réactions de **fusion d'hydrogène en hélium** y libèrent des quantités colossales d'énergie (Ajzoul, s.d.). Seule une infime fraction de ce flux atteint la Terre, sous forme de rayonnement électromagnétique.",
            },
            {
              type: 'text',
              content:
                "La puissance qu'un corps incandescent émet suit la **loi de Stefan--Boltzmann**~:",
            },
            {
              type: 'math',
              display: true,
              tex: "P_{\\text{d\\'egag\\'ee}} = S \\cdot \\sigma \\cdot T^4",
            },
            {
              type: 'text',
              content:
                "où $S$ est la surface de l'astre, $\\sigma$ la constante de Stefan--Boltzmann et $T$ sa température de surface. Le terme $T^4$ domine le calcul : de légères variations de température influencent fortement l'énergie émise par l'étoile.",
            },
            {
              type: 'text',
              content:
                "Hors atmosphère, le spectre de référence est **AM0** (Air Mass 0) : son irradiance extraterrestre vaut environ **1~367~W/m²**. Au sol, la convention **AM1,5** décrit le rayonnement après traversée d'une masse d'air standard ; la puissance incidente de référence y est de **1~000~W/m²** (Ajzoul, s.d. ; Toumi, 2021).",
            },
            {
              type: 'figure',
              src: '/figures/fig_ch2_spectre_am0_am15.png',
              caption:
                'Spectre électromagnétique solaire~: AM0 (extraterrestre) et AM1,5 (convention standard).',
              heightClass: 'h-80 md:h-96',
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Géométrie solaire et orientation du panneau',
          blocks: [
            {
              type: 'text',
              content:
                "L'énergie qu'un panneau intercepte dépend de la position apparente du Soleil, elle-même fixée par la latitude du site, la date et l'heure. Tous les angles se lisent dans le repère local $(x, y, z)$ : $x$ vers l'est, $y$ vers le nord, $z$ vers le zénith. L'azimut se compte depuis le nord, positif vers l'est ($0^\\circ$~=~nord, $90^\\circ$~=~est, $180^\\circ$~=~sud, $270^\\circ$~=~ouest).",
            },
            {
              type: 'text',
              content:
                "La trajectoire du Soleil se déduit de la latitude $\\varphi$ du site ($\\varphi = 14{,}65^\\circ$~N à Diass) et du jour de l'année $N$. La **déclinaison solaire** $\\delta$ — la latitude du point subsolaire — se calcule par la formule de Cooper~:",
            },
            {
              type: 'math',
              display: true,
              tex: '\\delta = 23{,}45^\\circ \\cdot \\sin\\!\\left(\\frac{360^\\circ}{365}\\,(N - 81)\\right).',
            },
            {
              type: 'text',
              content:
                "Elle varie de $-23{,}45^\\circ$ à $+23{,}45^\\circ$ au fil des saisons. Le module `SolarPhysicalEngineer` du pipeline reprend ce calcul tel quel.",
            },
            {
              type: 'text',
              content:
                "Pour aligner l'heure civile sur la course réelle du Soleil, l'**équation du temps** $E_q$ (en minutes) corrige l'excentricité de l'orbite terrestre~:",
            },
            {
              type: 'math',
              display: true,
              tex: 'E_q = 9{,}87\\,\\sin(2b) - 7{,}53\\,\\cos b - 1{,}5\\,\\sin b, \\qquad b = \\frac{360^\\circ}{365}\\,(N - 81).',
            },
            {
              type: 'text',
              content:
                "Le temps solaire local $t_{sl}$ s'en déduit ; il donne l'**angle horaire** $\\omega = 15^\\circ \\cdot (t_{sl} - 12)$, nul à midi solaire.",
            },
            {
              type: 'text',
              content:
                "La hauteur solaire $\\alpha_s$ et l'azimut $A_s$ se déduisent des coordonnées précédentes. Un panneau se caractérise par son inclinaison $\\beta$ et son azimut $A_p$ ; à Diass, la structure fixe vaut $\\beta = 15^\\circ$ et $A_p = 180^\\circ$. L'**angle d'incidence** $\\theta_i$ entre les rayons solaires et la normale du panneau $\\mathbf{n}$ s'écrit comme un produit scalaire, $\\cos\\theta_i = \\mathbf{n}\\cdot\\mathbf{s}$~:",
            },
            {
              type: 'math',
              display: true,
              tex: '\\cos\\theta_i = \\sin\\beta\\cos\\alpha_s\\cos(A_p-A_s) + \\cos\\beta\\sin\\alpha_s.',
            },
            {
              type: 'text',
              content:
                "Cette relation fixe l'apport direct sur le module~: $G_{\\text{dir,POA}} = G_{\\text{dir}}\\cos\\theta_i$. Les trackers solaires l'exploitent : ils réorientent en continu le panneau pour maintenir $\\cos\\theta_i \\approx 1$.",
            },
            {
              type: 'figure',
              src: '/figures/fig_ch2_geometrie_solaire.png',
              caption:
                'Géométrie solaire~: déclinaison $\\delta$, angles zénithal $\\theta_z$, élévation $\\alpha_s$, azimut $A_s$ et inclinaison $\\beta$ du panneau.',
              heightClass: 'h-96 md:h-[28rem]',
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Rayonnement solaire',
          blocks: [
            {
              type: 'text',
              content:
                "Hors atmosphère, l'irradiance extraterrestre AM0 vaut environ **1~367~W/m²** (Toumi, 2021). En traversant l'atmosphère, ce flux perd par diffusion et absorption ; la masse d'air AM mesure cette atténuation (Ajzoul, s.d.).",
            },
            {
              type: 'text',
              content:
                "Au sol, le rayonnement se décompose en trois apports. L'**irradiance directe** ($G_{dir}$) vient en ligne droite du disque solaire (Ajzoul, s.d.). L'**irradiance diffuse** ($G_{dif}$) est renvoyée par toute la voûte céleste, nuageuse ou chargée d'aérosols. Vient enfin le rayonnement **réfléchi** par le sol, dit albédo ($\\rho_g$). Sur le plan incliné du panneau, l'irradiance globale ($G_{POA}$) est la somme de ces trois contributions~:",
            },
            {
              type: 'math',
              display: true,
              tex: 'G_{POA} = G_{\\text{dir,POA}} + G_{\\text{dif,POA}} + G_{\\text{ref,POA}}.',
            },
            {
              type: 'figure',
              src: '/figures/decomposition_rayonnement.jpg',
              caption:
                'Décomposition du rayonnement solaire~: direct, diffus, global horizontal et réfléchi (albédo).',
              heightClass: 'h-96 md:h-[28rem]',
            },
          ],
        },
      ],
    },
    {
      type: 'section',
      title: 'Principe physique de la conversion photovoltaïque',
      blocks: [
        {
          type: 'subsection',
          title: "Structure atomique du silicium et bandes d'énergie",
          blocks: [
            {
              type: 'text',
              content:
                "Le **silicium (Si)** est le matériau de référence : plus de 90~\\% des cellules mondiales l'utilisent. Ses 4 électrons de valence forment, par liaisons covalentes, un réseau cristallin stable. À l'état pur, il reste pourtant isolant à température ambiante.",
            },
            {
              type: 'text',
              content:
                "La théorie des bandes distingue la **bande de valence** (presque pleine à basse température) de la **bande de conduction** (où les électrons libres transportent le courant). Entre les deux s'étend la **bande interdite** ($E_g \\approx 1{,}12$~eV à 300~K pour le silicium) (Ajzoul, s.d. ; Diouf, 2021). Un photon d'énergie supérieure à $E_g$ excite alors un électron de la bande de valence vers la bande de conduction.",
            },
            {
              type: 'table',
              caption: 'Valeurs de bande interdite $E_g$ des principaux semi-conducteurs.',
              headers: ['Matériau', '$E_g$ (eV)', 'Type'],
              rows: [
                ['Silicium (Si)', '1,12', 'Indirect'],
                ['Germanium (Ge)', '0,66', 'Indirect'],
                ['Arséniure de gallium (GaAs)', '1,42', 'Direct'],
                ['Séléniure de cuivre--indium--gallium (CIGS)', '1,0--1,7 (variable)', 'Direct'],
                ['Tellure de cadmium (CdTe)', '1,45', 'Direct'],
                ['Pérovskites (CH₃NH₃PbI₃)', '$\\sim$1,55', 'Direct'],
              ],
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Dopage et jonction PN',
          blocks: [
            {
              type: 'text',
              content:
                "Pour rendre le silicium conducteur, on y introduit des impuretés contrôlées : c'est le **dopage**. Le **type N (donneur)** s'obtient en ajoutant des éléments à cinq électrons (le phosphore, par exemple), qui libèrent des charges négatives excédentaires. Le **type P (accepteur)** utilise des éléments à trois électrons (le bore), qui génèrent des lacunes mobiles dites trous.",
            },
            {
              type: 'text',
              content:
                "Ces deux matériaux, mis en contact, forment la **jonction PN**. Près de l'interface, les porteurs de charge diffusent et créent une zone dépourvue de charges libres, la zone de déplétion. Elle engendre un **champ électrique interne**, qui fait office de barrière naturelle et sépare les charges.",
            },
            {
              type: 'figure',
              src: '/figures/zone_depletion.png',
              caption:
                "Jonction PN à l'équilibre~: zone neutre N, zone de charge d'espace (ZCE) et zone neutre P. Les donneurs ionisés ($+$) côté N et les accepteurs ionisés ($-$) côté P créent le champ électrique interne $\\vec{\\mathcal{E}}$ orienté de N vers P, qui sépare les paires électron--trou photo-générées.",
              heightClass: 'h-96 md:h-[28rem]',
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Effet photovoltaïque',
          blocks: [
            {
              type: 'text',
              content:
                "La conversion de la lumière en électricité enchaîne quatre processus. D'abord, le semi-conducteur **absorbe** les photons incidents ; leur énergie **génère** des paires électron--trou. Le champ de la jonction PN **sépare** aussitôt ces porteurs et prévient leur recombinaison précoce (Ajzoul, s.d.). Enfin, les contacts métalliques avant et arrière **collectent** ces charges et alimentent le circuit en courant continu (Ajzoul, s.d. ; Toumi, 2021).",
            },
            {
              type: 'figure',
              src: '/figures/Schema-electron-trou-V2b-tsp.png',
              caption:
                'Effet photovoltaïque dans une cellule au silicium~: les photons créent des paires électron--trou, les électrons sont collectés par le contact avant (silicium dopé N) et les trous par le contact arrière (silicium dopé P), produisant un courant continu dans le circuit extérieur.',
              heightClass: 'h-96 md:h-[28rem]',
            },
          ],
        },
      ],
    },
    {
      type: 'section',
      title: "Analyse de la variabilité et de l'intermittence",
      blocks: [
        {
          type: 'text',
          content:
            "La production d'une centrale photovoltaïque mêle deux composantes. La première est **déterministe** : elle suit la mécanique céleste — cycles journalier et saisonnier — et s'intègre par les éphémérides et la géométrie du panneau ($\\cos\\theta_i$). La seconde est **stochastique** : elle vient de l'atmosphère — passages nuageux rapides, épisodes d'harmattan, dépôt de poussières $\\tau_a$ — et reste imprévisible. C'est sur cette seconde composante que les modèles d'apprentissage profond apportent leur valeur.",
        },
        {
          type: 'figure',
          src: '/figures/fig_ch4_variabilite_court_terme.png',
          caption: 'Variabilité à court terme de la production induite par les passages nuageux.',
          heightClass: 'h-80 md:h-96',
        },
      ],
    },
    {
      type: 'section',
      title: 'Référentiel unifié des variables pour la centrale de Diass',
      blocks: [
        {
          type: 'text',
          content:
            "Les grandeurs mesurées ou calculées sur le site de Diass (23~MWc) sont regroupées dans le dictionnaire structuré ci-dessous. Ce référentiel limite le surapprentissage et préserve l'explicabilité des modèles, en particulier grâce aux mécanismes d'attention temporelle et de sélection de variables du TFT (Lim, 2021).",
        },
        {
          type: 'table',
          caption:
            'Référentiel unifié des variables pour la modélisation photovoltaïque (Centrale de Diass).',
          headers: ['Catégorie', 'Variable / Feature', 'Définition et rôle physique'],
          rows: [
            { group: 'Météorologie et Climat' },
            [
              '$G, G_{dir}, G_{dif}, G_{POA}$',
              'Irradiances globale, directe, diffuse et dans le plan du panneau (W/m²).',
            ],
            [
              '$c_{cov}, G_{sw}, \\alpha_c$',
              'Fraction nuageuse (\\%), rayonnement descendant et albédo de ciel clair.',
            ],
            [
              '$T_{amb}, T_{mod}, T_d$',
              "Températures de l'air, de la surface du module et du point de rosée (°C).",
            ],
            [
              '$v_{2m}, P_{atm}, RH$',
              'Vitesse du vent (m/s), pression atmosphérique (hPa) et humidité relative (\\%).',
            ],
            [
              '$\\tau_a$',
              "Épaisseur optique des aérosols (suivi des poussières sahariennes et de l'harmattan).",
            ],
            { group: 'Grandeurs Électriques' },
            [
              '$P_{dc}, V_{dc}, I_{dc}$',
              'Puissance brute (kW), tension (V) et courant (A) continus mesurés côté champ.',
            ],
            [
              '$P_{ac}, V_{ac}, I_{ac}, E_{ac}$',
              'Puissance active injectée (kW), tension, courant et énergie livrée au réseau (kWh).',
            ],
            [
              '$\\eta_{inv}, T_{inv}, V_{dc,inv}$',
              "Rendement (\\%), température interne (°C) et tension d'entrée de l'onduleur.",
            ],
            [
              '$\\mathbb{1}_{clip}, \\mathbb{1}_{op}, \\mathbb{1}_{run}$',
              "Indicateurs binaires d'écrêtage (*clipping*), de fonctionnement normal et de disponibilité.",
            ],
            { group: 'Exploitation et Milieu' },
            [
              '$S_f$, Soiling',
              "Ratio d'encrassement (perte de transmission due au sable) et historique des lavages.",
            ],
            [
              '$\\theta_{AOI}, \\theta_z, \\gamma_{az}$',
              "Angle d'incidence et coordonnées célestes (angle zénithal, azimut solaire).",
            ],
            [
              'Degradation, LID, PID',
              'Paramètres de vieillissement lent des cellules et de pertes par polarisation.',
            ],
            { group: 'Temporalité et Features Dérivées' },
            [
              'Encodage cyclique',
              "Représentations trigonométriques ($\\sin/\\cos$) de l'heure, du jour et du mois.",
            ],
            [
              'Lags et statistiques',
              'Retards temporels ($t-1\\text{h}$ à $t-168\\text{h}$) et moyennes glissantes sur 24 heures.',
            ],
            [
              '$\\xi_{cc}$ (Ciel clair)',
              "Indice de nébulosité relatif défini par le rapport $\\xi_{cc} = G_{obs} / G_{clear}$.",
            ],
            [
              'Indicateurs saisonniers',
              "Marqueurs binaires spécifiques au contexte sahélien (`is_harmattan`, `is_hivernage`).",
            ],
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
            "Le rendement d'un module se joue à trois niveaux : le rayonnement reçu, la géométrie de l'installation et la qualité du semi-conducteur. Au sol, ce rayonnement utile combine trois composantes — directe, diffuse et réfléchie par le sol — dont la somme donne l'irradiance dans le plan des modules. La hauteur et l'azimut du Soleil déterminent l'angle d'incidence, donc la part de rayonnement direct effectivement captée. Les suiveurs solaires exploitent exactement cet effet.\n\nCôté matériau, la bande interdite du silicium (1,12~eV) et la jonction PN décident quels photons sont absorbés, et comment les porteurs de charge sont séparés puis collectés aux contacts. L'analyse de la variabilité sépare ensuite deux contributions : celle du mouvement des astres, calculable par éphémérides, et celle de l'atmosphère, faite de nuages, d'harmattan et de poussières. La seconde échappe au calcul ; c'est elle que les modèles d'apprentissage profond doivent apprendre, à partir du référentiel présenté en fin de chapitre.",
        },
      ],
    },
  ],
}
