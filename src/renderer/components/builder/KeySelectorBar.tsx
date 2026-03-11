import { useMemo } from 'react'
import { useKeyStore } from '../../stores/useKeyStore'
import { analyzeKey } from '../../engine/keyAnalyzer'
import { getScaleFormula } from '../../engine/recommendationEngine'
import styles from './KeySelectorBar.module.css'

interface KeySelectorBarProps {
  onExpand: () => void
}

function getSignatureLabel(signature: number) {
  if (signature === 0) return 'No sharps or flats'
  if (signature > 0) return `${signature} sharp${signature > 1 ? 's' : ''}`
  return `${Math.abs(signature)} flat${Math.abs(signature) > 1 ? 's' : ''}`
}

export function KeySelectorBar({ onExpand }: KeySelectorBarProps) {
  const selectedRoot = useKeyStore((state) => state.selectedRoot)
  const selectedMode = useKeyStore((state) => state.selectedMode)

  const scaleNotes = useMemo(
    () => getScaleFormula(selectedRoot, selectedMode),
    [selectedRoot, selectedMode]
  )

  const keySummary = useMemo(
    () => analyzeKey(selectedRoot, selectedMode),
    [selectedRoot, selectedMode]
  )

  return (
    <div className={styles.bar}>
      <div className={styles.keyDisplay}>
        <span className={styles.rootPill}>{selectedRoot}</span>
        <span className={styles.modePill}>{selectedMode}</span>
      </div>

      <span className={styles.sigLabel}>{getSignatureLabel(keySummary.signature)}</span>

      <div className={styles.scaleNotes}>
        {scaleNotes.map((note) => (
          <span key={note.name} className={styles.scalePill}>{note.name}</span>
        ))}
      </div>

      <button className={styles.expandBtn} onClick={onExpand}>
        Key Map
      </button>
    </div>
  )
}
