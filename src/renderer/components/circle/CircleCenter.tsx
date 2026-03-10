import { motion, AnimatePresence } from 'motion/react'
import styles from './CircleCenter.module.css'

interface CircleCenterProps {
  keyName: string
  mode: string
  signature: number
  cx: number
  cy: number
  radius: number
}

export function CircleCenter({ keyName, mode, signature, cx, cy, radius }: CircleCenterProps) {
  const sigDisplay = signature === 0
    ? 'No sharps/flats'
    : signature > 0
      ? `${signature} sharp${signature > 1 ? 's' : ''}`
      : `${Math.abs(signature)} flat${Math.abs(signature) > 1 ? 's' : ''}`

  return (
    <g>
      {/* Subtle center circle */}
      <circle
        cx={cx} cy={cy} r={radius}
        className={styles.centerBg}
      />

      <AnimatePresence mode="wait">
        <motion.g
          key={keyName + mode}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <text
            x={cx} y={cy - 14}
            className={styles.keyName}
            textAnchor="middle"
            dominantBaseline="central"
          >
            {keyName}
          </text>
          <text
            x={cx} y={cy + 10}
            className={styles.modeName}
            textAnchor="middle"
            dominantBaseline="central"
          >
            {mode}
          </text>
          <text
            x={cx} y={cy + 28}
            className={styles.signature}
            textAnchor="middle"
            dominantBaseline="central"
          >
            {sigDisplay}
          </text>
        </motion.g>
      </AnimatePresence>
    </g>
  )
}
