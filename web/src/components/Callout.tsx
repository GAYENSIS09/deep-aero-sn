import clsx from 'clsx'

export type CalloutType = 'intuition' | 'interpretation' | 'formalisation' | 'transition'

interface CalloutProps {
  type: CalloutType
  children: React.ReactNode
}

const labels: Record<CalloutType, string> = {
  intuition: 'Intuition',
  interpretation: 'Interprétation',
  formalisation: 'Formalisation',
  transition: 'Transition',
}

const colors: Record<CalloutType, string> = {
  intuition: 'border-db-info bg-db-info/5',
  interpretation: 'border-db-accent bg-db-accent/5',
  formalisation: 'border-db-warn bg-db-warn/5',
  transition: 'border-db-wind bg-db-wind/5',
}

const textColors: Record<CalloutType, string> = {
  intuition: 'text-db-info',
  interpretation: 'text-db-accent',
  formalisation: 'text-db-warn',
  transition: 'text-db-wind',
}

export default function Callout({ type, children }: CalloutProps) {
  return (
    <div className={clsx('border-l-[3px] rounded-r-lg p-4 my-5', colors[type])}>
      <div className={clsx('text-[11px] font-semibold uppercase tracking-[0.15em] mb-2', textColors[type])}>
        {labels[type]}
      </div>
      <div className="text-[0.95rem] text-db-muted leading-relaxed font-serif">{children}</div>
    </div>
  )
}