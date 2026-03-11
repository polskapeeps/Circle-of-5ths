import { useCallback, useMemo, useRef, useState } from 'react'
import { CircleOfFifths } from '../circle/CircleOfFifths'
import { PianoRoll } from '../piano/PianoRoll'
import { ChordBuilderStrip } from '../builder/ChordBuilderStrip'
import { KeySelectorBar } from '../builder/KeySelectorBar'
import { useKeyStore } from '../../stores/useKeyStore'
import { useBuilderStore } from '../../stores/useBuilderStore'
import { useUIStore } from '../../stores/useUIStore'
import { getResolvedProgressions, getScaleFormula } from '../../engine/recommendationEngine'
import { analyzeKey } from '../../engine/keyAnalyzer'
import { sequenceToChordNames } from '../../engine/progressionResolver'
import type { Mode, ResolvedChordStep } from '../../types/music'
import styles from './IdeaWorkbench.module.css'

function getSignatureLabel(signature: number) {
  if (signature === 0) return 'No sharps or flats'
  if (signature > 0) return `${signature} sharp${signature > 1 ? 's' : ''}`
  return `${Math.abs(signature)} flat${Math.abs(signature) > 1 ? 's' : ''}`
}

const MIN_PIANO_HEIGHT = 160
const MAX_PIANO_HEIGHT = 600
const DEFAULT_PIANO_HEIGHT = 300

