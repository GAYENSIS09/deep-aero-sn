import type { ChapterData } from './index'

export const chapterContent: ChapterData = {
  slug: '8-etudes-cas',
  title: 'Étude de cas : Diass (solaire)',
  part: 'Partie III — Application et évaluation',
  intro:
    "Les chapitres précédents ont posé le cadre physique, les architectures et la stratégie probabiliste. Reste à vérifier que l'ensemble tient sur une centrale réelle. Diass, première centrale solaire publique du Sénégal, sert de cas d'étude~: sa structure fixe, son climat sahélien et sa production annualisée d'environ 34~GWh en font un terrain représentatif des contraintes que rencontrera la SENELEC à mesure que le solaire monte en puissance. Le chapitre suit le trajet des données, de l'export SCADA au vecteur de features, puis présente l'entraînement, les résultats et leur discussion.\n\nLa prévision répond à un besoin opérationnel~: anticiper la ressource renouvelable pour planifier l'entretien et les investissements, équilibrer l'offre et la demande en ajustant les moyens thermiques et hydrauliques, réduire les coûts de réserve et de curtailment, et préserver la sécurité du réseau en évitant les déséquilibres fréquence--puissance qui mènent au délestage.",
  sections: [
    {
      type: 'section',
      title: 'Le site de Diass, centrale solaire photovoltaïque',
      blocks: [
        {
          type: 'subsection',
          title: 'Description du site',
          blocks: [
            {
              type: 'text',
              content:
                "Le site de Diass est la **première centrale solaire photovoltaïque publique du Sénégal**, détenue et exploitée par la **SENELEC**. Située dans le département de Mbour , à environ 40--50~km au sud-est de Dakar, non loin de l'aéroport international Blaise Diagne, elle a été mise en service en mai 2022 et constitue un jalon majeur pour la transition énergétique du pays (SENELEC, 2025 ; SENELEC). Son financement a été assuré par un prêt de la banque allemande KfW ($\\sim$18~milliards FCFA).",
            },
            {
              type: 'table',
              caption: 'Caractéristiques techniques de la centrale de Diass.',
              headers: ['Paramètre', 'Valeur'],
              rows: [
                ['Localisation', 'Diass, Mbour, Thiès, Sénégal'],
                ['Coordonnées', '$14{,}65^\\circ$~N, $17{,}10^\\circ$~W'],
                ['Puissance nominale AC', '24,48~MW ($36 \\times 680$~kW, limitée à 20,16~MW)'],
                ['Puissance crête DC', '27,28~MWc ($85\\,248 \\times 320$~Wc)'],
                ['Puissance publiée (MP)', '23,114~MW (source SENELEC, écart documenté à la section ci-dessous)'],
                ['Technologie', 'Modules polycristallins Jinko JKM320PP-72-V'],
                ['Structure', 'Fixe (inclinaison 15°, azimut 0° plein sud)'],
                ['Nombre de modules', '85~248'],
                ['Onduleurs', '36 Schneider Conext Core XC-680 (12 stations $\\times$ 3)'],
                ['Surface du champ', '$\\sim$40~ha'],
                ['Mise en service', 'Mai 2022'],
                ['Propriétaire/exploitant', 'SENELEC (centrale publique, PPA 25~ans)'],
                ['Production annuelle', '$\\sim$34~GWh/an'],
                ["Période d'exploitation couverte", '30/08/2025 -- 31/08/2026'],
                ['Résolution des exports SCADA', '$\\sim$15~min'],
                ['Résolution du dataset de modélisation', '1~h après resampling'],
                ['Volumétrie', '35~196 lignes à 15~min (58 colonnes, 55 hors imputation) puis 8~800 lignes horaires (428 colonnes)'],
                ["Grandeurs d'exploitation", '$\\sim$440 (36 onduleurs, compteur HTA, station météo)'],
              ],
            },
            {
              type: 'text',
              content:
                "La centrale est équipée de **modules polycristallins** montés sur une **structure fixe** inclinée calée sur la latitude de Diass ($\\varphi = 14{,}65^\\circ$~N)~: cette configuration maximise le captage annuel sans la complexité mécanique d'un tracker et simplifie l'exploitation et la maintenance, tout en produisant une série régulière structurée par l'arc diurne. La localisation en zone sahélienne offre un gisement solaire parmi les plus élevés d'Afrique, avec une irradiance globale annuelle typique de l'ordre de 2~000~kWh/m²/an (Ajzoul).",
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Préparation des données : nature, provenance et traçabilité',
          blocks: [
            {
              type: 'text',
              content:
                "Trois familles de données entrent dans le jeu final~: les mesures SCADA de la centrale, les réanalyses externes et les variables calculées à partir de la géométrie du site. Elles n'ont ni la même résolution, ni la même latence, ni la même fiabilité. Plutôt que de les fondre en une série indifférenciée, le pipeline conserve pour chaque colonne son origine, parce que la prévision hérite de l'incertitude propre à chacune.",
            },
            {
              type: 'text',
              content:
                "**Données SCADA.** Les données d'exploitation couvrent la période du 30 août 2025 au 31 août 2026. Elles sont réparties dans six classeurs Excel issus du système de supervision Schneider~: paramètres DC, paramètres AC, mesures des DC Box, températures des cartes de puissance et deux ensembles de mesures météorologiques. Les fichiers décrivent les équipements de la centrale ainsi que le compteur de livraison HTA et la station météorologique. Après lecture et normalisation des horodatages, les différentes sources sont ramenées à une même série temporelle de référence à 15 minutes. Le notebook d'ingestion obtient ainsi **35~196 lignes à 15~minutes et 58~colonnes**, dont environ 34~600 observations non manquantes pour les variables SCADA ($T_{inv}$~: 34~606, $P_{ac}$~: 34~602, $G_{sw}$~: 34~601). Cette résolution source est ensuite agrégée à 1~heure par le pipeline de données, avant le feature engineering et l'apprentissage.",
            },
            {
              type: 'text',
              content:
                "Les grandeurs électriques sont ensuite ramenées à l'échelle de la centrale. Pour les mesures disponibles sur les 36 onduleurs, les tensions et courants sont agrégés par moyenne, tandis que les puissances sont additionnées lorsque la grandeur représente une contribution de chaque équipement. Les compteurs d'énergie sont traités comme des grandeurs cumulatives~: leur consommation ou production sur un intervalle est obtenue par différence entre deux valeurs successives, avec une borne inférieure à zéro afin d'éviter qu'un retour ou une remise à zéro du compteur ne produise une énergie négative. Les puissances extraites des fichiers SCADA étant exprimées en kW, les variables `P_dc`, `P_ac` et `P_dc_inv` sont converties en MW avant leur utilisation par la chaîne de modélisation.",
            },
            {
              type: 'text',
              content:
                "**Variables météorologiques et radiatives externes.** La station météorologique de Diass ne fournit pas l'ensemble des variables nécessaires à la caractérisation du rayonnement solaire. Les données SCADA sont donc complétées par des réanalyses horaires. NASA POWER, associé ici aux données MERRA-2, constitue la source principale pour plusieurs variables météorologiques et pour le GHI. Pour la période de juin à août 2026, pour laquelle le GHI de NASA POWER n'était pas encore disponible au moment de l'extraction, les données d'Open-Meteo basées sur ERA5 sont utilisées en complément.\n\nLes composantes DNI et DHI sont obtenues à partir d'Open-Meteo sur l'ensemble de la période considérée, car elles ne sont pas disponibles à la résolution horaire retenue dans l'interrogation de NASA POWER. La même source fournit également la couverture nuageuse et plusieurs variables météorologiques complémentaires.\n\nLes deux sources ne sont pas simplement concaténées. Les séries horaires sont d'abord alignées sur les horodatages SCADA, puis projetées sur la grille de 15~minutes. Pour les variables communes, NASA POWER est privilégié lorsque la donnée est disponible et Open-Meteo intervient en remplacement lorsque cette valeur est absente. Cette règle permet de conserver une source principale tout en évitant de perdre les derniers mois de la période d'étude. Le dataset transmis au feature engineering est ensuite obtenu après agrégation horaire, selon le rôle physique de chaque colonne.",
            },
            {
              type: 'text',
              content:
                "**Variables calculées et paramètres d'installation.** Certaines variables du jeu final ne correspondent pas à des mesures. La grandeur `clear_sky_ghi` est calculée à partir du modèle physique d'Ineichen--Perez et des coordonnées du site~; le nom a été choisi pour éviter toute ambiguïté avec l'albédo de surface. Les paramètres `surface_tilt` et `surface_azimuth` décrivent la géométrie de l'installation et sont fixés respectivement à 15° et 0°. Le paramètre `albedo_sol` est renseigné comme constante d'installation avec la valeur 0,2.\n\nCes variables sont conservées dans le jeu de données parce qu'elles peuvent être utiles aux étapes ultérieures de modélisation, mais elles ne doivent pas être interprétées comme des observations SCADA. La provenance de chaque variable est donc conservée selon quatre catégories~: mesure locale, réanalyse externe, variable calculée et paramètre d'installation.",
            },
            {
              type: 'text',
              content:
                "**Prévisions météorologiques numériques (NWP).** Les prévisions du modèle **ECMWF IFS HRES**, figé dans la configuration, sont récupérées via l'API *Single Runs* d'Open-Meteo et intégrées au pipeline comme covariables futures. Trois variables décrivant la couverture nuageuse totale, les nuages bas et le rayonnement à courte longueur d'onde sont injectées aux fenêtres sous forme de tenseur par le canal des covariables futures des modèles TCN et TFT. Elles n'entrent ni dans le scaler des features ni dans les baselines déterministes~: seul le modèle qui les consomme reçoit une tête supplémentaire.\n\nLa règle de causalité appliquée est une règle de disponibilité opérationnelle~: pour une fenêtre émise à $t_{\\text{ém}}$, le run retenu est le dernier dont $\\text{init} + 6~\\text{h} \\le t_{\\text{ém}}$, où 6~heures est la borne haute de latence documentée par Open-Meteo. L'horizon demandé par run est dérivé automatiquement ($72~\\text{h} + \\text{latence} + \\text{marge} = 85$~heures, fonction `required_forecast_hours`) et chaque run est mis en cache sur disque. Sur la plage du projet, 1~461 cycles sont demandés et 1~460 sont exploitables~; trois runs sont incomplets dans l'archive (dont 2026-06-11, 11~heures manquantes sur 84 attendues, traitées par troncature de queue). Sur 8~342 fenêtres candidates, 95 sont écartées ($1{,}14\\,\\%$) parce que le run sélectionné ne couvre pas tous les temps cibles, et 8~247 fenêtres sont conservées avec un âge de run de 6 à 12~heures et un horizon maximal de 72~heures.",
            },
            {
              type: 'text',
              content:
                "**Gestion des valeurs manquantes.** Une interruption réelle de télémesure d'environ six jours, entre le 9 et le 15 décembre 2025, est présente dans les exports SCADA. Ces observations n'existant pas dans les fichiers sources, elles ne sont pas reconstruites par interpolation. Après remise sur la grille temporelle, elles restent donc manquantes. Cette règle vaut pour l'évaluation~: une absence de mesure n'est pas assimilée à une production nulle. Les périodes nocturnes sont distinguées des véritables absences de télémesure à l'aide des informations temporelles et radiatives disponibles.",
            },
            {
              type: 'text',
              content:
                "**Construction du jeu final.** Après normalisation des noms de variables, agrégation des mesures SCADA, harmonisation temporelle à 15 minutes, enrichissement par les réanalyses et ajout des variables physiques, les données sources sont enregistrées dans `raw_input.parquet` (35~196 lignes à 15~minutes, 58 colonnes dont 55 hors imputation). Le pipeline applique ensuite le resampling horaire et sauvegarde le jeu de features utilisé par les modèles (`diass_features.parquet`, 8~800 lignes horaires et 428 colonnes dans le run du 6~octobre 2026, pour 427~features générées). Les deux volumétries sont rapportées séparément et ne doivent pas être confondues.\n\nLa chaîne de traitement distingue trois niveaux~: les observations directement issues de la centrale (**mesure**), les informations provenant de sources externes (**réanalyse**) et les variables produites par calcul ou fixées à partir des caractéristiques de l'installation (**paramètre**). Le notebook `diass.ipynb` sert de référence~: toute valeur citée dans ce chapitre y est vérifiable.",
            },
          ],
        },
        {
          type: 'subsection',
          title: "Parcours des données : de l'ingestion SCADA au jeu de features",
          blocks: [
            {
              type: 'text',
              content:
                "Ce parcours, fidèle au notebook `diass.ipynb` (source de vérité) et au script `diass.py`, retrace le cheminement des données depuis les exports du système SCADA jusqu'au vecteur de **features** alimentant les modèles. La transparence de ce cheminement est essentielle~: elle permet d'affirmer la validité des résultats présentés plus loin, en distinguant à chaque étape ce qui est **mesuré**, **téléchargé**, **reconstruit** ou **calculé**.",
            },
            {
              type: 'text',
              content:
                "**Ingestion SCADA : lecture et transformations de `diass.py`**\n\nLe script `diass.py` construit de façon reproductible le parquet brut de la centrale. La fonction `load_scada` lit les **six classeurs Excel** issus du superviseur Schneider~: paramètres DC, paramètres AC, mesures des DC Box, températures des cartes de puissance et deux ensembles de mesures météorologiques. Chaque classeur est identifié par un fragment de nom de fichier. La lecture est suivie de plusieurs transformations systématiques. La fonction `_parse_timestamp` normalise d'abord les horodatages en combinant la colonne `Date` (format `%d/%m/%Y`) et l'heure extraite de `Temps`, pour produire un index `timestamp` unifié puis trié, première garantie de cohérence entre des sources de formats hétérogènes. Les colonnes utiles sont ensuite retrouvées par expressions régulières, ce qui rend la lecture robuste aux variations de libellés. Les grandeurs sont agrégées à l'échelle de la centrale~: tensions et courants sont moyennés sur les équipements, tandis que les puissances contributives sont sommées, `P_dc` étant par exemple la somme des puissances DC des boxes. Les compteurs cumulatifs (`ENERGIA`~...) sont différenciés par `diff` puis bornés à zéro, afin qu'un retour ou une remise à zéro ne produise jamais d'énergie négative. Les puissances exprimées en kW sont enfin converties en MW, et les grandeurs structurantes sont récupérées selon la même logique~: tension réseau (`V_ac`), fréquence (`grid_frequency`), facteur de puissance (`cos_phi`), irradiance...",
            },
            {
              type: 'text',
              content:
                "**Enrichissement par réanalyses et variables physiques**\n\nLa station météorologique du site ne fournit qu'une partie des signaux utiles. Trois sources horaires publiques complètent le jeu~: NASA POWER pour le GHI, les températures, le vent, la rosée, l'humidité, la pression et la pluie~; CAMS, interrogé via l'API qualité de l'air d'Open-Meteo, pour l'épaisseur optique des aérosols, les poussières et les particules fines~; ERA5, via l'archive Open-Meteo, pour les composantes directe et diffuse du rayonnement, la couverture nuageuse, la température et la pression. Les valeurs sentinelles des réanalyses, qui marquent une donnée absente, sont traduites en valeurs manquantes.\n\nL'ingestion fusionne ensuite les sources sur une **grille unique à 15~minutes**. Les séries SCADA y sont réindexées et les réanalyses propagées vers l'avant~; pour les variables communes, la priorité attribuée aux mesures locales, puis à NASA POWER et enfin à ERA5, reflète la confiance décroissante que mérite chaque source. Les trous courts de télémesure sont comblés par une interpolation temporelle bornée à 24~heures, sans extrapolation, et les directions de vent sont décomposées en composantes sinusoïdales puis recombinées, ce qui évite les sauts artificiels autour du nord géographique.\n\nLes variables calculées sont produites par le moteur physique solaire du package~: le GHI de ciel clair y est évalué selon le modèle Ineichen--Perez, puis aligné sur la géométrie du site. Les **variables électriques historiques** sont enfin dérivées de façon strictement causale~: retards de 24~heures sur les tensions, les courants et la fréquence réseau (dont les écarts restent bornés à $\\pm 5$~Hz), rendements onduleur encadrés entre 0,5 et 1,0 avec un repli nominal de 0,97, rapport des courants alternatif et continu, indice d'encrassement établi à la veille, borné puis propagé, et compteurs d'énergie ramenés en incréments ou en cumuls sur 24~heures. Aucune de ces colonnes n'utilise d'information future~: la causalité est garantie par la construction même des variables, toutes décalées de 96~pas.",
            },
            {
              type: 'figure',
              src: '/figures/Deep-Aero-SN-ensemble.drawio.png',
              caption:
                "Vue d'ensemble du système Deep Aero SN~: des mesures (SCADA à 15~minutes, météos NASA/ERA/IFS, configuration) aux prévisions P+72~h.",
              heightClass: 'h-80 md:h-[28rem]',
            },
            {
              type: 'text',
              content:
                "La figure ci-dessus synthétise ce cheminement~: fabriquer les données, de l'import SCADA au parquet de features enrichi des réanalyses~; apprendre, du fenêtrage à la calibration probabiliste, traçabilité comprise~; prédire enfin, en sélectionnant le modèle approprié et en produisant une inférence par lots assortie de son enveloppe P10--P90.",
            },
            {
              type: 'text',
              content:
                "**Technologies et APIs mobilisées, et leur rôle**\n\nLe pipeline mobilise quelques briques standard~: Great Expectations pour le contrôle des schémas, scikit-learn et SHAP pour la sélection, Optuna pour l'optimisation, MLflow pour la traçabilité et Prefect pour l'orchestration.",
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Exploration des données (EDA)',
          blocks: [
            {
              type: 'text',
              content:
                "L'exploration des données permet de comprendre les caractéristiques de la production solaire de Diass avant toute modélisation. Cette phase identifie les patterns temporels, les corrélations entre variables et les spécificités du site.",
            },
            {
              type: 'text',
              content:
                "Le profil journalier moyen campe l'arc diurne typique du site~: irradiance et production culminent vers midi, la température ambiante suit avec un retard d'environ deux heures et le vent présente un minimum en fin de nuit (figure ci-dessous). À l'échelle d'une semaine (par exemple celle du 6~juin 2026, figure ci-dessous), la production suit étroitement l'irradiance, avec des chutes brutales lors des passages nuageux, principale source d'erreur à court terme.",
            },
            {
              type: 'figure',
              src: '/figures/nb_diass_profil_journalier.png',
              caption:
                'Profil journalier moyen sur la période~: irradiance, production, température ambiante et vent au niveau des modules.',
              heightClass: 'h-80 md:h-96',
            },
            {
              type: 'figure',
              src: '/figures/nb_diass_serie_semaine.png',
              caption:
                "Sept jours au pas horaire, semaine du 6~juin 2026~: les arcs diurnes successifs de l'irradiance et de la production, la température ambiante et le vent~; les passages nuageux du 12~juin découpent nettement la production.",
              heightClass: 'h-80 md:h-96',
            },
            {
              type: 'figure',
              src: '/figures/nb_diass_matrice_correlations.png',
              caption:
                "Matrice de corrélation horaire des sept variables principales~: `ghi`, `dni`, `dhi`, `P_ac`, `temp_air`, `cloud_cover` et `pressure`. L'irradiance est le déterminant dominant de la production, tandis que la couverture nuageuse s'y oppose.",
              heightClass: 'h-64 md:h-72',
            },
            {
              type: 'figure',
              src: '/figures/nb_diass_ghi_vs_production.png',
              caption:
                "Relation GHI--production au pas de 10~minutes, colorée par la température ambiante. La relation est quasi linéaire sous ciel clair et se disperse sous ciel nuageux~; aucune saturation franche n'apparaît sur la plage observée.",
              heightClass: 'h-64 md:h-72',
            },
            {
              type: 'text',
              content:
                "Le modèle NOCT relie la température de cellule à l'ambiance via $\\gamma = -0{,}43\\,\\%/^\\circ C$~; sur Diass, il donne une $T_{cell}$ moyenne de $33{,}3$~°C (maximum $70{,}8$~°C) pour une perte thermique moyenne de $-3{,}56\\,\\%$, facteur non négligeable de la production estivale.",
            },
            {
              type: 'figure',
              src: '/figures/nb_diass_effet_nuages.png',
              caption:
                "Effet de la couverture nuageuse sur la variabilité du GHI~: à gauche, GHI en fonction de la couverture coloré par la variabilité horaire~; à droite, variabilité moyenne par classe de couverture. La variabilité croît nettement avec la nébulosité, ce qui motive les lags courts d'irradiance.",
              heightClass: 'h-64 md:h-72',
            },
            {
              type: 'text',
              content:
                "Du côté des aérosols, l'épaisseur optique $\\tau_a$ tourne autour de $0{,}31$ en moyenne sur la période et culmine en mai~; la figure ci-dessous met l'irradiance en regard de cet indice et détaille son évolution mensuelle.",
            },
            {
              type: 'figure',
              src: '/figures/nb_diass_effet_aerosols.png',
              caption:
                "À gauche, GHI en fonction de l'épaisseur optique des aérosols avec sa droite de tendance~; à droite, AOD moyen mensuel avec repérage de l'harmattan (décembre--février).",
              heightClass: 'h-80 md:h-96',
            },
            {
              type: 'text',
              content:
                "L'EDA campe un site solaire typique du Sahel~: forte irradiance annuelle, variabilité nuageuse marquée pendant l'hivernage et aérosols significatifs en saison sèche. Ces trois traits orientent directement le choix des features.",
            },
            {
              type: 'text',
              content:
                "**Synthèse statistique des données**\n\nL'analyse statistique des données de Diass révèle les distributions suivantes~:",
            },
            {
              type: 'table',
              caption:
                "Statistiques descriptives du parquet brut de Diass (30/08/2025--31/08/2026, 35~196 lignes à 15~min, 55 colonnes hors indicateurs d'imputation~; run du 6~octobre 2026). Les comptes inférieurs à 35~196 traduisent les absences réelles de télémesure, dont la coupure de décembre 2025.",
              headers: ['Variable', 'N', 'Min', 'Médiane', 'Moyenne', 'Max', 'Écart-type'],
              rows: [
                ['GHI (W/m²)', '35~196', '0', '8,18', '241,95', '1~059,53', '320,13'],
                ['Production $P_{ac}$ (MW)', '34~602', '$-0{,}14$', '$-0{,}03$', '3,90', '18,45', '5,38'],
                ['Température air (°C)', '35~196', '14,16', '25,70', '25,71', '40,80', '4,75'],
                ['Humidité (%)', '35~196', '6,92', '74,43', '70,05', '100,0', '22,79'],
                ['Vitesse vent 2~m (m/s)', '35~196', '0,05', '3,22', '3,19', '7,54', '1,40'],
                ['DNI (W/m²)', '35~196', '0', '0', '223,31', '856,20', '284,28'],
                ['Couverture nuageuse (%)', '35~196', '0', '63,0', '53,96', '100,0', '41,96'],
                ['AOD $\\tau_a$', '35~196', '0,04', '0,29', '0,31', '1,11', '0,15'],
              ],
            },
            {
              type: 'text',
              content:
                "Deux remarques de lecture. La médiane du GHI est très basse ($8{,}18$~W/m²) alors que sa moyenne atteint $241{,}95$~W/m²~: c'est la signature de l'alternance jour/nuit sur un jeu à 15~minutes, et non une anomalie. Le minimum de production est légèrement **négatif** ($-0{,}14$~MW) car les onduleurs consomment une faible puissance en mode veille la nuit~; la médiane proche de zéro traduit la même chose. Les variables électriques SCADA comptent environ 34~600 observations non manquantes ($T_{inv}$~: 34~606, $P_{ac}$~: 34~602, $G_{sw}$~: 34~601), l'écart à 35~196 correspondant aux absences réelles conservées comme discontinuités.\n\nLe minimum de GHI est nul (nuit) et celui de production légèrement négatif, la puissance de veille des onduleurs étant soustraite en heures creuses~; ce masque temporel s'impose lors de l'évaluation des métriques, seuls les pas de temps diurnes étant pertinents pour la prévision solaire. La distribution de la production présente un pic à 0 (nuit) et un second pic aux environs de 13--14~MW (conditions ensoleillées), avec une distribution quasi-uniforme entre ces deux modes (Diouf, 2021).",
            },
            {
              type: 'text',
              content:
                "**Patterns temporels identifiés**\n\nL'EDA met en évidence quatre échelles de variation. Le **cycle diurne** domine~: production nulle la nuit, croissance à l'aube (6h--7h), pic à midi solaire (12h--13h), décroissance au coucher (18h--19h), la forme de l'arc dépendant de la géométrie solaire locale ($\\varphi = 14{,}65^\\circ$~N) et de l'inclinaison fixe des modules. Le **cycle hebdomadaire** est faible mais mesurable, lié à l'activité météorologique (passages de fronts en hivernage). Le **cycle saisonnier** oppose nettement la saison sèche (production élevée et régulière, GHI $\\sim$6~kWh/m²/jour) à l'hivernage (production réduite et variable, GHI $\\sim$4--5~kWh/m²/jour). Enfin, des **perturbations ponctuelles** s'ajoutent~: chutes brutales dues aux passages nuageux en hivernage, réductions progressives dues au soiling en saison sèche et baisses d'irradiance dues à l'harmattan de décembre à février.\n\nCes patterns sont directement exploitables par les modèles de deep learning~: le cycle diurne est capturé par les lags horaires, le cycle saisonnier par les features temporelles (jour julien, indicateur de saison), et les perturbations par les features d'irradiance et de météorologie.",
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Physique du site',
          blocks: [
            {
              type: 'text',
              content:
                "**Géométrie solaire locale**\n\nÀ la latitude de Diass ($\\varphi = 14{,}65^\\circ$~N), le Soleil atteint une hauteur maximale de $75{,}8^\\circ$ au solstice d'été (juin) et de $51{,}9^\\circ$ au solstice d'hiver (décembre) (Ajzoul). Cette variation saisonnière de la hauteur solaire module l'irradiance reçue sur le plan des panneaux~:",
            },
            {
              type: 'math',
              display: true,
              tex: '\\alpha_{s,\\max} = 90^\\circ - \\varphi + \\delta',
            },
            {
              type: 'text',
              content:
                "où $\\delta$ est la déclinaison solaire ($\\pm 23{,}45^\\circ$). Pour Diass, le Soleil passe presque au zénith aux équinoxes ($\\alpha_s \\approx 75^\\circ$), ce qui est favorable à la production. Les modules, montés sur une structure fixe avec une inclinaison de **15°** orientée **plein sud** (azimut 0°), captent le rayonnement de manière optimale toute l'année sans suivi actif.",
            },
            {
              type: 'text',
              content:
                "**Profil d'irradiance typique**\n\nLe site présente un contraste saisonnier marqué entre la **saison sèche** (novembre--mai) et l'**hivernage** (juin--octobre). En saison sèche, l'irradiance est élevée et régulière (GHI moyen $\\sim$6~kWh/m²/jour), le ciel généralement dégagé malgré l'harmattan de décembre à février~: c'est la période de production maximale. Pendant l'hivernage, l'irradiance est réduite et variable (GHI moyen $\\sim$4--5~kWh/m²/jour) et les passages nuageux et précipitations rendent la production plus irrégulière, mais les températures plus basses réduisent les pertes thermiques.",
            },
            {
              type: 'text',
              content:
                "**Températures ambiantes élevées**\n\nLe climat sahélien de la région de Thiès se caractérise par des températures ambiantes élevées, en particulier en saison chaude (mars--juin)~: les températures maximales atteignent régulièrement **35--40~°C**, avec des records dépassant 45~°C. La température de cellule $T_{cell}$ peut alors atteindre 65--75~°C, entraînant des pertes thermiques significatives~:",
            },
            {
              type: 'math',
              display: true,
              tex: '\\Delta P_{therm} = \\gamma \\cdot (T_{cell} - 25^\\circ C) \\approx -0{,}43\\,\\%/^\\circ C \\times 45^\\circ C \\approx -19\\,\\%',
            },
            {
              type: 'text',
              content:
                "Le refroidissement convectif par le vent ($v_{wind}$) atténue partiellement cet effet, ce qui fait de la vitesse du vent une variable d'entrée pertinente même pour un site solaire.",
            },
            {
              type: 'text',
              content:
                "**Impact de l'harmattan**\n\nL'harmattan, vent d'est venu du Sahara, transporte d'importantes masses de poussière pendant la saison sèche (novembre--février) et affecte la production de deux manières. Il réduit d'abord l'irradiance directe~: l'épaisseur optique des aérosols $\\tau_a$ augmente et diffuse une fraction notable du rayonnement, la DNI pouvant chuter de 15 à 30~\\% par rapport à un ciel clair. Il encrasse ensuite les modules~: les dépôts de poussière sur les surfaces vitrées réduisent la transparence et provoquent des pertes de 5 à 15~\\% sur plusieurs semaines sans nettoyage.\n\nCes deux effets sont distincts de la variabilité nuageuse et doivent être modélisés séparément dans le feature engineering.\n\nLa physique du site contraint directement le modèle~: il doit restituer le cycle diurne (géométrie solaire), la variabilité nuageuse (hivernage), l'effet des aérosols (harmattan) et les pertes thermiques (température ambiante élevée). Chacune de ces causes opère à une échelle différente, du journalier au saisonnier, ce qui justifie des features multi-échelles.",
            },
            {
              type: 'text',
              content:
                "**Influence des périodes de pluie**\n\nLa figure ci-dessous objective l'effet des épisodes pluvieux sur la production~: les jours où le cumul quotidien dépasse 1~mm (fond rouge) correspondent systématiquement à des creux de $P_{ac}$, alors que les périodes sèches (fond bleu) restent proches du profil nominal. Le run courant compte **96~jours pluvieux contre 271~jours secs**, avec une production moyenne de **3,7~MW par jour pluvieux contre 4,0~MW par jour sec ($-6\\,\\%$)**, ce qui confirme la précipitation comme variable discriminante de l'hivernage.",
            },
            {
              type: 'figure',
              src: '/figures/nb_diass_effet_pluie.png',
              caption:
                "Production $P_{ac}$ moyenne journalière avec périodes pluvieuses (cumul $> 1$~mm, fond rouge) et sèches (fond bleu). Les épisodes de pluie, concentrés pendant l'hivernage, coïncident avec les baisses marquées de production.",
              heightClass: 'h-64 md:h-72',
            },
          ],
        },
        {
          type: 'subsection',
          title: "Transformation des variables électriques SCADA : du data leakage à l'information causale",
          blocks: [
            {
              type: 'text',
              content:
                "**Le problème : la circularité des variables SCADA contemporaines**\n\nLes exports SCADA de Diass fournissent des variables électriques instantanées (`I_ac`, `P_dc`, `V_dc`, `V_dc_inv`, `I_dc`, `I_dc_inv`, `P_dc_inv`, `V_ac`, `cos_phi`, `energy_*kwh` et `grid_frequency`) mesurées au même instant $t$ que la cible `P_ac`. Utiliser ces variables brutes comme features constitue un **biais de circularité mathématique** (data leakage)~: le capteur de puissance AC et le capteur d'intensité AC mesurent simultanément le même flux d'électrons en sortie d'onduleur, liés par une équation déterministe stricte d'électrotechnique~:",
            },
            {
              type: 'math',
              display: true,
              tex: 'P_{ac} = V_{ac} \\times I_{ac} \\times \\cos(\\varphi) \\times \\sqrt{3}',
            },
            {
              type: 'text',
              content:
                "Un modèle de deep learning (MLP, LSTM, TCN) qui reçoit ces grandeurs brutes choisit par descente de gradient la **solution de facilité**~: apprendre cette formule instantanée au lieu d'anticiper les passages nuageux ou les conditions météo. En production, à l'instant $t$ pour prédire $t{+}24$~h, ces télémesures sont par définition **physiquement inexistantes**~: un modèle entraîné sur cette variante est donc inutilisable en conditions réelles.",
            },
            {
              type: 'text',
              content:
                "**Le problème de la persistance temporelle**\n\nLa puissance PV est une série très continue de jour~: des lags électriques trop proches ($t$-1h, $t$-2h) transforment le modèle en simple opérateur de décalage qui prédit «~demain = aujourd'hui~». Mais à Diass, les phénomènes sahéliens (passages nuageux rapides, tempêtes de poussière, vents de mousson) créent des variations de puissance brutales~: un modèle persistant affiche un excellent $R^2$ moyen par ciel bleu mais des erreurs catastrophiques dès qu'un nuage passe, mettant en péril la stabilité du réseau.",
            },
            {
              type: 'text',
              content:
                "**La démarche : variables causales (*Physics-Informed ML*)**\n\nL'objectif n'est pas de supprimer le SCADA électrique, mais de le transformer en **variables causales**~: les mesures brutes à l'instant $t$ (futur, circularité) deviennent des indicateurs d'état connus à $t{-}24$~h (passé légal *day-ahead*). Les variables électriques de la veille ne prédisent pas le soleil de demain, mais elles décrivent l'état de dégradation thermique de l'onduleur et l'encrassement des panneaux. En combinant physique et SCADA passé (ex.~: ratio $P_{dc,\\text{lag\\_24h}} / G_{sw,\\text{lag\\_24h}}$), on crée un indicateur de Performance Ratio dynamique~: c'est lui qui permet aux modèles avancés (TFT, TCN) d'ajuster le modèle météo global aux spécificités techniques et aux pertes réelles de la centrale.",
            },
            {
              type: 'text',
              content:
                "**Matrice de transformation**\n\nLe tableau ci-dessous présente la correspondance entre chaque variable SCADA brute et sa transformation causale. Les 11~variables contemporaines interdites sont remplacées par 11~variables transformées, toutes décalées d'au moins 24~heures ou calculées sur des fenêtres glissantes passées.",
            },
            {
              type: 'table',
              caption:
                'Substitution des variables électriques brutes~: toute grandeur contemporaine cède la place à un retard de 24~heures ou à un indicateur reconstruit sur le passé.',
              headers: ['Variable brute', 'Nature du risque', 'Remplacement', 'Ce que le remplacement apprend'],
              rows: [
                ['`I_ac`, `I_dc`', 'Fuite totale', '`I_dc_lag_24h` et rapport `I_dc_lag_24h`/`G_sw_lag_24h`', 'Encrassement des modules'],
                ['`V_dc`, `V_dc_inv`', 'Fuite indirecte', '`V_dc_lag_24h` et écart `V_dc_lag_4h` $-$ `temp_air_lag_4h`', 'Surchauffe de cellule déduite de la chute de tension'],
                ['`P_dc`, `P_dc_inv`', 'Fuite la plus forte', 'Rapport `P_ac_lag_24h`/`P_dc_lag_24h`', "Rendement de conversion réel de l'onduleur"],
                ['`V_ac`, `grid_freq`', 'Bruit proche de la cible', '`V_ac_std_24h`, écart-type glissant', 'Stabilité du réseau et curtailment'],
                ['`cos_phi`', 'Fuite électrotechnique', '`cos_phi_lag_24h`', "Comportement de régulation de l'onduleur"],
                ['`energy_*kwh`', 'Cumul ouvert sur la durée', 'Différentiel `energy_ac_lag_24h` $-$ `energy_ac_lag_25h`', 'Productivité globale et vieillissement long terme'],
                ['`insolacion_kwh_m2`', 'Intégration clôturée sur elle-même', '`insolacion_lag_24h`', 'Inertie thermique résiduelle du sol'],
              ],
            },
            {
              type: 'text',
              content:
                "**Implémentation**\n\nCes transformations sont implémentées dans le script `diass.py`, le notebook n'en conservant que la justification scientifique. Le décalage temporel porte sur 96~pas, soit 24~heures à la résolution de 15~minutes. Les retards de 24~heures appliqués aux courants, aux tensions, au facteur de puissance et à l'insolation sont obtenus par décalage d'autant de pas et restent indéfinis sur les 96~premiers pas, faute de passé. Trois rapports composites mettent en regard le passé électrique et l'irradiance~: l'encrassement, quotient du courant continu de la veille et de l'irradiance au plan de la veille~; la conversion de l'onduleur, quotient des puissances alternative et continue de la veille~; et le rapport des courants alternatif et continu de la veille. Enfin, un écart-type glissant sur 24~heures, purement passé, résume la tension réseau sur la fenêtre $[t{-}95,\\; t]$.",
            },
            {
              type: 'text',
              content:
                "Les onze variables électriques brutes mesurées à l'instant même, courants, tensions, puissances, facteur de puissance, insolation et fréquence réseau, ne sont **jamais copiées** telles quelles dans le jeu de sortie. Seules les versions transformées, récapitulées au tableau ci-dessus, y survivent, et le parquet qu'elles composent constitue l'entrée du pipeline de feature engineering.",
            },
            {
              type: 'text',
              content:
                "Cette transformation causale convertit des variables interdites (circularité instantanée) en indicateurs d'état interprétables (encrassement, rendement d'onduleur, stabilité réseau), accessibles en conditions réelles *day-ahead*. Combinée à l'exclusion automatique des fuites par corrélation (section ci-dessous), elle garantit que les modèles n'apprennent que des relations causales exploitables en opération.",
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Feature Engineering',
          blocks: [
            {
              type: 'text',
              content:
                "Le feature engineering de Diass repose sur le registre déterministe `DEFAULT_PLUGINS` du module `features/engineering.py`, qui instancie **sept plugins** exécutés en séquence. Cette liste constitue la source de vérité d'exécution.",
            },
            {
              type: 'table',
              caption: 'Features spécifiques au site de Diass (extrait).',
              headers: ['Catégorie', 'Feature', 'Description'],
              rows: [
                { group: 'Solaire' },
                ['`solar_elevation`', 'Hauteur solaire ($\\alpha_s$)'],
                ['`clear_sky_ghi`', 'GHI théorique ciel clair (Ineichen--Perez)'],
                ['`g_poa`', 'Irradiance sur le plan des modules'],
                ['`module_temp`', 'Température de cellule (modèle NOCT)'],
                { group: 'Temporel' },
                ['`hour_sin/cos`', 'Heure cyclique'],
                ['`is_harmattan`', 'Indicateur saison sèche (déc.--fév.)'],
                ['`is_mousson`', 'Indicateur hivernage (juil.--sept.)'],
                { group: 'Lags' },
                ['`ghi_lag_1h`, `_24h`, `_72h`', "Lags causaux d'irradiance"],
                ['`P_ac_lag_1h` -- `_72h`', 'Lags causaux de puissance'],
                ['`soiling_ratio_hist_24h`', "Indice d'encrassement $J{-}1$ (diass.py)"],
              ],
            },
            {
              type: 'text',
              content:
                "Les familles de features mobilisées sont les suivantes~: la **géométrie solaire** (`solar_elevation`, `solar_azimuth`, `clear_sky_ghi`, déterministes et calculables à l'avance)~; l'**irradiance** (`ghi`, `dni`, `dhi`, `g_poa`)~; la **température** (`temp_air`, `module_temp` via le modèle NOCT)~; les **aérosols et nuages** (`aod`, `dust`, `pm10`, `pm2_5`, `cloud_cover`)~; les **variables temporelles** (`hour_sin/cos`, jour de l'année, `is_harmattan`, `is_mousson`)~; et les **lags et statistiques glissantes** causaux (`_lag_1h` à `_72h`, moyennes et écarts-types sur 24~heures). Les variables électriques historiques (`soiling_ratio_hist_24h`, rendements onduleur, stabilité réseau) sont construites en amont dans `diass.py` par décalage de 24~heures et consommées telles quelles par les plugins, sans jamais introduire de grandeur contemporaine de la cible.\n\nDans le run de référence du 6~octobre 2026, cette chaîne produit 543~variables numériques en entrée de sélection, pour une union finale de 424~features (cible exclue), soit une dimension d'entrée de 425 pour les modèles et un parquet de features de 8~800 lignes et 428 colonnes.",
            },
            {
              type: 'text',
              content:
                "**Détail des sept plugins de feature engineering**\n\nLes sept plugins du registre, dans leur ordre d'exécution, sont les suivants. Chacun ajoute ses colonnes au DataFrame et la cible `P_ac` est préservée tout au long de la chaîne.",
            },
            {
              type: 'list',
              items: [
                "**`TemporalFeatureEngineer`**~: il encode le temps de manière cyclique (heure, jour de semaine, jour de l'année et mois en sinus/cosinus) et construit les indicateurs `is_daytime`, `is_harmattan`, `is_mousson` et `is_hivernage`, qui structurent les régimes saisonniers sahéliens.",
                '**`CommonWeatherEngineer`**~: il dérive les variables météorologiques communes (humidité, point de rosée, pression, précipitations) et leurs transformations directement exploitables par les modèles.',
                '**`GridFrequencyEngineer`**~: il traite la fréquence du réseau et ses écarts à 50~Hz comme indicateurs de stabilité et de curtailment, à partir des historiques $J{-}1$ exclusivement.',
                "**`SolarPhysicalEngineer`**~: il calcule les grandeurs physiques solaires (élévation, azimut et zénith solaires, déclinaison, masse d'air, `clear_sky_ghi`, indices de ciel clair, `g_poa`, température de cellule et pertes thermiques) à partir de la latitude du site et du modèle d'Ineichen--Perez.",
                "**`SolarWeatherEngineer`**~: il constitue le point d'extension documenté pour les features météorologiques spécifiquement solaires et transmet sans altération les variables requises par les étapes aval.",
                "**`SolarElectricalEngineer`**~: il consomme exclusivement les colonnes historiques $J{-}1$ produites par `build_diass_raw` (rendements onduleur bornés, ratios de conversion, drapeaux de clipping et d'état opérationnel) et refuse par construction toute grandeur électrique contemporaine de la cible, ainsi que tout terme en $\\Delta P$ qui en serait une transformation quasi linéaire.",
                "**`LagRollingFeatureEngineer`**~: il construit les retards causaux (`shift` strictement positif, par exemple 1, 2, 3, 24, 48 et 72~heures pour `ghi` et `P_ac`) et les statistiques glissantes calculées sur le passé et le présent uniquement, ce qui garantit l'absence d'accès au futur.",
              ],
            },
            {
              type: 'text',
              content:
                "Deux modules complémentaires ne font pas partie du registre par défaut~: le `FrequencyFeatureEngineer`, activable explicitement pour l'analyse spectrale, et le `SolarLossEngineer` (constantes de pertes LID, PID, mismatch, câblage et dégradation annuelle), qui reste disponible sans être exécuté dans le run courant. L'indice de soiling `soiling_ratio_hist_24h` n'est pas produit par un plugin~: il est calculé dans `diass.py` comme le rapport $I_{\\text{dc},J-1}/G_{\\text{sw},J-1}$ borné puis propagé, et il est ensuite consommé comme tout autre historique causal.",
            },
            {
              type: 'figure',
              src: '/figures/features_pipline_flow.drawio_.png',
              caption:
                "Boucle de feature engineering~: les sept plugins de `DEFAULT_PLUGINS` s'exécutent en séquence déterministe, suivis du ménage anti-fuite (constantes, corrélation $>0{,}99$, doublons) et des étapes opt-in (rythmes, encodage).",
              heightClass: 'h-80 md:h-[28rem]',
            },
            {
              type: 'text',
              content:
                "**Prévention du data leakage dans les lags et rolling statistics**\n\nChaque plugin de lags et de statistiques glissantes est conçu pour être **causal**~: à l'instant $t$, seules les données antérieures ou contemporaines ($\\leq t$) sont accessibles, ce que garantissent trois mécanismes. La fonction `shift(h)` décale la série de $h$~pas vers le futur~: à l'instant $t$, la feature `col_lag_hh` contient la valeur de `col` à $t{-}h$, les $h$~premiers pas restant à `NaN` faute de passé disponible. La fenêtre `.rolling(window=w, min_periods=1)` opère sur l'intervalle $[t{-}w{+}1,\\; t]$, exclusivement passé et présent~; `col_mean_24h` à l'instant $t$ est ainsi la moyenne des 24~dernières heures. Enfin, `diff(p)` calcule $\\text{value}[t] - \\text{value}[t{-}p]$, et les profils horaire et journalier recourent à une moyenne cumulée causale (`cumsum`/`cumcount` par groupe) qui n'intègre que les occurrences $\\leq t$. Ces garanties sont vérifiées par construction~: aucune feature n'accède à des valeurs futures de la cible ou des covariables.",
            },
            {
              type: 'text',
              content:
                "**Exclusion automatique des fuites de données**\n\nLe pipeline exclut automatiquement, en amont de la sélection, toute feature numérique dont la corrélation absolue de Pearson avec la cible `P_ac` dépasse le seuil `config.features.leakage_threshold` ($0{,}99$), à l'exception des drivers physiques explicitement autorisés (`leakage_allowlist`~: irradiance, position solaire, couverture nuageuse). Dans le run de référence du 6~octobre 2026, une seule variable est ainsi écartée (`P_ac_seasonal_dev`). Cette vérification garantit que les modèles n'accèdent pas à la cible par des voies dérivées indirectes et fonde la validité de l'évaluation sur le segment de test.",
            },
            {
              type: 'text',
              content:
                "**Pipeline de feature engineering : du parquet aux features**\n\nLe parquet brut (`raw_input.parquet`, 58~colonnes à 15~minutes, 55 hors imputation) est chargé par la fonction `data_pipeline()`, qui enchaîne six opérations. Le rééchantillonnage passe de 15~minutes à 1~heure (8~800~lignes), par moyenne pour les grandeurs instantanées, somme pour les taux et report de la dernière valeur pour les compteurs cumulatifs, selon le rôle physique de chaque colonne. Great Expectations valide ensuite les colonnes critiques. Le prétraitement nettoie les horodatages, borne physiquement les valeurs aberrantes, interpole sur 6~heures au plus, propage sur 24~heures au plus et remplace par `NaN` les valeurs hors de $3\\times\\text{IQR}$. Le feature engineering exécute les sept plugins du registre `DEFAULT_PLUGINS` en séquence déterministe, chacun ajoutant ses colonnes. Un nettoyage post-plugins supprime les colonnes à variance nulle (`nunique` $\\leq$~1, cible préservée), exclut les dérivées quasi linéaires de la cible ($|\\rho| > 0{,}99$, section ci-dessus) et, en option, les colonnes strictement dupliquées. La sélection applique enfin les sept méthodes en série puis en fait l'union (section ci-dessous).",
            },
            {
              type: 'text',
              content:
                "**Sélection de features par union de 7~méthodes**\n\nLa sélection est réalisée par le module `FeatureSelector` qui applique 7~méthodes indépendantes. La sélection finale est l'**union** des features retenues par chaque méthode (stratégie conservatrice maximisant le rappel)~:",
            },
            {
              type: 'table',
              caption:
                "Résultats de la sélection sur Diass (run du 6~octobre 2026)~: 543~variables en entrée, 424 retenues en union des sept méthodes (cible exclue). Têtes d'union~: `T_inv`, `G_sw`, `ghi`, `dni`, `dhi`, `cloud_cover`.",
              headers: ['Méthode', 'Retenues', 'Sur', '%', 'Critère'],
              rows: [
                ['Correlation', '349', '543', '64,3', '$|r| > 0{,}01$'],
                ['Mutual Information', '2', '543', '0,4', 'Top 2 (`P_ac_max_3h`, `P_ac_max_6h`)'],
                ['PCA', '0', '543', '0,0', '(composantes, pas features)'],
                ['RFE', '50', '543', '9,2', 'Rang 1 (`dust`, `pressure`, `wind_gust`…)'],
                ['VIF', '527', '543', '97,1', 'VIF $\\leq$ 5,0'],
                ['Permutation', '2', '543', '0,4', 'Top 2 (`P_ac_trend_dev`, `G_sw`)'],
                ['SHAP', '2', '543', '0,4', 'Top 2 (`P_ac_trend_dev`, `P_ac_hourly_profile`)'],
                ['Union brute', '542', '543', '99,8', '---'],
                ['Redondances dédupliquées', '118', '---', '---', '$|r| > 0{,}90$'],
                ['**Union finale**', '**424**', '**543**', '**78,1**', '---'],
              ],
            },
            {
              type: 'table',
              caption: "Répartition par famille de l'union finale (424~features, section 3.2 du notebook).",
              headers: ['Famille', 'N', '%'],
              rows: [
                ['Lags / fenêtres $J{-}1$', '137', '32,3'],
                ['Réanalyse / atmosphère', '123', '29,0'],
                ['Autres', '62', '14,6'],
                ['Météo locale (station)', '54', '12,7'],
                ['Physique PV', '23', '5,4'],
                ['Rendement / onduleur', '15', '3,5'],
                ['Temporel (sin/cos/heure)', '10', '2,4'],
                ['194 retenues par une seule méthode, **aucune** par les sept', '---', '---'],
              ],
            },
            {
              type: 'figure',
              src: '/figures/nb_diass_sel_familles.png',
              caption:
                "Répartition de l'union finale des 424~variables retenues par famille~; les lags de la veille dominent, suivis des réanalyses atmosphériques.",
              heightClass: 'h-80 md:h-96',
            },
            {
              type: 'text',
              content:
                "La stratégie d'union (plutôt qu'intersection) est conservatrice et maximise le rappel~: le consensus entre méthodes est faible (aucune feature retenue par les sept, 194 par une seule), de sorte qu'un vote majoritaire éliminerait les informations que seule une méthode sait isoler.",
            },
            {
              type: 'text',
              content:
                "**Discussion des méthodes et de leurs usages**\n\nLes **sept méthodes** mises en concurrence ne jouent pas le même rôle~: elles diffèrent par ce qu'elles mesurent (liaison linéaire, dépendance non linéaire, redondance, contribution prédictive), par le type de modèle qu'elles supposent et par l'information qu'elles produisent (rang, importance, variance). Le tableau ci-dessus et la figure ci-dessous en résument les enseignements~:",
            },
            {
              type: 'figure',
              src: '/figures/nb_diass_sel_volume.png',
              caption:
                'Nombre de variables retenues par chacune des sept méthodes de sélection.',
              heightClass: 'h-64 md:h-72',
            },
            {
              type: 'text',
              content:
                "La **corrélation de Pearson** ($|r|$ avec $P_{ac}$, seuil $|r| > 0{,}01$) est un filtre *linéaire* et rapide~: elle capte les drivers physiques directs (irradiance, `G_sw`) mais manque les dépendances non linéaires, et reste, avec 349 retenues (64,3~\\%), la méthode la plus large après le VIF. L'**information mutuelle** mesure la dépendance *générale*, linéaire ou non, sans hypothèse de modèle~; très sélective (top-2), elle ne retient ici que des fenêtres de la cible (`P_ac_max_3h`, `P_ac_max_6h`). La **PCA** est une méthode de *réduction de dimension* et non de sélection de colonnes~: elle éclaire la structure latente du jeu (dominée par l'arc diurne) sans fournir de composantes directement interprétables par le TFT. Le **RFE** (élimination récursive, rang inverse, `LinearRegression`) est un *wrapper* qui retire itérativement les features les moins contributives~; ses 50 retenues (9,2~\\%) privilégient les drivers météo et physiques (`dust`, `pressure`, `wind_gust`, `ratio_iac_idc_hist`). Le **VIF** (variance inflation factor, VIF $\\le 5{,}0$) mesure la *multicolinéarité* et non le pouvoir prédictif~; avec 527 retenues (97,1~\\%), c'est le plus permissif, signe que peu de variables sont fortement redondantes dans le jeu réel. La **permutation importance** (Random Forest) estime une importance *post*-modèle en permutant chaque feature~; très sélective, elle retient `P_ac_trend_dev` et `G_sw`. Le **SHAP**, importance additive *post*-modèle (moyenne de $|$SHAP$|$), est plus coûteux mais offre une interprétation locale cohérente~; ses deux têtes sont `P_ac_trend_dev` et `P_ac_hourly_profile`.",
            },
            {
              type: 'text',
              content:
                "L'issue dépend de l'échelle de décision~: une **union** de 424~features (figure ci-dessous) conserve l'essentiel du spectre, réparti entre réanalyse/atmosphère (29,0~\\%, 123), lags/fenêtres $J{-}1$ (32,3~\\%, 137) et météo locale (12,7~\\%, 54), comme le détaille la figure ci-dessus. Le consensus entre méthodes est faible (aucune feature n'est retenue par les sept méthodes, 194 par une seule)~: c'est précisément pourquoi l'union, plutôt qu'un vote majoritaire, est la stratégie robuste retenue.",
            },
            {
              type: 'figure',
              src: '/figures/nb_diass_sel_top12.png',
              caption:
                'Top-12 features de chaque méthode sur leur score normalisé. Chaque méthode met en avant des familles différentes (physique pour la corrélation et le VIF, météo pour le RFE, dérivées de la cible pour la permutation et le SHAP), confirmant la complémentarité des perspectives.',
              heightClass: 'h-64 md:h-72',
            },
            {
              type: 'text',
              content:
                "En résumé, 58~colonnes brutes entrent dans le pipeline, 543~features en sortent, et la sélection en retient 424 après exclusion des fuites et déduplication des redondances. Les familles préservées sont celles qu'on attend d'un site solaire~: lags et fenêtres $J{-}1$ (32~\\%), réanalyse atmosphérique (29~\\%), météo locale (13~\\%), physique PV (5~\\%). Aucune famille n'est sacrifiée au profit d'une autre, ce qui est précisément ce que vise une union.",
            },
            {
              type: 'text',
              content:
                "**Optimisation des hyperparamètres avec Optuna**\n\nL'entraînement des modèles avancés (TCN, TFT) repose sur une recherche d'hyperparamètres pilotée par **Optuna**. Les hyperparamètres (taux d'apprentissage, `batch_size`, `mse_weight`, planificateur de taux, fenêtres, architecture) ne sont pas fixés arbitrairement~: Optuna les propose et **évalue chaque combinaison** en entraînant le modèle et en mesurant sa performance de validation, remplaçant ainsi la grille exhaustive ou le réglage manuel. L'échantillonneur retenu est un **TPE** (*Tree-structured Parzen Estimator*), méthode bayésienne qui modélise la distribution des bons résultats et concentre les essais dans les régions prometteuses de l'espace plutôt que d'explorer uniformément~; chaque essai est tracé avec son objectif, ce qui permet de suivre la convergence. Un élagage **médian** interrompt par ailleurs les essais déjà nettement pires que la médiane des essais en cours, économisant le temps de calcul sans compromettre le résultat. L'objectif minimise une métrique de validation adaptée à la prévision probabiliste, la perte hybride MSE + pinball pondérée par `mse_weight` $= 0{,}5$ (chapitre 7), en explorant `mse_weight` $\\in [0{,}3; 0{,}8]$ sur deux décades de taux d'apprentissage et plusieurs planificateurs (plateau, cosinus, warmup cosinus). Pour les baselines, dix essais suffisent car leur espace est réduit~; pour le TCN et le TFT, davantage d'essais sont consacrés à l'architecture et à la stratégie d'horizon. Le meilleur essai est ensuite figé (graine $42$, arrêt précoce configuré séparément) et enregistré dans MLflow avec son `run_id`.\n\nLa même graine et les mêmes bornes permettent de retrouver exactement les modèles évalués à la section ci-dessous.",
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Entraînement et résultats',
          blocks: [
            {
              type: 'text',
              content:
                "Cinq modèles ont été entraînés sur les données de Diass avec un horizon de prévision de **72~heures**~: les trois repères usuels, la persistance, le MLP et le LSTM de base, entraînés via le pipeline des baselines avec dix essais d'optimisation~; puis le TCN et le TFT, entraînés via le pipeline général avec dix essais, la perte hybride de MSE et de pinball, et les covariables météorologiques NWP injectées au canal futur. Tous sont évalués sur le même segment de test, **1~049 fenêtres** allant d'un historique de 168~heures vers 72~heures d'horizon, sur la période du 16/07/2026 06h00 au 28/08/2026 22h00 prolongée de 72~h~; les métriques ci-dessous sont issues du notebook `diass.ipynb` (run du 6~octobre 2026)~:",
            },
            {
              type: 'figure',
              src: '/figures/puml_03_pipeline_training.png',
              caption:
                "Pipeline d'entraînement `training_pipeline`~: découpage chronologique 70/15/15 avec normalisation ajustée sur l'entraînement seul, optimisation Optuna optionnelle, apprentissage avec arrêt précoce, évaluation et calibration conforme (CQR par défaut), puis journalisation MLflow et locale.",
              heightClass: 'h-80 md:h-[28rem]',
            },
            {
              type: 'table',
              caption:
                'Résultats sur le segment de test de Diass (horizon 72~h, 1~049 fenêtres)~: métriques ponctuelles pour tous les modèles, métriques probabilistes pour TCN et TFT.',
              headers: ['Modèle', 'RMSE (MW)', 'MAE (MW)', 'nRMSE', '$R^2$', 'MAPE (%)'],
              rows: [
                ['persistence', '6,905', '4,987', '0,444', '$-1{,}013$', '3282,8'],
                ['MLP', '2,323', '1,275', '0,149', '0,772', '381,5'],
                ['`lstm_baseline`', '2,043', '1,148', '0,131', '0,824', '333,3'],
                ['TCN', '1,707', '0,989', '0,110', '0,877', '362,2'],
                ['TFT', '1,818', '1,157', '0,117', '0,861', '502,0'],
              ],
            },
            {
              type: 'table',
              caption:
                'Métriques probabilistes sur le test (quantiles $0{,}1$/$0{,}5$/$0{,}9$, $\\alpha{=}0{,}20$)~: couverture et largeur avant recalibrage, score de Winkler, pinball des bornes, puis couverture et largeur après recalibrage CQR.',
              headers: ['Modèle', 'Couv.', 'Largeur', 'Winkler', 'Pinball bas/haut', 'Couv. CQR', 'Largeur CQR'],
              rows: [
                ['TCN', '0,608', '1,670', '5,742', '0,325 / 0,250', '0,798', '2,596'],
                ['TFT', '0,713', '2,456', '5,964', '0,323 / 0,273', '0,742', '2,646'],
                {
                  group:
                    'Croisements de quantiles~: 0,0 pour les deux modèles. $s_h$ moyen/max~: TCN 0,463/0,613~MW~; TFT 0,095/0,156~MW.',
                },
              ],
            },
            {
              type: 'text',
              content:
                "Temps de calcul du run courant~: persistence 3~s, MLP 519~s, `lstm_baseline` 863~s, TCN 1~206~s, TFT 2~016~s. Les baselines ne produisent que des prévisions ponctuelles (métriques de calibration non applicables).",
            },
            {
              type: 'text',
              content:
                "La MAPE très élevée des baselines (3282,8~\\% pour la persistence) tient à la production quasi nulle en début et fin de journée, où le moindre écart pèse énormément en relatif. Les modèles avancés la réduisent d'un ordre de grandeur~; à l'inverse, la MAPE du TFT (502~\\%) est *supérieure* à celle du LSTM baseline (333~\\%), ce qui illustre la fragilité de cette métrique près de zéro production~: elle pénalise disproportionnellement les erreurs matinales et vespérales, sans rapport avec la qualité globale. Le R$^2$ et la RMSE, plus robustes, classent le TCN en tête ($R^2{=}0{,}877$, RMSE 1,71~MW).",
            },
            {
              type: 'text',
              content:
                "**Perte hybride et hyperparamètres retenus**\n\nLes modèles TCN et TFT ne sont pas entraînés avec une simple MSE~: ils utilisent la **perte hybride** multi-tâche du chapitre 7, dont la composante MSE optimise l'exactitude ponctuelle ($R^2$, RMSE) et la composante pinball la calibration des intervalles.",
            },
            {
              type: 'text',
              content:
                "La valeur retenue pour Diass est $w_{\\text{mse}} = 0{,}5$ par défaut (contribution égale), la plage HPO explorant $w_{\\text{mse}} \\in [0{,}3; 0{,}8]$. Ce compromis équilibré est justifié par le climat sahélien~: les passages nuageux rapides et les tempêtes de poussière rendent l'estimation de l'incertitude aussi critique que la prévision ponctuelle pour la gestion du réseau.",
            },
            {
              type: 'text',
              content:
                "Chaque modèle a fait l'objet de dix essais Optuna, conduits avec l'échantillonneur TPE et l'élagage médian présentés à la section ci-dessus. Les meilleurs essais retenus sont les suivants. Le MLP combine un poids hybride de 0,354, trois couches de 256~neurones, un dropout de 0,286, des lots de 64, un plateau et un taux d'apprentissage de $1{,}35{\\times}10^{-3}$. Le LSTM de base retient le même lot et la même profondeur, un dropout de 0,10, un planning cosinus et un taux de $1{,}88{\\times}10^{-4}$, pour un poids de 0,440. Le TCN retient des canaux de 64, 128, 256 et 256, un noyau de 5, un dropout de 0,252, 64 par lot, une montée en charge cosinus de cinq époques et un taux de $3{,}29{\\times}10^{-4}$, pour un poids de 0,765. Le TFT retient une dimension de 256 sur deux têtes, un dropout de 0,15, des lots de 128, un plateau et un taux de $6{,}92{\\times}10^{-4}$, pour un poids de 0,617.",
            },
            {
              type: 'text',
              content:
                "**Résultats TCN**\n\nLe TCN atteint sur le test une RMSE de **1,707~MW** et une MAE de **0,989~MW** ($R^2{=}0{,}877$). Sa couverture P10--P90 avant recalibrage vaut $60{,}8\\,\\%$ (largeur $1{,}670$~MW, Winkler $5{,}742$) et passe à **79,8~\\%** après recalibrage CQR ($\\alpha{=}0{,}20$, $s_h$ moyen $0{,}463$~MW, largeur $2{,}596$~MW), proche de la cible de 80~\\%.",
            },
            {
              type: 'text',
              content:
                "**Résultats TFT**\n\nLe TFT atteint **RMSE 1,818~MW**, **MAE 1,157~MW**, $R^2{=}0{,}861$. Sa couverture avant recalibrage vaut $71{,}2\\,\\%$ (largeur $2{,}456$~MW, Winkler $5{,}964$) et passe à **74,2~\\%** après CQR ($s_h$ moyen $0{,}095$~MW, largeur $2{,}646$~MW). Son interprétabilité (sélection de variables, attention) en fait un outil précieux côté opérateur, au prix d'une couverture calibrée inférieure à celle du TCN.",
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Analyse des résultats',
          blocks: [
            {
              type: 'text',
              content:
                "**Courbes d'entraînement**\n\nLes courbes d'entraînement du run courant (section 5.1 du notebook) montrent une convergence régulière des deux modèles avancés, avec early stopping (patience 25, maximum 100 époques)~: le TCN s'arrête à l'époque 57 et le TFT va au terme des 100 époques. Les pertes finales de validation restent proches des pertes d'entraînement, ce qui indique une bonne généralisation sans surapprentissage marqué.",
            },
            {
              type: 'figure',
              src: '/figures/nb_diass_learning_curves.png',
              caption:
                "Courbes d'entraînement (pertes train/validation) du TCN ($R^2{=}0{,}877$) et du TFT ($R^2{=}0{,}861$) sur Diass (section 5.1 du notebook).",
              heightClass: 'h-64 md:h-72',
            },
            {
              type: 'text',
              content: '**Performance sur la fenêtre de test**',
            },
            {
              type: 'figure',
              src: '/figures/nb_diass_fenetres_test.png',
              caption:
                'Fenêtres de test représentatives (début, milieu et fin du test)~: médiane P50, enveloppe P10--P90 et production réelle pour le TCN et le TFT, avec la MAE de chaque fenêtre. Les deux modèles suivent le cycle diurne et les chutes liées aux nuages~; les écarts les plus importants surviennent aux transitions jour/nuit.',
              heightClass: 'h-64 md:h-72',
            },
            {
              type: 'text',
              content:
                "Le TCN reproduit fidèlement le cycle diurne et capte les variations rapides liées au passage des nuages~; ses écarts les plus marqués surviennent aux transitions jour--nuit et lors des changements brusques d'irradiance, ce qui est attendu d'un modèle convolutionnel.",
            },
            {
              type: 'text',
              content:
                "**Comparaison des métriques sur le test**\n\nLa figure ci-dessous confirme la supériorité du TCN (RMSE 1,707~MW, $R^2{=}0{,}877$) sur le TFT (RMSE 1,818~MW, $R^2{=}0{,}861$), tandis que les baselines (persistence, MLP, `lstm_baseline`) restent nettement en retrait. L'écart entre les deux architectures avancées est toutefois limité~: sur ce site, la couverture de l'enveloppe P10--P90 après CQR est le critère qui les départage le plus nettement (TCN 79,8~\\% vs TFT 74,2~\\%).",
            },
            {
              type: 'figure',
              src: '/figures/nb_diass_comparaison_metriques.png',
              caption:
                'Comparaison des métriques RMSE, MAE et $R^2$ sur le test~: barres triées, meilleur modèle entouré en rouge, baselines en gris et modèles avancés en bleu. Le TCN devance légèrement le TFT sur les trois métriques ponctuelles.',
              heightClass: 'h-64 md:h-72',
            },
            {
              type: 'text',
              content:
                "**Prévision batch à 72~heures**\n\nLe pipeline d'inférence produit en mode batch une prévision à 72~h avec enveloppe P10--P90~: sur le run courant, la prévision du site vaut $p_{50} = 0{,}965$~MW.",
            },
            {
              type: 'figure',
              src: '/figures/puml_04_serving_inference.png',
              caption:
                'Serving et inférence~: le singleton `InferenceService` sélectionne le modèle de la génération courante (imposé $>$ site $>$ type, meilleur $R^2$), construit la dernière fenêtre normalisée et prédit P+72~h avec enveloppe P10--P90, persistée en parquet horodaté.',
              heightClass: 'h-80 md:h-[28rem]',
            },
            {
              type: 'figure',
              src: '/figures/nb_diass_prevision_batch_72h.png',
              caption:
                "Prévision batch à 72~heures~: médiane P50 et enveloppe P10--P90, séparateurs J+1 et J+2. L'enveloppe s'élargit avec l'horizon, conformément à la croissance de l'incertitude.",
              heightClass: 'h-64 md:h-72',
            },
          ],
        },
      ],
    },
    {
      type: 'section',
      title: 'Discussion et perspectives',
      blocks: [
        {
          type: 'subsection',
          title: 'Compromis TCN / TFT',
          blocks: [
            {
              type: 'text',
              content:
                "Les performances des modèles sont quantifiées avec les métriques définies au chapitre 4, sans redéfinir ici leurs formules. Le tableau ci-dessus rassemble les résultats ponctuels des cinq modèles sur le test de Diass et le second tableau les métriques probabilistes des deux architectures avancées.",
            },
            {
              type: 'text',
              content:
                "Sur Diass, le TCN devance le TFT sur les trois métriques ponctuelles (R$^2$ 0,877 vs 0,861~; RMSE 1,71 vs 1,82~MW) et sur la couverture calibrée (79,8~\\% vs 74,2~\\%). Deux raisons expliquent cet avantage~: la convolution dilatée capte le motif diurne quasi-périodique du solaire mieux que l'attention, et le TCN compte un ordre de grandeur de paramètres en moins, ce qui réduit le surapprentissage sur une année d'entraînement. Le TFT garde pour lui l'interprétabilité (VSN, poids d'attention), qui n'est pas un luxe pour un opérateur~: la sélection de variables et les cartes d'attention permettent de comprendre pourquoi le modèle prévoit une baisse à un horizon donné, information que le TCN ne fournit pas nativement.",
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Implications pour la SENELEC',
          blocks: [
            {
              type: 'text',
              content:
                "**Précision nécessaire**\n\nLa SENELEC gère un réseau à marge de manœuvre limitée. Pour le site de Diass (27,3~MWc installés, 23,1~MW publiés), une marge d'erreur de **5~MW** est jugée acceptable pour le dispatch quotidien, soit une exigence de RMSE inférieure à $5$~MW, ou $22\\,\\%$ de la capacité publiée. Cette marge définit la précision que les modèles doivent atteindre pour être opérationnels à 72~heures. Les deux architectures avancées la respectent largement, ce qui laisse une marge de sécurité confortable pour l'exploitant.",
            },
            {
              type: 'text',
              content:
                "**Intervalles pour le dispatch**\n\nUn intervalle P10--P90 est directement exploitable pour le dispatch. Sa borne haute dimensionne la réserve de sécurité à mobiliser, sa borne basse indique le plancher de production sur lequel la SENELEC peut compter pour ne pas démarrer de thermique inutilement. Entre les deux, la distribution des quantiles permet d'estimer la probabilité de franchir un seuil critique (10~\\% de la capacité, par exemple), information que la seule prévision ponctuelle ne donne pas. Combinée aux prévisions de charge, elle éclaire le niveau de production thermique à activer.",
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Comparaison aux performances publiées sur le site de Diass',
          blocks: [
            {
              type: 'text',
              content:
                "Avant d'évaluer la qualité prédictive des modèles (section ci-dessus), il convient de situer le **gisement mesuré et le rendement obtenu** face aux valeurs publiées pour cette même centrale. Quatre références ont été vérifiées à la source~: deux travaux de performance énergétique (Ndiaye, 2025 ; Sarr, 2025), une étude de prévision par réseaux de neurones (Diop, 2022) et une référence de modélisation stochastique du rayonnement (Mbaye, 2019).",
            },
            {
              type: 'text',
              content:
                "Le calcul suit la norme IEC~61724 sur la période d'exploitation réellement couverte par les données, avec pour puissance de référence le nominatif AC des onduleurs ($P_{\\mathrm{nom}} = 36 \\times 680 = 24{,}48~\\mathrm{MW}$). Le gisement de référence $Y_{\\mathrm{ref}}$ est intégré sur l'irradiance globale horizontale, afin de rester comparable à la source publiée.",
            },
            {
              type: 'table',
              caption:
                'Comparaison du gisement et du rendement de Diass aux valeurs publiées. deep-aero-sn~: 30/08/2025--31/08/2026 (367~jours, 8~800~h).',
              headers: ['Grandeur', 'deep-aero-sn', 'Ndiaye et al.', 'Écart'],
              rows: [
                ['Période', '2025--2026', '2022', '--'],
                ['Gisement $Y_{\\mathrm{ref}}$ (h/j)', '5,80', '5,83', '$-0{,}5\\,\\%$'],
                ['Rendement final $Y_{\\mathrm{f}}$ (h/j)', '3,76', '3,95', '$-4{,}8\\,\\%$'],
                ['Performance ratio (%)', '64,8', '64,65--75,82', 'dans la bande'],
                ['Énergie annualisée (GWh/an)', '33,6', '$\\sim$33,3', '$+0{,}9\\,\\%$'],
                ['Puissance de référence (MW)', '24,48 (AC)', '23,114 (MP)', '$+5{,}9\\,\\%$'],
              ],
            },
            {
              type: 'text',
              content:
                "Le gisement est fidèlement reproduit, à un demi-pour-cent près de la valeur publiée, ce qui atteste la cohérence du site, de son instrumentation et du calcul d'irradiance avec la source. Le rendement final reste légèrement en retrait, mais le *performance ratio* obtenu tombe dans la plage publiée. Deux précautions de méthode s'imposent~: le PR publié est un **PR de champ**, mesuré en fonctionnement continu, et non un PR final~; et le nôtre dépend de la convention retenue pour la puissance de référence, sachant qu'en reprenant la puissance publiée, le rendement et le PR restent également dans la plage attendue. **La conclusion reste donc robuste au choix de la puissance de référence.**",
            },
            {
              type: 'text',
              content:
                "Un écart de capacité demeure non résolu~: le matériel installé donne $85\\,248 \\times 320~\\mathrm{W} = 27{,}28~\\mathrm{MWc}$ en continu, contre $23{,}114~\\mathrm{MP}$ publiés, soit $15\\,\\%$ de moins. La puissance unitaire provient de la fiche technique du module Jinko JKM320PP-72-V et le nombre de modules est connu sans ambiguïté~; nous avons privilégié le matériel vérifiable et signalé l'écart plutôt que de l'ajuster artificiellement. Ce point demanderait une confirmation à partir des documents de réception de la centrale.\n\nDeux remarques finales complètent ce contrôle~: la géométrie retenue (inclinaison $15^\\circ$, azimut $0^\\circ$) correspond à la latitude du site, ce que corrobore la littérature sahélienne (Sarr, 2025)~; et le rapport $g_{\\mathrm{poa}}/g_{\\mathrm{hi}} \\simeq 0{,}88$, inférieur à~1, est physiquement attendu (à faible élévation, une part du flux diffus horizontal n'est pas interceptée par un plan incliné). Par ailleurs, les métriques de Diop (2022) (RMSE $0{,}003$~kWh inférieure à sa MAE $0{,}0223$~kWh, mathématiquement impossible) ne sont pas retenues comme référence, et Mbaye (2019) porte sur le rayonnement à 24~h, non sur la puissance. Le contrôle croisé confirme ainsi la cohérence du site~: gisement et PR concordent avec les valeurs publiées, et les écarts résiduels portent sur la capacité nominale, non sur la ressource.",
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
            "L'étude de cas de Diass valide l'ensemble du pipeline, de l'exploration des données à l'évaluation probabiliste, sur un site réel aux caractéristiques représentatives. Le feature engineering produit le vecteur d'entrée du run courant (543~variables, 424 retenues en union)~; les architectures TCN et TFT, chacune adaptée à un type de variabilité, fournissent des prévisions fiables à 72~heures. Le TCN devance légèrement le TFT sur les métriques ponctuelles ($R^2{=}0{,}877$) et la couverture calibrée (79,8~\\%)~; le TFT conserve pour sa part une interprétabilité (VSN, attention) que le TCN n'offre pas nativement.",
        },
        {
          type: 'text',
          content:
            "Une année d'entraînement suffit pour montrer que le pipeline tient sur Diass, pas pour garantir que les hyperparamètres retenus resteront stables d'une saison à l'autre. C'est la principale limite de ce travail~: la stabilité devra être vérifiée sur plusieurs années avant un déploiement opérationnel. Une seconde limite, plus structurelle, tient au pas horaire~: les passages nuageux sahéliens durent souvent moins d'une heure et sont lissés par le rééchantillonnage, ce qui plafonne mécaniquement la précision atteignable à 72~h. Un modèle dédié aux horizons courts (1--6~h, résolution 5--15~min) comblerait cette lacune, au prix d'une architecture distincte. Enfin, le coût mémoire du TFT, engendré par l'attention quadratique posée sur la fenêtre d'entrée, reste un frein pratique au déploiement embarqué, même si son interprétabilité en fait un outil précieux côté opérateur.",
        },
        {
          type: 'text',
          content:
            "La **reproductibilité** combine trois dispositifs~: un `run_id` unique par expérience, qui fixe hyperparamètres, graine et signature des features~; l'archivage des configurations dans des fichiers JSON~; et des données de Diass issues de sources publiques, réutilisables par d'autres chercheurs.",
        },
        {
          type: 'text',
          content:
            "Ce travail ouvre également trois pistes~: l'apprentissage par transfert vers un autre site solaire (le pipeline est déjà structuré par centrale), des modèles dédiés aux horizons de 1 à 6~heures à résolution fine, et l'apprentissage fédéré multi-sites sans partage des données brutes. La prochaine étape opérationnelle consiste à intégrer le pipeline au système de gestion du réseau de la SENELEC, en commençant par des phases pilotes sur Diass.",
        },
      ],
    },
  ],
}
