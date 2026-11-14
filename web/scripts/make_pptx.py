# -*- coding: utf-8 -*-
"""
Génère la version PowerPoint de la soutenance, calquée sur le deck web
(/presentation) : 16:9, thème sombre identique, 18 planches, notes d'orateur.

Usage :  python web/scripts/make_pptx.py   (depuis la racine du dépôt)
Sortie : web/public/deep-aero-sn-v2.pptx
"""

import math
import re
from pathlib import Path

from PIL import Image
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.util import Inches, Pt

ROOT = Path(__file__).resolve().parents[2]
FIG = ROOT / "web" / "public" / "figures"
IMG = ROOT / "web" / "public" / "images"
OUT = ROOT / "web" / "public" / "deep-aero-sn-v2.pptx"

# ── thème (identique au web) ──────────────────────────────────────────────
BG = RGBColor(0x0A, 0x0A, 0x0A)
PANEL = RGBColor(0x17, 0x17, 0x17)
BORDER = RGBColor(0x26, 0x26, 0x26)
ACCENT = RGBColor(0xAA, 0xFF, 0x00)
TEXT = RGBColor(0xF2, 0xF2, 0xF2)
MUTED = RGBColor(0xA0, 0xA0, 0x98)
DIM = RGBColor(0x7A, 0x7A, 0x72)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)

SERIF = "Georgia"
MONO = "Consolas"
SANS = "Calibri"

W, H = 13.333, 7.5
MARGIN = 0.55
CONTENT_W = W - 2 * MARGIN
TOTAL = 18

NBSP = "\u00A0"


def fr(s: str) -> str:
    """Espaces insécables à la française (avant %, dans les milliers)."""
    s = re.sub(r"(\d) (?=\d{3}(?!\d))", r"\1" + NBSP, s)
    s = s.replace(" %", NBSP + "%").replace(" MW", NBSP + "MW").replace(" GWh", NBSP + "GWh")
    return s


prs = Presentation()
prs.slide_width = Inches(W)
prs.slide_height = Inches(H)
BLANK = prs.slide_layouts[6]


def box(slide, x, y, w, h, wrap=True, anchor=None):
    from pptx.util import Inches as In

    tb = slide.shapes.add_textbox(In(x), In(y), In(w), In(h))
    tf = tb.text_frame
    tf.word_wrap = wrap
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    if anchor:
        tf.vertical_anchor = anchor
    return tf


def run(p, text, font=MONO, size=12, color=TEXT, bold=False, italic=False):
    r = p.add_run()
    r.text = text
    r.font.name = font
    r.font.size = Pt(size)
    r.font.color.rgb = color
    r.font.bold = bold
    r.font.italic = italic
    return r


def para(tf, first=False, align=None, space_after=None, space_before=None):
    p = tf.paragraphs[0] if first else tf.add_paragraph()
    if align:
        p.alignment = align
    if space_after is not None:
        p.space_after = Pt(space_after)
    if space_before is not None:
        p.space_before = Pt(space_before)
    return p


def rect(slide, x, y, w, h, fill, line=None, rounded=False, radius=0.08):
    shape_type = MSO_SHAPE.ROUNDED_RECTANGLE if rounded else MSO_SHAPE.RECTANGLE
    sp = slide.shapes.add_shape(shape_type, Inches(x), Inches(y), Inches(w), Inches(h))
    sp.fill.solid()
    sp.fill.fore_color.rgb = fill
    if line is None:
        sp.line.fill.background()
    else:
        sp.line.color.rgb = line
        sp.line.width = Pt(0.75)
    if rounded:
        try:
            sp.adjustments[0] = radius
        except Exception:
            pass
    sp.shadow.inherit = False
    return sp


def bg_fill(slide):
    slide.background.fill.solid()
    slide.background.fill.fore_color.rgb = BG


def chrome(slide, idx):
    """Filet de lecture : folio en bas à gauche, marque en bas à droite."""
    tf = box(slide, MARGIN, 7.08, 3.0, 0.3)
    run(para(tf, first=True), f"{idx:02d}{NBSP}sur{NBSP}{TOTAL}", MONO, 9, DIM)
    tf = box(slide, W - MARGIN - 3.0, 7.08, 3.0, 0.3)
    run(para(tf, first=True, align=PP_ALIGN.RIGHT), "DEEP AERO SN", MONO, 9, DIM)


def title_bar(slide, text, idx):
    tf = box(slide, MARGIN, 0.30, CONTENT_W, 0.78, anchor=MSO_ANCHOR.MIDDLE)
    run(para(tf, first=True), fr(text), SERIF, 24, TEXT, bold=True)
    rect(slide, MARGIN, 1.14, 1.15, 0.03, ACCENT)
    rect(slide, MARGIN + 1.15, 1.147, CONTENT_W - 1.15, 0.022, BORDER)
    chrome(slide, idx)


def stat(slide, x, y, w, v, l, accent=False, value_size=28, label_size=12.5):
    rect(slide, x, y, w, 0.028, ACCENT)
    tf = box(slide, x, y + 0.10, w, 0.52)
    run(para(tf, first=True), fr(v), MONO, value_size, ACCENT if accent else TEXT)
    tf = box(slide, x, y + 0.72, w, 0.9)
    run(para(tf, first=True), fr(l), SANS, label_size, MUTED)


def fig_card(slide, name, x, y, w, h, num, caption, base=FIG):
    rect(slide, x, y, w, h, WHITE, line=RGBColor(0x2E, 0x2E, 0x2E))
    path = base / name
    with Image.open(path) as im:
        iw, ih = im.size
    pad = 0.10
    bw, bh = w - 2 * pad, h - 2 * pad
    scale = min(bw / (iw / 96), bh / (ih / 96))  # pouces à 96 ppp
    dw, dh = (iw / 96) * scale, (ih / 96) * scale
    slide.shapes.add_picture(str(path), Inches(x + (w - dw) / 2), Inches(y + (h - dh) / 2),
                             Inches(dw), Inches(dh))
    tf = box(slide, x, y + h + 0.07, w, 0.62)
    p = para(tf, first=True)
    run(p, f"Figure {num}", MONO, 10.5, ACCENT)
    run(p, f" : {caption}", MONO, 10.5, DIM)


