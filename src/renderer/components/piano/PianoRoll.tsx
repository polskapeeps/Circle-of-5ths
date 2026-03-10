import { useCallback, useRef, type WheelEvent } from 'react'
import type { Chord, ResolvedChordStep } from '../../types/music'
import styles from './PianoRoll.module.css'

interface PianoRollProps {
  title: string
  subtitle: string
  steps: ResolvedChordStep[]
  focusMode?: boolean
  onToggleFocusMode?: () => void
}

interface PianoEvent {
  chordName: string
  noteName: string
  midi: number
  column: number
}

function getChordName(chord: Chord): string {
  return `${chord.root.name}${chord.type.symbol}`
}

function buildEvents(steps: ResolvedChordStep[]): PianoEvent[] {
  return steps.flatMap((step, index) => {
    let previousMidi = 47 + step.chord.root.pitchClass

    return step.chord.notes.map((note) => {
      let midi = 48 + note.pitchClass

      while (midi <= previousMidi) {
        midi += 12
      }

      previousMidi = midi

      return {
        chordName: getChordName(step.chord),
        noteName: note.name,
        midi,
        column: index + 1,
      }
    })
  })
}

function getLaneLabels(events: PianoEvent[]) {
  const baseMin = events.length > 0 ? Math.min(...events.map((event) => event.midi)) : 48
  const baseMax = events.length > 0 ? Math.max(...events.map((event) => event.midi)) : 72
  const min = baseMin - 2
  const max = baseMax + 2

  return Array.from({ length: max - min + 1 }, (_, index) => max - index)
}

function isBlackKey(midi: number) {
  return [1, 3, 6, 8, 10].includes(midi % 12)
}

function midiToLabel(midi: number) {
  const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const octave = Math.floor(midi / 12) - 1
  return `${names[midi % 12]}${octave}`
}

export function PianoRoll({
  title,
  subtitle,
  steps,
  focusMode = false,
  onToggleFocusMode,
}: PianoRollProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const events = buildEvents(steps)
  const lanes = getLaneLabels(events)
  const eventLookup = new Map(events.map((event) => [`${event.column}-${event.midi}`, event]))

  const handleWheel = useCallback((event: WheelEvent<HTMLDivElement>) => {
    const el = scrollRef.current
    if (!el) return

    // Shift+wheel or native horizontal scroll -> scroll horizontally
    if (event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      event.preventDefault()
      event.stopPropagation()
      const delta = event.deltaX !== 0 ? event.deltaX : event.deltaY
      el.scrollLeft += delta
    }
    // Normal wheel -> vertical scroll (let browser handle it naturally)
  }, [])

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <div className={styles.headerTools}>
          {onToggleFocusMode && (
            <button className={styles.focusToggle} onClick={onToggleFocusMode}>
              {focusMode ? 'Exit Focus' : 'Focus Piano Roll'}
            </button>
          )}
          <span className={styles.scrollHint}>Shift + scroll to pan</span>
        </div>
        <div className={styles.sequence}>
          {steps.map((step, i) => (
            <span key={`${step.numeral}-${i}`} className={styles.sequenceChord}>
              {getChordName(step.chord)}
            </span>
          ))}
        </div>
      </div>

      <div
        ref={scrollRef}
        className={styles.gridWrap}
        onWheel={handleWheel}
      >
        <div className={styles.grid} style={{ ['--steps' as string]: String(Math.max(steps.length, 1)) }}>
          <div className={styles.corner}>Pitch</div>
          {steps.map((step, index) => (
            <div key={`${step.numeral}-${index}`} className={styles.stepLabel}>
              <span>{step.numeral}</span>
              <strong>{getChordName(step.chord)}</strong>
            </div>
          ))}

          {lanes.map((lane) => (
            <div key={`lane-${lane}`} className={styles.laneRow}>
              <div className={styles.laneLabel}>{midiToLabel(lane)}</div>
              {steps.map((_, stepIndex) => {
                const note = eventLookup.get(`${stepIndex + 1}-${lane}`)

                return (
                  <div
                    key={`${lane}-${stepIndex}`}
                    className={styles.cell}
                    data-black={isBlackKey(lane)}
                    data-active={note ? 'true' : 'false'}
                  >
                    {note && <span className={styles.noteBlock}>{note.name}</span>}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
