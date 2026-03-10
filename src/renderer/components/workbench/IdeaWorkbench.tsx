import { useCallback, useMemo, useRef, useState } from 'react'
import { CircleOfFifths } from '../circle/CircleOfFifths'
import { PianoRoll } from '../piano/PianoRoll'
import { useChordStore } from '../../stores/useChordStore'
import { useIdeaStore } from '../../stores/useIdeaStore'
import { useKeyStore } from '../../stores/useKeyStore'
import { useProgressionStore } from '../../stores/useProgressionStore'
import { useUIStore } from '../../stores/useUIStore'
import { getProductionIdeas, getResolvedProgressions, getScaleFormula } from '../../engine/recommendationEngine'
import { analyzeKey } from '../../engine/keyAnalyzer'
import { chordToString } from '../../engine/chordBuilder'
import { sequenceToChordNames } from '../../engine/progressionResolver'
import type { Mode, ResolvedChordStep } from '../../types/music'
import styles from './IdeaWorkbench.module.css'

function getSelectedChordSteps(selectedChord: string | null, rootName: string, mode: Mode): ResolvedChordStep[] | null {
  if (!selectedChord) return null

  const key = analyzeKey(rootName, mode)
  const match = key.diatonicChords
    .flatMap((entry) => [entry.chord, entry.seventh].filter(Boolean))
    .find((chord) => chord && chordToString(chord) === selectedChord)

  if (!match) return null

  return [
    {
      numeral: match.romanNumeral ?? 'Chord',
      chord: match,
      role: 'diatonic',
      durationBeats: 4,
    },
  ]
}

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
  const selectedChord = useChordStore((state) => state.selectedChord)
  const selectedIdeaId = useIdeaStore((state) => state.selectedIdeaId)
  const selectedProgressionId = useProgressionStore((state) => state.selectedProgressionId)
  const selectedGenres = useProgressionStore((state) => state.selectedGenres)
  const selectedMoods = useProgressionStore((state) => state.selectedMoods)
  const complexityRange = useProgressionStore((state) => state.complexityRange)
  const pianoRollCollapsed = useUIStore((state) => state.pianoRollCollapsed)
  const togglePianoRoll = useUIStore((state) => state.togglePianoRoll)

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

  const ideas = useMemo(
    () => getProductionIdeas(selectedRoot, selectedMode),
    [selectedMode, selectedRoot]
  )

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
        genres: selectedGenres,
        moods: selectedMoods,
        complexityRange,
      }),
    [complexityRange, selectedGenres, selectedMoods, selectedMode, selectedRoot]
  )

  const preview = useMemo(() => {
    const selectedIdea = ideas.find((idea) => idea.id === selectedIdeaId)
    if (selectedIdea) {
      return {
        title: selectedIdea.title,
        subtitle: selectedIdea.summary,
        steps: selectedIdea.chords,
      }
    }

    const selectedProgression = rankedProgressions.find(
      (progression) => progression.progression.id === selectedProgressionId
    )
    if (selectedProgression) {
      return {
        title: selectedProgression.progression.name,
        subtitle: selectedProgression.matchReasons.join(' • '),
        steps: selectedProgression.chords,
      }
    }

    const selectedChordSteps = getSelectedChordSteps(selectedChord, selectedRoot, selectedMode)
    if (selectedChordSteps) {
      return {
        title: 'Selected chord',
        subtitle: 'Single-shot voicing preview for the current key center.',
        steps: selectedChordSteps,
      }
    }

    const fallback = rankedProgressions[0]
    if (fallback) {
      return {
        title: fallback.progression.name,
        subtitle: fallback.matchReasons.join(' • '),
        steps: fallback.chords,
      }
    }

    return {
      title: `${selectedRoot} ${selectedMode}`,
      subtitle: 'Choose a chord or progression to preview the voicing grid.',
      steps: [],
    }
  }, [ideas, rankedProgressions, selectedChord, selectedIdeaId, selectedMode, selectedProgressionId, selectedRoot])

  const leadSuggestion = rankedProgressions[0]

  return (
    <div className={styles.workbench} data-piano-collapsed={pianoRollCollapsed}>
      <div className={styles.circleCard}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.heading}>Key map</h2>
            <p className={styles.copy}>Click the circle to pivot keys, then tap a chord or progression to project it below.</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.rollToggle} onClick={togglePianoRoll}>
              {pianoRollCollapsed ? 'Show Piano Roll' : 'Hide Piano Roll'}
            </button>
            <div className={styles.meta}>
              <span className={styles.metaPill}>{selectedRoot}</span>
              <span className={styles.metaPill}>{selectedMode}</span>
            </div>
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
                <span className={styles.leadReason}>{leadSuggestion.matchReasons.slice(0, 2).join(' • ')}</span>
                <span className={styles.leadChords}>
                  {sequenceToChordNames(leadSuggestion.chords).join(' -> ')}
                </span>
              </section>
            )}
          </aside>
        </div>
      </div>

      {!pianoRollCollapsed && (
        <div className={styles.pianoSection} style={{ height: pianoHeight }}>
          <div className={styles.resizeHandle} onMouseDown={handleResizeStart}>
            <div className={styles.resizeHandleBar} />
          </div>
          <PianoRoll title={preview.title} subtitle={preview.subtitle} steps={preview.steps} />
        </div>
      )}
    </div>
  )
}