def takeaway(slide, x, y, w, text, size=14, lines=2):
    bar_h = 0.30 + 0.26 * lines
    rect(slide, x, y + 0.05, 0.035, bar_h, ACCENT)
    tf = box(slide, x + 0.20, y, w - 0.20, bar_h + 0.1, anchor=MSO_ANCHOR.MIDDLE)
    run(para(tf, first=True), fr(text), SERIF, size, TEXT)


def formula_box(slide, x, y, w, main, sub, main_size=19):
    rect(slide, x, y, w, 1.05, PANEL, line=BORDER, rounded=True, radius=0.10)
    tf = box(slide, x + 0.2, y + 0.16, w - 0.4, 0.5)
    run(para(tf, first=True, align=PP_ALIGN.CENTER), main, MONO, main_size, TEXT)
    tf = box(slide, x + 0.2, y + 0.66, w - 0.4, 0.34)
    run(para(tf, first=True, align=PP_ALIGN.CENTER), fr(sub), MONO, 10.5, MUTED)


def source_row(slide, x, y, w, name, desc):
    rect(slide, x, y, w, 0.014, BORDER)
    tf = box(slide, x, y + 0.10, w * 0.44, 0.3)
    run(para(tf, first=True), name.upper(), MONO, 11.5, TEXT)
    tf = box(slide, x + w * 0.44, y + 0.10, w * 0.56, 0.3)
    run(para(tf, first=True, align=PP_ALIGN.RIGHT), fr(desc), SANS, 11.5, MUTED)


def notes(slide, text):
    slide.notes_slide.notes_text_frame.text = text


def new_slide():
    s = prs.slides.add_slide(BLANK)
    bg_fill(s)
    return s


# ─────────────────────────── 01 · page de titre ───────────────────────────
s = new_slide()
for name, lx in (("ucadLogo.png", MARGIN), ("senelecLogo.png", W - MARGIN - 0.95)):
    rect(s, lx, 0.40, 0.95, 0.95, WHITE, rounded=True, radius=0.5)
    with Image.open(IMG / name) as im:
        iw, ih = im.size
    sc = min(0.78 / (iw / 96), 0.78 / (ih / 96))
    dw, dh = (iw / 96) * sc, (ih / 96) * sc
    s.shapes.add_picture(str(IMG / name), Inches(lx + (0.95 - dw) / 2), Inches(0.40 + (0.95 - dh) / 2),
                         Inches(dw), Inches(dh))
tf = box(s, 2.0, 0.52, 9.33, 0.85, anchor=MSO_ANCHOR.MIDDLE)
p = para(tf, first=True, align=PP_ALIGN.CENTER)
run(p, "UNIVERSITÉ CHEIKH ANTA DIOP DE DAKAR", MONO, 10.5, MUTED)
p = para(tf, align=PP_ALIGN.CENTER)
run(p, "FACULTÉ DES SCIENCES ET TECHNIQUES, DÉPARTEMENT MATHÉMATIQUES ET INFORMATIQUE", MONO, 10.5, DIM)
p = para(tf, align=PP_ALIGN.CENTER)
run(p, "SECTION INFORMATIQUE, MÉMOIRE DE LICENCE, DE 2025 À 2026", MONO, 10.5, DIM)

tf = box(s, 0.9, 2.35, 11.5, 1.9)
p = para(tf, first=True)
run(p, "Prévision probabiliste de la production", SERIF, 38, TEXT, bold=True)
p = para(tf)
run(p, "photovoltaïque par apprentissage profond", SERIF, 38, TEXT, bold=True)
tf = box(s, 0.9, 4.35, 11.5, 0.55)
run(para(tf, first=True), "Application à la centrale de Diass", SANS, 22, ACCENT)
tf = box(s, 0.9, 5.05, 11.5, 0.4)
run(para(tf, first=True), fr("Prévision multi-horizon à 72 heures par TCN et TFT, quantiles P10, P50 et P90 recalibrés par CQR"), MONO, 12, DIM)

rect(s, MARGIN, 6.30, CONTENT_W, 0.015, BORDER)
for lx, lw, lab, val in (
    (0.90, 3.2, "Présenté par", "Baye Mor Gaye"),
    (4.90, 3.2, "Encadrant", "Dr Ndiouma Bame"),
    (8.70, 3.9, "Maîtres de stage", "Dr Saidou Abdoul Soumare, Dr Abdoulaye Ba"),
):
    tf = box(s, lx, 6.48, lw, 0.28)
    run(para(tf, first=True), lab.upper(), MONO, 9, DIM)
    tf = box(s, lx, 6.78, lw, 0.35)
    run(para(tf, first=True), fr(val), MONO, 13, TEXT)
notes(s, "Bonjour à tous. Je vous présente mon mémoire de licence en informatique : prévision probabiliste de la "
         "production photovoltaïque par apprentissage profond, application à la centrale de Diass. Il a été encadré "
         "par le Dr Ndiouma Bame, et en stage à la SENELEC par le Dr Saidou Abdoul Soumare et le Dr Abdoulaye Ba. "
         "Je vais suivre le plan du mémoire : le contexte et la problématique, le cadre physique, les architectures, "
         "puis la modélisation sur Diass et ses résultats.")

# ─────────────────────────── 02 · contexte ────────────────────────────────
s = new_slide()
title_bar(s, "Les centrales sont construites ; la question se déplace vers la prévision", 2)
cols = 3
cw, gap = 3.71, 0.55
for i, (v, l, a) in enumerate([
    ("40 %", "de capacité renouvelable visée d’ici 2030, dans le cadre du JETP signé le 22 juin 2023", False),
    ("292,47 MWc", "de solaire raccordé en 2025, contre 245 MW en 2022", False),
    ("76,0 %", "de l’énergie acheminée est achetée : la SENELEC ne pilote pas ce flux", False),
]):
    stat(s, MARGIN + i * (cw + gap), 2.30, cw, v, l, accent=a)
