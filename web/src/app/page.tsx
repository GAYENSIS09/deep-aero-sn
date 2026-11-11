
import Link from 'next/link'
import VideoBlock from '@/components/VideoBlock'
import ThemeToggle from '@/components/ThemeToggle'
import LangToggle from '@/components/LangToggle'
import { asset } from '@/lib/paths'

function SectionHeading({
  number,
  children,
}: {
  number: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-9 flex items-baseline gap-4 border-b border-db-border pb-4">
      <span className="font-mono text-xs text-db-accent">{number}</span>
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-db-text">
        {children}
      </h2>
    </div>
  )
}

const navigation = [
  { href: '/', label: 'Accueil' },
  { href: '/chapitres/', label: 'Le mémoire' },
  { href: '/presentation/', label: 'Soutenance' },
  { href: '/chapitres/6-architectures/', label: 'Architectures' },
  { href: '/chapitres/8-etudes-cas/', label: 'Résultats' },
  { href: '#video', label: 'Présentation vidéo' },
]

const objectives = [
  {
    num: '01',
    title: 'Comprendre',
    text: 'Identifier les facteurs météorologiques et physiques qui influencent la production photovoltaïque.',
  },
  {
    num: '02',
    title: 'Prévoir',
    text: 'Construire, entraîner et comparer des architectures de deep learning pour la prévision à 72 heures.',
  },
  {
    num: '03',
    title: 'Quantifier l’incertitude',
    text: 'Produire des prévisions probabilistes P10, P50 et P90 et étudier leur calibration par régression quantile conforme (CQR).',
  },
  {
    num: '04',
    title: 'Préparer l’exploitation',
    text: 'Étudier comment les prévisions et leurs intervalles d’incertitude pourraient contribuer à la prise de décision opérationnelle.',
  },
]

