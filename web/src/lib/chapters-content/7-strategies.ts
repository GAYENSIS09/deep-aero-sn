import type { ChapterData } from './index'

export const chapterContent: ChapterData = {
  slug: '7-strategies',
  title: 'Stratégie MIMO et prévision probabiliste par quantiles',
  part: 'Partie II — Modélisation et deep learning',
  intro:
    "Avant d'entraîner un modèle à 72~h, deux décisions conditionnent le reste du dispositif : comment produire les $H$ horizons à partir de l'historique, et sous quelle forme restituer l'incertitude. Dans ce mémoire, la première est la stratégie **MIMO** (*Multiple-Input Multiple-Output*) ; la seconde est la **régression quantile**. Les deux sont liées : MIMO fournit naturellement la matrice $H \\times Q$ qu'attend la seconde. Ce chapitre expose ce couplage, la perte qui l'entraîne et le protocole qui le mesure.",
  sections: [
    {
      type: 'section',
      title: 'La stratégie MIMO de prévision multi-horizon',
      blocks: [
        {
          type: 'text',
          content:
            "Prévoir la production solaire des 72 prochaines heures peut se faire de deux manières : produire les $H$ valeurs futures en une seule passe, ou les engendrer séquentiellement en réinjectant chaque prédiction comme entrée de la suivante. Nous retenons la première option. Elle traite la séquence future comme un vecteur de sortie, ce qui préserve la cohérence entre horizons et supprime la propagation des erreurs d'inférence.",
        },
        {
          type: 'text',
          content: 'MIMO prédit en une seule passe le vecteur complet des horizons futurs :',
        },
        {
          type: 'math',
          display: true,
          tex: '\\hat{\\mathbf{y}} = \\bigl[\\hat{y}_{t+1}, \\dots, \\hat{y}_{t+H}\\bigr] = f_{\\boldsymbol{\\theta}}(\\mathbf{x}_{t-T:t}) \\in \\mathbb{R}^{H},',
        },
        {
          type: 'text',
          content:
            "La fenêtre d'entrée $\\mathbf{x}_{t-T:t}$ couvre $T$ pas d'historique : covariables météorologiques, variables calendaires et réalisations décalées. En prévision probabiliste, la sortie devient une matrice $H \\times Q$ :",
        },
        {
          type: 'math',
          display: true,
          tex: '\\hat{\\mathbf{Y}} = \\bigl[\\hat{y}_{t+1}^{(1)}, \\dots, \\hat{y}_{t+1}^{(Q)}; \\dots; \\hat{y}_{t+H}^{(1)}, \\dots, \\hat{y}_{t+H}^{(Q)}\\bigr] \\in \\mathbb{R}^{H \\times Q},',
        },
        {
          type: 'text',
          content:
            "où $Q$ est le nombre de quantiles prédits pour chaque horizon. C'est le paramétrage du *Temporal Fusion Transformer*, qui produit nativement des quantiles sur plusieurs horizons (Lim, 2021), comme celui des implémentations TCN du pipeline expérimental (protocole du chapitre 4 et évaluation détaillée ci-dessous).",
        },
        {
          type: 'text',
          content:
            "Nous avons écarté la prévision récursive pour deux raisons pratiques. Réinjecter une prédiction comme entrée de la suivante accumule mécaniquement la variance d'erreur sur 72 pas. Et un modèle unique pour tous les horizons coûte un seul entraînement au lieu de 72. La contrepartie est la dimension de sortie : pour $H = 72$ pas et $Q = 3$ quantiles, le réseau doit produire $216$ valeurs simultanées, ce qui accroît le risque de surapprentissage sur des séries de longueur modeste. C'est précisément ce coût que les architectures MIMO modernes (Lim, 2021) cherchent à contenir, par sélection de variables et partage de représentation, détaillés au chapitre~6.",
        },
        {
          type: 'figure',
          src: '/figures/ch7_mimo.png',
          caption:
            "La stratégie multi-horizon MIMO retenue : un modèle unique projette la fenêtre d'entrée $\\mathbf{x}_{t-T:t}$ sur l'ensemble des horizons futurs en une seule passe. En sortie probabiliste, la matrice $H \\times Q$ contient les $Q$ quantiles de chaque horizon. Cette architecture est nativement supportée par le TFT (Lim, 2021) et implémentée pour le TCN du pipeline expérimental.",
          heightClass: 'h-64 md:h-72',
        },
      ],
    },
    {
      type: 'section',
      title: 'La prévision par quantiles : type de sortie probabiliste',
      blocks: [
        {
          type: 'text',
          content:
            "Une prévision ponctuelle donne la production attendue ; elle ne dit pas quelle réserve mobiliser pour couvrir les cas défavorables. Dimensionner une réserve, arbitrer entre excès et déficit, sécuriser un contrat d'approvisionnement supposent de connaître la queue basse de la distribution de production, pas sa seule tendance centrale. Faute de pouvoir estimer la distribution complète avec trois têtes de sortie, nous en approximons les quantiles : $Q = 3$ niveaux, 10~\\%, 50~\\% et 90~\\%, soit une médiane et une enveloppe de confiance à 80~\\%.",
        },
        {
          type: 'text',
          content:
            "La régression quantile (Koenker, 1978 ; Koenker, 2005) estime le quantile conditionnel $q_\\alpha(\\mathbf{x}_t)$ en minimisant la perte en quantiles (pinball) (Koenker, 1978), qui pénalise à chaque pas le résidu $y-a$ entre l'observation $y$ et la borne prédite $a$ :",
        },
        {
          type: 'math',
          display: true,
          tex: '\\mathrm{QL}_{\\alpha}(y,\\,a) \\;=\\; \\bigl[\\alpha - \\indicator(y<a)\\bigr]\\,(y-a).',
        },
        {
          type: 'text',
          content:
            "Pour une architecture à sortie $Q$-dimensionnelle, la perte totale est la moyenne des pertes attachées aux $Q$ têtes de sortie :",
        },
        {
          type: 'math',
          display: true,
          tex: '\\mathcal{L}_{\\text{quantile}} = \\frac{1}{Q}\\sum_{q=1}^{Q} \\mathrm{QL}_{\\alpha_q}\\!\\left(y,\\; \\hat{y}^{(q)}\\right), \\qquad \\alpha_1 < \\alpha_2 < \\cdots < \\alpha_Q .',
        },
        {
          type: 'text',
          content:
            "Cette formulation est *séparable* : chaque tête $q$ s'optimise indépendamment des autres, ce qui simplifie et stabilise l'entraînement. En contrepartie, rien ne garantit l'*ordre* des quantiles prédits : deux quantiles voisins peuvent se croiser pour certaines entrées, produisant un intervalle de largeur négative.",
        },
        {
          type: 'text',
          content:
            "Ce défaut classique, le croisement des quantiles, appelle deux corrections : pénaliser explicitement tout croisement, ou paramétrer la sortie par des incréments positifs contraints, $\\hat{y}^{(q)} = \\hat{y}^{(1)} + \\sum_{j<q} \\operatorname{softplus}(\\Delta_j)$. Dans le code expérimental, la fréquence de croisement est *mesurée* (`quantile_crossing`) et reste nulle sur le jeu de test pour les deux architectures retenues, comme le rapporte le chapitre d'étude de cas ; la perte hybride décrite ci-dessous joue de surcroît un rôle régularisateur.",
        },
      ],
    },
    {
      type: 'section',
      title: "L'approche d'incertitude retenue dans le code : perte hybride multi-tâche",
      blocks: [
        {
          type: 'text',
          content:
            "Les modèles TCN et TFT ne sont pas entraînés par une simple perte quadratique. Ils recourent à une **fonction de perte hybride multi-tâche**, qui combine deux objectifs pondérés par `mse_weight` :",
        },
        {
          type: 'math',
          display: true,
          tex: '\\mathcal{L} \\;=\\; \\underbrace{w_{\\text{mse}} \\cdot \\text{MSE}(\\hat{y}_{0{,}5},\\, y)}_{\\text{exactitude ponctuelle}} \\;+\\; \\underbrace{(1 - w_{\\text{mse}}) \\cdot \\overline{\\text{Pinball}}(\\hat{y}_{q},\\, y)}_{\\text{calibration probabiliste}}.',
        },
        {
          type: 'text',
          content:
            "La composante MSE porte sur la médiane prédite, la composante pinball étant moyennée sur les quantiles $q \\in \\{0{,}1, 0{,}5, 0{,}9\\}$. Le poids `mse_weight` pilote le compromis entre les deux tâches.",
        },
        {
          type: 'table',
          caption:
            'Arbitrage fixé par le poids `mse_weight` de la perte hybride : précision ponctuelle (MSE sur la médiane) contre calibration des intervalles (pinball).',
          headers: ['Valeur de `mse_weight`', "Stratégie d'apprentissage", 'Effet sur les résultats'],
          rows: [
            ['$1.0$', 'Poids entier sur le MSE', 'Précision ponctuelle maximale, intervalles sans garantie'],
            ['$0.5$', '**Deux tâches à parts égales**', '**Précision correcte *et* intervalles bien calibrés**'],
            ['$0.0$', 'Poids entier sur le pinball', 'Intervalles bien calibrés, précision possiblement dégradée'],
          ],
        },
        {
          type: 'text',
          content:
            "Pour Diass, le poids retenu est $0.5$ : ce défaut du schéma de configuration est confirmé par la recherche bayésienne d'hyperparamètres, qui explore l'intervalle $[0.3,\\, 0.8]$. Ce compromis se justifie par la nature **sahélienne** du site ; les fortes variations d'irradiance (passages nuageux rapides, tempêtes de poussière de l'harmattan) rendent l'estimation de l'incertitude aussi critique que la prévision ponctuelle pour la conduite du réseau, et la plage explorée adapte l'arbitrage au contexte local sans le figer a priori. Sur le jeu de test, les meilleurs essais retiennent des valeurs proches du défaut (TFT : $0.617$, TCN : $0.765$), ce qui confirme empiriquement l'équilibre retenu.",
        },
        {
          type: 'text',
          content:
            "Sous-jacente à cette perte, la distinction entre les deux sources d'incertitude éclaire la lecture des résultats. L'incertitude *aléatoire* est irréductible : même avec une description parfaite de l'atmosphère, la position d'un passage nuageux reste imprévisible au-delà de quelques heures à l'échelle du kilomètre, et aucune quantité de données ne la supprime. L'incertitude *épistémique* est réductible : elle traduit un manque de données ou de capacité de modèle. La régression quantile approche la variabilité aléatoire conditionnelle ; l'injection des covariables futures NWP réduit, elle, la composante épistémique en informant le modèle de l'état atmosphérique à venir.",
        },
        {
          type: 'text',
          content:
            "L'entraînement hybride produit des quantiles dont la calibration n'est pas garantie en échantillon fini. Le code y adjoint donc une étape de *recalibrage* a posteriori.",
        },
      ],
    },
    {
      type: 'section',
      title: "Recalibrage de l'enveloppe : le CQR adopté dans le code",
      blocks: [
        {
          type: 'text',
          content:
            "La perte ponctuelle+quantile livre des intervalles dont la couverture effective peut s'écarter de la cible, surtout loin de la médiane. L'implémentation ajoute donc une étape d'**inférence conforme quantile** (*Conformalized Quantile Regression*, CQR) (Romano, 2019), selon un schéma *split conformal* (Vovk, 2005 ; Shafer, 2008) : un jeu de calibration disjoint fournit le score de non-conformité",
        },
        {
          type: 'math',
          display: true,
          tex: 's_i = \\max\\!\\bigl\\{\\hat{y}^{\\mathrm{bas}}_i - y_i,\\; y_i - \\hat{y}^{\\mathrm{haut}}_i\\bigr\\},',
        },
        {
          type: 'text',
          content:
            "et l'intervalle recalibré s'écrit, pour le niveau $\\alpha$ :",
        },
        {
          type: 'math',
          display: true,
          tex: '\\mathcal{I}(\\mathbf{x}) \\;=\\; \\bigl[\\:\\hat{y}^{\\mathrm{bas}}(\\mathbf{x}) - q_{(k)}(\\mathcal{C}),\\; \\hat{y}^{\\mathrm{haut}}(\\mathbf{x}) + q_{(k)}(\\mathcal{C})\\:\\bigr] , \\qquad k = \\lceil (m+1)(1-\\alpha)\\rceil ,',
        },
        {
          type: 'text',
          content:
            "où $q_{(k)}(\\mathcal{C})$ est le $k$-ième plus petit score de non-conformité sur le jeu de calibration de taille $m$. La garantie $\\mathbb{P}\\{y \\in \\mathcal{I}\\} \\ge 1-\\alpha$ (Vovk, 2005) vaut sans hypothèse sur le processus, à condition que les données de calibration soient *échangeables* avec le point à prédire.",
        },
        {
          type: 'text',
          content:
            "Dans le code, le recalibrage CQR est appliqué avec $\\alpha = 0.20$ sur le jeu de validation, puis évalué sur le test. Les journaux du notebook consignent son effet sur la couverture P10--P90 : pour le TCN, elle passe de $60{,}8\\,\\%$ à $79{,}8\\,\\%$, proche de la cible de 80~\\% ; pour le TFT, de $71{,}2\\,\\%$ à $74{,}2\\,\\%$, avec une enveloppe plus étroite et une largeur moyenne nettement inférieure ($0.095$~MW contre $0.463$~MW). C'est cette étape qui transforme l'enveloppe brute de la perte hybride en un intervalle à garantie de couverture vérifiable, sans réentraînement du réseau. La largeur de l'intervalle étant un quantile *absolu* des résidus de calibration, elle s'élargit naturellement avec l'horizon $h$, ce qui préserve une couverture stable.",
        },
        {
          type: 'text',
          content: 'Le protocole suivant mesure ce que le recalibrage a apporté.',
        },
      ],
    },
    {
      type: 'section',
      title: 'Scores stricts et calibration : juger une prévision par quantiles',
      blocks: [
        {
          type: 'text',
          content:
            "Une prévision probabiliste se juge par un *score propre*, quantité dont l'espérance sous la vraie loi est minimisée lorsque la loi prédite est la loi vraie (Gneiting, 2007). La largeur moyenne seule est triviale à minimiser (un intervalle infini y suffit), et la couverture seule récompense l'honnêteté sans la compétence. Nous rapportons donc systématiquement la couverture, la largeur moyenne et un score propre (pinball ou score de Winkler). C'est exactement ce que produit le code pour chaque modèle avancé : `coverage`, `interval_width`, `winkler_80`, ainsi que les pertes de quantiles `pinball_lower`/`pinball_upper`.",
        },
        {
          type: 'text',
          content:
            "Un intervalle $[\\hat{y}^{\\mathrm{bas}}, \\hat{y}^{\\mathrm{haut}}]$ de niveau nominal $1-2\\alpha$ est dit *calibré* si la fréquence empirique de couverture vérifie :",
        },
        {
          type: 'math',
          display: true,
          tex: '\\frac{1}{n}\\sum_{i=1}^{n} \\indicator\\!\\left\\{\\hat{y}^{\\mathrm{bas}}_i \\le y_i \\le \\hat{y}^{\\mathrm{haut}}_i\\right\\} \\;=\\; 1 - 2\\alpha \\;+\\; \\varepsilon_n , \\qquad \\varepsilon_n \\to 0 .',
        },
        {
          type: 'text',
          content:
            "Le terme $\\varepsilon_n$ fluctue selon la loi binomiale : pour un intervalle à 80~\\% évalué sur $n$ échantillons, la couverture observée s'écarte du nominal d'un ordre de grandeur $1/\\sqrt{n}$.",
        },
        {
          type: 'text',
          content:
            "La couverture ne distingue pas sur-couverture et sous-couverture. Un diagnostic plus fin, la *transformation intégrale de probabilité* (PIT), complète le triplet lorsque la loi complète est disponible. Avec trois quantiles, le code se restreint à la couverture, à la largeur moyenne, au score de Winkler et aux pertes de quantiles, ce qui suffit pour départager deux architectures à horizon donné.",
        },
      ],
    },
    {
      type: 'section',
      title: "Protocole d'évaluation sur le cas Diass",
      blocks: [
        {
          type: 'text',
          content:
            "Le protocole d'évaluation de l'incertitude appliqué à Diass comporte cinq étapes :",
        },
        {
          type: 'list',
          items: [
            "**Couverture par horizon.** Pour chaque $h \\in \\{1,\\dots,72\\}$, fréquence empirique de couverture de l'intervalle P10--P90 et écart à la cible de 80~\\% ;",
            "**Largeur par horizon.** Largeur moyenne de l'enveloppe, en MW et en pourcentage de $P^{\\max}$, pour comparer deux architectures à couverture égale ;",
            "**Score propre.** Pinball moyen sur les trois quantiles et score de Winkler à 80~\\% ;",
            "**Diagnostic de croisement.** Fréquence de $P_{10} > P_{50}$ ou $P_{50} > P_{90}$, qui doit être nulle ;",
            '**Comparaison au référentiel.** Score de calibration par rapport à la climatologie (protocole du chapitre 4).',
          ],
        },
        {
          type: 'text',
          content:
            "Ce protocole s'applique après l'étape CQR, sur des fenêtres de test identiques pour les deux architectures : 1049 fenêtres couvrant le 16~juillet au 28~août 2026, avec 168~h d'historique et 72~h d'horizon. Les valeurs numériques ci-dessous portent donc sur l'*enveloppe recalibrée*, et non sur la sortie brute de la perte hybride.",
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
            "La stratégie expérimentale retenue tient à trois décisions. Premièrement, la sortie suit la stratégie **MIMO** : un modèle unique produit les $H$ horizons en une seule passe, sans réinjection des prédictions, et apprend la cohérence entre horizons. Deuxièmement, cette sortie est **quantile**, avec $Q = 3$ niveaux (10~\\%, 50~\\%, 90~\\%) estimes par la régression quantile séparable. Troisièmement, l'incertitude est traitée par une perte hybride multi-tâche (MSE sur la médiane et pinball sur les quantiles, pondérés par `mse_weight`), complétée d'un recalibrage *conformalized quantile regression* destiné à garantir la couverture de l'enveloppe en échantillon fini.",
        },
        {
          type: 'text',
          content:
            "Avant d'aborder les résultats, trois points d'attention se dégagent. Le premier est méthodologique : une prévision probabiliste ne se juge pas par une métrique unique, et nous rapporterons systématiquement la couverture, la largeur moyenne et un score propre. Le second borne ce qu'on peut espérer : sans les covariables NWP, aucun modèle ne produira d'intervalle utile à 72~h ; c'est l'information d'entrée qui fixe le plafond, pas l'architecture. Le troisième est un choix assumé : $Q=3$ recalibré constitue le meilleur compromis entre information, coût d'inférence et faisabilité dans le cadre de ce mémoire.",
        },
      ],
    },
  ],
}