takeaway(s, MARGIN, 5.00, CONTENT_W,
         "Le climat sahélien rend la production intermittente : harmattan, hivernage, passages nuageux. Les "
         "renouvelables pèsent 27,35 % de la capacité installée mais 19,48 % de la production brute : chaque erreur "
         "de prévision se traduit par des déséquilibres du réseau et un appel aux réserves thermiques.", lines=3)
notes(s, "Le contexte tient en une idée : le verrou de l'infrastructure est levé, celui de la prévision reste. Dans "
         "le cadre du JETP signé le 22 juin 2023, le Sénégal vise 40 % de renouvelables dans la capacité installée "
         "d'ici 2030. Les parcs solaires et l'éolien de Taïba N'Diaye ont construit cette capacité, le solaire passe "
         "de 245 à 292 MW crête. Mais les renouvelables pèsent 27,35 % de la capacité contre 19,48 % seulement de la "
         "production brute : c'est l'effet de l'intermittence. Et la SENELEC achète 76 % de l'énergie acheminée : "
         "elle ne pilote pas l'essentiel de ce qui transite. Chaque erreur de prévision se traduit par des "
         "déséquilibres et un appel aux réserves thermiques.")

# ─────────────────────────── 03 · problématique et objectifs ──────────────
s = new_slide()
title_bar(s, "Une question, trois objectifs", 3)
rect(s, MARGIN, 1.70, CONTENT_W, 1.30, PANEL, rounded=True, radius=0.06)
rect(s, MARGIN, 1.70, 0.04, 1.30, ACCENT)
tf = box(s, MARGIN + 0.30, 1.70, CONTENT_W - 0.55, 1.30, anchor=MSO_ANCHOR.MIDDLE)
run(para(tf, first=True),
    fr("Comment modéliser par apprentissage profond et quantifier l’incertitude de la production "
       "photovoltaïque à 72 heures pour sécuriser le pilotage du réseau électrique au Sénégal ?"),
    SERIF, 17, TEXT)
objs = [
    ("1", "Construire le référentiel",
     "Variables unifiées de la centrale, du site et du climat sahélien, enrichies des covariables futures NWP ; "
     "sélection par union contre les fuites."),
    ("2", "Modéliser et quantifier",
     "Concevoir et comparer TCN et TFT en prévision multi-horizon 72 h ; intervalles recalibrés par CQR."),
    ("3", "Évaluer et dégager la portée",
     "Évaluer sur les données réelles de Diass, analyser les implications pour la gestion du réseau par la SENELEC."),
]
cw, gap = 3.71, 0.55
for i, (n, t, d) in enumerate(objs):
    x = MARGIN + i * (cw + gap)
    tf = box(s, x, 3.55, cw, 0.55)
    run(para(tf, first=True), n, MONO, 30, ACCENT)
    tf = box(s, x, 4.18, cw, 0.35)
    run(para(tf, first=True), t, SERIF, 16, TEXT, bold=True)
    tf = box(s, x, 4.60, cw, 1.5)
    run(para(tf, first=True), fr(d), SANS, 12.5, MUTED)
notes(s, "La problématique, telle qu'elle est posée dans le mémoire : comment modéliser par apprentissage profond "
         "et quantifier l'incertitude de la production photovoltaïque à 72 heures pour sécuriser le pilotage du "
         "réseau électrique au Sénégal ? Elle se décompose en trois sous-questions : comment modéliser, comment "
         "quantifier l'incertitude, et à quoi cela sert-il pour le pilotage du réseau. Pour y répondre, trois "
         "objectifs forment une progression. Un : construire un référentiel unifié de variables pour Diass, relié à "
         "la physique et au climat sahélien, enrichi des covariables futures NWP, avec une sélection par union "
         "contre les fuites. Deux : concevoir et comparer TCN et TFT, en multi-horizon 72 heures, sorties quantiles "
         "recalibrées par CQR. Trois : évaluer sur les données réelles de Diass et dégager la portée pour la "
         "SENELEC. Le plan suit les trois parties du mémoire : le cadre physique, les architectures, la modélisation "
         "sur Diass.")

# ─────────────────────────── 04 · chapitres 1 et 2 ────────────────────────
s = new_slide()
title_bar(s, "Un réseau thermique sur l’un des meilleurs gisements d’Afrique", 4)
cw, gap = 3.71, 0.55
for i, (v, l, a) in enumerate([
    ("74,7 %", "de la capacité installée est thermique en 2025, soit 1 711 MW sur 2 290", False),
    ("76,0 %", "de l’énergie acheminée est achetée aux producteurs indépendants", False),
    ("63 920 MW", "de potentiel PV estimé ; GHI annuel de 1 825 à 2 194 kWh/m²", True),
]):
    stat(s, MARGIN + i * (cw + gap), 1.55, cw, v, l, accent=a)
for i, (name, num, cap) in enumerate([
    ("Central Solaire de Diass carte.png", "1.3",
     "Localisation de la centrale de Diass, première centrale solaire publique du pays."),
    ("ghi_senegal.png", "1.4", "Gisement solaire du Sénégal : irradiance globale horizontale."),
]):
    fig_card(s, name, MARGIN + i * (5.95 + 0.33), 3.10, 5.95, 2.45, num, cap)
takeaway(s, MARGIN, 6.35, CONTENT_W,
         "Une part de la production se calcule, l’autre se prévoit : c’est elle que le modèle doit apprendre. "
         "Le référentiel unifié, ses quatre familles de variables, est la matière première de la partie III.", lines=2)
