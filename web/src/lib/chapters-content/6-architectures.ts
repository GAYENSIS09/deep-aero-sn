import type { ChapterData } from './index'

export const chapterContent: ChapterData = {
  slug: '6-architectures',
  title: 'Architectures avancées appliquées',
  part: 'Partie II — Modélisation et deep learning',
  intro:
    "La prévision photovoltaïque consiste à estimer la production solaire à partir de séquences historiques. Sa difficulté tient à deux échelles de variabilité imbriquées : le cycle diurne et saisonnier, largement déterministe, et la couverture nuageuse, brutale et stochastique. Les méthodes de lissage, aveugles à la seconde, s'y révèlent insuffisantes. Ce chapitre présente les deux architectures de référence retenues dans ce travail, le Temporal Fusion Transformer et le Temporal Convolutional Network, ainsi que le cadre commun d'encodage et d'évaluation qui les met en regard.",
  sections: [
    {
      type: 'section',
      title: 'Solaire : Temporal Fusion Transformer (TFT)',
      blocks: [
        {
          type: 'subsection',
          title: 'Le TFT sélectionne les variables puis pondère le passé par attention',
          blocks: [
            {
              type: 'text',
              content:
                "Le Temporal Fusion Transformer (TFT) est une architecture à attention conçue pour la prévision multi-horizon de séries multivariées~(Lim, 2021). Son entrée combine nativement trois types de données : des **covariables statiques** (localisation du panneau, puissance installée), des **entrées futures connues** (heure, jour de la semaine, saison) et des **séries exogènes passées** (irradiance, température, vent). Son fonctionnement articule trois dispositifs : le Variable Selection Network retient, à chaque instant, les variables qui importent ; l'attention exploite les relations temporelles pertinentes ; la sortie en quantiles rend l'incertitude explicite.",
            },
            {
              type: 'figure',
              src: '/figures/TFT - Architecture Detaillee image.png',
              caption:
                "Architecture du TFT~: les covariables statiques (localisation, puissance installée) génèrent 4 contextes via un encodeur statique~: $\\mathbf{c}_s$ guide la sélection de variables (VSN), $\\mathbf{c}_e$/$\\mathbf{c}_h$ initialisent les états LSTM, et $\\mathbf{c}_c$ conditionne la sortie. Les séries temporelles suivent un chemin distinct~: VSN $\\to$ LSTM encodeur $\\to$ LSTM décodeur $\\to$ attention interprétable multi-tête $\\to$ FFN de sortie. Les *gated skip connections* (portes sigmoid entre chaque couche) garantissent la circulation du gradient sur les profondeurs importantes. Les poids de l'attention sont partagés entre têtes pour une agrégation interprétable (Lim et al., 2021).",
              heightClass: 'h-96 md:h-[30rem]',
            },
            {
              type: 'text',
              content:
                "Sa valeur ajoutée tient à l'interprétabilité : on peut visualiser les variables retenues par la VSN, les positions temporelles mises en avant par l'attention et les features statiques qui pèsent sur la sortie~(Lim, 2021), un atout décisif pour les opérateurs de réseau électrique.",
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Covariables statiques → 4 contextes via encodeur statique',
          blocks: [
            {
              type: 'text',
              content:
                "Les covariables statiques (localisation du panneau, puissance installée, type de capteur) traversent un encodeur statique qui produit quatre vecteurs de contexte, chacun dédié à un sous-système : la sélection de variables, l'initialisation des états LSTM et le conditionnement de la sortie.",
            },
            {
              type: 'text',
              content: "L'encodeur statique calcule~:",
            },
            {
              type: 'math',
              display: true,
              tex: '\\mathbf{c}_s = \\text{GRN}_{\\text{stat}}(\\mathbf{x}_{\\text{stat}}), \\qquad \\mathbf{c}_e = \\text{GRN}_{\\text{enc}}(\\mathbf{x}_{\\text{stat}}), \\qquad \\mathbf{c}_h = \\text{GRN}_{\\text{hid}}(\\mathbf{x}_{\\text{stat}}), \\qquad \\mathbf{c}_c = \\text{GRN}_{\\text{con}}(\\mathbf{x}_{\\text{stat}})',
            },
            {
              type: 'text',
              content:
                "où $\\mathbf{x}_{\\text{stat}}$ est le vecteur des covariables statiques. Le contexte $\\mathbf{c}_s$ alimente la Variable Selection Network, $\\mathbf{c}_e$ et $\\mathbf{c}_h$ initialisent les états cachés des LSTM encodeur et décodeur, et $\\mathbf{c}_c$ conditionne la couche de sortie.",
            },
            {
              type: 'text',
              content:
                "Cette séparation laisse le modèle exploiter une même information statique de plusieurs manières selon le sous-système : la sélection de variables réclame un résumé global ($\\mathbf{c}_s$), là où les LSTM attendent un état initial ($\\mathbf{c}_e$, $\\mathbf{c}_h$). Chaque GRN apprend une transformation qui lui est propre, ce qui évite un partage excessif de paramètres.",
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Le bloc fondateur : Gated Residual Network (GRN)',
          blocks: [
            {
              type: 'text',
              content:
                "Traitons d'abord le constituant fondamental du TFT. Sélection de variables, traitement statique et décodage reposent tous sur le même type de réseau résiduel : le Gated Residual Network.",
            },
            {
              type: 'text',
              content:
                "Le GRN est un réseau résiduel doté d'une porte GLU (Gated Linear Unit) qui module le flux d'information : le sigmoïde écarte les features non pertinentes, tandis que la connexion résiduelle préserve le gradient et l'information d'origine.",
            },
            {
              type: 'text',
              content: 'Le GRN calcule~:',
            },
            {
              type: 'math',
              display: true,
              tex: '\\text{GRN}(\\mathbf{a}, \\mathbf{c}) = \\text{LayerNorm}\\left(\\mathbf{a} + \\text{GLU}(\\eta_1)\\right)',
            },
            {
              type: 'math',
              display: true,
              tex: '\\eta_1 = W_1 \\eta_2 + \\mathbf{b}_1, \\qquad \\eta_2 = \\text{ELU}(W_2 \\mathbf{a} + W_3 \\mathbf{c} + \\mathbf{b}_2)',
            },
            {
              type: 'text',
              content:
                "où $\\mathbf{a}$ est l'entrée principale (features temporelles ou statiques) et $\\mathbf{c}$ une condition optionnelle (contexte statique ou temporel). La transformation non linéaire $\\eta_2$ recourt à une ELU et sert à l'extraction de caractéristiques ; $\\eta_1$ est la projection linéaire qui suit. La porte GLU segmente les $2d$ canaux en deux moitiés : la première fait office de porte, la seconde de candidat, selon $\\text{GLU}(\\eta_1) = \\sigma(\\eta_1^{(1:d)}) \\odot \\eta_1^{(d+1:2d)}$.",
            },
            {
              type: 'figure',
              src: '/figures/Gated Residual Network.png',
              caption:
                "Illustration du Gated Residual Network (GRN) tel que présenté par Lim et al.~(2021). L'entrée $\\mathbf{a}$ est transformée par une couche Dense, une activation ELU, puis une seconde Dense produisant $2d$ valeurs. La porte GLU filtre les dimensions non pertinentes via un sigmoid, tandis que la connexion résiduelle et la LayerNorm stabilisent l'entraînement.",
              heightClass: 'h-96 md:h-[28rem]',
            },
            {
              type: 'text',
              content:
                "Le GRN se retrouve partout dans le TFT : sélection de variables, traitement des features statiques, décodage. Sa force tient à la porte GLU, dont le sigmoïde «~ferme~» approximativement les dimensions inutiles. La connexion résiduelle $\\mathbf{a} + \\dots$ et la Layer Normalization~(Ba, 2016) garantissent que l'information d'entrée n'est jamais entièrement perdue.",
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Variable Selection Network (VSN)',
          blocks: [
            {
              type: 'text',
              content:
                "La VSN répond à une question mouvante : quelles variables d'entrée importent à cet instant précis ? L'irradiance est déterminante à midi mais sans objet la nuit, la température reste pertinente en permanence. La VSN calcule donc un poids d'importance $\\boldsymbol{\\xi}_t$ par variable, ce qui concentre le modèle sur les plus informatives.",
            },
            {
              type: 'text',
              content: 'Ces poids sont produits par un GRN dédié~:',
            },
            {
              type: 'math',
              display: true,
              tex: '\\boldsymbol{\\xi}_t = \\text{Softmax}\\left(\\text{GRN}_{\\mathbf{v}}(\\mathbf{X}_t, \\mathbf{c}_s)\\right)',
            },
            {
              type: 'text',
              content:
                "Le vecteur $\\boldsymbol{\\xi}_t \\in \\mathbb{R}^{N_v}$, de somme unité, pondère les $N_v$ colonnes de la matrice $\\mathbf{X}_t \\in \\mathbb{R}^{N_v \\times d}$ à l'instant $t$ ; le contexte $\\mathbf{c}_s$ encode le site. Les variables considérées vont de l'irradiance et la température au vent et à l'heure.",
            },
            {
              type: 'text',
              content: 'La sortie filtrée est la somme pondérée~:',
            },
            {
              type: 'math',
              display: true,
              tex: '\\tilde{\\mathbf{x}}_t = \\sum_{j=1}^{N_v} \\xi_t^{(j)} \\cdot \\tilde{\\mathbf{x}}_t^{(j)}',
            },
            {
              type: 'text',
              content:
                "où $\\tilde{\\mathbf{x}}_t^{(j)} = \\text{GRN}_j(\\mathbf{x}_t^{(j)})$ est la variable $j$ filtrée par son propre GRN.",
            },
            {
              type: 'figure',
              src: '/figures/variable-selection-network.png',
              caption:
                "Sélection de variables (VSN)~: chaque variable $\\mathbf{x}_t^{(j)}$ passe par un GRN indépendant. Les $N_v$ sorties sont concaténées puis un GRN de contexte ($\\text{GRN}_v$) prédit les poids d'importance $\\boldsymbol{\\xi}_t$ via un softmax. La sortie $\\tilde{\\mathbf{x}}_t$ est la somme pondérée des variables filtrées.",
              heightClass: 'h-96 md:h-[28rem]',
            },
            {
              type: 'text',
              content:
                "La VSN est interprétable : en suivant les poids $\\boldsymbol{\\xi}_t$ au fil du temps, on lit quelles variables dominent la prédiction ; on s'attend à un poids élevé de l'irradiance le jour et nul la nuit, la température demeurant toujours significative. C'est un avantage net sur les modèles «~boîte noire~».",
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Attention multi-head interprétable',
          blocks: [
            {
              type: 'text',
              content:
                "Les variables filtrées forment une séquence temporelle $\\tilde{\\mathbf{x}}_1, \\ldots, \\tilde{\\mathbf{x}}_T$. Il reste à encoder ces dépendances séquentielles, puis à les mobiliser au moment de prédire. Le décodeur du TFT combine pour cela un LSTM local, pour les motifs courts, et une attention interprétable, pour les dépendances à longue portée.",
            },
            {
              type: 'text',
              content:
                "L'attention «~interprétable~» partage la projection de valeur entre les têtes, ce qui autorise la moyenne des cartes d'attention et fournit une attention globale unique.",
            },
            {
              type: 'text',
              content: "L'attention multi-head interprétable s'écrit~:",
            },
            {
              type: 'math',
              display: true,
              tex: '\\text{InterpretableMultiHead}(Q, K, V) = \\frac{1}{H}\\sum_{h=1}^{H} \\text{Attention}(Q W_Q^{(h)}, K W_K^{(h)}) \\cdot V W_V',
            },
            {
              type: 'text',
              content:
                "où $Q, K, V$ proviennent du LSTM local ; les projections $W_Q^{(h)}$ et $W_K^{(h)}$ sont propres à chaque tête, $W_V$ est partagée entre elles, et $H$ désigne le nombre de têtes (4 à 8 en pratique).",
            },
            {
              type: 'text',
              content:
                "Le partage de $W_V$ distingue cette attention de l'attention standard : la moyenne des cartes d'attention garde un sens, et l'on peut agréger les poids de toutes les têtes en une carte interprétable. Appliquée entre passé (encodeur) et futur (décodeur), elle révèle quelles positions passées pèsent le plus sur la prédiction.",
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Sortie en quantiles',
          blocks: [
            {
              type: 'text',
              content:
                "Le TFT ne prédit pas une valeur unique, mais plusieurs quantiles simultanément, à savoir $q=0{,}1$ (pire cas), $q=0{,}5$ (médiane) et $q=0{,}9$ (meilleur cas), ce qui livre une mesure complète de l'incertitude.",
            },
            {
              type: 'text',
              content: 'La perte en quantiles (pinball, présentée au chapitre 4) est~:',
            },
            {
              type: 'math',
              display: true,
              tex: '\\text{QL}(y, \\hat{y}, q) = q \\cdot \\max(y - \\hat{y}, 0) + (1-q) \\cdot \\max(\\hat{y} - y, 0)',
            },
            {
              type: 'text',
              content:
                "Pour $q=0{,}5$, la pénalité est symétrique : surestimation et sous-estimation coûtent autant. Pour $q=0{,}1$, sous-estimer coûte neuf fois plus que surestimer, ce qui pousse le modèle vers le bas de la distribution, comme l'exige la gestion de réseau, où l'on planifie sur le pire cas plutôt que de risquer un blackout.",
            },
            {
              type: 'figure',
              src: '/figures/ch6_tft_quantile.png',
              caption:
                "Sortie en quantiles du TFT~: au lieu d'une seule prédiction, le modèle fournit une enveloppe de confiance ($q = 0{,}1$ à $0{,}9$) qui capture l'incertitude liée à la variabilité nuageuse.",
              heightClass: 'h-80 md:h-96',
            },
          ],
        },
      ],
    },
    {
      type: 'section',
      title: 'Photovoltaïque : Temporal Convolutional Network (TCN)',
      blocks: [
        {
          type: 'subsection',
          title: 'Convolution dilatée et filtre $k = 3$',
          blocks: [
            {
              type: 'text',
              content:
                "Le Temporal Convolutional Network (TCN) s'appuie sur des convolutions causales dilatées pour modéliser les dépendances longues à moindre coût que les RNN, tout en se parallélisant intégralement (Bai, 2018). Pour la prévision PV, son champ réceptif exponentiel capte bien les motifs cycliques journaliers et hebdomadaires.",
            },
            {
              type: 'text',
              content:
                "Un bloc TCN combine convolution causale, dilatation exponentielle et connexion résiduelle. La convolution causale n'observe que le passé, ce qui écarte toute fuite de données :",
            },
            {
              type: 'math',
              display: true,
              tex: '(x *_c w)_t = \\sum_{i=0}^{k-1} w_i \\cdot x_{t-i}',
            },
            {
              type: 'text',
              content:
                "La dilatation $d = 2^\\ell$ étend ensuite le champ réceptif à chaque couche $\\ell$ :",
            },
            {
              type: 'math',
              display: true,
              tex: '(x *_d w)_t = \\sum_{i=0}^{k-1} w_i \\cdot x_{t - d \\cdot i}',
            },
            {
              type: 'text',
              content:
                "Enfin, un bloc résiduel (connexion skip et Layer Normalization~(Ba, 2016)) préserve la circulation du gradient.",
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Le champ réceptif',
          blocks: [
            {
              type: 'text',
              content:
                "Le champ réceptif d'un TCN de profondeur $L$, de filtre $k$ et de dilatations exponentielles vaut~:",
            },
            {
              type: 'math',
              display: true,
              tex: 'R = 1 + \\sum_{\\ell=0}^{L-1} (k-1) \\cdot 2^\\ell = 1 + (k-1)(2^L - 1)',
            },
            {
              type: 'text',
              content:
                "$R$ compte les pas de temps couverts, $k$ est la taille du filtre ($k = 3$ typiquement), $L$ la profondeur, et la dilatation vaut $2^\\ell$ à la couche $\\ell$.",
            },
            {
              type: 'text',
              content:
                "Avec $k = 3$ et $L = 10$ couches, $R = 1 + 2(2^{10} - 1) = 2047$ pas de temps, soit plus de trois semaines en données horaires. Le TCN traitant la séquence en parallèle, et non pas à pas comme un LSTM, son entraînement s'en trouve accéléré.",
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Architecture TCN appliquée à la prévision PV',
          blocks: [
            {
              type: 'text',
              content:
                "Le TCN empile des blocs résiduels, chacun renfermant deux convolutions dilatées causales, une activation, une normalisation et une connexion résiduelle. La connexion skip projette l'entrée dans l'espace de sortie lorsque les dimensions diffèrent.",
            },
            {
              type: 'text',
              content: "Un bloc résiduel TCN s'écrit~:",
            },
            {
              type: 'math',
              display: true,
              tex: '\\mathbf{h} = \\text{LayerNorm}\\!\\left(\\mathbf{x} + \\text{Conv1D}_2\\!\\left(\\text{ReLU}\\!\\left(\\text{LayerNorm}\\!\\left(\\text{Conv1D}_1(\\mathbf{x})\\right)\\right)\\right)\\right)',
            },
            {
              type: 'text',
              content:
                "L'entrée $\\mathbf{x} \\in \\mathbb{R}^{T \\times C_{\\text{in}}}$ traverse deux convolutions causales dilatées ($\\text{Conv1D}_1$ puis $\\text{Conv1D}_2$, de même dilatation $d$), séparées par une LayerNorm et un ReLU ; la somme résiduelle $\\mathbf{x} + \\dots$ est stabilisée par une LayerNorm finale.",
            },
            {
              type: 'figure',
              src: '/figures/TCN architecture.png',
              caption:
                "Architecture TCN empilée~: chaque bloc contient un bloc résiduel avec une dilatation $d = 2^\\ell$. Le **padding causal** assure que chaque sortie ne dépend que du passé. Les skip connections sont sommées en sortie. Le champ réceptif croît exponentiellement~: $RF = 1 + \\sum_{\\ell=0}^{L-1} (k-1) \\cdot 2^\\ell = \\mathcal{O}(k \\cdot 2^L)$, permettant de couvrir des séquences très longues avec peu de couches.",
              heightClass: 'h-96 md:h-[30rem]',
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Pourquoi ce choix pour le PV',
          blocks: [
            {
              type: 'text',
              content:
                "Le TCN convient particulièrement à la prévision PV : son champ réceptif exponentiel couvre les cycles diurne et hebdomadaire, la parallélisation totale accélère l'entraînement sur de longues séquences, et sa complexité mémoire linéaire $\\mathcal{O}(T)$ surclasse la quadraticité $\\mathcal{O}(T^2)$ du Transformer.",
            },
            {
              type: 'text',
              content:
                "Il s'entraîne plus vite qu'un LSTM (parallélisme total) et reste plus stable qu'un Transformer (pas de quadraticité). En contrepartie, il ne gère pas nativement les variables statiques (localisation du panneau) et n'offre pas l'interprétabilité d'une attention. C'est un bon choix lorsque la vitesse d'entraînement prime.",
            },
            {
              type: 'text',
              content:
                "Les deux architectures de référence étant posées, nous détaillons les stratégies d'encodage et d'évaluation communes à ce travail.",
            },
          ],
        },
      ],
    },
    {
      type: 'section',
      title: 'Entraînement : encodage et évaluation',
      blocks: [
        {
          type: 'subsection',
          title: "Encodage sin/cos de l'heure",
          blocks: [
            {
              type: 'text',
              content:
                "L'encodage cyclique de l'heure est indispensable : 23~h et 0~h occupent le même point du cycle journalier, qu'une représentation linéaire disloquerait. Les coordonnées sin/cos préservent cette circularité.",
            },
            {
              type: 'text',
              content:
                "L'heure $h$ (0--23) se code en deux dimensions~:",
            },
            {
              type: 'math',
              display: true,
              tex: 'h_{\\sin} = \\sin\\!\\left(\\frac{2\\pi h}{24}\\right), \\qquad h_{\\cos} = \\cos\\!\\left(\\frac{2\\pi h}{24}\\right)',
            },
            {
              type: 'text',
              content:
                "Le couple $h_{\\sin}, h_{\\cos}$ possède une distance euclidienne qui respecte la proximité entre 23~h et 0~h.",
            },
            {
              type: 'text',
              content:
                "Avec cette représentation, la distance euclidienne entre 10~h et 11~h égale celle entre 22~h et 23~h, comme il se doit. Sans encodage cyclique, le modèle tiendrait 23~h et 0~h pour très éloignées.",
            },
          ],
        },
        {
          type: 'subsection',
          title: 'La baseline à battre : la persistance',
          blocks: [
            {
              type: 'text',
              content:
                "La persistance est la baseline la plus simple : elle prédit que la valeur future égalera la valeur courante. Difficile à battre à court terme ($H < 6$~h), la production d'énergie présentant une forte inertie.",
            },
            {
              type: 'text',
              content: 'La prédiction de persistance est~:',
            },
            {
              type: 'math',
              display: true,
              tex: '\\hat{y}_{t+h} = y_t',
            },
            {
              type: 'text',
              content:
                "$\\hat{y}_{t+h}$ reprend simplement $y_t$, la valeur observée en $t$, pour un horizon $h$.",
            },
            {
              type: 'text',
              content:
                "Le skill score quantifie l'amélioration par rapport à cette baseline~:",
            },
            {
              type: 'math',
              display: true,
              tex: '\\text{Skill Score} = 1 - \\frac{\\text{RMSE}_{\\text{modèle}}}{\\text{RMSE}_{\\text{persistance}}}',
            },
            {
              type: 'text',
              content:
                "Un skill score positif signale un modèle meilleur que la persistance ; une valeur de $0{,}2$ correspond à un gain de 20~\\%.",
            },
            {
              type: 'text',
              content:
                "La persistance est un benchmark réaliste : à très court terme, la production présente estime déjà correctement celle de $+1$~h. Un skill score positif indique que le modèle exploite des informations additionnelles (tendances, corrélations, cycles). Aux horizons longs ($H > 12$~h), la persistance se dégrade naturellement et le skill score grimpe.",
            },
          ],
        },
        {
          type: 'text',
          content:
            "Deux architectures de référence et complémentaires ont été présentées pour la prévision de la production solaire. Le Temporal Fusion Transformer mise sur la sélection de variables et l'attention interprétable ; le Temporal Convolutional Network privilégie la légèreté et la vitesse d'entraînement par ses convolutions causales dilatées. L'encodage circulaire de l'heure et la baseline de persistance fixent en outre le cadre commun dans lequel ces deux modèles seront comparés dans la suite du mémoire.",
        },
      ],
    },
  ],
}
