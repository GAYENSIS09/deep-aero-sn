import type { ChapterData } from './index'

export const chapterContent: ChapterData = {
  slug: '5-modeles',
  title: 'Modèles pour séries temporelles',
  part: 'Partie II — Modélisation et deep learning',
  intro:
    "Ce chapitre présente les modèles qui exploitent la dimension temporelle. Il examine quatre familles : les réseaux convolutifs 1D, qui extraient des motifs locaux par partage de poids ; les réseaux récurrents (RNN, LSTM, GRU), qui entretiennent un état caché pour suivre la dépendance séquentielle ; le mécanisme d'attention, qui pondère directement les états passés ; et le Transformer, qui remplace la récurrence par une auto-attention parallélisable. Ces briques constituent le socle des architectures TFT et TCN, détaillées au chapitre~6.",
  sections: [
    {
      type: 'section',
      title: 'Réseaux convolutifs (CNN)',
      blocks: [
        {
          type: 'text',
          content:
            "Un réseau dense traite chaque entrée isolément : il ignore la topologie spatiale et temporelle. Le réseau convolutif (CNN) y remédie en imposant la localité et le partage des poids. Il analyse ainsi des séquences longues avec un nombre de paramètres modéré.",
        },
        {
          type: 'subsection',
          title: 'Motivation : de la densité à la convolution',
          blocks: [
            {
              type: 'text',
              content:
                "Un perceptron multicouche relie une entrée de dimension $p$ à $N$ neurones : il coûte $p \\times N$ paramètres. Sur une entrée de forte dimension, ce nombre explose et l'entraînement bascule vite en surapprentissage. Les CNN évitent ce travers par trois contraintes structurelles. La **localité** limite chaque neurone à un sous-ensemble restreint de l'entrée : son champ réceptif local. Le **partage des poids** applique le même filtre à toute la séquence ; le coût d'un filtre se réduit alors à la taille $k$ de son noyau. L'**invariance par translation** garantit qu'une caractéristique apprise en un point reste détectable en toute autre position.",
            },
            {
              type: 'text',
              content:
                "Ces contraintes ramènent la complexité paramétrique de $\\mathcal{O}(p \\times N)$ à $\\mathcal{O}(k \\times N)$, autorisant l'entraînement sur des séquences temporelles de grande longueur.",
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Convolution 1D et causalité',
          blocks: [
            {
              type: 'text',
              content:
                "Dans la prévision temporelle, un filtre 1D de taille $k$ glisse le long du signal : à chaque pas, il calcule le produit scalaire entre ses poids $w$ et la fenêtre d'entrée. Pour un signal $x$, la convolution 1D discrète s'écrit :",
            },
            {
              type: 'math',
              display: true,
              tex: '(x * w)_t = \\sum_{i=0}^{k-1} w_i \\cdot x_{t+i}.',
            },
            {
              type: 'text',
              content:
                "Pour empêcher toute fuite d'information du futur vers le passé, on impose une contrainte de **causalité** : le calcul ne voit que les pas de temps antérieurs ou égaux à $t$ :",
            },
            {
              type: 'math',
              display: true,
              tex: '(x *_c w)_t = \\sum_{i=0}^{k-1} w_i \\cdot x_{t - i}.',
            },
            {
              type: 'text',
              content:
                "Le remplissage (*padding*) fixe la dimension de la carte de sortie. En mode **valid**, on n'ajoute rien : la sortie compte $T - k + 1$ pas. En mode **same**, un remplissage symétrique conserve la longueur $T$. En mode **causal**, le remplissage se fait uniquement à gauche : on garde la longueur $T$ et rien ne remonte depuis le futur.",
            },
            {
              type: 'figure',
              src: '/figures/padding.png',
              caption:
                'Comportement des modes de remplissage (*padding*) : **valid**, **same** et **causal**.',
              heightClass: 'h-72 md:h-80',
            },
          ],
        },
        {
          type: 'subsection',
          title: "Convolution 2D et blocs d'extraction",
          blocks: [
            {
              type: 'text',
              content:
                "Pour une représentation bidimensionnelle (spectrogramme issu du signal temporel, par exemple), l'opération s'étend sur deux axes. Une entrée $X$ de dimensions $H \\times W$ et $C$ canaux, convoluée par un filtre $W \\in \\mathbb{R}^{C_f \\times k_h \\times k_w}$, produit :",
            },
            {
              type: 'math',
              display: true,
              tex: '(X * W)_{i,j} = \\sum_{c=1}^{C_f} \\sum_{m=0}^{k_h-1} \\sum_{n=0}^{k_w-1} W_{c,m,n} \\cdot X_{c,\\, i+m,\\, j+n}.',
            },
            {
              type: 'text',
              content:
                "Une telle couche compte $C_f \\times (C_{\\text{in}} \\times k_h \\times k_w + 1)$ paramètres.",
            },
            {
              type: 'text',
              content:
                "Dans une architecture moderne, on associe la convolution à des transformations stabilisatrices :",
            },
            {
              type: 'math',
              display: true,
              tex: '\\mathbf{h} = \\text{Dropout}\\Big(\\text{ReLU}\\big(\\text{BN}(\\text{Conv1D}_{k \\times F}(\\mathbf{x}))\\big)\\Big),',
            },
            {
              type: 'text',
              content:
                "où $\\text{BN}$ désigne la normalisation par lot (*Batch Normalization*) et $F$ le nombre de filtres. On projette ensuite cette représentation vers l'espace cible :",
            },
            {
              type: 'math',
              display: true,
              tex: '\\hat{\\mathbf{y}} = W_o \\, \\text{Flatten}(\\mathbf{h}) + \\mathbf{b}_o, \\qquad W_o \\in \\mathbb{R}^{q \\times (T \\cdot F)},',
            },
            {
              type: 'text',
              content:
                "où $q$ est la dimension de la sortie ($q=3$ pour l'estimation de quantiles).",
            },
            {
              type: 'figure',
              src: '/figures/ch5_cnn_pipeline.png',
              caption:
                "Chaîne de traitement typique d'un CNN 1D séquentiel.",
              heightClass: 'h-24 md:h-28',
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Sous-échantillonnage et hiérarchie des représentations',
          blocks: [
            {
              type: 'text',
              content:
                "La résolution temporelle se réduit par le pas de convolution (*stride*) $s$ ou par agrégation (*pooling*). Le max-pooling retient l'activation maximale sur une fenêtre donnée :",
            },
            {
              type: 'math',
              display: true,
              tex: '\\text{MaxPool}_{p}(X)_{i} = \\max_{m \\in [0, p)} X_{i \\cdot p + m},',
            },
            {
              type: 'text',
              content:
                "tandis que l'agrégation moyenne (*average pooling*) calcule la moyenne du voisinage. L'empilement de ces couches construit une hiérarchie de représentations, des motifs locaux haute fréquence jusqu'aux variations de faible fréquence qui portent les tendances.",
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Champ réceptif et convolutions dilatées',
          blocks: [
            {
              type: 'text',
              content:
                "Le champ réceptif, c'est la largeur de la séquence d'entrée qui influe sur un neurone donné. Pour un réseau de $L$ couches convolutives standards de noyau $k$, il croît linéairement :",
            },
            {
              type: 'math',
              display: true,
              tex: '\\text{Champ réceptif} = 1 + L \\times (k - 1).',
            },
            {
              type: 'text',
              content:
                "Les **convolutions dilatées** visent un objectif : capturer des dépendances à long terme sans alourdir le réseau ni multiplier les paramètres. Elles introduisent pour cela un facteur d'espacement $d$ :",
            },
            {
              type: 'math',
              display: true,
              tex: '(x *_d w)_t = \\sum_{i=0}^{k-1} w_i \\cdot x_{t - d \\cdot i}.',
            },
            {
              type: 'text',
              content:
                "Si la dilatation croît exponentiellement avec la profondeur ($d = 2^\\ell$ à la couche $\\ell$), le champ réceptif grandit de la même façon. WaveNet (van den Oord, 2016) repose sur cette propriété et y ajoute une activation filtrée (*gating*) :",
            },
            {
              type: 'math',
              display: true,
              tex: 'z = \\tanh(W_f * x) \\odot \\sigma(W_g * x),',
            },
            {
              type: 'text',
              content:
                "où $\\odot$ désigne le produit de Hadamard.",
            },
            {
              type: 'figure',
              src: '/figures/1d_dilated_conv.PNG',
              caption:
                "Convolutions dilatées causales avec facteur d'expansion exponentiel ($d=1, 2, 4, 8$).",
              heightClass: 'h-72 md:h-80',
            },
          ],
        },
      ],
    },
    {
      type: 'section',
      title: 'Réseaux récurrents et architectures à portes (RNN, LSTM, GRU)',
      blocks: [
        {
          type: 'text',
          content:
            "Un réseau récurrent modélise la dépendance séquentielle : il conserve un état caché, mis à jour à chaque pas de temps.",
        },
        {
          type: 'subsection',
          title: 'Réseaux de neurones récurrents (RNN)',
          blocks: [
            {
              type: 'text',
              content:
                "Le RNN élémentaire traite une séquence $\\mathbf{x}_1, \\dots, \\mathbf{x}_T$ en entretenant un état interne $\\mathbf{h}_t$ :",
            },
            {
              type: 'math',
              display: true,
              tex: '\\mathbf{h}_t = \\tanh\\!\\left(W_{hh}\\, \\mathbf{h}_{t-1} + W_{xh}\\, \\mathbf{x}_t + \\mathbf{b}_h\\right),',
            },
            {
              type: 'math',
              display: true,
              tex: '\\hat{\\mathbf{y}}_t = W_{hy}\\, \\mathbf{h}_t + \\mathbf{b}_y.',
            },
            {
              type: 'figure',
              src: '/figures/ch5_rnn_unrolled.png',
              caption: "Déploiement temporel d'un réseau récurrent.",
              heightClass: 'h-80 md:h-96',
            },
            {
              type: 'text',
              content:
                "Régulariser un réseau récurrent demande une adaptation : le dropout standard perturbe la mémoire temporelle. Le *dropout récurrent* applique donc un même masque de Bernoulli $\\mathbf{m}$ à tous les pas de temps de la séquence :",
            },
            {
              type: 'math',
              display: true,
              tex: '\\tilde{\\mathbf{h}}_t = \\mathbf{m} \\odot \\mathbf{h}_t, \\qquad \\mathbf{m} \\sim \\text{Bernoulli}(1-p).',
            },
            {
              type: 'text',
              content:
                "L'entraînement se fait par rétropropagation à travers le temps (*Backpropagation Through Time*, BPTT) : la récurrence y enchaîne les produits matriciels $\\prod_{k} W_{hh}$. La disparition du gradient, analysée au chapitre~4, s'y manifeste alors pleinement : les dépendances lointaines cessent d'être apprises.",
            },
          ],
        },
        {
          type: 'subsection',
          title: 'LSTM (Long Short-Term Memory)',
          blocks: [
            {
              type: 'text',
              content:
                "Le LSTM (Hochreiter, 1997) corrige la disparition du gradient avec un état de cellule $\\mathbf{c}_t$, régulé par trois portes d'activation sigmoïdiennes :",
            },
            {
              type: 'math',
              display: true,
              tex: "\\begin{aligned}\\mathbf{f}_t &= \\sigma\\!\\left(W_f [\\mathbf{h}_{t-1}, \\mathbf{x}_t] + \\mathbf{b}_f\\right) && \\text{(porte d'oubli)}, \\\\ \\mathbf{i}_t &= \\sigma\\!\\left(W_i [\\mathbf{h}_{t-1}, \\mathbf{x}_t] + \\mathbf{b}_i\\right) && \\text{(porte d'entrée)}, \\\\ \\tilde{\\mathbf{c}}_t &= \\tanh\\!\\left(W_c [\\mathbf{h}_{t-1}, \\mathbf{x}_t] + \\mathbf{b}_c\\right) && \\text{(candidat de mémoire)}, \\\\ \\mathbf{c}_t &= \\mathbf{f}_t \\odot \\mathbf{c}_{t-1} + \\mathbf{i}_t \\odot \\tilde{\\mathbf{c}}_t && \\text{(mise à jour de l'état de cellule)}, \\\\ \\mathbf{o}_t &= \\sigma\\!\\left(W_o [\\mathbf{h}_{t-1}, \\mathbf{x}_t] + \\mathbf{b}_o\\right) && \\text{(porte de sortie)}, \\\\ \\mathbf{h}_t &= \\mathbf{o}_t \\odot \\tanh(\\mathbf{c}_t) && \\text{(état caché)}.\\end{aligned}",
            },
            {
              type: 'text',
              content:
                "L'opération additive $\\mathbf{c}_t = \\mathbf{f}_t \\odot \\mathbf{c}_{t-1} + \\dots$ entretient un flux d'erreur linéaire le long de la séquence : c'est ce canal additif qui neutralise le vanishing gradient (chapitre~4).",
            },
            {
              type: 'figure',
              src: '/figures/Complete-LSTM-architecture-with-equations-showing-how-information-moves-through-the-cell_W640.jpg',
              caption:
                "Structure interne et flux d'information au sein d'une cellule LSTM.",
              heightClass: 'h-96 md:h-[28rem]',
            },
          ],
        },
        {
          type: 'subsection',
          title: 'GRU (Gated Recurrent Unit)',
          blocks: [
            {
              type: 'text',
              content:
                "Le bloc GRU simplifie le LSTM en fusionnant état de cellule et état caché, ramenant le système à deux portes :",
            },
            {
              type: 'math',
              display: true,
              tex: "\\begin{aligned}\\mathbf{z}_t &= \\sigma\\!\\left(W_z [\\mathbf{h}_{t-1}, \\mathbf{x}_t] + \\mathbf{b}_z\\right) && \\text{(porte de mise à jour)}, \\\\ \\mathbf{r}_t &= \\sigma\\!\\left(W_r [\\mathbf{h}_{t-1}, \\mathbf{x}_t] + \\mathbf{b}_r\\right) && \\text{(porte de réinitialisation)}, \\\\ \\tilde{\\mathbf{h}}_t &= \\tanh\\!\\left(W_h [\\mathbf{r}_t \\odot \\mathbf{h}_{t-1}, \\mathbf{x}_t] + \\mathbf{b}_h\\right) && \\text{(état candidat)}, \\\\ \\mathbf{h}_t &= (1 - \\mathbf{z}_t) \\odot \\mathbf{h}_{t-1} + \\mathbf{z}_t \\odot \\tilde{\\mathbf{h}}_t && \\text{(interpolation)}.\\end{aligned}",
            },
            {
              type: 'text',
              content:
                "Cette formulation réduit d'environ $25\\,\\%$ le nombre de paramètres par rapport au LSTM, à performances comparables.",
            },
            {
              type: 'figure',
              src: '/figures/Gated-Recurrent-Unit-GRU_W640.jpg',
              caption: "Architecture d'une unité GRU.",
              heightClass: 'h-96 md:h-[28rem]',
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Extensions récurrentes',
          blocks: [
            {
              type: 'text',
              content:
                "Quand toute la séquence est déjà disponible, comme dans les tâches non causales, le réseau récurrent bidirectionnel la parcourt dans les deux sens chronologiques :",
            },
            {
              type: 'math',
              display: true,
              tex: '\\mathbf{h}_t = [\\overrightarrow{\\mathbf{h}}_t;\\, \\overleftarrow{\\mathbf{h}}_t].',
            },
            {
              type: 'text',
              content:
                "Ce traitement reste toutefois proscrit pour la prévision causale en temps réel, où le futur n'est pas connu.",
            },
            {
              type: 'figure',
              src: '/figures/ch5_bidirectional_rnn.png',
              caption: 'Réseau récurrent bidirectionnel.',
              heightClass: 'h-[22rem] md:h-[26rem]',
            },
            {
              type: 'table',
              caption: 'Comparaison synthétique des modèles récurrents.',
              headers: ['Critère', 'RNN Standard', 'LSTM / GRU'],
              rows: [
                ['Mémoire long terme', 'Limitée', 'Élevée'],
                ['Rétropropagation du gradient', 'Évanouissement', 'Stabilisée'],
                ['Calcul parallélisable', 'Non (Séquentiel)', 'Non (Séquentiel)'],
                ['Complexité temporelle', '$\\mathcal{O}(T)$', '$\\mathcal{O}(T)$'],
                ['Nombre de paramètres', '$3 d_h^2 + 3 d_h d_x$', '$4(d_h^2 + d_h d_x)$ (LSTM)'],
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'section',
      title: "Mécanisme d'attention",
      blocks: [
        {
          type: 'text',
          content:
            "L'attention remédie au goulot d'étranglement du vecteur d'état de dimension fixe : au lieu de comprimer tout le passé dans un seul vecteur, elle pondère chaque état historique.",
        },
        {
          type: 'subsection',
          title: 'Attention additive et multiplicative',
          blocks: [
            {
              type: 'text',
              content:
                "L'attention additive (Bahdanau, 2015) calcule un score d'alignement $e_{t,j}$ entre l'état du décodeur $\\mathbf{s}_{t-1}$ et les états de l'encodeur $\\mathbf{h}_j$ :",
            },
            {
              type: 'math',
              display: true,
              tex: 'e_{t,j} = \\mathbf{v}^\\top \\tanh\\!\\left(W_s\\, \\mathbf{s}_{t-1} + W_h\\, \\mathbf{h}_j\\right), \\qquad \\alpha_{t,j} = \\frac{\\exp(e_{t,j})}{\\sum_{k=1}^{T} \\exp(e_{t,k})}.',
            },
            {
              type: 'text',
              content:
                "Le vecteur de contexte $\\mathbf{c}_t = \\sum_{j=1}^{T} \\alpha_{t,j}\\, \\mathbf{h}_j$ agrège ensuite les représentations pondérées.",
            },
            {
              type: 'figure',
              src: '/figures/bahdanau_attention.png',
              caption:
                "Comparaison entre le goulot d'étranglement séquentiel et le mécanisme d'attention d'alignement.",
              heightClass: 'h-80 md:h-96',
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Self-Attention et Multi-Head Attention',
          blocks: [
            {
              type: 'text',
              content:
                "L'auto-attention (*self-attention*) projette une séquence $X$ par trois matrices de poids, produisant requêtes ($Q$), clés ($K$) et valeurs ($V$) :",
            },
            {
              type: 'math',
              display: true,
              tex: 'Q = X W_Q, \\quad K = X W_K, \\quad V = X W_V.',
            },
            {
              type: 'text',
              content: "L'attention par produit scalaire normalisé s'écrit :",
            },
            {
              type: 'math',
              display: true,
              tex: '\\text{Attention}(Q, K, V) = \\text{softmax}\\!\\left(\\frac{Q K^\\top}{\\sqrt{d_k}}\\right) V,',
            },
            {
              type: 'text',
              content:
                "où le facteur $\\sqrt{d_k}$ évite la saturation du softmax pour les grandes dimensions.",
            },
            {
              type: 'text',
              content:
                "Pour capter simultanément des dépendances issues de plusieurs sous-espaces de représentation, l'attention multi-têtes (*Multi-Head Attention*) exécute $H$ projections en parallèle :",
            },
            {
              type: 'math',
              display: true,
              tex: '\\text{head}_h = \\text{Attention}(Q W_Q^h,\\, K W_K^h,\\, V W_V^h),',
            },
            {
              type: 'math',
              display: true,
              tex: '\\text{MultiHead}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_H)\\, W_O.',
            },
            {
              type: 'figure',
              src: '/figures/multi-head-attention.png',
              caption: "Mécanisme d'attention multi-têtes.",
              heightClass: 'h-80 md:h-96',
            },
            {
              type: 'text',
              content:
                "Le coût computationnel de l'auto-attention, $\\mathcal{O}(T^2 \\cdot d_k)$, croît quadratiquement avec la longueur de la séquence $T$.",
            },
          ],
        },
      ],
    },
    {
      type: 'section',
      title: 'Architecture Transformer',
      blocks: [
        {
          type: 'text',
          content:
            "Le Transformer (Vaswani, 2017) remplace la récurrence par l'auto-attention : le traitement des séquences devient alors entièrement parallèle.",
        },
        {
          type: 'figure',
          src: '/figures/ch5_transformer_pipeline.png',
          caption: 'Schéma du bloc encodeur du Transformer.',
          heightClass: 'h-52 md:h-60',
        },
        {
          type: 'subsection',
          title: 'Encodage positionnel',
          blocks: [
            {
              type: 'text',
              content:
                "L'auto-attention ne porte en elle aucune notion d'ordre : la position temporelle $pos$ doit donc être injectée explicitement, ici par des fonctions sinusoïdales :",
            },
            {
              type: 'math',
              display: true,
              tex: '\\mathbf{PE}_{(pos,\\, 2i)} = \\sin\\!\\left(\\frac{pos}{10000^{2i/d}}\\right), \\qquad \\mathbf{PE}_{(pos,\\, 2i+1)} = \\cos\\!\\left(\\frac{pos}{10000^{2i/d}}\\right),',
            },
            {
              type: 'text',
              content:
                "où $i$ désigne l'indice de la dimension d'encodage.",
            },
            {
              type: 'figure',
              src: '/figures/ch5_positional_encoding.png',
              caption: "Matrice d'encodage positionnel sinusoïdal.",
              heightClass: 'h-80 md:h-96',
            },
          ],
        },
        {
          type: 'subsection',
          title: 'Sous-couches et projection',
          blocks: [
            {
              type: 'text',
              content:
                "Chaque sous-couche intègre une connexion résiduelle suivie d'une normalisation par couche (*Layer Normalization*) :",
            },
            {
              type: 'math',
              display: true,
              tex: '\\text{Sortie} = \\text{LayerNorm}\\!\\left(\\mathbf{x} + \\text{Dropout}(\\text{SousCouche}(\\mathbf{x}))\\right).',
            },
            {
              type: 'text',
              content:
                "Le réseau positionnel à propagation avant (*Feed-Forward Network*, FFN) applique deux transformations affines encadrant une non-linéarité :",
            },
            {
              type: 'math',
              display: true,
              tex: '\\text{FFN}(\\mathbf{z}) = W_2 \\cdot \\text{ReLU}(W_1 \\mathbf{z} + \\mathbf{b}_1) + \\mathbf{b}_2.',
            },
            {
              type: 'text',
              content:
                "En prévision temporelle, on projette linéairement la représentation finale $\\mathbf{Z}^{(L)}$ de l'encodeur pour construire la prédiction sur l'horizon $H$ :",
            },
            {
              type: 'math',
              display: true,
              tex: '\\hat{\\mathbf{Y}} = W_o \\, \\mathbf{Z}^{(L)} + \\mathbf{b}_o, \\qquad W_o \\in \\mathbb{R}^{q \\times d_{\\text{model}}}.',
            },
            {
              type: 'figure',
              src: '/figures/An-illustration-of-transformer-architecture-13_W640.jpg',
              caption:
                'Architecture globale du Transformer (Encodeur-Décodeur).',
              heightClass: 'h-96 md:h-[28rem]',
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
            "Les architectures du chapitre suivant reposent sur trois familles de briques.\n\nLa convolution exploite la localité et le partage de poids : elle réduit le nombre de paramètres face à un réseau dense. En version causale et dilatée, elle ouvre le champ réceptif sans jamais regarder le futur, comme dans WaveNet.\n\nLa récurrence entretient un état caché à travers la séquence, mais le RNN seul perd l'information sur les longues séquences. Le LSTM y répond par un état de cellule et trois portes ; le GRU en utilise deux, pour un coût plus faible. L'attention, elle, pondère les états passés au lieu de tout comprimer dans un vecteur unique ; en multi-têtes, elle couvre plusieurs sous-espaces, mais son coût croît quadratiquement avec la longueur.\n\nLe Transformer assemble ces éléments — auto-attention, encodage positionnel, connexions résiduelles, normalisation par couche — et supprime la récurrence : tout devient parallèle. Le TFT et le TCN combinent ensuite ces briques selon deux logiques différentes.",
        },
      ],
    },
  ],
}