notes(s, "Chapitres 1 et 2 : le cadre, puis la physique. Le thermique pèse 1 711 MW sur 2 290 installés, soit "
         "74,7 %. La production brute atteint 7 486 GWh en 2025, dont 76 % d'achats aux producteurs indépendants : "
         "la SENELEC ne pilote pas la majorité de ce qui transite, d'où l'intérêt de la prévision. En face, le "
         "gisement national est l'un des meilleurs : GHI annuel de 1 825 à 2 194 kWh/m², potentiel estimé à "
         "63 920 MW. Les centrales sont hétérogènes, modules fixes, bifaciaux, suiveurs : aucun modèle unique ne "
         "convient, chaque site exige un calage. Diass, première centrale solaire publique du pays, fournit des "
         "données d'exploitation suffisantes : c'est notre cas d'étude. Deuxième chapitre : la physique. Une part de "
         "la production se calcule exactement : la géométrie solaire, la déclinaison, l'angle d'incidence ; le "
         "pipeline reprend ces formules, figures 2.2 et 2.6 du mémoire. L'autre part est stochastique : passages "
         "nuageux, harmattan et empoussièrement, pertes thermiques. C'est cette part-là que le modèle doit "
         "apprendre. Pour l'encadrer, le chapitre fixe un référentiel unifié de variables en quatre familles : "
         "météo et climat, grandeurs électriques, exploitation et milieu, temporalité et features dérivées. Ce "
         "référentiel est la matière première de la partie III.")

# ─────────────────────────── 05 · TFT ─────────────────────────────────────
s = new_slide()
title_bar(s, "Le TFT sélectionne les variables, puis pondère le passé par attention", 5)
fig_card(s, "TFT - Architecture Detaillee image.png", MARGIN, 1.55, 7.30, 4.60, "5.1",
         "Architecture du Temporal Fusion Transformer.")
sx, sw = 8.30, 4.48
stat(s, sx, 1.95, sw, "VSN", "chaque variable est pesée à chaque pas de temps")
stat(s, sx, 3.40, sw, "Attention", "multi-têtes et interprétable, les poids se lisent", accent=True)
stat(s, sx, 4.85, sw, "Quantiles natifs",
     "la sortie donne P10, P50 et P90 ; les covariables météo futures entrent nativement")
notes(s, "Deuxième partie : les architectures. Les chapitres 3 et 4 posent d'abord l'état de l'art et le protocole : "
         "découpage chronologique, normalisation ajustée sur l'entraînement seul, validation walk-forward ; le passé "
         "prédit le futur, jamais l'inverse. Les briques, figures 3.1 et 4.3 du mémoire : la convolution causale "
         "dilatée, qui étend le champ réceptif sans regarder le futur, les réseaux récurrents LSTM, puis l'attention "
         "et le Transformer. Chapitre 5, le TFT : sa variable selection network pèse chaque variable à chaque pas de "
         "temps ; les blocs GRN à porte GLU lissent les représentations ; l'attention multi-têtes reste "
         "interprétable ; les covariables futures connues, nos prévisions météo, entrent nativement ; et la sortie "
         "est en quantiles. Sa valeur ajoutée est l'interprétabilité : l'opérateur voit pourquoi le modèle annonce "
         "une baisse à un horizon donné.")

# ─────────────────────────── 06 · TCN ─────────────────────────────────────
s = new_slide()
title_bar(s, "Le TCN : des convolutions causales dilatées, rapides et parallèles", 6)
sx, sw = MARGIN, 4.48
stat(s, sx, 1.95, sw, "2 047 pas",
     "champ réceptif : noyau 3, 10 couches dilatées, soit plus de trois semaines d’historique horaire", accent=True)
stat(s, sx, 3.40, sw, "Parallélisme total",
     "séquence traitée d’un bloc, mémoire linéaire, sans le coût quadratique de l’attention")
stat(s, sx, 4.85, sw, "En contrepartie", "pas de variables statiques natives, pas d’interprétabilité native")
fig_card(s, "TCN architecture.png", 5.45, 1.55, 7.30, 4.60, "5.5",
         "Architecture du TCN : blocs résiduels à convolutions causales dilatées.")
notes(s, "Le TCN ensuite : des convolutions causales dilatées, un noyau de 3 et dix couches portent le champ "
         "réceptif à 2 047 pas, plus de trois semaines d'historique horaire. La séquence est traitée en parallèle et "
         "la mémoire est linéaire : l'entraînement est rapide et stable. En contrepartie, pas de variables "
         "statiques natives ni d'interprétabilité native. Deux philosophies s'affrontent : le TFT choisit "
         "l'interprétabilité, le TCN la vitesse et la simplicité. Le chapitre 6 fixe le cadre commun pour les "
         "départager.")

# ─────────────────────────── 07 · MIMO et CQR ─────────────────────────────
s = new_slide()
title_bar(s, "Un modèle produit les 72 heures ; le recalibrage garantit l’enveloppe", 7)
fig_card(s, "mimo_flow.drawio.png", MARGIN, 1.55, 6.90, 3.90, "6.1",
         "Flux MIMO : fenêtre d’historique, modèle unique, matrice H × Q.")
rx, rw = 7.85, 4.93
formula_box(s, rx, 1.70, rw, "I(x) = [ ŷbas − q, ŷhaut + q ]",
            "q = quantile des scores de non-conformité sur le jeu de calibration, avec α = 0,20", main_size=17)
stat(s, rx, 3.15, rw, "72 × 3 = 216", "quantiles P10, P50, P90 produits en une seule passe")
stat(s, rx, 4.55, rw, "≥ 80 %", "couverture garantie après recalibrage, sans réentraînement", accent=True)
takeaway(s, MARGIN, 6.25, CONTENT_W,
         "Sans les prévisions météo futures, aucun modèle ne produira d’intervalle utile à 72 heures : le plafond "
         "vient de l’information d’entrée.", lines=2)