export function IdeaWorkbench() {
  const selectedRoot = useKeyStore((state) => state.selectedRoot)
  const selectedMode = useKeyStore((state) => state.selectedMode)
  const pianoRollFocusMode = useUIStore((state) => state.pianoRollFocusMode)
  const togglePianoRollFocusMode = useUIStore((state) => state.togglePianoRollFocusMode)

  const slots = useBuilderStore((state) => state.slots)

  const [circleExpanded, setCircleExpanded] = useState(false)
  const [pianoHeight, setPianoHeight] = useState(DEFAULT_PIANO_HEIGHT)
  const dragRef = useRef<{ startY: number; startHeight: number } | null>(null)

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    dragRef.current = { startY: e.clientY, startHeight: pianoHeight }

    const handleMove = (ev: MouseEvent) => {
      if (!dragRef.current) return
      const delta = dragRef.current.startY - ev.clientY
      const next = Math.min(MAX_PIANO_HEIGHT, Math.max(MIN_PIANO_HEIGHT, dragRef.current.startHeight + delta))
      setPianoHeight(next)
    }

    const handleUp = () => {
      dragRef.current = null
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.body.style.cursor = 'ns-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleUp)
  }, [pianoHeight])

  const handleTouchResizeStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    dragRef.current = { startY: touch.clientY, startHeight: pianoHeight }

    const handleMove = (ev: TouchEvent) => {
      if (!dragRef.current) return
      const t = ev.touches[0]
      const delta = dragRef.current.startY - t.clientY
      const next = Math.min(MAX_PIANO_HEIGHT, Math.max(MIN_PIANO_HEIGHT, dragRef.current.startHeight + delta))
      setPianoHeight(next)
    }

    const handleEnd = () => {
      dragRef.current = null
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('touchend', handleEnd)
    }

    document.addEventListener('touchmove', handleMove, { passive: false })
    document.addEventListener('touchend', handleEnd)
  }, [pianoHeight])

  const scaleNotes = useMemo(
    () => getScaleFormula(selectedRoot, selectedMode),
    [selectedMode, selectedRoot]
  )

  const keySummary = useMemo(
    () => analyzeKey(selectedRoot, selectedMode),
    [selectedMode, selectedRoot]
  )

  const rankedProgressions = useMemo(
    () =>
      getResolvedProgressions(selectedRoot, selectedMode, {
        genres: [],
        moods: [],
        selectedNotes: [],
        complexityRange: [1, 5],
      }),
    [selectedMode, selectedRoot]
  )

  const leadSuggestion = rankedProgressions[0]

  // Builder store is the single source of truth for the piano roll
  const builderSteps = useMemo(() => {
    return slots.filter((s) => s.chord !== null).map((s) => s.chord!)
  }, [slots])

  const previewTitle = builderSteps.length > 0
    ? 'Chord Builder'
    : `${selectedRoot} ${selectedMode}`

  const previewSubtitle = builderSteps.length > 0
    ? sequenceToChordNames(builderSteps).join(' \u2192 ')
    : 'Add chords above to see the voicing grid.'

  return (
    <div
      className={styles.workbench}
      data-focus-mode={pianoRollFocusMode}
    >
      {/* Key selection: collapsible circle or compact bar */}
      {!pianoRollFocusMode && (
        <>
          {circleExpanded ? (
            <div className={styles.circleCard} data-collapsible>
              <div className={styles.cardHeader}>
                <div>
                  <h2 className={styles.heading}>Key map</h2>
                  <p className={styles.copy}>Click the circle to pivot keys.</p>
                </div>
                <div className={styles.headerActions}>
                  <button className={styles.rollToggle} onClick={() => setCircleExpanded(false)}>
                    Collapse
                  </button>
                </div>
              </div>

              <div className={styles.circleWrap}>
                <div className={styles.circleStage}>
                  <CircleOfFifths />
                </div>

                <aside className={styles.infoRail}>
                  <section className={styles.infoCard}>
                    <span className={styles.infoLabel}>Scale notes</span>
                    <div className={styles.noteRow}>
                      {scaleNotes.map((note) => (
                        <span key={note.name} className={styles.notePill}>
                          {note.name}
                        </span>
                      ))}
                    </div>
                  </section>

                  <section className={styles.infoCard}>
                    <span className={styles.infoLabel}>Key profile</span>
                    <div className={styles.metricGrid}>
                      <div>
                        <span className={styles.metricLabel}>Relative</span>
                        <strong className={styles.metricValue}>{keySummary.relativeKey || '--'}</strong>
                      </div>
                      <div>
                        <span className={styles.metricLabel}>Parallel</span>
                        <strong className={styles.metricValue}>{keySummary.parallelKey || '--'}</strong>
                      </div>
                      <div>
                        <span className={styles.metricLabel}>Signature</span>
                        <strong className={styles.metricValue}>{getSignatureLabel(keySummary.signature)}</strong>
                      </div>
                    </div>
                  </section>

                  {leadSuggestion && (
                    <section className={styles.infoCard}>
                      <span className={styles.infoLabel}>Best match right now</span>
                      <strong className={styles.leadTitle}>{leadSuggestion.progression.name}</strong>
                      <span className={styles.leadReason}>{leadSuggestion.matchReasons.slice(0, 2).join(' \u2022 ')}</span>
                      <span className={styles.leadChords}>
                        {sequenceToChordNames(leadSuggestion.chords).join(' -> ')}
                      </span>
                    </section>
                  )}
                </aside>
              </div>
            </div>
          ) : (
            <KeySelectorBar onExpand={() => setCircleExpanded(true)} />
          )}
        </>
      )}

      {/* Chord Builder Strip — the hero interaction zone */}
      {!pianoRollFocusMode && <ChordBuilderStrip />}

      {/* Piano Roll — always visible, dominant element */}
      <div
        className={styles.pianoSection}
        data-focus-mode={pianoRollFocusMode}
        style={pianoRollFocusMode ? undefined : { height: pianoHeight }}
      >
        {!pianoRollFocusMode && (
          <div className={styles.resizeHandle} onMouseDown={handleResizeStart} onTouchStart={handleTouchResizeStart}>
            <div className={styles.resizeHandleBar} />
          </div>
        )}
        <PianoRoll
          title={previewTitle}
          subtitle={previewSubtitle}
          steps={builderSteps}
          focusMode={pianoRollFocusMode}
          onToggleFocusMode={togglePianoRollFocusMode}
        />
      </div>
    </div>
  )
}
