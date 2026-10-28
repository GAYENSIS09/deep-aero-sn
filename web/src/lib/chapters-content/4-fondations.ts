import type { ChapterData } from './index'

export const chapterContent: ChapterData = {
  slug: '4-fondations',
  title: "Fondations de l'apprentissage supervisé et régularisation",
  part: 'Partie II — Modélisation et deep learning',
  intro:
    "Ce chapitre fixe les notions théoriques que mobilisent les chapitres suivants : le neurone artificiel et le perceptron multicouche, les fonctions d'activation et de coût, l'optimisation par descente de gradient et rétropropagation, les schémas de régularisation, enfin le protocole d'évaluation. Les développements historiques (perceptron de Rosenblatt, régression logistique, classification multi-classe) restent à l'écart : aucune des architectures évaluées aux chapitres~5 à~8 ne les réactive. L'ambition est de fournir un socle opérationnel, non un panorama.",
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
                "Le point de départ est la régression linéaire. Pour un jeu de $N$ observations $(x_i,y_i)$, on cherche $a$ et $b$ minimisant la somme des carrés des écarts",
            },
            {
              type: 'math',
              display: true,
              tex: 'f(a,b) = \\sum_{i=1}^{N}(ax_i + b - y_i)^2.',
            },
            {
              type: 'text',
              content:
                "Géométriquement, $f$ définit un paraboloïde dont les lignes de niveau sont des ellipses d'autant plus allongées que le conditionnement $\\kappa = \\lambda_{\\max}/\\lambda_{\\min}$ de la Hessienne est grand. Cette anisotropie, illustrée à la figure ci-dessous, annonce la difficulté qui traverse tout le chapitre : dans une vallée étroite, la descente de gradient oscille transversalement et progresse lentement le long de l'axe utile. C'est précisément cette observation qui motivera les optimiseurs adaptatifs de la section consacrée à l'optimisation.",
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
                "La généralisation à $p$ variables suit immédiatement. Avec $\\hat{y} = Wx + b$, annuler le gradient conduit aux équations normales $W = (X^\\top X)^{-1}X^\\top Y$.",
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
                "Un neurone artificiel généralise cette forme en intercalant une transformation non linéaire $\\varphi$ entre la combinaison linéaire et la sortie :",
            },
            {
              type: 'math',
              display: true,
              tex: 'z = Wx + b, \\qquad \\hat{y} = \\varphi(z).',
            },
            {
              type: 'text',
              content:
                "La frontière de décision reste l'hyperplan $z=0$ ; $\\varphi$ n'en modifie que la transition. Le produit scalaire $Wx$ s'interprète comme une mesure de similarité entre l'entrée et le motif encodé par les poids. Le biais s'absorbe en posant $x_0=1$, ce qui permet d'écrire $\\hat{y}=\\varphi(W'x')$ avec $x'\\in\\mathbb{R}^{p+1}$, convention systématiquement retenue en pratique (figure ci-dessous).",
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
                "Pour un lot de $n$ exemples, la forme matricielle s'écrit $\\hat{Y} = \\varphi(WX + b\\mathbb{1}^\\top)$ : un seul produit matriciel réalise $q\\times n$ produits scalaires en parallèle, ce qui explique l'adéquation de ces modèles aux processeurs graphiques. Si $\\varphi$ est linéaire, la composition de plusieurs couches se réduit à un produit matriciel unique. La non-linéarité n'est donc pas un raffinement : c'est la condition d'existence du deep learning.",
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
                "Le perceptron multicouche répond à une limite structurelle du modèle linéaire, que résume le problème du XOR : les classes $\\{(0,0),(1,1)\\}$ et $\\{(0,1),(1,0)\\}$ ne sont séparables par aucune droite, si bien qu'un neurone isolé ne peut les distinguer (figure ci-dessous). L'empilement de couches et l'intercalation de non-linéarités permettent de construire de telles frontières de décision non linéaires.",
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
                "L'empilement des couches produit le perceptron multicouche (MLP). Pour $\\ell=1,\\dots,L$ :",
            },
            {
              type: 'math',
              display: true,
              tex: '\\mathbf{h}^{(\\ell)} = \\varphi_\\ell\\!\\left(W^{(\\ell)}\\mathbf{h}^{(\\ell-1)} + \\mathbf{b}^{(\\ell)}\\right), \\qquad \\mathbf{h}^{(0)}=\\mathbf{x}.',
            },
            {
              type: 'text',
              content:
                "Le vecteur $\\mathbf{h}^{(\\ell)}$ constitue une représentation interne des données. L'intérêt de la profondeur est hiérarchique : les premières couches détectent des motifs simples, les suivantes les combinent en structures plus abstraites. À capacité égale, un réseau profond nécessite généralement moins de paramètres qu'un réseau large pour approximer une même fonction.",
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
                "Un résultat classique justifie a posteriori cette architecture : toute fonction continue sur un compact peut être approximée à précision arbitraire par un réseau à une seule couche cachée suffisamment large (Cybenko, 1989 ; Hornik, 1991). Le théorème ne dit rien sur la généralisation ni sur la facilité d'apprentissage : la profondeur reste utile en pratique, non pour la capacité de représentation, mais pour l'efficacité statistique.",
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
                "La stabilité de l'entraînement des réseaux profonds repose sur trois mécanismes complémentaires. La Batch Normalization (Ioffe, 2015) normalise les activations par mini-batch, ce qui lisse le paysage de la perte et autorise des taux d'apprentissage plus élevés. Le Dropout (Srivastava, 2014) désactive aléatoirement chaque neurone avec probabilité $p$, forçant le réseau à ne pas dépendre d'une unité particulière. Les initialisations Xavier/Glorot ($\\mathcal{N}(0, 2/(n_{\\text{in}}+n_{\\text{out}}))$) et He/Kaiming ($\\mathcal{N}(0, 2/n_{\\text{in}})$) préservent la variance des activations à travers les couches, He doublant la variance pour compenser la moitié des neurones annulés par ReLU. Ces trois leviers sont réexaminés dans la section consacrée à la régularisation, sous l'angle de la régularisation.",
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
            "Le choix de l'activation détermine la dynamique du gradient. Sigmoïde et tanh, historiquement dominantes, souffrent d'un gradient maximal borné ($0{,}25$ et $1{,}0$ respectivement). Dans un réseau de $L$ couches, le gradient est multiplié par un produit de $L$ facteurs inférieurs à $1$ : c'est le *vanishing gradient*, analysé dans la section consacrée aux gradients qui s'annulent ou explosent.",
        },
        {
          type: 'text',
          content: "ReLU (LeCun, 2015) lève cette limitation en adoptant un gradient constant de $1$ pour $z>0$ :",
        },
        {
          type: 'math',
          display: true,
          tex: "\\mathrm{ReLU}(z) = \\max(0,z), \\qquad \\mathrm{ReLU}'(z) = \\mathbb{1}_{z>0}.",
        },
        {
          type: 'text',
          content:
            "Trois propriétés expliquent son succès : gradient non atténué dans la région active, coût de calcul négligeable, sparsité naturelle (environ la moitié des neurones s'annulent). Sa faiblesse, le *dying ReLU*, apparaît lorsqu'un neurone reste définitivement dans la zone négative. Les variantes LeakyReLU, ELU, GELU et Swish atténuent ce problème. GELU et Swish sont aujourd'hui standard dans les Transformers, et GELU équipe le TFT du chapitre~6.",
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
            "La couche de sortie suit la même logique : identité pour une régression scalaire, sigmoïde pour une probabilité binaire, softmax pour une distribution sur $q$ classes :",
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
            "Entraîner un réseau revient à minimiser une fonction de coût qui traduit l'écart entre prédiction et vérité en un scalaire *différentiable* : c'est elle, et non la métrique, qui pilote la descente de gradient. Les métriques d'évaluation, mesurées sur un jeu de test indépendant, jugent la qualité des prévisions ; libres de toute contrainte de dérivabilité, elles expriment l'écart en des termes interprétables pour l'exploitant. Le pipeline `deep_aero_sn` rapporte deux familles de métriques : les *déterministes*, pour la prévision ponctuelle (souvent la médiane prédite), et les *probabilistes*, pour les intervalles de confiance.",
        },
        {
          type: 'text',
          content:
            "Les pertes effectivement optimisées sont peu nombreuses. En prévision ponctuelle, il s'agit de l'erreur quadratique moyenne $\\mathrm{MSE}(\\hat{y},y)=\\frac{1}{n}\\sum_{i=1}^{n}(\\hat{y}_i-y_i)^2$, dérivable et sensible aux grands écarts. En prévision probabiliste, il s'agit de la perte pinball, qui évalue un quantile $q$ :",
        },
        {
          type: 'math',
          display: true,
          tex: '\\text{QL}(y,\\hat{y},q) = q\\max(y-\\hat{y},0) + (1-q)\\max(\\hat{y}-y,0),',
        },
        {
          type: 'text',
          content:
            "et se réduit à l'erreur absolue pour $q=0{,}5$. Le pipeline combine ces deux objectifs par la perte hybride donnée en fin de section.",
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
            "Elle exprime l'erreur moyenne dans l'unité de la cible : une MAE de $0{,}5$~MW signifie que la prévision s'en écarte de $0{,}5$~MW en moyenne. Ne pénalisant pas davantage les grandes erreurs, elle reste robuste aux extrêmes mais masque une défaillance concentrée sur quelques points.",
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
            "Le carré donne un poids accru aux grandes erreurs, car un écart de 3~MW contribue neuf fois plus qu'un écart de 1~MW ; d'où sa sensibilité aux pics mal prévus (passages nuageux brusques, couverture surestimée) et son statut de métrique de référence pour les applications réseau, où les écarts extrêmes coûtent cher.",
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
            "Elle reste toutefois *indéfinie* dès qu'une observation est nulle, cas permanent en photovoltaïque (nuit, panne) : la division par une valeur proche de zéro produirait des erreurs astronomiques et non informatives. Le pipeline ne calcule donc la MAPE que sur les points dépassant un seuil relatif $\\varepsilon = \\max\\!\\left(10^{-6},\\ 0{,}05 \\cdot \\text{médiane}(|y|)\\right)$ ; si aucun ne passe le seuil (séquence entièrement nocturne), il bascule sur la **sMAPE**, bornée par 200~\\% :",
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
            "Il mesure la part de variance expliquée relativement au modèle constant $\\bar{y}$. Un $R^2$ de $0{,}877$ (TCN sur Diass) signifie que le modèle réduit de $87{,}7\\,\\%$ l'erreur quadratique du prédicteur naïf. Contrairement à une idée répandue, il peut devenir négatif quand la prévision est pire que la moyenne, comme l'illustre la persistance sur les séries très variables ; ce comportement constitue en soi un signal diagnostique.",
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
            "le terme $10^{-8}$ écartant la division par zéro. En rapportant l'erreur à l'étendue des valeurs, cette normalisation autorise la comparaison entre sites de puissances ou horizons différents, là où la RMSE brute dépend de l'échelle de la centrale ; c'est la métrique employée au chapitre~7 pour comparer les architectures.",
        },
        {
          type: 'text',
          content:
            "**Couverture.** La **couverture** est la proportion d'observations tombant dans l'intervalle :",
        },
        {
          type: 'math',
          display: true,
          tex: '\\text{Cov} = \\frac{1}{n}\\sum_{i=1}^{n} \\indicator\\!\\left[y_i \\in [\\hat{y}_i^{\\text{bas}}, \\hat{y}_i^{\\text{haut}}]\\right].',
        },
        {
          type: 'text',
          content:
            "Pour des quantiles $q=0{,}1$ et $q=0{,}9$, la couverture attendue vaut $80\\,\\%$ : plus le modèle s'en approche, plus le niveau de confiance annoncé est honnête. Sur Diass, le TCN atteint $79{,}8\\,\\%$ contre $74{,}2\\,\\%$ pour le TFT (chapitre~8).",
        },
        {
          type: 'text',
          content:
            "**Largeur d'intervalle.** La **largeur moyenne** moyenne la largeur de l'intervalle :",
        },
        {
          type: 'math',
          display: true,
          tex: '\\text{Width} = \\frac{1}{n}\\sum_{i=1}^{n} \\left(\\hat{y}_i^{\\text{haut}} - \\hat{y}_i^{\\text{bas}}\\right).',
        },
        {
          type: 'text',
          content:
            "À couverture égale, un intervalle plus étroit est préférable : il traduit une incertitude mieux maîtrisée, donc des prévisions plus utiles.",
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
            "où $\\Delta_i$ est nul si $y_i$ appartient à l'intervalle, et vaut sinon la distance de $y_i$ à la borne la plus proche. À la différence de la seule couverture, ce score punit les intervalles trop larges comme les sorties de borne, offrant un compromis unique entre finesse et honnêteté.",
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
            "Cette formulation, centrale pour le chapitre~7, n'est rappelée ici que pour mémoire : elle est analysée dans son contexte applicatif.",
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
                "Selon la taille du lot utilisée à chaque mise à jour, on distingue trois régimes : le batch complet (gradient exact, coût prohibitif), le SGD pur (un exemple par mise à jour, forte variance) et le mini-batch, standard en pratique, dont le bruit agit comme une régularisation implicite en favorisant les minima plats. Le taux d'apprentissage $\\eta$ est l'hyperparamètre le plus critique ; les schedules usuels vont du step decay au cosine annealing, jusqu'au warmup suivi d'un decay, standard pour les Transformers et utilisé par le TFT.",
            },
            {
              type: 'text',
              content:
                "Sur une fonction quadratique, la convergence est garantie si $\\eta < 2/\\lambda_{\\max}$, avec un nombre d'itérations en $\\mathcal{O}(\\kappa\\log(1/\\varepsilon))$. En grande dimension non convexe, les mauvais minima locaux sont rares ; les difficultés réelles sont les points-selles et les plateaux, que le bruit du mini-batch aide à traverser.",
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
                "La rétropropagation (LeCun, 1989) calcule $\\nabla_\\theta \\mathcal{L}$ en appliquant la règle de la chaîne de la sortie vers l'entrée, en $\\mathcal{O}(D)$ opérations, soit la même complexité que la passe avant. En notant $\\delta^{(\\ell)} = \\partial \\mathcal{L}/\\partial \\mathbf{z}^{(\\ell)}$, la récurrence s'écrit",
            },
            {
              type: 'math',
              display: true,
              tex: "\\delta^{(\\ell)} = \\left(W^{(\\ell+1)\\top}\\delta^{(\\ell+1)}\\right)\\odot \\varphi'(\\mathbf{z}^{(\\ell)}), \\qquad \\frac{\\partial \\mathcal{L}}{\\partial W^{(\\ell)}} = \\delta^{(\\ell)}\\mathbf{h}^{(\\ell-1)\\top}.",
            },
            {
              type: 'text',
              content:
                "Le gradient d'un poids est donc le produit externe du signal d'erreur qui remonte et de l'activation qui descend : plus l'activation est grande, plus le poids est ajusté. Cette forme est exactement celle du gradient sigmoïde+BCE ; elle explique aussi pourquoi les activations à gradient borné (sigmoïde, tanh) provoquent le vanishing gradient analysé plus loin.",
            },
            {
              type: 'text',
              content:
                "En PyTorch, la rétropropagation est automatisée via l'autograd : `loss.backward()` peuple les accumulateurs `.grad`, qu'il faut remettre à zéro avant chaque itération (`optimizer.zero_grad()`).",
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
                "Momentum accumule une inertie, $v_t = \\beta v_{t-1} + \\nabla_\\theta \\mathcal{L}$, qui amortit les oscillations dans les directions de forte courbure. Adagrad divise le pas par la racine de la somme cumulée des gradients au carré, mais son taux décroît indéfiniment. RMSProp corrige ce défaut par une moyenne mobile. Adam (Kingma, 2015) combine les deux idées avec une correction de biais :",
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
                "ce qui évite que la pénalisation $L_2$ soit écrasée par la normalisation adaptative. C'est l'optimiseur retenu pour le TFT, comme indiqué au chapitre~6.",
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
                "L'erreur totale d'un modèle se décompose en biais$^2$, variance et bruit irréductible. Un biais élevé correspond au sous-apprentissage, une variance élevée au surapprentissage (figure ci-dessous). La régularisation augmente légèrement le biais mais réduit significativement la variance, déplaçant l'optimum vers une complexité plus faible.",
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
                "modifie le gradient en $\\partial \\mathcal{L}/\\partial W + \\lambda W$, ce qui revient à multiplier les poids par $(1-\\eta\\lambda)$ à chaque pas, d'où le nom *weight decay*. La pénalité $L_1$,",
            },
            {
              type: 'math',
              display: true,
              tex: '\\mathcal{L}_{\\text{reg}} = \\mathcal{L} + \\lambda\\sum_\\ell \\|W^{(\\ell)}\\|_1,',
            },
            {
              type: 'text',
              content:
                "favorise la parcimonie : géométriquement, le losange $L_1$ a ses sommets sur les axes, et la perte atteint typiquement sa première intersection en un point où certains poids sont exactement nuls (figure ci-dessous). Elastic Net combine les deux pour obtenir à la fois parcimonie et stabilité.",
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
                "Le dropout (Srivastava, 2014) désactive aléatoirement chaque neurone avec probabilité $p$ pendant l'entraînement, puis rescale les activations restantes par $1/(1-p)$ pour conserver la magnitude moyenne :",
            },
            {
              type: 'math',
              display: true,
              tex: '\\tilde{h}_j = \\frac{m_j}{1-p}h_j, \\qquad m_j \\sim \\mathrm{Bernoulli}(1-p).',
            },
            {
              type: 'text',
              content:
                "À l'inférence, tous les neurones sont actifs. L'interprétation bayésienne (Gal \\& Ghahramani, 2016) y voit une approximation de l'inférence sur l'ensemble des sous-réseaux. En pratique, $p=0{,}5$ sur les couches denses, $p=0{,}1$--$0{,}2$ sur la couche d'entrée, et aucun dropout en sortie.",
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
                "Quatre variantes se distinguent par l'axe de normalisation. La Batch Normalization normalise par feature sur le mini-batch ; elle dépend donc de la taille de lot et se comporte différemment à l'entraînement et à l'inférence. La Layer Normalization,",
            },
            {
              type: 'math',
              display: true,
              tex: '\\mu = \\frac{1}{H}\\sum_{k=1}^H h_k, \\qquad \\sigma^2 = \\frac{1}{H}\\sum_{k=1}^H (h_k-\\mu)^2, \\qquad \\tilde{h}_k = \\gamma_k\\frac{h_k-\\mu}{\\sqrt{\\sigma^2+\\epsilon}}+\\beta_k,',
            },
            {
              type: 'text',
              content:
                "normalise par échantillon sur les features, ce qui la rend indépendante du batch, propriété essentielle pour les Transformers qui traitent des séquences de longueur variable. C'est la normalisation utilisée par le TFT et le TCN (chapitre~6). L'Instance Normalization opère par canal et par échantillon, la Group Normalization par groupes de canaux, indépendamment du batch.",
            },
            {
              type: 'text',
              content:
                "Le débat sur le mécanisme d'action de la BN a été tranché par Santurkar et al. (2018) : elle agit principalement en lissant le paysage de la perte, plutôt qu'en réduisant l'*internal covariate shift*.",
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
            "La rétropropagation multiplie les gradients couche par couche. Si chaque facteur est inférieur à $1$ en magnitude, comme pour une sigmoïde dont le gradient maximal vaut $0{,}25$, le gradient décroît exponentiellement avec la profondeur : après dix couches, il est multiplié par $0{,}25^{10}\\approx 10^{-6}$, et les couches proches de l'entrée cessent d'apprendre. Le phénomène inverse (facteurs $>1$) fait exploser la perte en NaN.",
        },
        {
          type: 'text',
          content:
            "Quatre leviers corrigent le vanishing. L'activation ReLU (gradient $\\in\\{0,1\\}$) ne réduit pas le gradient dans sa zone active. Les initialisations de He et Xavier ajustent la variance des poids à la dimension des couches, écartant l'explosion comme l'annulation des activations. Les connexions résiduelles,",
        },
        {
          type: 'math',
          display: true,
          tex: '\\mathbf{h}^{(\\ell)} = \\mathbf{h}^{(\\ell-1)} + \\mathcal{F}(\\mathbf{h}^{(\\ell-1)}), \\qquad \\frac{\\partial \\mathbf{h}^{(\\ell)}}{\\partial \\mathbf{h}^{(\\ell-1)}} = I + \\frac{\\partial \\mathcal{F}}{\\partial \\mathbf{h}^{(\\ell-1)}},',
        },
        {
          type: 'text',
          content:
            "garantissent un terme identité dans la jacobienne, ce qui empêche le gradient de s'annuler~; c'est ce qui a permis d'entraîner des réseaux à plusieurs centaines de couches (ResNet), et l'on retrouve ce mécanisme dans les blocs résiduels du TCN (chapitre~6). Les LSTM, enfin, résolvent le problème dans les séquences grâce à un canal de mémoire à flux additif $c_t = f_t\\odot c_{t-1} + i_t\\odot\\tilde{c}_t$, plutôt que multiplicatif.",
        },
        {
          type: 'text',
          content:
            "Pour l'explosion, la parade est le gradient clipping : si $\\|g\\|>\\tau$, on remplace $g$ par $\\tau g/\\|g\\|$, avec $\\tau=1$ ou $5$. La technique est systématique pour les RNN et les Transformers ; elle est appliquée au TFT du chapitre~6.",
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
                "Le découpage standard sépare entraînement (60--80~\\%, ajustement des poids), validation (10--20~\\%, hyperparamètres et early stopping) et test (10--20~\\%, évaluation finale unique). Pour les séries temporelles, l'ordre chronologique est préservé : on ne mélange pas les échantillons, et la normalisation est ajustée sur l'entraînement seul puis gelée. La validation croisée classique cède la place au walk-forward : chaque pli entraîne sur tout le passé disponible et teste sur la fenêtre suivante, ce qui garantit qu'aucune donnée future n'est utilisée (figure ci-dessous).",
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
                "La fuite de données désigne toute contamination de l'évaluation par une information indisponible au moment de la prévision. Elle se rencontre le plus souvent sous l'une de trois formes : ajustement de la normalisation sur l'ensemble complet, sélection de features ou d'hyperparamètres guidée par le test, usage de features construites avec le futur. Cette dernière forme est la plus insidieuse, car elle se dissimule aisément dans une longue liste de colonnes. Les garde-fous du pipeline sont détaillés au chapitre~8, où ils s'appliquent au cas de Diass~: ajustement exclusif du scaler sur l'entraînement, sélection confinée à l'entraînement et à la validation, ingénierie causale excluant automatiquement les dérivées quasi linéaires de la cible.",
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
                "L'optimisation des hyperparamètres se heurte à quatre difficultés : structure nichée (chaque évaluation exige un entraînement complet), coût en heures-GPU, espace mixte continu/entier/catégoriel à dépendances conditionnelles, et objectif non lisse. La recherche sur grille devient ingérable au-delà de quatre paramètres ; la recherche aléatoire de Bergstra \\& Bengio (2012) reste une référence lorsque peu de dimensions comptent réellement. Les méthodes modernes se répartissent en quatre familles : optimisation bayésienne, estimateur de Parzen arborescent (TPE), méthodes multi-fidélité (successive halving, Hyperband, ASHA) et méthodes populationnelles (CMA-ES, PBT). Franceschi et al. (2024) en donnent une synthèse.",
            },
            {
              type: 'text',
              content:
                "Ce travail retient Optuna, avec un échantillonneur TPE et un élagage médian. La perte minimisée est la perte hybride MSE+pinball (présentée plus haut), et les essais sont journalisés dans MLflow pour assurer la traçabilité des configurations. Le détail de la recherche, les valeurs retenues pour Diass et les résultats comparés figurent au chapitre~8.",
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
                "On surveille la perte de validation et l'on arrête l'entraînement lorsqu'elle cesse de décroître, typiquement après une patience de 5 à 20 époques, en restaurant les poids du meilleur point. Ce mécanisme est utilisé pour tous les modèles du chapitre~8, avec une patience de 25 époques pour le TCN et le TFT.",
            },
          ],
        },
      ],
    },
  ],
}
