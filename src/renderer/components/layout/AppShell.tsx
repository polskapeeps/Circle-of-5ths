import { clsx } from 'clsx'
import { useUIStore } from '../../stores/useUIStore'
import styles from './AppShell.module.css'

interface AppShellProps {
  sidebar: React.ReactNode
  center: React.ReactNode
  panel: React.ReactNode
}

export function AppShell({ sidebar, center, panel }: AppShellProps) {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const panelCollapsed = useUIStore((s) => s.panelCollapsed)

  return (
    <div className={styles.shell}>
      <div className={styles.titlebar}>
        <span className={styles.titleText}>Circle of Fifths</span>
      </div>
      <div
        className={clsx(
          styles.content,
          sidebarCollapsed && styles.sidebarCollapsed,
          panelCollapsed && styles.panelCollapsed
        )}
      >
        <aside className={clsx(styles.sidebar, sidebarCollapsed && styles.collapsed)}>
          {sidebar}
        </aside>
        <main className={styles.center}>
          {center}
        </main>
        <aside className={clsx(styles.panel, panelCollapsed && styles.collapsed)}>
          {panel}
        </aside>
      </div>
    </div>
  )
}