notes(s, "Chapitre 6 : la stratégie de prévision, commune aux deux architectures. La sortie est traitée en MIMO : un "
         "seul modèle reçoit la fenêtre d'historique et produit en une passe la matrice 72 horizons par 3 quantiles, "
         "soit 216 valeurs. J'ai écarté la prévision récursive : l'erreur s'accumule sur 72 pas et il faudrait 72 "
         "entraînements. La perte est hybride, w·MSE + (1−w)·pinball : une erreur quadratique sur la médiane, une "
         "perte pinball sur les quantiles. Les croisements de quantiles mesurés sur le test sont nuls. Les quantiles "
         "appris ne garantissent pas la couverture en échantillon fini : le recalibrage conformel CQR les corrige "
         "sans réentraînement. Sur un jeu de calibration, on mesure le plus grand dépassement des bornes, on en "
         "prend le quantile, puis on l'ajoute à la borne haute et on le retire de la borne basse. Avec alpha égal à "
         "0,20, la couverture d'au moins 80 % est garantie sous échangeabilité. L'évaluation suit cinq étapes : "
         "couverture et largeur par horizon, score propre de Winkler, diagnostic de croisement, comparaison à la "
         "climatologie.")

# ─────────────────────────── 08 · vue d'ensemble ──────────────────────────
s = new_slide()
title_bar(s, "Du capteur SCADA à la prévision batch : une démarche en trois temps", 8)
fig_card(s, "Deep-Aero-SN-ensemble.drawio.png", 1.20, 1.50, 10.93, 4.30, "7.1",
         "Vue d’ensemble du système Deep Aero SN.")
rect(s, MARGIN, 6.42, CONTENT_W, 0.014, BORDER)
cw, gap = 3.71, 0.55
for i, t in enumerate(["1. Construire les données", "2. Apprendre et calibrer", "3. Inférer : prévision batch 72 h"]):
    tf = box(s, MARGIN + i * (cw + gap), 6.55, cw, 0.3)
    run(para(tf, first=True), fr(t), MONO, 12, TEXT)
notes(s, "Troisième partie : le chapitre 7 met la méthodologie à l'épreuve sur Diass. Trois objectifs d'étude : "
         "prévoir la production à 72 heures, accompagner chaque prévision d'une enveloppe P10 à P90, comparer "
         "plusieurs architectures sur un protocole identique. La démarche, que montre la figure, se déroule en trois "
         "temps : construire les données, de l'export SCADA au fichier de features enrichi par les réanalyses ; "
         "apprendre, du découpage en fenêtres jusqu'à la calibration probabiliste ; puis inférer, qui sélectionne le "
         "modèle retenu et produit une prévision par lots avec son enveloppe. Les sections suivantes suivent ce fil.")

# ─────────────────────────── 09 · le site ─────────────────────────────────
s = new_slide()
title_bar(s, "Un site sahélien exigeant : quatre phénomènes à capturer", 9)
cw, gap = 3.71, 0.55
for i, (v, l, a) in enumerate([
    ("27,28 MWc", "85 248 modules Jinko de 320 Wc, structure fixe inclinée à 15° plein sud, 23,1 MW publiés", False),
    ("34 GWh", "par an en moyenne ; mise en service en mai 2022, exploitée par la SENELEC", False),
    ("Harmattan", "DNI en baisse de 15 à 30 %, empoussièrement de 5 à 15 %", True),
]):
    stat(s, MARGIN + i * (cw + gap), 1.60, cw, v, l, accent=a)
fig_card(s, "nb_diass_effet_pluie.png", 3.17, 3.30, 7.00, 2.70, "7.2",
         "Production journalière moyenne : 3,7 MW les jours de pluie contre 4,0 les jours secs, soit 6 % de moins.")
notes(s, "Section 7.2 : le site. Diass compte 85 248 modules polycristallins de 320 Wc, soit 27,28 MWc crête pour "
         "23,1 MW publiés, sur une structure fixe inclinée à 15 degrés plein sud, pour environ 34 gigawattheures par "
         "an. Quatre phénomènes structurent la production : le cycle diurne, la variabilité nuageuse de l'hivernage, "
         "les aérosols de l'harmattan, le DNI perd 15 à 30 %, l'empoussièrement 5 à 15 %, et les pertes thermiques, "
         "la température de cellule montant à 65 à 75 degrés. La figure montre l'effet de la pluie : 3,7 mégawatts "
         "en moyenne les jours de pluie contre 4,0 les jours secs, soit moins 6 %.")

# ─────────────────────────── 10 · les données ─────────────────────────────
s = new_slide()
title_bar(s, "Six sources hiérarchisées, des données physiquement plausibles", 10)
sources = [
    ("SCADA Schneider", "mesure locale, du 30/08/2025 au 31/08/2026, pas 15 min"),
    ("NASA POWER", "réanalyse : GHI et météo"),
    ("ERA5", "DNI, DHI et nuages"),
    ("CAMS", "aérosols et poussières"),
    ("ECMWF IFS", "prévisions météo, injectées comme covariables futures"),
    ("Ciel clair", "modèle d’Ineichen et Perez"),
]
lw = 6.40
for i, (n, d) in enumerate(sources):
    source_row(s, MARGIN, 1.55 + i * 0.64, lw, n, d)
rx, rw = 7.35, 5.43
stat(s, rx, 1.75, rw, "init + 6 h ≤ t", "le run météo doit précéder l’émission ; 1 460 cycles exploitables sur 1 461", accent=True)
stat(s, rx, 3.15, rw, "8 800 h × 428", "jeu final, à partir de 35 196 lignes SCADA et 58 colonnes")
stat(s, rx, 4.55, rw, "Interpolation ≤ 24 h", "sans extrapolation ; la coupure du 9 au 15 décembre 2025 reste manquante")
takeaway(s, MARGIN, 6.15, CONTENT_W,
         "Contrôle IEC 61724 : gisement reproduit à 0,5 % près, performance ratio de 64,8 % dans la plage publiée, "
         "énergie annualisée à +0,9 % ; les données peuvent servir de base à la modélisation.", lines=2)
