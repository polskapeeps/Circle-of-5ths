import { motion } from 'motion/react'
import { clsx } from 'clsx'
import type { Chord } from '../../types/music'
import { chordToString } from '../../engine/chordBuilder'
import { useChordStore } from '../../stores/useChordStore'
import styles from './ChordCard.module.css'

interface ChordCardProps {
  chord: Chord
  seventh?: Chord
  showSeventh?: boolean
}

const FUNCTION_COLORS: Record<string, string> = {
  'tonic': 'var(--fn-tonic)',
  'subdominant': 'var(--fn-subdominant)',
  'dominant': 'var(--fn-dominant)',
}

export function ChordCard({ chord, seventh, showSeventh = true }: ChordCardProps) {
  const hoveredChord = useChordStore((s) => s.hoveredChord)
  const selectedChord = useChordStore((s) => s.selectedChord)
  const setHoveredChord = useChordStore((s) => s.setHoveredChord)
  const setSelectedChord = useChordStore((s) => s.setSelectedChord)

  const displayChord = showSeventh && seventh ? seventh : chord
  const chordId = chordToString(displayChord)
  const isHovered = hoveredChord === chordId
  const isSelected = selectedChord === chordId
  const fnColor = chord.function ? FUNCTION_COLORS[chord.function] : 'var(--text-muted)'

  return (
    <motion.div
      className={clsx(styles.card, isSelected && styles.selected)}
      onHoverStart={() => setHoveredChord(chordId)}
      onHoverEnd={() => setHoveredChord(null)}
      onClick={() => setSelectedChord(isSelected ? null : chordId)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <div className={styles.indicator} style={{ background: fnColor }} />
      <div className={styles.content}>
        <span className={styles.numeral}>{chord.romanNumeral}</span>
        <span className={styles.name}>{chordToString(displayChord)}</span>
        <span className={styles.notes}>
          {displayChord.notes.map((n) => n.name).join(' ')}
        </span>
      </div>
      {chord.function && (
        <span className={styles.function} style={{ color: fnColor }}>
          {chord.function}
        </span>
      )}
    </motion.div>
  )
}
