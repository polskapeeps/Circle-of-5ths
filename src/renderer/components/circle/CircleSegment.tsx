import { motion } from 'motion/react'
import type { SegmentGeometry } from '../../types/geometry'
import styles from './CircleSegment.module.css'

interface CircleSegmentProps {
  geometry: SegmentGeometry
  label: string
  color: string
  isSelected: boolean
  isHovered: boolean
  isRelated: boolean
  onHoverStart: () => void
  onHoverEnd: () => void
  onClick: () => void
}

export function CircleSegment({
  geometry, label, color, isSelected, isHovered, isRelated,
  onHoverStart, onHoverEnd, onClick
}: CircleSegmentProps) {
  const baseOpacity = isSelected ? 1 : isRelated ? 0.6 : isHovered ? 0.8 : 0.35
  const glowOpacity = isSelected ? 0.5 : isHovered ? 0.3 : 0

  return (
    <g className={styles.segment}>
      {/* Glow effect behind segment */}
      {(isSelected || isHovered) && (
        <motion.path
          d={geometry.path}
          fill={color}
          opacity={glowOpacity}
          filter="url(#segment-glow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: glowOpacity }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Main segment */}
      <motion.path
        d={geometry.path}
        fill={color}
        className={styles.segmentPath}
        initial={false}
        animate={{
          opacity: baseOpacity,
          scale: isSelected ? 1.03 : isHovered ? 1.015 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={{ transformOrigin: `${geometry.labelPosition.x}px ${geometry.labelPosition.y}px` }}
        onHoverStart={onHoverStart}
        onHoverEnd={onHoverEnd}
        onClick={onClick}
      />

      {/* Label */}
      <text
        x={geometry.labelPosition.x}
        y={geometry.labelPosition.y}
        className={styles.label}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: isSelected ? 'clamp(16px, 1.15vw, 19px)' : 'clamp(13px, 0.95vw, 16px)',
          fontWeight: isSelected ? 700 : 600,
          opacity: isSelected || isHovered || isRelated ? 1 : 0.7,
        }}
        pointerEvents="none"
      >
        {label}
      </text>
    </g>
  )
}
