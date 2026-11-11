import type { ChapterData } from './index'

export const chapterContent: ChapterData = {
  slug: '7-strategies',
  title: 'Stratégie MIMO et prévision probabiliste par quantiles',
  part: 'Partie II — Modélisation et deep learning',
  intro:
    "Avant d'entraîner un modèle à 72~h, deux décisions conditionnent le reste du dispositif : comment produire les $H$ horizons à partir de l'historique, et sous quelle forme restituer l'incertitude. Dans ce mémoire, la première se tranche par la stratégie **MIMO** (*Multiple-Input Multiple-Output*), la seconde par la **régression quantile**. Les deux se répondent : MIMO fournit la matrice $H \\times Q$ qu'attend la seconde. Ce chapitre expose ce couplage, la perte qui l'entraîne et le protocole qui le mesure.",
  sections: [
    {
      type: 'section',
      title: 'La stratégie MIMO de prévision multi-horizon',
      blocks: [
        {
          type: 'text',
          content:
            "Prévoir la production solaire des 72 prochaines heures se fait de deux manières : produire les $H$ valeurs futures en une seule passe, ou les engendrer séquentiellement en réinjectant chaque prédiction dans la suivante. Nous retenons la première option : elle traite la séquence future comme un vecteur de sortie, ce qui préserve la cohérence entre horizons et supprime la propagation des erreurs d'inférence.",
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
            "où $Q$ est le nombre de quantiles prédits par horizon. Ce paramétrage est celui du *Temporal Fusion Transformer*, qui produit nativement des quantiles sur plusieurs horizons (Lim, 2021) ; il vaut aussi pour les implémentations TCN du pipeline expérimental (protocole du chapitre 4, évaluation détaillée ci-dessous).",
        },
        {
          type: 'text',
          content:
            "Nous écartons la prévision récursive pour deux raisons pratiques. Réinjecter chaque prédiction dans la suivante fait grimper la variance d'erreur sur les 72 pas. En revanche, un modèle unique pour tous les horizons ne coûte qu'un seul entraînement au lieu de 72. La contrepartie tient à la sortie : avec $H = 72$ et $Q = 3$, le réseau doit produire $216$ valeurs d'un coup, ce qui augmente le risque de surapprentissage sur des séries courtes. Les architectures MIMO modernes (Lim, 2021) cherchent justement à contenir ce coût, par sélection de variables et partage de représentation, comme le détaille le chapitre~6.",
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
            "Une prévision ponctuelle donne la production attendue ; elle ne dit pas quelle réserve mobiliser pour couvrir les cas défavorables. Dimensionner une réserve, arbitrer entre excès et déficit ou sécuriser un contrat supposent de connaître la queue basse de la distribution de production, pas seulement sa tendance centrale. Nous ne pouvons pas estimer la distribution complète avec trois têtes de sortie ; nous en approchons donc les quantiles : $Q = 3$ niveaux, 10~\\%, 50~\\% et 90~\\%, soit une médiane et une enveloppe de confiance à 80~\\%.",
        },
        {
          type: 'text',
          content:
            "La régression quantile (Koenker, 1978 ; Koenker, 2005) estime le quantile conditionnel $q_\\alpha(\\mathbf{x}_t)$ en minimisant la perte en quantiles, dite *pinball*. Elle pénalise à chaque pas le résidu $y-a$ entre l'observation $y$ et la borne prédite $a$ :",
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
            "Cette formulation est *séparable* : chaque tête $q$ s'optimise sans les autres, ce qui simplifie et stabilise l'entraînement. En contrepartie, rien ne garantit l'*ordre* des quantiles prédits : sur certaines entrées, deux voisins se croisent et l'intervalle prend une largeur négative.",
        },
        {
          type: 'text',
          content:
            "Deux remèdes existent à ce croisement : pénaliser explicitement tout chevauchement, ou paramétrer la sortie par des incréments positifs contraints, $\\hat{y}^{(q)} = \\hat{y}^{(1)} + \\sum_{j<q} \\operatorname{softplus}(\\Delta_j)$. Le code mesure la fréquence de ces chevauchements (`quantile_crossing`) : elle reste nulle sur le jeu de test pour les deux architectures retenues, comme le rapporte le chapitre d'étude de cas. La perte hybride décrite ci-dessous joue aussi un rôle régularisateur.",
        },
      ],
    },
    {
      type: 'section',
      title: "L'approche d'incertitude retenue : perte hybride multi-tâche",
      blocks: [
        {
          type: 'text',
          content:
            "Les modèles TCN et TFT n'utilisent pas une simple perte quadratique. Ils optimisent une **fonction de perte hybride multi-tâche**, qui pondère deux objectifs par `mse_weight` :",
        },
        {
          type: 'math',
          display: true,
          tex: '\\mathcal{L} \\;=\\; \\underbrace{w_{\\text{mse}} \\cdot \\text{MSE}(\\hat{y}_{0{,}5},\\, y)}_{\\text{exactitude ponctuelle}} \\;+\\; \\underbrace{(1 - w_{\\text{mse}}) \\cdot \\overline{\\text{Pinball}}(\\hat{y}_{q},\\, y)}_{\\text{calibration probabiliste}}.',
        },
        {
          type: 'text',
          content:
            "La composante MSE porte sur la médiane prédite ; la composante pinball est moyennée sur les quantiles $q \\in \\{0{,}1, 0{,}5, 0{,}9\\}$. Le poids `mse_weight` règle le compromis entre les deux tâches.",
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
            "Pour Diass, le poids retenu est $0.5$, valeur confirmée par la recherche bayésienne d'hyperparamètres, qui explore l'intervalle $[0.3,\\, 0.8]$.\n\nCe choix tient au site **sahélien** : passages nuageux rapides et tempêtes de poussière de l'harmattan font varier fortement l'irradiance. Pour la conduite du réseau, estimer l'incertitude devient alors aussi critique que la prévision ponctuelle. La plage explorée adapte l'arbitrage au contexte local, sans le figer a priori.\n\nSur le jeu de test, les meilleurs essais retiennent des valeurs voisines (TFT : $0.617$, TCN : $0.765$).",
        },
        {
          type: 'text',
          content:
            "Cette perte repose sur deux sources d'incertitude, qu'il faut distinguer pour lire les résultats. L'incertitude *aléatoire* est irréductible : même une atmosphère parfaitement décrite ne permet pas de prévoir la position d'un passage nuageux au-delà de quelques heures, à l'échelle du kilomètre ; aucune quantité de données ne la supprime. L'incertitude *épistémique* est réductible : elle vient d'un manque de données ou de capacité de modèle. La régression quantile approche la variabilité aléatoire conditionnelle ; l'injection des covariables futures NWP réduit la composante épistémique, en informant le modèle de l'état atmosphérique à venir.",
        },
        {
          type: 'text',
          content:
            "L'entraînement hybride produit des quantiles dont la calibration n'est pas garantie en échantillon fini. Le code ajoute donc une étape de *recalibrage* a posteriori.",
        },
      ],
    },
    {
      type: 'section',
      title: "Recalibrage de l'enveloppe : le CQR adopté",
      blocks: [
        {
          type: 'text',
          content:
            "La perte ponctuelle+quantile produit des intervalles dont la couverture effective peut s'écarter de la cible, surtout loin de la médiane. L'implémentation ajoute donc une étape d'**inférence conforme quantile** (*Conformalized Quantile Regression*, CQR) (Romano, 2019), selon un schéma *split conformal* (Vovk, 2005 ; Shafer, 2008) : un jeu de calibration disjoint fournit le score de non-conformité",
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
            "où $q_{(k)}(\\mathcal{C})$ est le $k$-ième plus petit score de non-conformité, calculé sur le jeu de calibration de taille $m$. La garantie $\\mathbb{P}\\{y \\in \\mathcal{I}\\} \\ge 1-\\alpha$ (Vovk, 2005) vaut sans hypothèse sur le processus, à condition que les données de calibration soient *échangeables* avec le point à prédire.",
        },
        {
          type: 'text',
          content:
            "Dans le code, le recalibrage CQR s'applique avec $\\alpha = 0.20$ sur le jeu de validation, puis s'évalue sur le test. La couverture évolue ainsi : pour le TCN, elle passe de $60{,}8\\,\\%$ à $79{,}8\\,\\%$, proche de la cible de 80~\\% ; pour le TFT, de $71{,}2\\,\\%$ à $74{,}2\\,\\%$, avec une enveloppe plus étroite et une largeur moyenne nettement inférieure ($0.095$~MW contre $0.463$~MW). C'est cette étape qui transforme l'enveloppe brute de la perte hybride en un intervalle à garantie de couverture vérifiable, sans réentraînement du réseau. La largeur de l'intervalle étant un quantile *absolu* des résidus de calibration, elle s'élargit naturellement avec l'horizon $h$, ce qui préserve une couverture stable.",
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
            "Une prévision probabiliste se juge par un *score propre* : une quantité dont l'espérance est minimale lorsque la loi prédite est la vraie (Gneiting, 2007). La largeur moyenne seule se minimise trivialement — un intervalle infini suffit —, et la couverture seule récompense l'honnêteté sans la compétence. Nous rapportons donc trois grandeurs : la couverture, la largeur moyenne et un score propre (pinball ou score de Winkler). Le code les calcule pour chaque modèle avancé : `coverage`, `interval_width`, `winkler_80`, ainsi que les pertes de quantiles `pinball_lower`/`pinball_upper`.",
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
            "Le terme $\\varepsilon_n$ obéit à la loi binomiale : pour un intervalle à 80~\\% évalué sur $n$ échantillons, la couverture observée s'écarte du nominal d'un ordre de grandeur $1/\\sqrt{n}$.",
        },
        {
          type: 'text',
          content:
            "La couverture ne distingue pas sur-couverture et sous-couverture. La *transformation intégrale de probabilité* (PIT) complète le triplet lorsque la loi complète est disponible. Avec trois quantiles, le code se limite donc à la couverture, à la largeur moyenne, au score de Winkler et aux pertes de quantiles : assez pour départager deux architectures à horizon donné.",
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
            "Le protocole s'applique après l'étape CQR, sur des fenêtres de test identiques pour les deux architectures : 1049 fenêtres du 16~juillet au 28~août 2026, avec 168~h d'historique et 72~h d'horizon. Les valeurs numériques ci-dessous portent donc sur l'*enveloppe recalibrée*, et non sur la sortie brute de la perte hybride.",
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
            "La stratégie retenue tient en trois choix. D'abord, une sortie **MIMO** : un modèle unique produit les $H$ horizons en une seule passe, sans réinjection des prédictions, et apprend la cohérence entre horizons. Ensuite, une sortie **quantile** : $Q = 3$ niveaux (10~\\%, 50~\\%, 90~\\%), estimés par régression quantile séparable. Enfin, une perte hybride multi-tâche — MSE sur la médiane, pinball sur les quantiles, pondérés par `mse_weight` — complétée par un recalibrage *conformalized quantile regression* destiné à garantir la couverture de l'enveloppe en échantillon fini.",
        },
        {
          type: 'text',
          content:
            "Trois points restent en tête avant les résultats. Le premier est méthodologique : une prévision probabiliste ne se juge pas sur une métrique unique ; nous rapporterons toujours les trois ensemble, couverture, largeur moyenne et score propre. Le second borne ce qu'on peut espérer : sans les covariables NWP, aucun modèle ne produira d'intervalle utile à 72~h ; c'est l'information d'entrée qui fixe le plafond, pas l'architecture. Le troisième est un arbitrage : $Q=3$ recalibré concilie information, coût d'inférence et faisabilité dans le cadre de ce mémoire.",
        },
      ],
    },
  ],
}
