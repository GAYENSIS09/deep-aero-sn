import type { ChapterData } from './index'

export const chapterContent: ChapterData = {
  slug: '8-etudes-cas',
  title: 'Étude de cas : Diass (solaire)',
  part: 'Partie III — Application et évaluation',
  intro:
    "Les chapitres précédents ont posé le cadre physique, les architectures et la stratégie probabiliste. Ce chapitre les confronte à une centrale réelle : Diass, première centrale solaire publique du Sénégal. Sa structure fixe, son climat sahélien et sa production d'environ 34~GWh par an en font un cas représentatif de ce que la SENELEC devra gérer à mesure que le solaire monte en puissance.",
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
                "Le site de Diass est la **première centrale solaire photovoltaïque publique du Sénégal**. La **SENELEC** en est propriétaire et exploitante. Elle se situe dans le département de Mbour, à environ 40--50~km au sud-est de Dakar, près de l'aéroport international Blaise Diagne. Mise en service en mai 2022, elle marque un jalon de la transition énergétique du pays (SENELEC, 2025 ; SENELEC). Son financement vient d'un prêt de la banque allemande KfW ($\\sim$18~milliards FCFA).",
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
                "Les **modules polycristallins** sont posés sur une **structure fixe** inclinée à la latitude de Diass ($\\varphi = 14{,}65^\\circ$~N). Ce choix maximise le captage annuel sans la mécanique d'un tracker, et simplifie l'exploitation comme la maintenance. Il donne aussi une production régulière, structurée par l'arc diurne. Le site se trouve en zone sahélienne, l'un des gisements solaires les plus élevés d'Afrique : l'irradiance globale annuelle y est de l'ordre de 2~000~kWh/m²/an (Ajzoul).",
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
                "Trois familles de données alimentent le jeu final~: les mesures SCADA de la centrale, les réanalyses externes et les variables calculées à partir de la géométrie du site. Leur résolution, leur latence et leur fiabilité diffèrent. Le pipeline garde donc l'origine de chaque colonne, au lieu de tout fusionner : une prévision hérite de l'incertitude de ses entrées.",
            },
            {
              type: 'text',
              content:
                "**Données SCADA.** La période couverte va du 30 août 2025 au 31 août 2026. Les mesures proviennent de six classeurs Excel du superviseur Schneider~: paramètres DC, paramètres AC, mesures des DC Box, températures des cartes de puissance et deux ensembles météorologiques. Ces fichiers décrivent les équipements de la centrale, le compteur de livraison HTA et la station météo. Après normalisation des horodatages, les sources sont alignées sur une série de référence à 15 minutes : on obtient **35~196 lignes à 15~minutes et 58~colonnes**. Les variables SCADA y comptent environ 34~600 observations non manquantes ($T_{inv}$~: 34~606, $P_{ac}$~: 34~602, $G_{sw}$~: 34~601). Le pipeline agrège ensuite cette résolution à 1~heure, avant le feature engineering et l'apprentissage.",
            },
            {
              type: 'text',
              content:
                "Les grandeurs électriques sont ensuite ramenées à l'échelle de la centrale. Sur les 36 onduleurs, tensions et courants se moyennent, les puissances se somment quand chaque équipement y contribue. Les compteurs d'énergie se traitent comme des cumuls : la production d'un intervalle vaut l'écart entre deux valeurs successives, borné à zéro pour qu'un retour à zéro du compteur ne produise pas d'énergie négative. Les puissances SCADA s'expriment en kW : `P_dc`, `P_ac` et `P_dc_inv` passent en MW avant d'entrer dans la chaîne de modélisation.",
            },
            {
              type: 'text',
              content:
                "**Variables météorologiques et radiatives externes.** La station météo du site ne couvre pas tout le rayonnement solaire. On complète donc par des réanalyses horaires. NASA POWER, associé aux données MERRA-2, est la source principale, y compris pour le GHI. Seul problème : pour juin--août 2026, son GHI n'était pas encore disponible à l'extraction. On le remplace alors par les données Open-Meteo (ERA5).\n\nLes composantes DNI et DHI viennent d'Open-Meteo sur toute la période : NASA POWER ne les fournit pas à la résolution horaire interrogée. Open-Meteo apporte aussi la couverture nuageuse et plusieurs variables complémentaires.\n\nLes deux sources ne se contentent pas d'être concaténées. Les séries horaires s'alignent d'abord sur les horodatages SCADA, puis sur la grille de 15~minutes. Pour une variable commune, NASA POWER prime quand la donnée existe ; Open-Meteo la remplit quand elle manque. La source principale reste donc intacte, sans perte des derniers mois de la période. Le jeu transmis au feature engineering résulte de l'agrégation horaire, au regard du rôle physique de chaque colonne.",
            },
            {
              type: 'text',
              content:
                "**Variables calculées et paramètres d'installation.** Ces colonnes ne sont pas des mesures. `clear_sky_ghi` est calculé par le modèle d'Ineichen--Perez à partir des coordonnées du site ; son nom évite de le confondre avec l'albédo de surface. `surface_tilt` et `surface_azimuth` fixent la géométrie de l'installation à 15° et 0°. `albedo_sol` est une constante d'installation valant 0,2.\n\nCes variables restent dans le jeu parce qu'elles servent aux étapes suivantes, mais il ne faut pas les lire comme des observations SCADA. Chaque colonne porte donc l'une des quatre provenances~: mesure locale, réanalyse externe, variable calculée ou paramètre d'installation.",
            },
            {
              type: 'text',
              content:
                "**Prévisions météorologiques numériques (NWP).** Le modèle **ECMWF IFS HRES**, figé dans la configuration, alimente le pipeline en covariables futures. On l'interroge via l'API *Single Runs* d'Open-Meteo. Trois variables transitent par le canal des covariables futures des modèles TCN et TFT, sous forme de tenseur : couverture nuageuse totale, nuages bas et rayonnement à courte longueur d'onde. Elles n'entrent ni dans le scaler des features ni dans les baselines déterministes~: seul le modèle qui les consomme reçoit une tête supplémentaire.\n\nLa règle de causalité tient à la disponibilité opérationnelle~: pour une fenêtre émise à $t_{\\text{ém}}$, on retient le dernier run dont $\\text{init} + 6~\\text{h} \\le t_{\\text{ém}}$, car 6~heures est la borne haute de latence documentée par Open-Meteo. L'horizon demandé par run se dérive de lui-même ($72~\\text{h} + \\text{latence} + \\text{marge} = 85$~heures, fonction `required_forecast_hours`), et chaque run se met en cache sur disque. Sur la période du projet, 1~461 cycles sont demandés, 1~460 exploitables. Trois runs restent incomplets dans l'archive, dont celui du 2026-06-11 (11~heures manquantes sur 84 attendues, traitées par troncature de queue). Sur 8~342 fenêtres candidates, 95 sont écartées ($1{,}14\\,\\%$) faute d'un run couvrant tous les temps cibles. Il reste 8~247 fenêtres, avec un âge de run de 6 à 12~heures et un horizon maximal de 72~heures.",
            },
            {
              type: 'text',
              content:
                "**Gestion des valeurs manquantes.** Les exports SCADA contiennent une vraie coupure de télémesure de six jours, du 9 au 15 décembre 2025. Ces mesures n'existent pas dans les fichiers sources : on ne les reconstruit pas par interpolation. Remises sur la grille, elles restent manquantes. Même règle pour l'évaluation~: une absence de mesure ne devient jamais une production nulle. Les périodes nocturnes se distinguent des vraies coupures grâce aux informations temporelles et radiatives.",
            },
            {
              type: 'text',
              content:
                "**Construction du jeu final.** Les noms de variables sont normalisés, les mesures SCADA agrégées, le temps harmonisé à 15 minutes, les réanalyses et les variables physiques ajoutées. Le tout part dans `raw_input.parquet` (35~196 lignes à 15~minutes, 58 colonnes dont 55 hors imputation). Le pipeline rééchantillonne ensuite à l'heure et sauvegarde le jeu de features des modèles (`diass_features.parquet`, 8~800 lignes horaires et 428 colonnes dans le run du 6~octobre 2026, pour 427~features générées). Les deux volumétries se lisent séparément : les confondre fausse tout.\n\nLa chaîne distingue trois niveaux~: ce qui vient directement de la centrale (**mesure**), ce qui vient de sources externes (**réanalyse**), ce qui est calculé ou fixé par la géométrie de l'installation (**paramètre**).",
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
                "Ce parcours va des exports SCADA jusqu'au vecteur de **features** qui alimente les modèles. Il faut le rendre transparent : la validité des résultats en dépend. À chaque étape, on distingue ce qui est **mesuré**, **téléchargé**, **reconstruit** ou **calculé**.",
            },
            {
              type: 'text',
              content:
                "**Ingestion SCADA**\n\nLa fonction `load_scada` lit les **six classeurs Excel** du superviseur Schneider~: paramètres DC, paramètres AC, mesures des DC Box, températures des cartes de puissance et deux ensembles météorologiques. Chaque classeur se repère à un fragment de son nom. La lecture enchaîne ensuite des transformations systématiques. `_parse_timestamp` fusionne la colonne `Date` (format `%d/%m/%Y`) avec l'heure extraite de `Temps` : il en sort un index `timestamp` unifié et trié, première garantie de cohérence entre formats hétérogènes. Les colonnes utiles se retrouvent par expressions régulières, ce qui rend la lecture insensible aux variations de libellés. Les grandeurs sont agrégées à l'échelle de la centrale : tensions et courants se moyennent sur les équipements, les puissances contributives se somment (`P_dc` est la somme des puissances DC des boxes). Les compteurs cumulatifs (`ENERGIA`~...) passent par `diff` puis sont bornés à zéro, pour qu'un retour à zéro ne produise jamais d'énergie négative. Les puissances en kW deviennent enfin des MW. Les grandeurs structurantes suivent la même logique : tension réseau (`V_ac`), fréquence (`grid_frequency`), facteur de puissance (`cos_phi`), irradiance.",
            },
            {
              type: 'text',
              content:
                "**Enrichissement par réanalyses et variables physiques**\n\nLa station météo du site ne fournit qu'une partie des signaux utiles. Trois sources horaires publiques complètent le jeu~: NASA POWER pour le GHI, les températures, le vent, la rosée, l'humidité, la pression et la pluie ; CAMS, interrogé via l'API qualité de l'air d'Open-Meteo, pour l'épaisseur optique des aérosols, les poussières et les particules fines ; ERA5, via l'archive Open-Meteo, pour les composantes directe et diffuse du rayonnement, la couverture nuageuse, la température et la pression. Les valeurs sentinelles des réanalyses marquent une donnée absente : elles deviennent des valeurs manquantes.\n\nL'ingestion fusionne ensuite les sources sur une **grille unique à 15~minutes**. Les séries SCADA y sont réindexées, les réanalyses propagées vers l'avant. Pour une variable commune, la priorité va des mesures locales à NASA POWER, puis à ERA5 : elle reflète la confiance que mérite chaque source. Les trous courts de télémesure se comblent par une interpolation bornée à 24~heures, sans extrapolation. Les directions de vent passent en composantes sinusoïdales avant d'être recombinées : pas de saut artificiel autour du nord géographique.\n\nLe moteur physique solaire du package produit les variables calculées : le GHI de ciel clair y est évalué selon le modèle Ineichen--Perez, puis aligné sur la géométrie du site. Les **variables électriques historiques** viennent enfin, dérivées de façon strictement causale : retards de 24~heures sur les tensions, les courants et la fréquence réseau (écarts bornés à $\\pm 5$~Hz), rendements onduleur encadrés entre 0,5 et 1,0 avec un repli nominal de 0,97, rapport des courants alternatif et continu, indice d'encrassement établi à la veille (borné puis propagé), et compteurs d'énergie ramenés en incréments ou cumuls sur 24~heures. Aucune de ces colonnes ne regarde vers le futur : la causalité tient à la construction, toutes décalées de 96~pas.",
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
                "La figure ci-dessus résume le trajet en trois temps~: fabriquer les données, de l'import SCADA au parquet de features enrichi des réanalyses ; apprendre, du fenêtrage à la calibration probabiliste, traçabilité comprise ; prédire enfin, en choisissant le bon modèle et en produisant une inférence par lots avec son enveloppe P10--P90.",
            },
            {
              type: 'text',
              content:
                "**Technologies et APIs mobilisées, et leur rôle**\n\nLe pipeline repose sur cinq briques standard, chacune avec un rôle précis~: Great Expectations contrôle les schémas ; scikit-learn et SHAP servent à la sélection ; Optuna optimise ; MLflow trace ; Prefect orchestre.",
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
                "Avant toute modélisation, l'exploration décrit la production solaire de Diass. Elle repère les rythmes temporels, les corrélations entre variables et les particularités du site.",
            },
            {
              type: 'text',
              content:
                "Le profil journalier moyen donne l'arc diurne attendu~: irradiance et production culminent vers midi, la température suit avec environ deux heures de retard, le vent atteint son minimum en fin de nuit (figure ci-dessous). À l'échelle d'une semaine — celle du 6~juin 2026, figure ci-dessous — la production épouse l'irradiance et chute brutalement au passage des nuages, principale source d'erreur à court terme.",
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
                "Le modèle NOCT relie la température de cellule à l'ambiance, avec $\\gamma = -0{,}43\\,\\%/^\\circ C$. Sur Diass, il donne une $T_{cell}$ moyenne de $33{,}3$~°C, un maximum de $70{,}8$~°C et une perte thermique moyenne de $-3{,}56\\,\\%$. Un facteur à ne pas négliger en production estivale.",
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
                "Côté aérosols, l'épaisseur optique $\\tau_a$ vaut $0{,}31$ en moyenne sur la période et culmine en mai. La figure ci-dessous met l'irradiance en regard de cet indice et détaille son évolution mensuelle.",
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
                "L'EDA dresse le portrait d'un site solaire typique du Sahel~: forte irradiance annuelle, variabilité nuageuse marquée en hivernage, aérosols importants en saison sèche. Ces trois traits orientent le choix des features.",
            },
            {
              type: 'text',
              content:
                "**Synthèse statistique des données**\n\nLes distributions mesurées sur Diass sont les suivantes~:",
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
                "Deux valeurs demandent une explication. La médiane du GHI est très basse ($8{,}18$~W/m²) face à une moyenne de $241{,}95$~W/m² : c'est l'alternance jour/nuit d'un jeu à 15~minutes, pas une anomalie. Le minimum de production est légèrement **négatif** ($-0{,}14$~MW) : la nuit, les onduleurs consomment un peu en veille. La médiane proche de zéro vient de la même cause. Les variables électriques SCADA comptent environ 34~600 observations non manquantes ($T_{inv}$~: 34~606, $P_{ac}$~: 34~602, $G_{sw}$~: 34~601) ; l'écart avec 35~196 tient aux absences réelles, conservées comme discontinuités.\n\nCette nuit se lit aussi dans l'évaluation : le GHI minimal est nul, la production minimale légèrement négative. Seuls les pas diurnes ont un sens pour la prévision solaire, l'évaluation les isole donc. La distribution de la production accuse un pic à 0 (nuit) et un second autour de 13--14~MW (ciel dégagé), à peu près uniforme entre les deux (Diouf, 2021).",
            },
            {
              type: 'text',
              content:
                "**Patterns temporels identifiés**\n\nL'EDA dégage quatre échelles de variation. Le **cycle diurne** domine : production nulle la nuit, montée à l'aube (6h--7h), pic à midi solaire (12h--13h), descente au coucher (18h--19h). La forme de l'arc vient de la géométrie solaire locale ($\\varphi = 14{,}65^\\circ$~N) et de l'inclinaison fixe des modules. Le **cycle hebdomadaire** reste faible mais mesurable, lié à l'activité météorologique (passages de fronts en hivernage). Le **cycle saisonnier** oppose la saison sèche — production élevée et régulière, GHI $\\sim$6~kWh/m²/jour — à l'hivernage — production réduite et variable, GHI $\\sim$4--5~kWh/m²/jour. S'y ajoutent des **perturbations ponctuelles** : chutes brutales au passage des nuages en hivernage, réductions progressives au soiling en saison sèche, baisses d'irradiance de l'harmattan de décembre à février.\n\nLe deep learning exploite directement ces rythmes : les lags horaires captent le cycle diurne, les features temporelles (jour julien, indicateur de saison) le cycle saisonnier, et les features d'irradiance et de météo les perturbations.",
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
                "**Géométrie solaire locale**\n\nÀ la latitude de Diass ($\\varphi = 14{,}65^\\circ$~N), le Soleil culmine à $75{,}8^\\circ$ au solstice d'été (juin) et à $51{,}9^\\circ$ au solstice d'hiver (décembre) (Ajzoul). Cette variation saisonnière module l'irradiance reçue sur le plan des panneaux~:",
            },
            {
              type: 'math',
              display: true,
              tex: '\\alpha_{s,\\max} = 90^\\circ - \\varphi + \\delta',
            },
            {
              type: 'text',
              content:
                "où $\\delta$ est la déclinaison solaire ($\\pm 23{,}45^\\circ$). À Diass, le Soleil passe presque au zénith aux équinoxes ($\\alpha_s \\approx 75^\\circ$), ce qui favorise la production. Les modules, fixes, inclinés de **15°** et tournés **plein sud** (azimut 0°), captent bien le rayonnement toute l'année, sans suivi actif.",
            },
            {
              type: 'text',
              content:
                "**Profil d'irradiance typique**\n\nL'année se partage entre la **saison sèche** (novembre--mai) et l'**hivernage** (juin--octobre). En saison sèche, l'irradiance est élevée et régulière (GHI moyen $\\sim$6~kWh/m²/jour) ; le ciel reste dégagé malgré l'harmattan de décembre à février. C'est la période de production maximale. En hivernage, le GHI moyen tombe à $\\sim$4--5~kWh/m²/jour : nuages et pluies rendent la production irrégulière, mais les températures plus basses réduisent les pertes thermiques.",
            },
            {
              type: 'text',
              content:
                "**Températures ambiantes élevées**\n\nLe climat sahélien de Thiès chauffe fort, surtout en saison chaude (mars--juin) : les maxima atteignent régulièrement **35--40~°C**, avec des records au-delà de 45~°C. La température de cellule $T_{cell}$ grimpe alors à 65--75~°C, ce qui coûte de la puissance~:",
            },
            {
              type: 'math',
              display: true,
              tex: '\\Delta P_{therm} = \\gamma \\cdot (T_{cell} - 25^\\circ C) \\approx -0{,}43\\,\\%/^\\circ C \\times 45^\\circ C \\approx -19\\,\\%',
            },
            {
              type: 'text',
              content:
                "Le vent refroidit les modules par convection ($v_{wind}$) et atténue en partie cette perte. Sa vitesse devient donc une variable d'entrée pertinente, même sur un site solaire.",
            },
            {
              type: 'text',
              content:
                "**Impact de l'harmattan**\n\nL'harmattan, vent d'est venu du Sahara, charge l'air de poussière pendant la saison sèche (novembre--février). Son effet est double. Il augmente l'épaisseur optique des aérosols $\\tau_a$ et diffuse une part notable du rayonnement : la DNI peut perdre 15 à 30~\\% par rapport à un ciel clair. Il dépose aussi de la poussière sur les modules : les dépôts réduisent la transparence et coûtent 5 à 15~\\% de production après quelques semaines sans nettoyage.\n\nCes deux effets n'ont rien à voir avec la variabilité nuageuse. Le feature engineering doit les traiter séparément.\n\nLa physique du site contraint donc le modèle. Il doit restituer le cycle diurne (géométrie solaire), la variabilité nuageuse (hivernage), les aérosols (harmattan) et les pertes thermiques (températures élevées). Chaque cause agit à son échelle, du jour à la saison : d'où les features multi-échelles.",
            },
            {
              type: 'text',
              content:
                "**Influence des périodes de pluie**\n\nLa figure ci-dessous mesure l'effet des épisodes pluvieux~: les jours où le cumul dépasse 1~mm (fond rouge) correspondent à des creux de $P_{ac}$, tandis que les périodes sèches (fond bleu) restent proches du profil nominal. Le run courant compte **96~jours pluvieux contre 271~jours secs**, pour **3,7~MW de production moyenne les jours de pluie contre 4,0~MW les jours secs ($-6\\,\\%$)**. La précipitation discrimine donc bien l'hivernage.",
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
                "**Le problème : la circularité des variables SCADA contemporaines**\n\nLes exports SCADA de Diass livrent des variables électriques instantanées (`I_ac`, `P_dc`, `V_dc`, `V_dc_inv`, `I_dc`, `I_dc_inv`, `P_dc_inv`, `V_ac`, `cos_phi`, `energy_*kwh` et `grid_frequency`), mesurées au même instant $t$ que la cible `P_ac`. Les prendre telles quelles en features crée un **biais de circularité mathématique** (data leakage) : le capteur de puissance AC et celui d'intensité AC observent le même flux d'électrons en sortie d'onduleur, liés par une équation déterministe d'électrotechnique~:",
            },
            {
              type: 'math',
              display: true,
              tex: 'P_{ac} = V_{ac} \\times I_{ac} \\times \\cos(\\varphi) \\times \\sqrt{3}',
            },
            {
              type: 'text',
              content:
                "Face à ces grandeurs brutes, un modèle de deep learning (MLP, LSTM, TCN) choisit par descente de gradient la **solution de facilité** : apprendre la formule instantanée, au lieu d'anticiper les nuages et la météo. Or, à l'instant $t$, prédire $t{+}24$~h suppose des télémesures qui sont **physiquement inexistantes**. Un modèle entraîné ainsi est inutilisable en conditions réelles.",
            },
            {
              type: 'text',
              content:
                "**Le problème de la persistance temporelle**\n\nDe jour, la puissance PV est très continue. Des lags électriques trop proches ($t$-1h, $t$-2h) font du modèle un simple opérateur de décalage : «~demain = aujourd'hui~». Or les phénomènes sahéliens (passages nuageux rapides, tempêtes de poussière, vents de mousson) cassent brutalement cette continuité. Un modèle persistant affiche alors un excellent $R^2$ par ciel bleu, puis des erreurs catastrophiques dès qu'un nuage passe — au détriment de la stabilité du réseau.",
            },
            {
              type: 'text',
              content:
                "**La démarche : variables causales (*Physics-Informed ML*)**\n\nOn ne supprime pas le SCADA électrique : on le transforme en **variables causales**. Les mesures brutes de l'instant $t$ deviennent des indicateurs d'état connus à $t{-}24$~h — un passé légitime pour une prévision *day-ahead*. Les variables de la veille ne disent rien du soleil de demain ; en revanche, elles décrivent l'état thermique de l'onduleur et l'encrassement des panneaux. Combinées à la physique (par exemple $P_{dc,\\text{lag\\_24h}} / G_{sw,\\text{lag\\_24h}}$), elles donnent un Performance Ratio dynamique. C'est lui qui permet au TFT et au TCN d'ajuster la météo globale aux pertes réelles de la centrale.",
            },
            {
              type: 'text',
              content:
                "**Matrice de transformation**\n\nLe tableau ci-dessous donne la correspondance entre chaque variable SCADA brute et sa version causale. Les 11~variables contemporaines interdites cèdent la place à 11~variables transformées, toutes retardées d'au moins 24~heures ou calculées sur des fenêtres glissantes passées.",
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
                "**Implémentation**\n\nLe décalage porte sur 96~pas, soit 24~heures à la résolution de 15~minutes. Courants, tensions, facteur de puissance et insolation sont retardés d'autant ; sur les 96~premiers pas, ils restent indéfinis, faute de passé. Trois rapports composites confrontent le passé électrique à l'irradiance : l'encrassement (courant continu de la veille sur irradiance au plan de la veille), la conversion de l'onduleur (puissances alternative et continue de la veille) et le rapport des courants alternatif et continu de la veille. Enfin, un écart-type glissant sur 24~heures, purement passé, résume la tension réseau sur la fenêtre $[t{-}95,\\; t]$.",
            },
            {
              type: 'text',
              content:
                "Les onze variables électriques brutes — courants, tensions, puissances, facteur de puissance, insolation, fréquence réseau — ne sont **jamais copiées** telles quelles dans le jeu de sortie. Seules les versions transformées du tableau ci-dessus y passent, et le parquet qui en résulte entre dans le pipeline de feature engineering.",
            },
            {
              type: 'text',
              content:
                "La transformation causale convertit des variables interdites (circularité instantanée) en indicateurs d'état lisibles : encrassement, rendement d'onduleur, stabilité réseau — tous accessibles en conditions réelles *day-ahead*. Combinée à l'exclusion automatique des fuites par corrélation (section ci-dessous), elle garantit que les modèles n'apprennent que des relations exploitables en opération.",
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
                "Le feature engineering de Diass repose sur le registre déterministe `DEFAULT_PLUGINS` du module `features/engineering.py`~: **sept plugins**, exécutés en séquence.",
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
                ['`soiling_ratio_hist_24h`', "Indice d'encrassement $J{-}1$"],
              ],
            },
            {
              type: 'text',
              content:
                "Les familles de features sont les suivantes~: la **géométrie solaire** (`solar_elevation`, `solar_azimuth`, `clear_sky_ghi`, déterministe, calculable à l'avance), l'**irradiance** (`ghi`, `dni`, `dhi`, `g_poa`), la **température** (`temp_air`, `module_temp` via le modèle NOCT), les **aérosols et nuages** (`aod`, `dust`, `pm10`, `pm2_5`, `cloud_cover`), les **variables temporelles** (`hour_sin/cos`, jour de l'année, `is_harmattan`, `is_mousson`), et les **lags et statistiques glissantes** causaux (`_lag_1h` à `_72h`, moyennes et écarts-types sur 24~heures). Les variables électriques historiques (`soiling_ratio_hist_24h`, rendements onduleur, stabilité réseau) sont construites en amont par décalage de 24~heures. Les plugins les consomment telles quelles : aucune grandeur contemporaine de la cible n'entre dans le jeu.\n\nDans le run de référence du 6~octobre 2026, la chaîne produit 543~variables numériques pour la sélection, dont l'union finale retient 424~features (cible exclue). Les modèles reçoivent donc 425 dimensions d'entrée, dans un parquet de 8~800 lignes et 428 colonnes.",
            },
            {
              type: 'text',
              content:
                "**Détail des sept plugins de feature engineering**\n\nLes sept plugins s'exécutent dans l'ordre suivant. Chacun ajoute ses colonnes au DataFrame ; la cible `P_ac` reste intacte tout au long de la chaîne.",
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
                "Deux modules restent hors du registre par défaut : `FrequencyFeatureEngineer`, à activer explicitement pour l'analyse spectrale, et `SolarLossEngineer` (constantes de pertes LID, PID, mismatch, câblage et dégradation annuelle) — disponibles, mais non exécutés dans le run courant. L'indice de soiling `soiling_ratio_hist_24h` ne vient pas d'un plugin : on le calcule directement comme le rapport $I_{\\text{dc},J-1}/G_{\\text{sw},J-1}$, borné puis propagé. Il se consomme ensuite comme n'importe quel autre historique causal.",
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
                "**Prévention du data leakage dans les lags et rolling statistics**\n\nChaque plugin de lags et de statistiques glissantes est **causal** : à l'instant $t$, seules les données $\\leq t$ sont accessibles. Trois mécanismes l'y assurent. `shift(h)` décale la série de $h$~pas : à l'instant $t$, `col_lag_hh` vaut `col` à $t{-}h$, les $h$~premiers pas restant à `NaN` faute de passé. `.rolling(window=w, min_periods=1)` opère sur $[t{-}w{+}1,\\; t]$, passé et présent seulement : `col_mean_24h` à l'instant $t$ est la moyenne des 24~dernières heures. `diff(p)` calcule $\\text{value}[t] - \\text{value}[t{-}p]$ ; les profils horaire et journalier passent par une moyenne cumulée causale (`cumsum`/`cumcount` par groupe) qui n'intègre que les occurrences $\\leq t$. Par construction, aucune feature n'accède à une valeur future de la cible ou des covariables.",
            },
            {
              type: 'text',
              content:
                "**Exclusion automatique des fuites de données**\n\nEn amont de la sélection, le pipeline écarte toute feature dont la corrélation absolue de Pearson avec la cible `P_ac` dépasse `config.features.leakage_threshold` ($0{,}99$). Exception : les drivers physiques de la `leakage_allowlist` (irradiance, position solaire, couverture nuageuse). Dans le run du 6~octobre 2026, une seule variable est ainsi retirée (`P_ac_seasonal_dev`). Avec la transformation causale, ce garde-fou empêche tout accès détourné à la cible : la validité de l'évaluation sur le segment de test en dépend.",
            },
            {
              type: 'text',
              content:
                "**Pipeline de feature engineering : du parquet aux features**\n\nLa fonction `data_pipeline()` charge le parquet brut (`raw_input.parquet`, 58~colonnes à 15~minutes, 55 hors imputation) et enchaîne six opérations. Le rééchantillonnage passe de 15~minutes à 1~heure (8~800~lignes) : moyenne pour les grandeurs instantanées, somme pour les taux, dernière valeur reportée pour les compteurs cumulatifs — chaque colonne suit son rôle physique. Great Expectations valide les colonnes critiques. Le prétraitement nettoie les horodatages, borne les valeurs aberrantes, interpole sur 6~heures au plus, propage sur 24~heures au plus et passe en `NaN` ce qui dépasse $3\\times\\text{IQR}$. Le feature engineering exécute les sept plugins de `DEFAULT_PLUGINS` en séquence déterministe. Un nettoyage post-plugins supprime les colonnes à variance nulle (`nunique` $\\leq$~1, cible préservée), les dérivées quasi linéaires de la cible ($|\\rho| > 0{,}99$, section ci-dessus) et, en option, les colonnes strictement dupliquées. La sélection applique alors les sept méthodes, puis prend leur union (section ci-dessous).",
            },
            {
              type: 'text',
              content:
                "**Sélection de features par union de 7~méthodes**\n\nLe module `FeatureSelector` applique 7~méthodes indépendantes. La sélection finale est leur **union** : une stratégie conservatrice, qui maximise le rappel~:",
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
              caption: "Répartition par famille de l'union finale (424~features).",
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
                "L'union vaut mieux que l'intersection ici : elle est conservatrice et maximise le rappel. Le consensus entre méthodes est faible — aucune feature retenue par les sept, 194 par une seule — donc un vote majoritaire balaierait ce que seule une méthode sait isoler.",
            },
            {
              type: 'text',
              content:
                "**Discussion des méthodes et de leurs usages**\n\nLes **sept méthodes** ne jouent pas le même rôle. Elles mesurent des choses différentes (liaison linéaire, dépendance non linéaire, redondance, contribution prédictive), supposent des modèles différents et produisent des sorties différentes (rang, importance, variance). Le tableau ci-dessus et la figure ci-dessous résument ce qu'on en retient~:",
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
                "La **corrélation de Pearson** ($|r|$ avec $P_{ac}$, seuil $|r| > 0{,}01$) est un filtre *linéaire* et rapide : elle capte les drivers physiques directs (irradiance, `G_sw`) mais rate les dépendances non linéaires. Elle retient 349 variables (64,3~\\%), la plus large après le VIF. L'**information mutuelle** mesure toute dépendance, linéaire ou non, sans hypothèse de modèle. Très sélective, elle ne retient ici que deux fenêtres de la cible (`P_ac_max_3h`, `P_ac_max_6h`). La **PCA** réduit la dimension sans sélectionner de colonnes : elle éclaire la structure latente du jeu, dominée par l'arc diurne, mais ses composantes ne se lisent pas directement dans le TFT. Le **RFE** (élimination récursive, rang inverse, `LinearRegression`) est un *wrapper* qui retire une à une les features les moins contributives ; ses 50 retenues (9,2~\\%) penchent vers les drivers météo et physiques (`dust`, `pressure`, `wind_gust`, `ratio_iac_idc_hist`). Le **VIF** (variance inflation factor, VIF $\\le 5{,}0$) mesure la *multicolinéarité*, pas le pouvoir prédictif. Avec 527 retenues (97,1~\\%), c'est le plus permissif : peu de variables sont fortement redondantes dans ce jeu. La **permutation importance** (Random Forest) estime une importance *post*-modèle en permutant chaque feature ; très sélective, elle retient `P_ac_trend_dev` et `G_sw`. Le **SHAP** produit une importance additive *post*-modèle (moyenne de $|$SHAP$|$), plus coûteuse mais locale et cohérente ; ses deux têtes sont `P_ac_trend_dev` et `P_ac_hourly_profile`.",
            },
            {
              type: 'text',
              content:
                "L'issue dépend de l'échelle de décision~: une **union** de 424~features (figure ci-dessous) conserve l'essentiel du spectre — réanalyse/atmosphère (29,0~\\%, 123), lags/fenêtres $J{-}1$ (32,3~\\%, 137), météo locale (12,7~\\%, 54) — comme le détaille la figure ci-dessus. Le consensus entre méthodes reste faible : aucune feature n'est retenue par les sept, 194 par une seule. D'où l'union, et non un vote majoritaire, comme stratégie robuste.",
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
                "En résumé : 58~colonnes brutes entrent dans le pipeline, 543~features en sortent, la sélection en garde 424 après exclusion des fuites et déduplication. Restent les familles attendues sur un site solaire — lags et fenêtres $J{-}1$ (32~\\%), réanalyse atmosphérique (29~\\%), météo locale (13~\\%), physique PV (5~\\%). Aucune famille n'est sacrifiée : c'est exactement le but de l'union.",
            },
            {
              type: 'text',
              content:
                "**Optimisation des hyperparamètres avec Optuna**\n\nLes modèles avancés (TCN, TFT) sont réglés par **Optuna**. Les hyperparamètres (taux d'apprentissage, `batch_size`, `mse_weight`, planificateur de taux, fenêtres, architecture) ne sont pas fixés à la main : Optuna les propose et **évalue chaque combinaison** en entraînant le modèle puis en mesurant sa performance de validation. La grille exhaustive et le réglage manuel disparaissent. L'échantillonneur est un **TPE** (*Tree-structured Parzen Estimator*) : cette méthode bayésienne modélise la distribution des bons résultats et concentre les essais dans les régions prometteuses, au lieu d'explorer uniformément. Chaque essai est tracé avec son objectif, ce qui suit la convergence. Un élagage **médian** arrête les essais nettement pires que la médiane en cours : du temps de calcul économisé, sans rien retirer au résultat. L'objectif minimise la perte hybride MSE + pinball pondérée par `mse_weight` $= 0{,}5$ (chapitre 7), en explorant `mse_weight` $\\in [0{,}3; 0{,}8]$, deux décades de taux d'apprentissage et plusieurs planificateurs (plateau, cosinus, warmup cosinus). Dix essais suffisent aux baselines, dont l'espace est réduit ; pour le TCN et le TFT, les essais portent davantage sur l'architecture et la stratégie d'horizon. Le meilleur essai est ensuite figé (graine $42$, arrêt précoce configuré séparément) et enregistré dans MLflow avec son `run_id`.",
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
                "Cinq modèles s'affrontent sur Diass, à l'horizon de **72~heures**. Trois servent de repères : la persistance, le MLP et le LSTM de base, entraînés par le pipeline des baselines avec dix essais d'optimisation. Viennent le TCN et le TFT, passés par le pipeline général — dix essais, perte hybride MSE + pinball, covariables NWP injectées au canal futur. Tous sont évalués sur le même segment de test : **1~049 fenêtres**, chacune partant de 168~heures d'historique pour prévoir 72~heures, du 16/07/2026 06h00 au 28/08/2026 22h00 prolongée de 72~h. Les métriques ci-dessous sortent de ce segment~:",
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
                "Temps de calcul du run courant~: persistence 3~s, MLP 519~s, `lstm_baseline` 863~s, TCN 1~206~s, TFT 2~016~s. Les baselines ne produisent que des prévisions ponctuelles : les métriques de calibration ne s'appliquent pas à elles.",
            },
            {
              type: 'text',
              content:
                "La MAPE des baselines explose (3282,8~\\% pour la persistence) : la production est quasi nulle en début et fin de journée, et le moindre écart y pèse énormément en relatif. Les modèles avancés la ramènent d'un ordre de grandeur. Mais la MAPE du TFT (502~\\%) dépasse celle du LSTM baseline (333~\\%), alors que le TFT est plus précis ailleurs : la métrique est fragile près de zéro. Elle pénalise surtout les erreurs du matin et du soir, sans lien avec la qualité globale. On s'en tient donc au R$^2$ et à la RMSE, plus robustes, qui placent le TCN en tête ($R^2{=}0{,}877$, RMSE 1,71~MW).",
            },
            {
              type: 'text',
              content:
                "**Perte hybride et hyperparamètres retenus**\n\nLe TCN et le TFT ne minimisent pas une simple MSE : ils utilisent la **perte hybride** multi-tâche du chapitre 7. Sa composante MSE vise l'exactitude ponctuelle ($R^2$, RMSE), sa composante pinball la calibration des intervalles.",
            },
            {
              type: 'text',
              content:
                "Sur Diass, $w_{\\text{mse}} = 0{,}5$ par défaut, soit une contribution égale, la HPO explorant $w_{\\text{mse}} \\in [0{,}3; 0{,}8]$. Ce compromis se justifie par le climat sahélien : passages nuageux rapides et tempêtes de poussière font de l'estimation de l'incertitude un enjeu aussi important que la prévision ponctuelle pour gérer le réseau.",
            },
            {
              type: 'text',
              content:
                "Chaque modèle passe par dix essais Optuna, avec l'échantillonneur TPE et l'élagage médian vus plus haut. Les meilleurs essais retenus : MLP — poids hybride 0,354, trois couches de 256~neurones, dropout 0,286, lots de 64, plateau, taux $1{,}35{\\times}10^{-3}$. LSTM de base — même lot et même profondeur, dropout 0,10, planning cosinus, taux $1{,}88{\\times}10^{-4}$, poids 0,440. TCN — canaux 64, 128, 256 et 256, noyau 5, dropout 0,252, 64 par lot, montée en charge cosinus de cinq époques, taux $3{,}29{\\times}10^{-4}$, poids 0,765. TFT — dimension 256 sur deux têtes, dropout 0,15, lots de 128, plateau, taux $6{,}92{\\times}10^{-4}$, poids 0,617.",
            },
            {
              type: 'text',
              content:
                "**Résultats TCN**\n\nSur le test, le TCN monte à une RMSE de **1,707~MW** et une MAE de **0,989~MW**, pour un $R^2{=}0{,}877$. Sa couverture P10--P90 vaut $60{,}8\\,\\%$ avant recalibrage (largeur $1{,}670$~MW, Winkler $5{,}742$). Le CQR la porte à **79,8~\\%** ($\\alpha{=}0{,}20$, $s_h$ moyen $0{,}463$~MW, largeur $2{,}596$~MW), tout près de la cible de 80~\\%.",
            },
            {
              type: 'text',
              content:
                "**Résultats TFT**\n\nLe TFT affiche **RMSE 1,818~MW**, **MAE 1,157~MW**, $R^2{=}0{,}861$. Sa couverture passe de $71{,}2\\,\\%$ avant recalibrage (largeur $2{,}456$~MW, Winkler $5{,}964$) à **74,2~\\%** après CQR ($s_h$ moyen $0{,}095$~MW, largeur $2{,}646$~MW). Son interprétabilité (sélection de variables, attention) en fait un outil précieux côté opérateur, mais sa couverture calibrée reste sous celle du TCN.",
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
                "**Courbes d'entraînement**\n\nLes deux modèles avancés convergent régulièrement, avec un early stopping (patience 25, maximum 100 époques) : le TCN s'arrête à l'époque 57, le TFT va au terme des 100. Les pertes de validation finales restent proches des pertes d'entraînement : la généralisation est bonne, sans surapprentissage marqué.",
            },
            {
              type: 'figure',
              src: '/figures/nb_diass_learning_curves.png',
              caption:
                "Courbes d'entraînement (pertes train/validation) du TCN ($R^2{=}0{,}877$) et du TFT ($R^2{=}0{,}861$) sur Diass.",
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
                "Le TCN suit bien le cycle diurne et les variations rapides des passages nuageux. Ses écarts les plus marqués se situent aux transitions jour--nuit et lors des changements brusques d'irradiance — normal pour un modèle convolutionnel.",
            },
            {
              type: 'text',
              content:
                "**Comparaison des métriques sur le test**\n\nLa figure ci-dessous le confirme : le TCN (RMSE 1,707~MW, $R^2{=}0{,}877$) devance le TFT (RMSE 1,818~MW, $R^2{=}0{,}861$), et les baselines (persistence, MLP, `lstm_baseline`) restent loin derrière. L'écart entre les deux architectures avancées reste modeste. Sur ce site, ce qui les départage le plus nettement, c'est la couverture de l'enveloppe P10--P90 après CQR (TCN 79,8~\\% contre TFT 74,2~\\%).",
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
                "**Prévision batch à 72~heures**\n\nEn mode batch, le pipeline d'inférence produit une prévision à 72~h avec son enveloppe P10--P90. Sur le run courant, la prévision du site vaut $p_{50} = 0{,}965$~MW.",
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
                "On mesure les performances avec les métriques du chapitre 4 ; leurs formules ne sont pas reprises ici. Le tableau ci-dessus regroupe les résultats ponctuels des cinq modèles sur le test de Diass, le second les métriques probabilistes des deux architectures avancées.",
            },
            {
              type: 'text',
              content:
                "Sur Diass, le TCN devance le TFT sur les trois métriques ponctuelles (R$^2$ 0,877 contre 0,861~; RMSE 1,71 contre 1,82~MW) et sur la couverture calibrée (79,8~\\% contre 74,2~\\%). Deux raisons expliquent l'écart. La convolution dilatée capte le motif diurne quasi périodique du solaire mieux que l'attention. Et le TCN compte un ordre de grandeur de paramètres en moins : moins de risque de surapprendre sur une seule année d'entraînement. Le TFT, lui, garde l'interprétabilité (VSN, poids d'attention) — un atout loin d'être un luxe pour un opérateur. Sélection de variables et cartes d'attention disent pourquoi le modèle annonce une baisse à un horizon donné : le TCN ne le donne pas nativement.",
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
                "**Précision nécessaire**\n\nLe réseau de la SENELEC n'a pas beaucoup de marge de manœuvre. Pour Diass (27,3~MWc installés, 23,1~MW publiés), retenons une hypothèse de travail : une erreur de **5~MW** reste acceptable au dispatch quotidien. Autrement dit, il faut une RMSE inférieure à $5$~MW, soit $22\\,\\%$ de la capacité publiée. C'est le seuil d'opérationnalité à 72~heures. Les deux architectures avancées respectent largement ce seuil : l'exploitant garde une confortable marge de sécurité.",
            },
            {
              type: 'text',
              content:
                "**Intervalles pour le dispatch**\n\nL'intervalle P10--P90 s'utilise directement au dispatch. Sa borne haute dimensionne la réserve de sécurité à mobiliser. Sa borne basse donne le plancher de production sur lequel la SENELEC peut compter, pour éviter de démarrer une thermique inutilement. Entre les deux, la distribution des quantiles estime la probabilité de franchir un seuil critique (10~\\% de la capacité, par exemple) — ce que la seule prévision ponctuelle ne donne pas. Associée aux prévisions de charge, elle éclaire le niveau de production thermique à activer.",
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
                "Avant de juger la qualité prédictive des modèles (section ci-dessus), il faut situer le **gisement mesuré et le rendement obtenu** face aux valeurs publiées pour cette même centrale. Quatre références ont été vérifiées à la source : deux travaux de performance énergétique (Ndiaye, 2025 ; Sarr, 2025), une étude de prévision par réseaux de neurones (Diop, 2022) et une modélisation stochastique du rayonnement (Mbaye, 2019).",
            },
            {
              type: 'text',
              content:
                "Le calcul suit la norme IEC~61724, sur la période réellement couverte par les données. La puissance de référence est le nominatif AC des onduleurs ($P_{\\mathrm{nom}} = 36 \\times 680 = 24{,}48~\\mathrm{MW}$). Le gisement de référence $Y_{\\mathrm{ref}}$ s'intègre sur l'irradiance globale horizontale, pour rester comparable à la source publiée.",
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
                "Le gisement est reproduit à un demi-pour-cent près de la valeur publiée : le site, son instrumentation et notre calcul d'irradiance sont cohérents avec la source. Le rendement final traîne un peu derrière, mais le *performance ratio* tombe dans la plage publiée. Deux précautions de méthode s'imposent. Le PR publié est un **PR de champ**, mesuré en fonctionnement continu, pas un PR final. Le nôtre dépend de la convention de puissance de référence — mais en reprenant la puissance publiée, rendement et PR restent dans la plage attendue. **La conclusion ne dépend donc pas de ce choix.**",
            },
            {
              type: 'text',
              content:
                "Un écart de capacité reste inexpliqué : le matériel installé donne $85\\,248 \\times 320~\\mathrm{W} = 27{,}28~\\mathrm{MWc}$ en continu, contre $23{,}114~\\mathrm{MP}$ publiés, soit $15\\,\\%$ de moins. La puissance unitaire vient de la fiche technique du module Jinko JKM320PP-72-V, et le nombre de modules est connu sans ambiguïté. Nous avons gardé le matériel vérifiable et signalé l'écart, plutôt que de l'ajuster. Les documents de réception de la centrale permettraient de le trancher.\n\nDeux remarques enfin. La géométrie retenue (inclinaison $15^\\circ$, azimut $0^\\circ$) correspond à la latitude du site, ce que corrobore la littérature sahélienne (Sarr, 2025). Et le rapport $g_{\\mathrm{poa}}/g_{\\mathrm{hi}} \\simeq 0{,}88$, inférieur à~1, est physiquement attendu : à faible élévation, une part du flux diffus horizontal n'est pas interceptée par un plan incliné. Restent les références écartées : les métriques de Diop (2022) (RMSE $0{,}003$~kWh inférieure à sa MAE $0{,}0223$~kWh, ce qui est mathématiquement impossible) et Mbaye (2019), qui porte sur le rayonnement à 24~h, non sur la puissance. Le contrôle croisé confirme la cohérence du site : gisement et PR concordent avec les valeurs publiées, et les écarts résiduels portent sur la capacité nominale, pas sur la ressource.",
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
            "L'étude de cas de Diass valide le pipeline complet, de l'exploration des données à l'évaluation probabiliste, sur un site réel représentatif. Le feature engineering livre le vecteur d'entrée du run courant (543~variables, 424 retenues en union). Le TCN et le TFT, chacun adapté à un type de variabilité, prévoient à 72~heures avec fiabilité. Le TCN devance légèrement le TFT sur les métriques ponctuelles ($R^2{=}0{,}877$) et la couverture calibrée (79,8~\\%) ; le TFT garde en revanche une interprétabilité (VSN, attention) que le TCN n'offre pas.",
        },
        {
          type: 'text',
          content:
            "Une seule année d'entraînement montre que le pipeline tient sur Diass ; elle ne garantit pas que les hyperparamètres restent stables d'une saison à l'autre. C'est la première limite : il faudra vérifier cette stabilité sur plusieurs années avant tout déploiement opérationnel. La seconde est structurelle : le pas horaire. Les passages nuageux sahéliens durent souvent moins d'une heure ; le rééchantillonnage les lisse et plafonne ainsi la précision atteignable à 72~h. Un modèle dédié aux horizons courts (1--6~h, résolution 5--15~min) comblerait la lacune, avec une architecture distincte. Enfin, le coût mémoire du TFT — attention quadratique sur la fenêtre d'entrée — freine le déploiement embarqué, même si son interprétabilité en fait un outil précieux côté opérateur.",
        },
        {
          type: 'text',
          content:
            "Trois pistes s'ouvrent : le transfert vers un autre site solaire (le pipeline est déjà structuré par centrale), des modèles dédiés aux horizons de 1 à 6~heures à résolution fine, et l'apprentissage fédéré multi-sites sans partage des données brutes. Côté exploitation, la prochaine étape est d'intégrer le pipeline au système de gestion du réseau de la SENELEC, par des phases pilotes sur Diass.",
        },
      ],
    },
  ],
}