notes(s, "Section 7.3 : les données, en six sources hiérarchisées. Le SCADA de la centrale, du 30 août 2025 au "
         "31 août 2026 au pas de 15 minutes ; NASA POWER et ERA5 pour les réanalyses ; CAMS pour les aérosols ; "
         "ECMWF IFS pour les prévisions météo injectées comme covariables futures ; Ineichen et Perez pour le ciel "
         "clair. L'ordre de priorité va de la mesure locale à NASA POWER puis ERA5. L'interpolation est limitée à "
         "24 heures, sans extrapolation, et la vraie coupure du 9 au 15 décembre 2025 reste manquante. La règle de "
         "causalité impose init plus six heures inférieur ou égal à l'heure d'émission : sur 1 461 cycles, 1 460 "
         "sont exploitables, 8 247 fenêtres valides. Jeu final : 8 800 heures, 428 colonnes. Et le contrôle IEC "
         "61724 valide la plausibilité : gisement reproduit à 0,5 % près, performance ratio 64,8 % dans la plage "
         "publiée, énergie annualisée à plus 0,9 %.")

# ─────────────────────────── 11 · EDA ─────────────────────────────────────
s = new_slide()
title_bar(s, "L’arc diurne domine, et l’irradiance explique la production", 11)
cw, gap = 3.71, 0.55
for i, (name, num, cap) in enumerate([
    ("nb_diass_profil_journalier.png", "7.3", "Profil journalier moyen."),
    ("nb_diass_serie_semaine.png", "7.4", "Semaine du 6 juin 2026."),
    ("nb_diass_matrice_correlations.png", "7.5", "Matrice de corrélation."),
]):
    fig_card(s, name, MARGIN + i * (cw + gap), 1.70, cw, 3.15, num, cap)
takeaway(s, MARGIN, 5.95, CONTENT_W,
         "Les chutes brutales au passage des nuages sont la principale source d’erreur à court terme.", lines=1)
notes(s, "Avant de modéliser, j'explore les données : section 7.3.3. Le profil journalier moyen montre l'arc diurne "
         "attendu ; la semaine du 6 juin 2026 montre la production qui épouse l'irradiance, avec des chutes brutales "
         "au passage des nuages. La matrice de corrélation confirme : l'irradiance domine la production, la "
         "couverture nuageuse joue en sens inverse. Avec le modèle NOCT, la température de cellule moyenne est de "
         "33,3 degrés, pour une perte thermique moyenne de 3,56 %. L'épaisseur optique des aérosols vaut 0,31 en "
         "moyenne et culmine en mai. Ces effets de l'atmosphère sont ceux que le modèle devra apprendre.")

# ─────────────────────────── 12 · anti-fuite ──────────────────────────────
s = new_slide()
title_bar(s, "Empêcher le modèle de « tricher » : la formule électrique ne doit pas fuiter", 12)
formula_box(s, 3.17, 2.00, 7.00, "Pac = Vac × Iac × cos φ × √3",
            "les mesures contemporaines de la cible donneraient la réponse au modèle", main_size=20)
cw, gap = 3.71, 0.55
for i, (v, l, a) in enumerate([
    ("Retards de 24 h", "les mesures brutes deviennent des indicateurs d’état connus à t−24 h, soit 96 pas de retard", True),
    ("11", "variables brutes interdites, toutes remplacées par des variables transformées", False),
    ("|ρ| > 0,99", "exclusion automatique, sauf irradiance, position solaire, nuages", False),
]):
    stat(s, MARGIN + i * (cw + gap), 4.10, cw, v, l, accent=a)
notes(s, "Section 7.4 : la mise en œuvre, qui commence par la prévention des fuites. Les variables électriques "
         "mesurées au même instant que la cible sont reliées à la production par une égalité stricte : P égale V "
         "fois I fois cosinus phi fois racine de trois. Un modèle qui les reçoit apprend cette formule au lieu "
         "d'anticiper la météo, et serait inutilisable en exploitation. Je ne supprime pas le SCADA : je le "
         "transforme en retards de 24 heures, des indicateurs d'état connus à t moins 24 h. Les onze variables "
         "brutes interdites deviennent onze variables transformées. Enfin, toute variable corrélée à plus de 0,99 "
         "avec la cible est exclue automatiquement, sauf les drivers physiques autorisés.")

# ─────────────────────────── 13 · features ────────────────────────────────
s = new_slide()
title_bar(s, "De 58 colonnes brutes à 424 variables retenues, sans fuite", 13)
fig_card(s, "features_pipline_flow.drawio_.png", MARGIN, 1.55, 7.30, 4.45, "7.9",
         "Pipeline de feature engineering et contrôles anti-fuite.")
sx, sw = 8.30, 4.48
stat(s, sx, 1.85, sw, "78,1 %", "des variables construites sont retenues : 424 sur 543, à partir de 58 colonnes brutes", accent=True)
stat(s, sx, 3.35, sw, "Union de 7 méthodes", "194 variables ne sont retenues que par une seule : le vote majoritaire les écarterait")
stat(s, sx, 4.85, sw, "118", "redondances supprimées, corrélations au-delà de 0,90 en valeur absolue")
notes(s, "Sections 7.4.2 et 7.4.3 : l'ingénierie puis la sélection. Le pipeline exécute six opérations : "
         "rééchantillonnage horaire, contrôles Great Expectations, prétraitement avec interpolation limitée, sept "
         "étapes de construction de variables, encodage cyclique du temps, météo, fréquence réseau, physique "
         "solaire, électrique causal, retards, puis nettoyage et sélection. 58 colonnes brutes donnent 543 "
         "variables. La sélection applique sept méthodes indépendantes et retient leur union : 194 variables ne "
         "sont retenues que par une seule méthode, un vote majoritaire les écarterait. Après suppression de 118 "
         "redondances à corrélation supérieure à 0,90, 424 variables restent, et aucune famille n'est sacrifiée.")

# ─────────────────────────── 14 · entraînement ────────────────────────────
s = new_slide()
title_bar(s, "Cinq modèles, un même protocole d’entraînement", 14)
fig_card(s, "nb_diass_learning_curves.png", MARGIN, 1.55, 7.30, 4.30, "7.14",
         "Courbes d’entraînement du TCN et du TFT : convergence régulière, arrêt à 57 et 100 époques.")
