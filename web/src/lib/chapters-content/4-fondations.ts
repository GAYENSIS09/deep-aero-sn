import type { ChapterData } from './index'

export const chapterContent: ChapterData = {
  slug: '4-fondations',
  title: "Fondations de l'apprentissage supervisé et régularisation",
  part: 'Partie II — Modélisation et deep learning',
  intro:
    "Ce chapitre pose les notions que mobilisent les chapitres suivants : le neurone artificiel et le perceptron multicouche, les fonctions d'activation et de coût, la descente de gradient et la rétropropagation, les schémas de régularisation, enfin le protocole d'évaluation. Il laisse de côté les développements historiques — perceptron de Rosenblatt, régression logistique, classification multi-classe — qu'aucune des architectures évaluées aux chapitres~5 à~8 ne réactive. Objectif : un socle opérationnel, pas un panorama.",
  sections: [
    {
      type: 'figure',
      src: '/figures/boucle_apprentissage_supervise.jpg',
      caption:
        "Boucle d'apprentissage supervisé : les données traversent un modèle paramétré, la prédiction est comparée à la cible par une fonction de coût, et l'optimisation ajuste les paramètres.",
      heightClass: 'h-72 md:h-80',
    },
    {
      type: 'section',
      title: 'Du modèle linéaire au perceptron multicouche',
      blocks: [
        {
          type: 'subsection',
          title: 'Régression linéaire et conditionnement',
          blocks: [
            {
              type: 'text',
              content:
                "Le point de départ est la régression linéaire. Sur un jeu de $N$ observations $(x_i,y_i)$, on cherche $a$ et $b$ qui minimisent la somme des carrés des écarts",
            },
            {
              type: 'math',
              display: true,
              tex: 'f(a,b) = \\sum_{i=1}^{N}(ax_i + b - y_i)^2.',
            },
            {
              type: 'text',
              content:
                "Géométriquement, $f$ est un paraboloïde : ses lignes de niveau sont des ellipses d'autant plus étirées que le conditionnement $\\kappa = \\lambda_{\\max}/\\lambda_{\\min}$ de la Hessienne est grand. Cette anisotropie, illustrée figure ci-dessous, annonce la difficulté qui court tout au long du chapitre. Dans une vallée étroite, la descente de gradient oscille transversalement et avance lentement le long de l'axe utile. C'est cette observation qui motivera les optimiseurs adaptatifs de la section sur l'optimisation.",
            },
            {
              type: 'figure',
              src: '/figures/lignes_niveau_de.png',
              caption:
                'Lignes de niveau de $f(a,b)$ : le minimum se trouve dans une région plate et allongée.',
              heightClass: 'h-72 md:h-80',
            },
            {
              type: 'text',
              content:
                "La généralisation à $p$ variables suit sans mal : avec $\\hat{y} = Wx + b$, annuler le gradient donne les équations normales $W = (X^\\top X)^{-1}X^\\top Y$.",
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Neurone artificiel',
          blocks: [
            {
              type: 'text',
              content:
                "Le neurone artificiel garde cette forme, mais intercale une transformation non linéaire $\\varphi$ entre la combinaison linéaire et la sortie :",
            },
            {
              type: 'math',
              display: true,
              tex: 'z = Wx + b, \\qquad \\hat{y} = \\varphi(z).',
            },
            {
              type: 'text',
              content:
                "La frontière de décision reste l'hyperplan $z=0$ ; $\\varphi$ ne change que la transition autour. Le produit scalaire $Wx$ mesure la similarité entre l'entrée et le motif encodé par les poids. On absorbe le biais en posant $x_0=1$, ce qui donne $\\hat{y}=\\varphi(W'x')$ avec $x'\\in\\mathbb{R}^{p+1}$, la convention retenue en pratique (figure ci-dessous).",
            },
            {
              type: 'figure',
              src: '/figures/modele_neurones.png',
              caption:
                "Architecture d'un neurone artificiel : les entrées sont pondérées, sommées avec le biais, puis transformées par une activation.",
              heightClass: 'h-80 md:h-96',
            },
            {
              type: 'text',
              content:
                "Pour un lot de $n$ exemples, la forme matricielle est $\\hat{Y} = \\varphi(WX + b\\mathbb{1}^\\top)$ : un seul produit matriciel calcule $q\\times n$ produits scalaires en parallèle. D'où l'adéquation de ces modèles aux processeurs graphiques. Si $\\varphi$ est linéaire, enchaîner les couches revient à un unique produit matriciel. La non-linéarité n'est donc pas un raffinement : c'est la condition d'existence du deep learning.",
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Perceptron multicouche',
          blocks: [
            {
              type: 'text',
              content:
                "Le perceptron multicouche répond à une limite structurelle du modèle linéaire, que résume le problème du XOR : les classes $\\{(0,0),(1,1)\\}$ et $\\{(0,1),(1,0)\\}$ ne sont séparables par aucune droite, donc un neurone isolé ne peut pas les distinguer (figure ci-dessous). Empiler les couches et alterner les non-linéarités permet de tracer de telles frontières.",
            },
            {
              type: 'figure',
              src: '/figures/xor_probleme.png',
              caption:
                "Le problème du XOR : les deux classes ne sont pas linéairement séparables, ce qui motive l'empilement de couches et la non-linéarité.",
              heightClass: 'h-72 md:h-80',
            },
            {
              type: 'text',
              content:
                "C'est ainsi que naît le perceptron multicouche (MLP). Pour $\\ell=1,\\dots,L$ :",
            },
            {
              type: 'math',
              display: true,
              tex: '\\mathbf{h}^{(\\ell)} = \\varphi_\\ell\\!\\left(W^{(\\ell)}\\mathbf{h}^{(\\ell-1)} + \\mathbf{b}^{(\\ell)}\\right), \\qquad \\mathbf{h}^{(0)}=\\mathbf{x}.',
            },
            {
              type: 'text',
              content:
                "Le vecteur $\\mathbf{h}^{(\\ell)}$ est une représentation interne des données. La profondeur sert à hiérarchiser : les premières couches repèrent des motifs simples, les suivantes les assemblent en structures plus abstraites. À capacité égale, un réseau profond atteint en général la même fonction avec moins de paramètres qu'un réseau large.",
            },
            {
              type: 'figure',
              src: '/figures/ch4_mlp_architecture.png',
              caption: "Architecture d'un MLP à deux couches cachées.",
              heightClass: 'h-[22rem] md:h-[26rem]',
            },
            {
              type: 'text',
              content:
                "Un théorème classique valide a posteriori cette architecture : toute fonction continue sur un compact peut être approximée à précision arbitraire par un réseau à une seule couche cachée suffisamment large (Cybenko, 1989 ; Hornik, 1991). Mais le théorème ne dit rien de la généralisation ni de la difficulté d'apprentissage. La profondeur reste utile en pratique pour l'efficacité statistique, pas pour la capacité de représentation.",
            },
          ],
        },
        {
          type: 'subsection',
          title: "Stabilité de l'entraînement : normalisation, dropout, initialisation",
          blocks: [
            {
              type: 'text',
              content:
                "La stabilité de l'entraînement repose sur trois mécanismes complémentaires. La Batch Normalization (Ioffe, 2015) normalise les activations par mini-batch : le paysage de la perte s'adoucit et l'on peut viser des taux d'apprentissage plus élevés. Le Dropout (Srivastava, 2014) désactive chaque neurone avec probabilité $p$ et empêche le réseau de dépendre d'une unité particulière. Les initialisations Xavier/Glorot ($\\mathcal{N}(0, 2/(n_{\\text{in}}+n_{\\text{out}}))$) et He/Kaiming ($\\mathcal{N}(0, 2/n_{\\text{in}})$) préservent la variance des activations d'une couche à l'autre ; He double la variance pour compenser la moitié des neurones annulés par ReLU. On revient sur ces trois leviers dans la section régularisation.",
            },
          ],
        },
      ],
    },
    {
      type: 'section',
      title: "Fonctions d'activation",
      blocks: [
        {
          type: 'text',
          content:
            "L'activation commande la dynamique du gradient. Sigmoïde et tanh, longtemps dominantes, ont un gradient maximal borné : $0{,}25$ et $1{,}0$ respectivement. Dans un réseau de $L$ couches, le gradient est multiplié par un produit de $L$ facteurs inférieurs à $1$ : c'est le *vanishing gradient*, analysé dans la section consacrée aux gradients qui s'annulent ou explosent.",
        },
        {
          type: 'text',
          content: "ReLU (LeCun, 2015) lève cette limite avec un gradient constant, $1$ pour $z>0$ :",
        },
        {
          type: 'math',
          display: true,
          tex: "\\mathrm{ReLU}(z) = \\max(0,z), \\qquad \\mathrm{ReLU}'(z) = \\mathbb{1}_{z>0}.",
        },
        {
          type: 'text',
          content:
            "Trois avantages expliquent son succès : gradient non atténué dans la région active, coût de calcul négligeable, sparsité naturelle (environ la moitié des neurones s'annulent). Sa faiblesse est le *dying ReLU* : un neurone qui reste définitivement dans la zone négative ne s'en relève pas. Les variantes LeakyReLU, ELU, GELU et Swish atténuent ce problème. GELU et Swish sont aujourd'hui standard dans les Transformers, et GELU équipe le TFT du chapitre~6.",
        },
        {
          type: 'table',
          caption: "Récapitulatif des fonctions d'activation.",
          headers: ['Activation', 'Formule', 'Sortie', '$\\nabla$ max', 'Usage'],
          rows: [
            ['Sigmoïde', '$\\frac{1}{1+e^{-z}}$', '$(0,1)$', '$0{,}25$', 'Portes LSTM'],
            ['Tanh', '$\\frac{e^z-e^{-z}}{e^z+e^{-z}}$', '$(-1,1)$', '$1{,}0$', 'LSTM'],
            ['ReLU', '$\\max(0,z)$', '$[0,\\infty)$', '$1{,}0$', 'CNN, MLP'],
            ['GELU', '$z\\,\\Phi(z)$', '$\\mathbb{R}$', '$1{,}0$', 'Transformers'],
            ['Swish', '$z\\,\\sigma(z)$', '$\\mathbb{R}$', '$1{,}0$', 'Transformers'],
            ['Softmax', '$\\frac{e^{z_k}}{\\sum_j e^{z_j}}$', '$(0,1)^q$', 'variable', 'Sortie multi-classe'],
            ['Identité', '$z$', '$\\mathbb{R}$', '$1{,}0$', 'Régression'],
          ],
        },
        {
          type: 'text',
          content:
            "La couche de sortie suit la même règle : identité pour une régression scalaire, sigmoïde pour une probabilité binaire, softmax pour une distribution sur $q$ classes :",
        },
        {
          type: 'math',
          display: true,
          tex: '\\mathrm{softmax}(z)_k = \\frac{e^{z_k}}{\\sum_{j=1}^q e^{z_j}}.',
        },
        {
          type: 'text',
          content:
            "En pratique, on calcule $\\mathrm{softmax}(z-\\max(z))$ pour éviter les débordements numériques.",
        },
      ],
    },
    {
      type: 'section',
      title: "Fonctions de coût et métriques d'évaluation",
      blocks: [
        {
          type: 'text',
          content:
            "Entraîner un réseau, c'est minimiser une fonction de coût qui traduit l'écart entre prédiction et vérité en un scalaire *différentiable* : c'est elle, et non la métrique, qui pilote la descente de gradient. Les métriques d'évaluation, elles, se mesurent sur un jeu de test indépendant ; libres de toute contrainte de dérivabilité, elles expriment l'écart en des termes interprétables pour l'exploitant. Le pipeline `deep_aero_sn` rapporte deux familles : les *déterministes*, pour la prévision ponctuelle (souvent la médiane prédite), et les *probabilistes*, pour les intervalles de confiance.",
        },
        {
          type: 'text',
          content:
            "Le nombre de pertes réellement optimisées est réduit. En prévision ponctuelle, c'est l'erreur quadratique moyenne $\\mathrm{MSE}(\\hat{y},y)=\\frac{1}{n}\\sum_{i=1}^{n}(\\hat{y}_i-y_i)^2$, dérivable et sensible aux grands écarts. En prévision probabiliste, c'est la perte pinball, qui évalue un quantile $q$ :",
        },
        {
          type: 'math',
          display: true,
          tex: '\\text{QL}(y,\\hat{y},q) = q\\max(y-\\hat{y},0) + (1-q)\\max(\\hat{y}-y,0),',
        },
        {
          type: 'text',
          content:
            "Pour $q=0{,}5$, elle se réduit à l'erreur absolue. Le pipeline combine ces deux objectifs par la perte hybride donnée en fin de section.",
        },
        {
          type: 'text',
          content:
            "Dans les formules ci-dessous, les moyennes sont notées $\\bar{y}=\\frac{1}{n}\\sum_i y_i$ pour les observations et $\\bar{\\hat{y}}=\\frac{1}{n}\\sum_i \\hat{y}_i$ pour les prévisions.",
        },
        {
          type: 'text',
          content: '**Erreur absolue moyenne (MAE).** La **MAE** vaut',
        },
        {
          type: 'math',
          display: true,
          tex: '\\text{MAE} = \\frac{1}{n}\\sum_{i=1}^{n} \\left|\\hat{y}_i - y_i\\right|.',
        },
        {
          type: 'text',
          content:
            "Elle se lit dans l'unité de la cible : une MAE de $0{,}5$~MW signifie que la prévision s'en écarte de $0{,}5$~MW en moyenne. Comme elle ne pénalise pas davantage les grandes erreurs, elle reste robuste aux extrêmes, mais masque une défaillance concentrée sur quelques points.",
        },
        {
          type: 'text',
          content: "**Racine de l'erreur quadratique moyenne.** La **RMSE** vaut",
        },
        {
          type: 'math',
          display: true,
          tex: '\\text{RMSE} = \\sqrt{\\frac{1}{n}\\sum_{i=1}^{n} \\left(\\hat{y}_i - y_i\\right)^2}.',
        },
        {
          type: 'text',
          content:
            "Le carré pèse d'autant plus lourd que l'erreur grandit : un écart de 3~MW contribue neuf fois plus qu'un écart de 1~MW. D'où la sensibilité de la RMSE aux pics mal prévus (passages nuageux brusques, couverture surestimée) et son statut de métrique de référence pour les applications réseau, où les écarts extrêmes coûtent cher.",
        },
        {
          type: 'text',
          content: "**Erreur absolue moyenne en pourcentage (MAPE).** La **MAPE** s'écrit",
        },
        {
          type: 'math',
          display: true,
          tex: '\\text{MAPE} = \\frac{100}{n}\\sum_{i=1}^{n} \\left|\\frac{\\hat{y}_i - y_i}{y_i}\\right|\\;\\%.',
        },
        {
          type: 'text',
          content:
            "Reste qu'elle est *indéfinie* dès qu'une observation est nulle, cas permanent en photovoltaïque (nuit, panne) : la division par une valeur proche de zéro produirait des erreurs astronomiques et non informatives. Le pipeline ne calcule donc la MAPE que sur les points dépassant un seuil relatif $\\varepsilon = \\max\\!\\left(10^{-6},\\ 0{,}05 \\cdot \\text{médiane}(|y|)\\right)$ ; si aucun point ne passe le seuil (séquence entièrement nocturne), il bascule sur la **sMAPE**, bornée par 200~\\% :",
        },
        {
          type: 'math',
          display: true,
          tex: '\\text{sMAPE} = \\frac{200}{n}\\sum_{i=1}^{n} \\frac{\\left|\\hat{y}_i - y_i\\right|}{\\left|y_i\\right| + \\left|\\hat{y}_i\\right|}\\;\\%.',
        },
        {
          type: 'text',
          content: '**Coefficient de détermination.** Le **$R^2$** vaut',
        },
        {
          type: 'math',
          display: true,
          tex: 'R^2 = 1 - \\frac{\\sum_{i=1}^{n} \\left(\\hat{y}_i - y_i\\right)^2}{\\sum_{i=1}^{n} \\left(y_i - \\bar{y}\\right)^2}.',
        },
        {
          type: 'text',
          content:
            "Il mesure la part de variance expliquée relativement au modèle constant $\\bar{y}$. Un $R^2$ de $0{,}877$ (TCN sur Diass) signifie que le modèle réduit de $87{,}7\\,\\%$ l'erreur quadratique du prédicteur naïf. Contrairement à une idée reçue, il peut devenir négatif quand la prévision est pire que la moyenne : la persistance l'illustre sur les séries très variables. Ce comportement est en soi un signal diagnostique.",
        },
        {
          type: 'text',
          content:
            "**Erreur quadratique moyenne normalisée (NRMSE).** La **NRMSE** (commande `nrmse`) rapporte la RMSE à l'amplitude de la série observée :",
        },
        {
          type: 'math',
          display: true,
          tex: '\\text{NRMSE} = \\frac{\\text{RMSE}}{\\max(y) - \\min(y) + 10^{-8}},',
        },
        {
          type: 'text',
          content:
            "le terme $10^{-8}$ écarte la division par zéro. En rapportant l'erreur à l'étendue des valeurs, on peut comparer des sites de puissances ou des horizons différents, là où la RMSE brute suit l'échelle de la centrale ; c'est la métrique du chapitre~7 pour comparer les architectures.",
        },
        {
          type: 'text',
          content:
            "**Couverture.** La **couverture** compte la part d'observations tombant dans l'intervalle :",
        },
        {
          type: 'math',
          display: true,
          tex: '\\text{Cov} = \\frac{1}{n}\\sum_{i=1}^{n} \\indicator\\!\\left[y_i \\in [\\hat{y}_i^{\\text{bas}}, \\hat{y}_i^{\\text{haut}}]\\right].',
        },
        {
          type: 'text',
          content:
            "Avec $q=0{,}1$ et $q=0{,}9$, la couverture attendue vaut $80\\,\\%$ : plus le modèle s'en approche, plus l'intervalle mérite la confiance qu'il affiche. Sur Diass, le TCN atteint $79{,}8\\,\\%$ contre $74{,}2\\,\\%$ pour le TFT (chapitre~8).",
        },
        {
          type: 'text',
          content:
            "**Largeur d'intervalle.** La **largeur moyenne** mesure l'écart entre les deux bornes de l'intervalle :",
        },
        {
          type: 'math',
          display: true,
          tex: '\\text{Width} = \\frac{1}{n}\\sum_{i=1}^{n} \\left(\\hat{y}_i^{\\text{haut}} - \\hat{y}_i^{\\text{bas}}\\right).',
        },
        {
          type: 'text',
          content:
            "À couverture égale, l'intervalle étroit l'emporte : il traduit une incertitude mieux maîtrisée, donc des prévisions plus utiles.",
        },
        {
          type: 'text',
          content:
            "**Score de Winkler.** Le **score de Winkler** (commande `winkler_80`, seuil $\\alpha=0{,}2$) pénalise à la fois la largeur de l'intervalle et les écarts hors bornes :",
        },
        {
          type: 'math',
          display: true,
          tex: '\\text{Winkler} = \\frac{1}{n}\\sum_{i=1}^{n} \\Big[\\text{Width}_i + \\frac{2}{\\alpha}\\Delta_i\\Big],',
        },
        {
          type: 'text',
          content:
            "$\\Delta_i$ est nul si $y_i$ appartient à l'intervalle ; sinon, il vaut la distance de $y_i$ à la borne la plus proche. À la différence de la seule couverture, ce score punit les intervalles trop larges comme les sorties de borne : un seul chiffre arbitre entre finesse et honnêteté.",
        },
        {
          type: 'text',
          content:
            "**Perte hybride.** Le pipeline combine les deux objectifs par une pondération $w_{\\text{mse}}$ :",
        },
        {
          type: 'math',
          display: true,
          tex: '\\mathcal{L} = w_{\\text{mse}}\\cdot\\text{MSE}(\\hat{y}_{0{,}5},y) + (1-w_{\\text{mse}})\\cdot\\overline{\\text{Pinball}}(\\hat{y}_q,y), \\quad q\\in\\{0{,}1,0{,}5,0{,}9\\}.',
        },
        {
          type: 'text',
          content:
            "Cette formulation, centrale pour le chapitre~7, n'apparaît ici que pour mémoire : elle sera analysée dans son contexte applicatif.",
        },
      ],
    },
    {
      type: 'section',
      title: 'Optimisation',
      blocks: [
        {
          type: 'subsection',
          title: 'Descente de gradient',
          blocks: [
            {
              type: 'text',
              content:
                "L'algorithme de base déplace les paramètres dans la direction opposée au gradient :",
            },
            {
              type: 'math',
              display: true,
              tex: '\\theta \\leftarrow \\theta - \\eta\\,\\nabla_\\theta \\mathcal{L}(\\theta).',
            },
            {
              type: 'text',
              content:
                "La taille du lot utilisée à chaque mise à jour définit trois régimes : le batch complet (gradient exact, coût prohibitif), le SGD pur (un exemple par mise à jour, forte variance) et le mini-batch, standard en pratique, dont le bruit agit comme une régularisation implicite en favorisant les minima plats. Le taux d'apprentissage $\\eta$ reste l'hyperparamètre le plus critique ; les schedules usuels vont du step decay au cosine annealing, jusqu'au warmup suivi d'un decay, standard pour les Transformers et utilisé par le TFT.",
            },
            {
              type: 'text',
              content:
                "Sur une fonction quadratique, la convergence est garantie si $\\eta < 2/\\lambda_{\\max}$, avec un nombre d'itérations en $\\mathcal{O}(\\kappa\\log(1/\\varepsilon))$. En grande dimension non convexe, les mauvais minima locaux sont rares : les vrais obstacles sont les points-selles et les plateaux, que le bruit du mini-batch aide à traverser.",
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Rétropropagation',
          blocks: [
            {
              type: 'text',
              content:
                "La rétropropagation (LeCun, 1989) calcule $\\nabla_\\theta \\mathcal{L}$ en appliquant la règle de la chaîne de la sortie vers l'entrée, en $\\mathcal{O}(D)$ opérations — autant que la passe avant. En notant $\\delta^{(\\ell)} = \\partial \\mathcal{L}/\\partial \\mathbf{z}^{(\\ell)}$, la récurrence s'écrit",
            },
            {
              type: 'math',
              display: true,
              tex: "\\delta^{(\\ell)} = \\left(W^{(\\ell+1)\\top}\\delta^{(\\ell+1)}\\right)\\odot \\varphi'(\\mathbf{z}^{(\\ell)}), \\qquad \\frac{\\partial \\mathcal{L}}{\\partial W^{(\\ell)}} = \\delta^{(\\ell)}\\mathbf{h}^{(\\ell-1)\\top}.",
            },
            {
              type: 'text',
              content:
                "Le gradient d'un poids est donc le produit externe du signal d'erreur qui remonte et de l'activation qui descend : plus l'activation est grande, plus le poids est ajusté. Cette forme est exactement celle du gradient sigmoïde+BCE ; elle explique pourquoi les activations à gradient borné (sigmoïde, tanh) provoquent le vanishing gradient analysé plus loin.",
            },
            {
              type: 'text',
              content:
                "Les bibliothèques calculent ces gradients pour nous : la rétropropagation remplit les accumulateurs de gradient, qu'il faut remettre à zéro avant chaque itération.",
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Optimiseurs adaptatifs',
          blocks: [
            {
              type: 'text',
              content:
                "Momentum accumule une inertie, $v_t = \\beta v_{t-1} + \\nabla_\\theta \\mathcal{L}$, qui amortit les oscillations dans les directions de forte courbure. Adagrad divise le pas par la racine de la somme cumulée des gradients au carré, mais son taux décroît indéfiniment. RMSProp corrige ce défaut par une moyenne mobile. Adam (Kingma, 2015) marie les deux idées avec une correction de biais :",
            },
            {
              type: 'math',
              display: true,
              tex: 'm_t = \\beta_1 m_{t-1} + (1-\\beta_1)\\nabla_\\theta \\mathcal{L}, \\qquad v_t = \\beta_2 v_{t-1} + (1-\\beta_2)(\\nabla_\\theta \\mathcal{L})^2,',
            },
            {
              type: 'math',
              display: true,
              tex: '\\theta_{t+1} = \\theta_t - \\frac{\\eta}{\\sqrt{\\hat{v}_t}+\\epsilon}\\hat{m}_t, \\qquad \\hat{m}_t = \\frac{m_t}{1-\\beta_1^t},\\quad \\hat{v}_t = \\frac{v_t}{1-\\beta_2^t}.',
            },
            {
              type: 'text',
              content:
                "Valeurs par défaut : $\\beta_1=0{,}9$, $\\beta_2=0{,}999$, $\\epsilon=10^{-8}$. AdamW (Loshchilov, 2019) découple le weight decay de l'adaptation,",
            },
            {
              type: 'math',
              display: true,
              tex: '\\theta_{t+1} = (1-\\eta\\lambda)\\theta_t - \\frac{\\eta}{\\sqrt{\\hat{v}_t}+\\epsilon}\\hat{m}_t,',
            },
            {
              type: 'text',
              content:
                "Cela empêche la normalisation adaptative d'écraser la pénalisation $L_2$. C'est l'optimiseur retenu pour le TFT, comme indiqué au chapitre~6.",
            },
            {
              type: 'table',
              caption: "Recommandations d'optimiseurs.",
              headers: ['Architecture', 'Optimiseur', 'Hyperparamètres'],
              rows: [
                ['CNN + batch norm', 'Adam', '$\\eta=10^{-3}$'],
                ['Transformer', 'AdamW + warmup', '$\\lambda=0.01$, warmup 4000 pas'],
                ['Généralisation critique', 'SGD + momentum', '$\\eta=0.01$, schedule cosinus'],
                ['Prototype rapide', 'Adam', 'Valeurs par défaut'],
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'section',
      title: 'Régularisation',
      blocks: [
        {
          type: 'subsection',
          title: 'Compromis biais-variance',
          blocks: [
            {
              type: 'text',
              content:
                "L'erreur totale d'un modèle se décompose en biais$^2$, variance et bruit irréductible. Un biais élevé correspond au sous-apprentissage, une variance élevée au surapprentissage (figure ci-dessous). La régularisation paie un léger surcroît de biais pour une forte baisse de variance : l'optimum se déplace vers une complexité plus faible.",
            },
            {
              type: 'figure',
              src: '/figures/ch4_bias_variance.png',
              caption: 'Compromis biais-variance.',
              heightClass: 'h-72 md:h-80',
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Pénalités $L_1$, $L_2$ et Elastic Net',
          blocks: [
            {
              type: 'text',
              content: 'La pénalité $L_2$,',
            },
            {
              type: 'math',
              display: true,
              tex: '\\mathcal{L}_{\\text{reg}} = \\mathcal{L} + \\frac{\\lambda}{2}\\sum_\\ell \\|W^{(\\ell)}\\|_F^2,',
            },
            {
              type: 'text',
              content:
                "transforme le gradient en $\\partial \\mathcal{L}/\\partial W + \\lambda W$, ce qui revient à multiplier les poids par $(1-\\eta\\lambda)$ à chaque pas : d'où le nom *weight decay*. La pénalité $L_1$,",
            },
            {
              type: 'math',
              display: true,
              tex: '\\mathcal{L}_{\\text{reg}} = \\mathcal{L} + \\lambda\\sum_\\ell \\|W^{(\\ell)}\\|_1,',
            },
            {
              type: 'text',
              content:
                "pousse à la parcimonie : géométriquement, le losange $L_1$ a ses sommets sur les axes, et la perte atteint en général sa première intersection en un point où certains poids sont exactement nuls (figure ci-dessous). Elastic Net combine les deux pour obtenir à la fois parcimonie et stabilité.",
            },
            {
              type: 'figure',
              src: '/figures/Régularisation L1 vs L2.png',
              caption:
                'Géométrie du $L_1$ vs $L_2$ : le losange $L_1$ induit la parcimonie, le cercle $L_2$ des poids petits mais non nuls.',
              heightClass: 'h-80 md:h-96',
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Dropout',
          blocks: [
            {
              type: 'text',
              content:
                "Le dropout (Srivastava, 2014) désactive chaque neurone avec probabilité $p$ pendant l'entraînement, puis rescale les activations restantes par $1/(1-p)$ pour conserver la magnitude moyenne :",
            },
            {
              type: 'math',
              display: true,
              tex: '\\tilde{h}_j = \\frac{m_j}{1-p}h_j, \\qquad m_j \\sim \\mathrm{Bernoulli}(1-p).',
            },
            {
              type: 'text',
              content:
                "À l'inférence, tous les neurones sont de nouveau actifs. L'interprétation bayésienne (Gal \\& Ghahramani, 2016) y voit une approximation de l'inférence sur l'ensemble des sous-réseaux. En pratique : $p=0{,}5$ sur les couches denses, $p=0{,}1$--$0{,}2$ sur la couche d'entrée, et aucun dropout en sortie.",
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Normalisation',
          blocks: [
            {
              type: 'text',
              content:
                "Quatre variantes se distinguent par l'axe qu'elles normalisent. La Batch Normalization le fait par feature sur le mini-batch : elle dépend donc de la taille de lot et se comporte différemment à l'entraînement et à l'inférence. La Layer Normalization,",
            },
            {
              type: 'math',
              display: true,
              tex: '\\mu = \\frac{1}{H}\\sum_{k=1}^H h_k, \\qquad \\sigma^2 = \\frac{1}{H}\\sum_{k=1}^H (h_k-\\mu)^2, \\qquad \\tilde{h}_k = \\gamma_k\\frac{h_k-\\mu}{\\sqrt{\\sigma^2+\\epsilon}}+\\beta_k,',
            },
            {
              type: 'text',
              content:
                "normalise par échantillon, donc indépendante du batch — propriété essentielle pour les Transformers, qui traitent des séquences de longueur variable. C'est la normalisation du TFT et du TCN (chapitre~6). L'Instance Normalization opère par canal et par échantillon, la Group Normalization par groupes de canaux, indépendamment du batch.",
            },
            {
              type: 'text',
              content:
                "Santurkar et al. (2018) ont tranché le débat sur le mécanisme d'action de la BN : elle agit principalement en lissant le paysage de la perte, plutôt qu'en réduisant l'*internal covariate shift*.",
            },
          ],
        },
      ],
    },
    {
      type: 'section',
      title: 'Vanishing et exploding gradients',
      blocks: [
        {
          type: 'text',
          content:
            "La rétropropagation multiplie les gradients couche après couche. Si chaque facteur est inférieur à $1$ en magnitude — le cas de la sigmoïde, dont le gradient maximal vaut $0{,}25$ —, le gradient décroît exponentiellement avec la profondeur : après dix couches, il est multiplié par $0{,}25^{10}\\approx 10^{-6}$, et les couches proches de l'entrée cessent d'apprendre. À l'inverse, des facteurs supérieurs à $1$ font exploser la perte, qui devient non finie.",
        },
        {
          type: 'text',
          content:
            "Quatre leviers corrigent le vanishing. L'activation ReLU (gradient $\\in\\{0,1\\}$) ne réduit pas le gradient dans sa zone active. Les initialisations de He et Xavier ajustent la variance des poids à la dimension des couches : ni explosion, ni activations annulées. Les connexions résiduelles,",
        },
        {
          type: 'math',
          display: true,
          tex: '\\mathbf{h}^{(\\ell)} = \\mathbf{h}^{(\\ell-1)} + \\mathcal{F}(\\mathbf{h}^{(\\ell-1)}), \\qquad \\frac{\\partial \\mathbf{h}^{(\\ell)}}{\\partial \\mathbf{h}^{(\\ell-1)}} = I + \\frac{\\partial \\mathcal{F}}{\\partial \\mathbf{h}^{(\\ell-1)}},',
        },
        {
          type: 'text',
          content:
            "laissent un terme identité dans la jacobienne : le gradient ne peut pas s'annuler. C'est ce qui a permis d'entraîner des réseaux à plusieurs centaines de couches (ResNet) ; on retrouve le même mécanisme dans les blocs résiduels du TCN (chapitre~6). Les LSTM, eux, règlent le problème dans les séquences : leur canal de mémoire a un flux additif $c_t = f_t\\odot c_{t-1} + i_t\\odot\\tilde{c}_t$, plutôt que multiplicatif.",
        },
        {
          type: 'text',
          content:
            "Pour l'explosion, la parade est le gradient clipping : si $\\|g\\|>\\tau$, on remplace $g$ par $\\tau g/\\|g\\|$, avec $\\tau=1$ ou $5$. La technique est systématique pour les RNN et les Transformers ; le TFT du chapitre~6 l'applique.",
        },
        {
          type: 'table',
          caption: 'Stratégies anti-vanishing par architecture.',
          headers: ['Architecture', 'Remèdes'],
          rows: [
            ['MLP profond', 'ReLU + He init + skip connections'],
            ['CNN profond', 'ResNet + BatchNorm'],
            ['RNN', 'LSTM/GRU + gradient clipping'],
            ['Transformer', 'LayerNorm + gradient clipping'],
          ],
        },
      ],
    },
    {
      type: 'section',
      title: "Généralisation et protocole d'évaluation",
      blocks: [
        {
          type: 'subsection',
          title: 'Découpage des données',
          blocks: [
            {
              type: 'text',
              content:
                "Le découpage standard sépare entraînement (60--80~\\%, ajustement des poids), validation (10--20~\\%, hyperparamètres et early stopping) et test (10--20~\\%, évaluation finale unique). Sur une série temporelle, l'ordre chronologique est préservé : on ne mélange pas les échantillons, et la normalisation est ajustée sur l'entraînement seul puis gelée. La validation croisée classique cède donc la place au walk-forward. Chaque pli entraîne sur tout le passé disponible et teste sur la fenêtre suivante : aucune donnée future n'entre en jeu (figure ci-dessous).",
            },
            {
              type: 'figure',
              src: '/figures/ch4_walk_forward.png',
              caption: 'Validation croisée walk-forward pour séries temporelles.',
              heightClass: 'h-64 md:h-72',
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Fuite de données',
          blocks: [
            {
              type: 'text',
              content:
                "La fuite de données, c'est toute contamination de l'évaluation par une information indisponible au moment de la prévision. Elle se rencontre le plus souvent sous l'une de trois formes : ajustement de la normalisation sur l'ensemble complet, sélection de features ou d'hyperparamètres guidée par le test, usage de features construites avec le futur. Cette dernière est la plus insidieuse : elle se dissimule aisément dans une longue liste de colonnes. Le chapitre~8 détaille les garde-fous du pipeline, appliqués au cas de Diass : ajustement exclusif du scaler sur l'entraînement, sélection confinée à l'entraînement et à la validation, ingénierie causale excluant automatiquement les dérivées quasi linéaires de la cible.",
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Optimisation des hyperparamètres',
          blocks: [
            {
              type: 'text',
              content:
                "L'optimisation des hyperparamètres se heurte à quatre difficultés : structure nichée (chaque évaluation exige un entraînement complet), coût en heures-GPU, espace mixte continu/entier/catégoriel à dépendances conditionnelles, objectif non lisse. La recherche sur grille devient ingérable au-delà de quatre paramètres ; la recherche aléatoire de Bergstra \\& Bengio (2012) reste une référence quand peu de dimensions comptent réellement. Les méthodes modernes tiennent en quatre familles : optimisation bayésienne, estimateur de Parzen arborescent (TPE), méthodes multi-fidélité (successive halving, Hyperband, ASHA) et méthodes populationnelles (CMA-ES, PBT). Franceschi et al. (2024) en donnent une synthèse.",
            },
            {
              type: 'text',
              content:
                "Ce travail retient Optuna, avec un échantillonneur TPE et un élagage médian. On minimise la perte hybride MSE+pinball (présentée plus haut), et les essais sont journalisés dans MLflow pour garder la trace des configurations. Le détail de la recherche, les valeurs retenues pour Diass et les résultats comparés figurent au chapitre~8.",
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Arrêt anticipé',
          blocks: [
            {
              type: 'text',
              content:
                "On surveille la perte de validation et l'on arrête l'entraînement dès qu'elle cesse de décroître, après une patience de 5 à 20 époques typiques, en restaurant les poids du meilleur point. Tous les modèles du chapitre~8 utilisent ce mécanisme, avec une patience de 25 époques pour le TCN et le TFT.",
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
            "Parti de la régression linéaire, ce chapitre a montré pourquoi un empilement de couches non linéaires représente des relations qu'un modèle linéaire laisse de côté, le problème du XOR en étant l'illustration la plus simple. Les fonctions d'activation conditionnent la propagation du gradient ; les fonctions de coût traduisent l'objectif visé (erreur quadratique pour la valeur centrale, pinball pour les quantiles) ; les métriques (MAE, RMSE, $R^2$, NRMSE, couverture, largeur, score de Winkler) comparent les modèles sur un jeu de test indépendant. L'optimisation part de la descente de gradient et va jusqu'aux optimiseurs adaptatifs : la rétropropagation calcule les gradients, Adam ou AdamW conduisent l'entraînement.\n\nLa régularisation (pénalités $L_1$ et $L_2$, dropout, normalisation) contient la variance sans amputer la capacité du modèle. L'analyse du vanishing et de l'exploding gradient justifie les choix techniques qui reviendront dans les chapitres suivants : ReLU, initialisations de He et Xavier, connexions résiduelles, LSTM et gradient clipping.\n\nLe protocole d'évaluation fixe les conditions de comparaison : découpage chronologique, validation walk-forward, prévention des fuites de données, optimisation des hyperparamètres par Optuna, journalisation MLflow et arrêt anticipé. Ce sont ces règles qui s'appliquent au cas de Diass.",
        },
      ],
    },
  ],
}
