import type { BuilderSlot } from '../../types/music'
import { chordToString } from '../../engine/chordBuilder'
import styles from './ChordSlot.module.css'

interface ChordSlotProps {
  slot: BuilderSlot
  onClickSlot: (id: string) => void
  onLock: (id: string) => void
  onRandomize: (id: string) => void
  onRemove: (id: string) => void
}

export function ChordSlot({ slot, onClickSlot, onLock, onRandomize, onRemove }: ChordSlotProps) {
  const filled = slot.chord !== null

  return (
    <div
      className={styles.slot}
      data-filled={filled}
      data-locked={slot.locked}
      onClick={() => onClickSlot(slot.id)}
    >
      {filled ? (
        <>
          <span className={styles.numeral}>{slot.chord!.numeral}</span>
          <span className={styles.chordName}>{chordToString(slot.chord!.chord)}</span>
        </>
      ) : (
        <>
          <span className={styles.emptyLabel}>+</span>
          <span className={styles.emptyHint}>Add</span>
        </>
      )}

      <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
        {filled && (
          <button
            className={styles.lockBtn}
            data-active={slot.locked}
            onClick={() => onLock(slot.id)}
            title={slot.locked ? 'Unlock' : 'Lock'}
          >
            {slot.locked ? '\u2022' : '\u25CB'}
          </button>
        )}
        <button
          className={styles.randomBtn}
          onClick={() => onRandomize(slot.id)}
          title="Randomize"
        >
          {'\u21BB'}
        </button>
        <button
          className={styles.removeBtn}
          onClick={() => onRemove(slot.id)}
          title="Remove"
        >
          {'\u00D7'}
        </button>
      </div>
    </div>
  )
}
