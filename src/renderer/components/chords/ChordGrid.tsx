import { useMemo } from 'react'
import { useKeyStore } from '../../stores/useKeyStore'
import { analyzeKey, getKeyDisplayName } from '../../engine/keyAnalyzer'
import { ChordCard } from './ChordCard'
import styles from './ChordGrid.module.css'

export function ChordGrid() {
  const selectedRoot = useKeyStore((state) => state.selectedRoot)
  const selectedMode = useKeyStore((state) => state.selectedMode)

  const key = useMemo(
    () => analyzeKey(selectedRoot, selectedMode),
    [selectedRoot, selectedMode]
  )

  const displayName = getKeyDisplayName(selectedRoot, selectedMode)

  return (
    <div className={styles.grid}>
      <div className={styles.header}>
        <h2 className={styles.keyName}>{displayName}</h2>
        <span className={styles.subtitle}>Diatonic chords</span>
      </div>
      <div className={styles.chords}>
        {key.diatonicChords.map((diatonicChord) => (
          <ChordCard
            key={diatonicChord.degree}
            chord={diatonicChord.chord}
            seventh={diatonicChord.seventh}
          />
        ))}
      </div>
      <div className={styles.relatedKeys}>
        <div className={styles.relatedItem}>
          <span className={styles.relatedLabel}>Relative</span>
          <span className={styles.relatedValue}>{key.relativeKey || '--'}</span>
        </div>
        <div className={styles.relatedItem}>
          <span className={styles.relatedLabel}>Parallel</span>
          <span className={styles.relatedValue}>{key.parallelKey || '--'}</span>
        </div>
      </div>
    </div>
  )
}
