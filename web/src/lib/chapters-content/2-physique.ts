import type { ChapterData } from './index'

export const chapterContent: ChapterData = {
  slug: '2-physique',
  title: 'Physique et technologie photovoltaïque',
  part: 'Partie I — Contexte physique et données',
  intro:
    "Ce chapitre présente les bases physiques de la filière photovoltaïque et les mécanismes qui régissent la production d'électricité. Du rayonnement solaire au comportement de la cellule semi-conductrice, chaque maillon éclaire les grandeurs clés que tout modèle de prévision se doit de capturer.",
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
                "Le Soleil est une étoile d'environ **1~400~000~km de diamètre** animée par des réactions de **fusion d'hydrogène en hélium**, qui libèrent des quantités colossales d'énergie (Ajzoul, s.d.). Une infime fraction de ce flux parvient jusqu'à la Terre sous forme de rayonnement électromagnétique.",
            },
            {
              type: 'text',
              content:
                'La puissance globale émise par un corps incandescent obéit à la **loi de Stefan--Boltzmann**~:',
            },
            {
              type: 'math',
              display: true,
              tex: "P_{\\text{d\\'egag\\'ee}} = S \\cdot \\sigma \\cdot T^4",
            },
            {
              type: 'text',
              content:
                "où $S$ représente la surface de l'astre, $\\sigma$ la constante de Stefan--Boltzmann, et $T$ sa température de surface. La puissance rayonnée augmentant avec la quatrième puissance de la température, de légères variations thermiques influencent considérablement l'énergie émise par l'étoile.",
            },
            {
              type: 'text',
              content:
                "En dehors de l'atmosphère, le spectre de référence est l'orbe **AM0** (Air Mass 0), qui correspond à une irradiance extraterrestre d'environ **1~367~W/m²**. Au niveau du sol, la convention **AM1,5** modélise le rayonnement après la traversée d'une masse d'air standard, fixant la puissance incidente de référence à **1~000~W/m²** (Ajzoul, s.d. ; Toumi, 2021).",
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
                "L'énergie interceptée par un panneau dépend directement de la position apparente du Soleil, liée à la latitude du site, à la date et à l'heure. Les angles sont exprimés dans le repère local $(x, y, z)$ ($x$ vers l'est, $y$ vers le nord, $z$ vers le zénith), avec des azimuts comptés depuis le nord et positifs vers l'est ($0^\\circ$~=~nord, $90^\\circ$~=~est, $180^\\circ$~=~sud, $270^\\circ$~=~ouest).",
            },
            {
              type: 'text',
              content:
                "La latitude $\\varphi$ du site ($\\varphi = 14{,}65^\\circ$~N à Diass) et le jour de l'année $N$ dictent la trajectoire solaire. La **déclinaison solaire** $\\delta$, qui traduit la latitude du point subsolaire, s'obtient par la formule de Cooper~:",
            },
            {
              type: 'math',
              display: true,
              tex: '\\delta = 23{,}45^\\circ \\cdot \\sin\\!\\left(\\frac{360^\\circ}{365}\\,(N - 81)\\right).',
            },
            {
              type: 'text',
              content:
                "Elle varie de $-23{,}45^\\circ$ à $+23{,}45^\\circ$ au fil des saisons, un calcul directement repris par le module `SolarPhysicalEngineer` du pipeline.",
            },
            {
              type: 'text',
              content:
                "Pour caler l'heure civile sur la course réelle du Soleil, l'**équation du temps** $E_q$ (en minutes) corrige l'excentricité de l'orbite terrestre~:",
            },
            {
              type: 'math',
              display: true,
              tex: 'E_q = 9{,}87\\,\\sin(2b) - 7{,}53\\,\\cos b - 1{,}5\\,\\sin b, \\qquad b = \\frac{360^\\circ}{365}\\,(N - 81).',
            },
            {
              type: 'text',
              content:
                "Le temps solaire local $t_{sl}$ s'en déduit, ce qui permet de calculer l'**angle horaire** $\\omega = 15^\\circ \\cdot (t_{sl} - 12)$, nul à midi solaire.",
            },
            {
              type: 'text',
              content:
                "La hauteur solaire $\\alpha_s$ et l'azimut $A_s$ se déduisent de ces coordonnées. Pour un panneau caractérisé par son inclinaison $\\beta$ et son azimut $A_p$ (par exemple $\\beta = 15^\\circ$ et $A_p = 180^\\circ$ pour la structure fixe de Diass), l'**angle d'incidence** $\\theta_i$ entre les rayons solaires et la normale du panneau $\\mathbf{n}$ s'exprime via le produit scalaire $\\cos\\theta_i = \\mathbf{n}\\cdot\\mathbf{s}$~:",
            },
            {
              type: 'math',
              display: true,
              tex: '\\cos\\theta_i = \\sin\\beta\\cos\\alpha_s\\cos(A_p-A_s) + \\cos\\beta\\sin\\alpha_s.',
            },
            {
              type: 'text',
              content:
                "Cette relation fondamentale gouverne l'apport direct de l'irradiance sur le module~: $G_{\\text{dir,POA}} = G_{\\text{dir}}\\cos\\theta_i$. Les trackers solaires exploitent précisément ce principe en ajustant en continu l'orientation du panneau pour maintenir $\\cos\\theta_i \\approx 1$.",
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
                "Hors de l'atmosphère, l'irradiance extraterrestre AM0 atteint environ **1~367~W/m²** (Toumi, 2021). En traversant la couche atmosphérique, ce flux subit des pertes par diffusion et absorption, une atténuation quantifiée par la masse d'air AM (Toumi, 2021 ; Ajzoul, s.d.).",
            },
            {
              type: 'text',
              content:
                "Au sol, le rayonnement se compose de trois apports distincts : l'**irradiance directe** ($G_{dir}$) reçue en ligne droite depuis le disque solaire (Ajzoul, s.d.), l'**irradiance diffuse** ($G_{dif}$) renvoyée de toutes parts par la voûte céleste nuageuse ou chargée d'aérosols, et enfin le rayonnement **réfléchi** par le sol, ou albédo ($\\rho_g$). L'irradiance globale reçue sur le plan incliné du panneau ($G_{POA}$) s'écrit ainsi comme la sommation de ces contributions~:",
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
                "Matériau de référence pour plus de 90~\\% des cellules mondiales, le **silicium (Si)** possède 4 électrons de valence qui forment un réseau cristallin stable par liaisons covalentes. À l'état pur, il se comporte toutefois comme un isolant à température ambiante.",
            },
            {
              type: 'text',
              content:
                "La théorie des bandes distingue la **bande de valence** (presque pleine à basse température) de la **bande de conduction** (où les électrons libres assurent le transport du courant). Entre les deux s'étend la **bande interdite** ($E_g \\approx 1{,}12$~eV à 300~K pour le silicium) (Ajzoul, s.d. ; Diouf, 2021). Lorsqu'un photon d'énergie supérieure à $E_g$ frappe le matériau, il excite un électron de la bande de valence vers la bande de conduction.",
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
                "Pour rendre le silicium conducteur, on réalise un **dopage** en y introduisant des impuretés contrôlées. Le **type N (donneur)** s'obtient par l'ajout d'éléments à cinq électrons (comme le phosphore) pour libérer des charges négatives excédentaires, tandis que le **type P (accepteur)** fait appel à des éléments à trois électrons (comme le bore) pour générer des lacunes mobiles, appelées trous.",
            },
            {
              type: 'text',
              content:
                "La mise en contact intime de ces deux matériaux engendre la **jonction PN**. Au voisinage de l'interface, la diffusion des porteurs de charge crée une zone d'appauvrissement exempte de charges libres, dite zone de déplétion, qui donne naissance à un **champ électrique interne**. Ce champ joue un rôle moteur indispensable en agissant comme une barrière naturelle et un séparateur de charges.",
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
                "La conversion de la lumière en électricité s'opère à travers un enchaînement de processus physiques continus. Tout d'abord, l'**absorption** des photons incidents par le semi-conducteur insuffle l'énergie nécessaire à la **génération** de paires électron--trou. Sous l'action du champ électrique inhérent à la jonction PN, ces porteurs subissent une **séparation** spatiale immédiate qui prévient leur recombinaison précoce (Ajzoul, s.d.). Enfin, la **collecte** de ces charges par les contacts métalliques frontaux et arrière alimente le circuit extérieur sous forme de courant continu (Ajzoul, s.d. ; Toumi, 2021).",
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
            "Comme établi au Chapitre~2, la production d'une centrale photovoltaïque dépend conjointement de cycles déterministes et de perturbations stochastiques. Du point de vue de la modélisation, la variabilité déterministe et prévisible liée à la mécanique céleste (cycles journalier et saisonnier), directement intégrée via les éphémérides et les composantes géométriques ($\\cos\\theta_i$), se distingue de l'incertitude stochastique provoquée par la dynamique atmosphérique (passages nuageux rapides, épisodes d'harmattan et dépôt de poussières $\\tau_a$). La valeur ajoutée des modèles d'apprentissage profond réside sur cette seconde composante, par nature imprévisible.",
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
            "Afin d'éviter le surapprentissage et de garantir l'explicabilité des modèles (notamment via les mécanismes d'attention temporelle et de sélection de variables propres au modèle TFT (Lim, 2021)), l'ensemble des grandeurs mesurées ou calculées sur le site de Diass (23~MWc) a été regroupé au sein d'un dictionnaire structuré présenté dans le tableau ci-dessous.",
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
            "En ramenant l'ensemble des grandeurs physiques, électriques et temporelles à un référentiel unifié et rigoureusement structuré, ce chapitre relie les phénomènes d'intermittence observés sur le terrain aux exigences de la modélisation statistique. Chaque entrée transmise au modèle de prévision correspond ainsi à un phénomène physique clairement identifiable, ce qui garantit la transparence et l'exploitabilité opérationnelle des résultats pour le gestionnaire du réseau (SENELEC) (SENELEC, 2025).",
        },
      ],
    },
  ],
}