const memoirBlocks = [
  {
    num: '01',
    title: 'Cadre de la transition énergétique au Sénégal et présentation des sites',
    desc: 'Le système électrique sénégalais, les énergies renouvelables et le contexte du site étudié.',
    href: '/chapitres/1-transition/',
  },
  {
    num: '02',
    title: 'Physique et technologie photovoltaïque',
    desc: 'Irradiance, température, vent, conversion électrique et encrassement des modules.',
    href: '/chapitres/2-physique/',
  },
  {
    num: '03',
    title: 'Fondations de l\'apprentissage supervisé et régularisation',
    desc: 'Séries temporelles, réseaux convolutifs, réseaux récurrents et mécanismes d’attention.',
    href: '/chapitres/4-fondations/',
  },
  {
    num: '04',
    title: 'Architectures avancées appliquées',
    desc: 'Réseaux convolutifs temporels (TCN) et Temporal Fusion Transformer (TFT).',
    href: '/chapitres/6-architectures/',
  },
  {
    num: '05',
    title: 'Stratégie MIMO et prévision probabiliste par quantiles',
    desc: 'Prévision multi-horizon, quantiles P10/P50/P90, fonctions de perte et calibration.',
    href: '/chapitres/7-strategies/',
  },
  {
    num: '06',
    title: 'Étude de cas : Diass (solaire)',
    desc: 'Protocole expérimental, évaluation des modèles et analyse des résultats.',
    href: '/chapitres/8-etudes-cas/',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-clip bg-db-bg text-db-text">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-db-border bg-db-bg/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex h-[68px] items-center justify-between gap-5">
            <Link
              href="/"
              aria-label="Deep Aero SN — accueil"
              className="flex shrink-0 items-center gap-3"
            >
              <img
                src={asset('/images/ucadLogo.png')}
                alt="Université Cheikh Anta Diop de Dakar"
                className="h-10 w-10 object-contain"
              />
              <span className="hidden text-[11px] font-semibold uppercase tracking-[0.16em] text-db-text sm:block">
                Deep Aero <span className="text-db-accent">SN</span>
              </span>
            </Link>

            <nav
              aria-label="Navigation principale"
              className="flex min-w-0 items-center gap-5 overflow-x-auto py-3 sm:gap-7"
            >
              {navigation.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="shrink-0 text-[11px] font-medium text-db-muted transition-colors hover:text-db-accent"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <ThemeToggle />
            <LangToggle />
            <img
              src={asset('/images/senelecLogo.png')}
              alt="SENELEC"
              className="hidden h-10 w-10 shrink-0 object-contain sm:block"
            />
          </div>
        </div>
      </header>

      {/* Couverture */}
      <section aria-labelledby="page-title">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:py-24">
          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-20 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0">
              <div className="mb-8 flex items-center gap-4">
                <span className="h-px w-10 bg-db-accent" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-db-muted">
                  Mémoire de licence · 2025–2026
                </p>
              </div>

              <h1
                id="page-title"
                className="max-w-4xl text-[2.65rem] font-semibold leading-[1.08] tracking-[-0.045em] text-db-text sm:text-6xl xl:text-[4.5rem]"
              >
                Prévision probabiliste de la production photovoltaïque
                <span className="mt-3 block font-normal text-db-accent">
                  à 72 h par apprentissage profond
                </span>
              </h1>

              <div className="mt-8 border-l border-db-accent pl-5">
                <p className="text-xs uppercase tracking-[0.15em] text-db-muted">
                  Étude de cas
                </p>
                <p className="mt-2 text-lg font-medium sm:text-xl">
                  Centrale photovoltaïque de Diass, Sénégal
                </p>
              </div>

              <div className="mt-12 grid gap-7 border-t border-db-border pt-7 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-db-dim">
                    Auteur
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    Baye Mor Gaye
                  </p>
                  <p className="mt-1 text-sm text-db-muted">
                    Licence 3 Informatique
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-db-dim">
                    Établissement
                  </p>
                  <p className="mt-2 text-sm font-medium leading-relaxed">
                    Université Cheikh Anta Diop de Dakar
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-db-muted">
                    Faculté des Sciences et Techniques
                    <br />
                    Département de Mathématiques et Informatique
                  </p>
                </div>
              </div>

              <p className="mt-8 text-xs leading-relaxed text-db-muted">
                Mémoire réalisé avec l’accompagnement de la SENELEC.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3">
                <Link
                  href="/chapitres/"
                  className="inline-flex items-center gap-3 border-b border-db-accent pb-2 text-sm font-semibold transition-colors hover:text-db-accent"
                >
                  Lire le mémoire
                  <span aria-hidden="true">↗</span>
                </Link>

                <Link
                  href="/presentation/"
                  className="text-sm text-db-muted transition-colors hover:text-db-text"
                >
                  Consulter la soutenance
                </Link>
              </div>
            </div>

            <figure className="mx-auto w-full max-w-[300px] lg:mt-16 lg:max-w-none">
              <div className="overflow-hidden bg-db-surface">
                <img
                  src={asset('/images/author.png')}
                  alt="Portrait de Baye Mor Gaye"
                  className="aspect-[4/5] w-full object-cover object-center"
                />
              </div>
              <figcaption className="mt-4 border-t border-db-border pt-3">
                <p className="text-sm font-semibold">Baye Mor Gaye</p>
                <p className="mt-1 text-xs text-db-muted">
                  Auteur du mémoire
                </p>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Lecture du mémoire */}
      <section
        id="lecture"
        className="border-t border-db-border"
        aria-labelledby="lecture-title"
      >
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 font-mono text-xs text-db-accent">01 / DOCUMENT</p>
              <h2
                id="lecture-title"
                className="text-2xl font-semibold tracking-tight sm:text-3xl"
              >
                Le mémoire intégral
              </h2>
            </div>
            <a
              href={asset('/main.pdf')}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-db-muted underline decoration-db-border underline-offset-4 transition-colors hover:text-db-accent"
            >
              Ouvrir le PDF dans un nouvel onglet ↗
            </a>
          </div>

          <div className="overflow-hidden border border-db-border bg-white">
            <iframe
              src={asset('/main.pdf')}
              title="Lecture intégrale du mémoire de licence"
              className="h-[65vh] min-h-[440px] w-full sm:h-[78vh]"
            />
          </div>
          <p className="mt-3 text-xs text-db-dim">
            La lecture intégrée dépend du lecteur PDF de votre navigateur.
          </p>
        </div>
      </section>

      {/* Présentation de la recherche */}
      <section
        className="border-t border-db-border"
        aria-labelledby="about-title"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-20">
          <div>
            <p className="font-mono text-xs text-db-accent">02 / DÉMARCHE</p>
            <h2
              id="about-title"
              className="mt-4 text-2xl font-semibold tracking-tight"
            >
              À propos
            </h2>
          </div>

          <div className="max-w-3xl">
            <p className="text-lg leading-relaxed text-db-text sm:text-xl">
              Ce mémoire étudie l’utilisation de l’apprentissage profond pour
              anticiper la production photovoltaïque de la centrale de Diass
              jusqu’à 72 heures à l’avance, dans le contexte climatique du
              Sénégal.
            </p>
            <p className="mt-6 text-sm leading-7 text-db-muted sm:text-base">
              Le travail porte sur la préparation et l’analyse des données,
              la comparaison d’architectures de séries temporelles, notamment
              TCN et TFT, et la production de prévisions probabilistes. L’objectif
              est d’évaluer non seulement la précision des estimations, mais
              aussi leur capacité à représenter l’incertitude utile à la
              planification énergétique.
            </p>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-db-border pt-5">
              {[
                'Apprentissage profond',
                'Séries temporelles',
                'Énergie solaire',
                'Prévision probabiliste',
              ].map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-db-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Encadrement */}
      <section
        className="border-t border-db-border"
        aria-labelledby="supervision-title"
      >
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="mb-10">
            <p className="font-mono text-xs text-db-accent">03 / INSTITUTIONS</p>
            <h2
              id="supervision-title"
              className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Encadrement
            </h2>
          </div>

          <div className="grid gap-10 md:grid-cols-2 md:gap-16">
            <div className="border-t-2 border-db-border pt-5">
              <div className="flex items-start gap-4">
                <img
                  src={asset('/images/ucadLogo.png')}
                  alt="Logo UCAD"
                  className="h-12 w-12 shrink-0 object-contain"
                />
                <div>
                  <h3 className="text-sm font-semibold leading-relaxed">
                    Université Cheikh Anta Diop de Dakar
                  </h3>
                  <p className="mt-5 text-base font-medium">Dr Ndiouma Bame</p>
                  <p className="mt-1 text-sm text-db-muted">
                    Encadrant académique
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-db-border pt-5">
              <div className="flex items-start gap-4">
                <img
                  src={asset('/images/senelecLogo.png')}
                  alt="Logo SENELEC"
                  className="h-12 w-12 shrink-0 object-contain"
                />
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold">SENELEC</h3>

                  <div className="mt-5">
                    <p className="text-base font-medium">
                      Dr Saidou Abdoul Soumare
                    </p>
                    <p className="mt-1 text-sm text-db-muted">
                      Maître de stage
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="text-base font-medium">Dr Abdoulaye Ba</p>
                    <p className="mt-1 text-sm text-db-muted">
                      Maître de stage
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problématique */}
      <section
        className="border-t border-db-border"
        aria-labelledby="problem-title"
      >
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-20">
            <div>
              <p className="font-mono text-xs text-db-accent">04 / PROBLÉMATIQUE</p>
              <h2
                id="problem-title"
                className="mt-4 text-2xl font-semibold tracking-tight"
              >
                Question de recherche
              </h2>
            </div>

            <div>
              <blockquote className="max-w-4xl border-l-2 border-db-accent pl-6 text-xl font-medium leading-relaxed tracking-tight sm:pl-8 sm:text-2xl lg:text-3xl">
                Comment concevoir un modèle d’apprentissage profond capable
                de prévoir avec précision et robustesse la production
                photovoltaïque à 72 heures, tout en quantifiant l’incertitude
                dans les conditions climatiques sénégalaises ?
              </blockquote>

              <figure className="mt-12">
                <img
                  src={asset('/figures/fig_ch13_diass_serie_temporelle.png')}
                  alt="Évolution temporelle de la production photovoltaïque de la centrale de Diass"
                  className="h-auto w-full border border-db-border bg-db-surface"
                  loading="lazy"
                />
                <figcaption className="mt-3 max-w-3xl text-xs leading-relaxed text-db-muted">
                  Évolution temporelle de la production photovoltaïque à Diass.
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* Objectifs */}
      <section
        className="border-t border-db-border"
        aria-labelledby="objectives-title"
      >
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="font-mono text-xs text-db-accent">05 / OBJECTIFS</p>
              <h2
                id="objectives-title"
                className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl"
              >
                De la donnée à la prévision
              </h2>
            </div>
            <Link
              href="/chapitres/"
              className="text-sm text-db-muted underline decoration-db-border underline-offset-4 transition-colors hover:text-db-accent"
            >
              Méthodologie complète ↗
            </Link>
          </div>

          <div className="border-t border-db-border">
            {objectives.map((objective) => (
              <article
                key={objective.num}
                className="grid gap-3 border-b border-db-border py-6 sm:grid-cols-[64px_minmax(180px,0.65fr)_minmax(0,1.35fr)] sm:gap-6 sm:py-8"
              >
                <span className="font-mono text-sm text-db-accent">
                  {objective.num}
                </span>
                <h3 className="text-base font-semibold">
                  {objective.title}
                </h3>
                <p className="max-w-2xl text-sm leading-7 text-db-muted">
                  {objective.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Sommaire */}
      <section
        className="border-t border-db-border"
        aria-labelledby="chapters-title"
      >
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-20">
            <div>
              <p className="font-mono text-xs text-db-accent">06 / SOMMAIRE</p>
              <h2
                id="chapters-title"
                className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl"
              >
                Parcours de lecture
              </h2>
              <p className="mt-4 max-w-xs text-sm leading-7 text-db-muted">
                Des fondements physiques aux expériences de prévision,
                explorez les principales étapes du mémoire.
              </p>
            </div>

            <div className="border-t border-db-border">
              {memoirBlocks.map((block) => (
                <Link
                  key={block.num}
                  href={block.href}
                  className="group grid gap-3 border-b border-db-border py-6 sm:grid-cols-[44px_minmax(0,1fr)_24px] sm:gap-5 sm:py-7"
                >
                  <span className="font-mono text-xs text-db-dim transition-colors group-hover:text-db-accent">
                    {block.num}
                  </span>

                  <div>
                    <h3 className="text-base font-medium transition-colors group-hover:text-db-accent sm:text-lg">
                      {block.title}
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-db-muted">
                      {block.desc}
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className="hidden self-center text-lg text-db-dim transition-transform group-hover:translate-x-1 group-hover:text-db-accent sm:block"
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Présentation vidéo */}
      <section
        id="video"
        className="scroll-mt-24 border-t border-db-border"
        aria-labelledby="video-title"
      >
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <p className="font-mono text-xs text-db-accent">07 / PRÉSENTATION</p>
          <h2
            id="video-title"
            className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Présentation du mémoire
          </h2>
          <p className="mb-8 mt-3 max-w-2xl text-sm leading-7 text-db-muted">
            Une présentation synthétique de la problématique, de la démarche
            expérimentale et des principaux enseignements du travail.
          </p>

          <div className="border-y border-db-border py-6">
            <VideoBlock />
          </div>
        </div>
      </section>

      {/* Pied de page */}
      <footer className="border-t border-db-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-xs text-db-muted">
            Baye Mor Gaye · Licence 3 Informatique · 2025–2026
          </p>
          <Link
            href="/"
            className="text-xs text-db-muted transition-colors hover:text-db-accent"
          >
            Retour en haut ↑
          </Link>
        </div>
      </footer>
    </main>
  )
}
