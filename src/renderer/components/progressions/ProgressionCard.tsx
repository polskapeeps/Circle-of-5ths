import { motion } from 'motion/react'
import { clsx } from 'clsx'
import type { Progression } from '../../types/music'
import { Badge } from '../shared/Badge'
import styles from './ProgressionCard.module.css'

interface ProgressionCardProps {
  progression: Progression
  isSelected: boolean
  onClick: () => void
}

export function ProgressionCard({ progression, isSelected, onClick }: ProgressionCardProps) {
  return (
    <motion.div
      className={clsx(styles.card, isSelected && styles.selected)}
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      layout
    >
      <div className={styles.header}>
        <span className={styles.name}>{progression.name}</span>
        <div className={styles.complexity}>
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className={clsx(styles.dot, i < progression.complexity && styles.dotFilled)}
            />
          ))}
        </div>
      </div>

      <div className={styles.numerals}>
        {progression.numerals.map((n, i) => (
          <span key={i} className={styles.numeral}>
            {n}
            {i < progression.numerals.length - 1 && (
              <span className={styles.arrow}> → </span>
            )}
          </span>
        ))}
      </div>

      <div className={styles.tags}>
        {progression.genre.slice(0, 3).map((g) => (
          <Badge key={g} label={g} />
        ))}
      </div>

      {progression.famousExamples && progression.famousExamples.length > 0 && (
        <div className={styles.examples}>
          {progression.famousExamples.slice(0, 2).map((ex) => (
            <span key={ex} className={styles.example}>♪ {ex}</span>
          ))}
        </div>
      )}
    </motion.div>
  )
}
