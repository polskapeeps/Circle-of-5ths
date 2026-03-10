import { clsx } from 'clsx'
import styles from './Badge.module.css'

interface BadgeProps {
  label: string
  active?: boolean
  color?: string
  onClick?: () => void
}

export function Badge({ label, active = false, color, onClick }: BadgeProps) {
  return (
    <button
      className={clsx(styles.badge, active && styles.active)}
      style={color ? { '--badge-color': color } as React.CSSProperties : undefined}
      onClick={onClick}
    >
      {label}
    </button>
  )
}