sx, sw = 8.30, 4.48
stat(s, sx, 1.95, sw, "5 modèles", "persistance, MLP, LSTM, TCN, TFT ; seuls TCN et TFT sont probabilistes")
stat(s, sx, 3.40, sw, "57 puis 100", "époques du TCN puis du TFT, patience de 25", accent=True)
stat(s, sx, 4.85, sw, "CQR", "recalibrage appliqué sur la validation, α = 0,20")
notes(s, "Sections 7.4.4 à 7.4.6 : l'apprentissage. Cinq modèles sur un protocole commun : la persistance comme "
         "repère minimal, le MLP et le LSTM comme repères appris, et le TCN et le TFT, seuls à recevoir les "
         "covariables météo futures et à produire des prévisions probabilistes avec la perte hybride. Les "
         "hyperparamètres sont cherchés par Optuna, échantillonneur TPE, dix essais, graine 42 figée, élagage par "
         "la médiane. La validation sert à arrêter tôt : patience de 25 époques, le TCN s'arrête à 57, le TFT va à "
         "100 ; l'entraînement a coût 1 206 secondes au TCN et 2 016 au TFT. Les courbes montrent une convergence "
         "régulière, sans surapprentissage marqué. Enfin le recalibrage CQR, alpha 0,20, est appliqué sur la "
         "validation. Le pipeline complet de cette étape est la figure 7.13 du mémoire.")

# ─────────────────────────── 15 · inférence ───────────────────────────────
s = new_slide()
title_bar(s, "Une prévision batch de 72 heures, enveloppe P10 à P90 incluse", 15)
fig_card(s, "nb_diass_prevision_batch_72h.png", MARGIN, 1.55, 7.30, 4.30, "7.16",
         "Prévision batch à 72 heures : médiane P50 et enveloppe P10 à P90.")
sx, sw = 8.30, 4.48
stat(s, sx, 1.95, sw, "P50 = 0,965 MW", "médiane de la prévision du site, run courant")
stat(s, sx, 3.40, sw, "Enveloppe croissante", "la largeur entre P10 et P90 augmente avec l’horizon", accent=True)
stat(s, sx, 4.85, sw, "Mode batch", "modèle retenu, nouvelle prévision à chaque émission")
notes(s, "Section 7.4.7 : l'inférence. Le pipeline sélectionne le modèle retenu, assemble l'historique jusqu'à la "
         "dernière heure disponible, ajoute les prévisions météo futures, et produit en mode batch une prévision à "
         "72 heures avec son enveloppe P10 à P90. Sur le run courant, la médiane de la prévision du site vaut "
         "0,965 mégawatt. L'enveloppe s'élargit avec l'horizon : c'est attendu, la largeur étant un quantile absolu "
         "des résidus de calibration.")

# ─────────────────────────── 16 · résultats ───────────────────────────────
s = new_slide()
title_bar(s, "Sur 1 049 fenêtres, le TCN domine et son enveloppe couvre 79,8 % des observations", 16)
headers = ["Modèle", "RMSE, MW", "MAE, MW", "R²", "Couverture", "Largeur, MW"]
rows = [
    ["Persistance", "6,905", "4,987", "−1,013", "", ""],
    ["MLP", "2,323", "1,275", "0,772", "", ""],
    ["LSTM", "2,043", "1,148", "0,824", "", ""],
    ["TCN", "1,707", "0,989", "0,877", "79,8 %", "2,596"],
    ["TFT", "1,818", "1,157", "0,861", "74,2 %", "2,646"],
]
widths = [2.30, 1.90, 1.90, 1.50, 2.20, 2.00]
tx, ty = 0.77, 1.70
gf = s.shapes.add_table(len(rows) + 1, len(headers), Inches(tx), Inches(ty),
                        Inches(sum(widths)), Inches(0.50 * (len(rows) + 1)))
table = gf.table
for j, wdt in enumerate(widths):
    table.columns[j].width = Inches(wdt)
for i in range(len(rows) + 1):
    table.rows[i].height = Inches(0.50)
    for j in range(len(headers)):
        cell = table.cell(i, j)
        cell.fill.solid()
        cell.fill.fore_color.rgb = PANEL if i == 0 else BG
        cell.vertical_anchor = MSO_ANCHOR.MIDDLE
        cell.margin_left = Inches(0.12)
        cell.margin_right = Inches(0.12)
        tfc = cell.text_frame
        tfc.word_wrap = False
        p = tfc.paragraphs[0]
        if i == 0:
            run(p, headers[j].upper(), MONO, 10.5, DIM)
        else:
            val = rows[i - 1][j]
            if val:
                run(p, fr(val), MONO, 13, ACCENT if j == 0 else TEXT)
tf = box(s, tx, ty + 0.50 * 6 + 0.12, sum(widths), 0.3)
run(para(tf, first=True), fr("Couverture et largeur mesurées après recalibrage, pour les seuls modèles probabilistes."),
    SANS, 12, MUTED)
takeaway(s, MARGIN, 5.90, CONTENT_W,
         "L’écart entre les deux architectures est modeste : c’est la couverture de l’enveloppe après CQR qui les "
         "départage.", lines=2)
notes(s, "Section 7.5 : les résultats, sur 1 049 fenêtres de test couvrant du 16 juillet au 28 août 2026. Le TCN "
         "est le plus précis : RMSE 1,707 MW, MAE 0,989, R carré 0,877. Le TFT suit de près : 1,818 MW, R carré "
         "0,861. Les repères sont nettement en retrait : la persistance est à 6,9 MW avec un R carré négatif. La "
         "MAPE est très élevée pour tous car la production est presque nulle en début et fin de journée : je "
         "m'appuie donc sur le RMSE et le R carré. Côté incertitude : le TCN passe de 60,8 % de couverture à 79,8 % "
         "après CQR, proche de la cible de 80 % ; le TFT de 71 à 74,2 %. Aucun croisement de quantiles. L'écart "
         "entre les deux architectures est modeste : c'est la couverture calibrée qui les départage.")

