import { motion } from 'motion/react'
import { clsx } from 'clsx'
import type { ResolvedProgression } from '../../types/music'
import { Badge } from '../shared/Badge'
import { sequenceToChordNames } from '../../engine/progressionResolver'
import styles from './ProgressionCard.module.css'

interface ProgressionCardProps {
  progression: ResolvedProgression
  isSelected: boolean
  onClick: () => void
}

export function ProgressionCard({ progression, isSelected, onClick }: ProgressionCardProps) {
  const chordNames = sequenceToChordNames(progression.chords)
  const noteMatchLabel = progression.noteCoverage.matched.length > 0
    ? `Matches ${progression.noteCoverage.matched.join(', ')}`
    : progression.scaleFit.isFullyDiatonic
      ? 'Fully diatonic'
      : `${progression.scaleFit.inScaleChordTones}/${progression.scaleFit.totalChordTones} chord tones in key`

  return (
    <motion.div
      className={clsx(styles.card, isSelected && styles.selected)}
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      layout
    >
      <div className={styles.header}>
        <span className={styles.name}>{progression.progression.name}</span>
        <div className={styles.complexity}>
          {Array.from({ length: 5 }, (_, index) => (
            <span
              key={index}
              className={clsx(
                styles.dot,
                index < progression.progression.complexity && styles.dotFilled
              )}
            />
          ))}
        </div>
      </div>

      <div className={styles.numerals}>
        {progression.progression.numerals.map((numeral, index) => (
          <span key={`${numeral}-${index}`} className={styles.numeral}>
            {numeral}
            {index < progression.progression.numerals.length - 1 && (
              <span className={styles.arrow}>{' -> '}</span>
            )}
          </span>
        ))}
      </div>

      <div className={styles.realized}>
        {chordNames.join(' -> ')}
      </div>

      <div className={styles.metaRow}>
        <span className={styles.metaTag}>{noteMatchLabel}</span>
        <span className={styles.metaTag}>
          {progression.scaleFit.isFullyDiatonic ? 'No borrowed tones' : 'Borrowed tones included'}
        </span>
      </div>

      <div className={styles.tags}>
        {progression.progression.genre.slice(0, 3).map((genre) => (
          <Badge key={genre} label={genre} />
        ))}
      </div>

      <div className={styles.reasons}>
        {progression.matchReasons.slice(0, 2).map((reason) => (
          <span key={reason} className={styles.reason}>
            {reason}
          </span>
        ))}
      </div>

      {progression.progression.famousExamples && progression.progression.famousExamples.length > 0 && (
        <div className={styles.examples}>
          {progression.progression.famousExamples.slice(0, 2).map((example) => (
            <span key={example} className={styles.example}>
              Song ref: {example}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}
