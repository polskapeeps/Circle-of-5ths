import { ChordGrid } from '../chords/ChordGrid'
import { ProductionInsights } from '../insights/ProductionInsights'
import styles from './SidebarWorkspace.module.css'

export function SidebarWorkspace() {
  return (
    <div className={styles.workspace}>
      <ChordGrid />
      <ProductionInsights />
    </div>
  )
}
