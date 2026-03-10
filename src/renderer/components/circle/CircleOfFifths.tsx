import { useState, useMemo } from 'react'
import { useKeyStore } from '../../stores/useKeyStore'
import { CIRCLE_MAJOR_KEYS, CIRCLE_MINOR_KEYS, KEY_COLORS, RELATIVE_MINOR } from '../../data/notes'
import { KEY_SIGNATURES } from '../../data/notes'
import { getCircleConfig, getSegmentGeometry } from '../../engine/circleGeometry'
import { CircleSegment } from './CircleSegment'
import { CircleCenter } from './CircleCenter'
import styles from './CircleOfFifths.module.css'

const SIZE = 520

export function CircleOfFifths() {
  const selectedRoot = useKeyStore((s) => s.selectedRoot)
  const selectedMode = useKeyStore((s) => s.selectedMode)
  const setSelectedRoot = useKeyStore((s) => s.setSelectedRoot)
  const setSelectedMode = useKeyStore((s) => s.setSelectedMode)
  const [hoveredIndex, setHoveredIndex] = useState<{ ring: 'major' | 'minor'; index: number } | null>(null)

  const config = useMemo(() => getCircleConfig(SIZE), [])

  const majorSegments = useMemo(
    () => CIRCLE_MAJOR_KEYS.map((_, i) =>
      getSegmentGeometry(config.cx, config.cy, config.outerInner, config.outerRadius, i, 12)
    ),
    [config]
  )

  const minorSegments = useMemo(
    () => CIRCLE_MINOR_KEYS.map((_, i) =>
      getSegmentGeometry(config.cx, config.cy, config.innerInner, config.innerRadius, i, 12)
    ),
    [config]
  )

  // Determine which segments are related to the selection
  const selectedMajorIndex = CIRCLE_MAJOR_KEYS.indexOf(selectedRoot as typeof CIRCLE_MAJOR_KEYS[number])
  const selectedMinorKey = RELATIVE_MINOR[selectedRoot] || ''
  const selectedMinorIndex = CIRCLE_MINOR_KEYS.indexOf(selectedMinorKey as typeof CIRCLE_MINOR_KEYS[number])

  // Adjacent keys on circle (related keys)
  const relatedMajorIndices = new Set<number>()
  if (selectedMode === 'major' && selectedMajorIndex >= 0) {
    relatedMajorIndices.add((selectedMajorIndex + 1) % 12)
    relatedMajorIndices.add((selectedMajorIndex + 11) % 12)
  }

  const signature = KEY_SIGNATURES[selectedRoot] ?? 0

  return (
    <div className={styles.container}>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className={styles.svg}
      >
        <defs>
          <filter id="segment-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer ring - Major keys */}
        {CIRCLE_MAJOR_KEYS.map((key, i) => {
          const isSel = selectedMode === 'major' && key === selectedRoot
          const isHov = hoveredIndex?.ring === 'major' && hoveredIndex.index === i
          const isRel = relatedMajorIndices.has(i) || (selectedMode === 'major' && selectedMinorIndex === i)

          return (
            <CircleSegment
              key={`major-${key}`}
              geometry={majorSegments[i]}
              label={key}
              color={KEY_COLORS[key] || '#666'}
              isSelected={isSel}
              isHovered={isHov}
              isRelated={isRel}
              onHoverStart={() => setHoveredIndex({ ring: 'major', index: i })}
              onHoverEnd={() => setHoveredIndex(null)}
              onClick={() => { setSelectedRoot(key); setSelectedMode('major') }}
            />
          )
        })}

        {/* Inner ring - Minor keys */}
        {CIRCLE_MINOR_KEYS.map((key, i) => {
          const rootOnly = key.replace('m', '')
          const majorParent = CIRCLE_MAJOR_KEYS[i]
          const color = KEY_COLORS[majorParent] || '#666'
          const isSel = selectedMode === 'minor' && rootOnly === selectedRoot
          const isHov = hoveredIndex?.ring === 'minor' && hoveredIndex.index === i
          const isRel = selectedMode === 'major' && i === selectedMinorIndex

          return (
            <CircleSegment
              key={`minor-${key}`}
              geometry={minorSegments[i]}
              label={key}
              color={color}
              isSelected={isSel}
              isHovered={isHov}
              isRelated={isRel}
              onHoverStart={() => setHoveredIndex({ ring: 'minor', index: i })}
              onHoverEnd={() => setHoveredIndex(null)}
              onClick={() => { setSelectedRoot(rootOnly); setSelectedMode('minor') }}
            />
          )
        })}

        {/* Center */}
        <CircleCenter
          keyName={selectedRoot}
          mode={selectedMode}
          signature={signature}
          cx={config.cx}
          cy={config.cy}
          radius={config.centerRadius}
        />
      </svg>
    </div>
  )
}
