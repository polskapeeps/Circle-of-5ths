import { clsx } from 'clsx'
import styles from './GlassPanel.module.css'

interface GlassPanelProps {
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'subtle'
  className?: string
  style?: React.CSSProperties
}

export function GlassPanel({ children, variant = 'default', className, style }: GlassPanelProps) {
  return (
    <div className={clsx(styles.panel, styles[variant], className)} style={style}>
      {children}
    </div>
  )
}