# ─────────────────────────── 17 · lecture SENELEC ─────────────────────────
s = new_slide()
title_bar(s, "Une erreur de 1,7 MW devant un seuil de dispatch de 5 MW", 17)
fig_card(s, "nb_diass_fenetres_test.png", MARGIN, 1.55, 7.00, 4.30, "7.18",
         "Fenêtres de test représentatives : médiane P50, enveloppe P10 à P90, production réelle.")
rx, rw = 7.95, 4.83
stat(s, rx, 1.75, rw, "5 MW", "seuil indicatif de dispatch quotidien, retenu comme hypothèse de travail, soit 22 % de la capacité publiée")
stat(s, rx, 3.20, rw, "1,707 MW", "RMSE du TCN, largement sous le seuil", accent=True)
tf = box(s, rx, 4.65, rw, 1.9)
p = para(tf, first=True, space_after=8)
run(p, "P90 ", MONO, 12.5, TEXT, bold=True)
run(p, fr("dimensionne la réserve de sécurité à mobiliser"), SANS, 12.5, MUTED)
p = para(tf, space_after=8)
run(p, "P10 ", MONO, 12.5, TEXT, bold=True)
run(p, fr("donne la production sur laquelle compter sans démarrer le thermique"), SANS, 12.5, MUTED)
p = para(tf)
run(p, fr("les quantiles estiment la probabilité de franchir un seuil critique, par exemple 10 % de la capacité"),
    SANS, 12.5, MUTED)
notes(s, "La figure 7.18 montre des fenêtres de test : le TCN reproduit bien le cycle diurne et suit les variations "
         "rapides dues aux nuages ; ses écarts les plus nets apparaissent aux transitions jour et nuit. Section "
         "7.5.5 : que valent ces résultats pour la SENELEC ? Le réseau a peu de marge de manœuvre. Comme hypothèse "
         "de travail, je retiens un seuil indicatif de 5 mégawatts pour le dispatch quotidien, soit 22 % de la "
         "capacité publiée : le TCN est à 1,7 MW, la marge est confortable. Concrètement, la borne haute P90 "
         "dimensionne la réserve de sécurité à mobiliser ; la borne basse P10 donne la production sur laquelle "
         "compter sans démarrer le thermique inutilement ; et la distribution des quantiles estime la probabilité "
         "de franchir un seuil critique, par exemple 10 % de la capacité.")

# ─────────────────────────── 18 · conclusion ──────────────────────────────
s = new_slide()
title_bar(s, "Une chaîne validée de bout en bout sur les données réelles de Diass", 18)
cw, gap = 3.71, 0.55
for i, (v, l) in enumerate([
    ("1,707 MW", "RMSE du TCN à 72 heures, R² de 0,877"),
    ("79,8 %", "couverture recalibrée des bornes P10 et P90, cible de 80 %"),
    ("424 variables", "retenues sur 543 construites, sans fuite"),
]):
    stat(s, MARGIN + i * (cw + gap), 1.60, cw, v, l, accent=True)
rect(s, MARGIN, 3.45, CONTENT_W, 0.014, BORDER)
cols3 = [
    ("Objectifs tenus", None, "Un référentiel sans fuite, deux architectures comparées à enveloppe calibrée, une "
                              "preuve sur données réelles pour la SENELEC."),
    ("Limites", ["Une seule année d’entraînement", "Les nuages brefs échappent au pas horaire",
                 "Coût mémoire de l’attention du TFT"], None),
    ("Perspectives", ["Transférer le pipeline vers un autre site solaire",
                      "Court terme, de 1 à 6 heures au pas de 5 à 15 minutes",
                      "Apprentissage fédéré, puis pilote à la SENELEC"], None),
]
for i, (lab, items, para_text) in enumerate(cols3):
    x = MARGIN + i * (cw + gap)
    tf = box(s, x, 3.70, cw, 0.3)
    run(para(tf, first=True), lab.upper(), MONO, 10.5, ACCENT)
    tf = box(s, x, 4.10, cw, 1.8)
    if para_text:
        run(para(tf, first=True), fr(para_text), SANS, 12.5, MUTED)
    else:
        for k, it in enumerate(items):
            p = para(tf, first=(k == 0), space_after=7)
            run(p, fr(it), SANS, 12.5, MUTED)
tf = box(s, MARGIN, 6.25, CONTENT_W, 0.35)
run(para(tf, first=True, align=PP_ALIGN.CENTER), "MERCI DE VOTRE ATTENTION", MONO, 12, DIM)
notes(s, "En conclusion, la chaîne complète est validée de bout en bout sur un site réel. Les trois objectifs sont "
         "tenus : un référentiel sans fuite, 543 variables construites, 424 retenues ; deux architectures comparées "
         "à enveloppe calibrée ; et une preuve sur données réelles avec une portée opérationnelle. Le TCN devance "
         "légèrement le TFT en précision et en couverture calibrée, tandis que le TFT conserve une interprétabilité "
         "que le TCN n'offre pas. Deux limites : une seule année d'entraînement, donc la stabilité des "
         "hyperparamètres d'une saison à l'autre n'est pas garantie ; le pas horaire lisse les nuages de moins "
         "d'une heure et plafonne la précision à 72 heures ; à quoi s'ajoute le coût mémoire de l'attention du TFT. "
         "Trois prolongements : transférer le pipeline à un autre site, un modèle dédié aux horizons de 1 à 6 heures "
         "au pas de 5 à 15 minutes, et l'apprentissage fédéré. Sur le plan opérationnel, une intégration "
         "progressive à la gestion du réseau de la SENELEC, avec des phases pilotes sur Diass. Merci de votre "
         "attention.")

prs.save(OUT)
print(f"OK : {OUT} ({TOTAL} planches)")
