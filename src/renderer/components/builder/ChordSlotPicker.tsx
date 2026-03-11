import { useState } from 'react'
import { analyzeKey } from '../../engine/keyAnalyzer'
import { buildChord, chordToString } from '../../engine/chordBuilder'
import { resolveChordStep } from '../../engine/progressionResolver'
import { NOTE_NAMES } from '../../data/notes'
import { CHORD_TYPES } from '../../data/chords'
import type { Mode, ResolvedChordStep } from '../../types/music'
import styles from './ChordSlotPicker.module.css'

interface ChordSlotPickerProps {
  rootName: string
  mode: Mode
  onSelect: (chord: ResolvedChordStep) => void
  onClose: () => void
}

const ADVANCED_CATEGORIES: { label: string; keys: string[] }[] = [
  { label: 'Seventh', keys: Object.keys(CHORD_TYPES).filter((k) => CHORD_TYPES[k].category === 'seventh') },
  { label: 'Extended', keys: Object.keys(CHORD_TYPES).filter((k) => CHORD_TYPES[k].category === 'extended') },
  { label: 'Altered', keys: Object.keys(CHORD_TYPES).filter((k) => CHORD_TYPES[k].category === 'altered') },
  { label: 'Sus', keys: Object.keys(CHORD_TYPES).filter((k) => CHORD_TYPES[k].category === 'sus') },
]

export function ChordSlotPicker({ rootName, mode, onSelect, onClose }: ChordSlotPickerProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const key = analyzeKey(rootName, mode)

  const handleDiatonicSelect = (numeral: string) => {
    const step = resolveChordStep(rootName, mode, numeral)
    onSelect(step)
    onClose()
  }

  const handleAdvancedSelect = (chromaticRoot: string, qualityKey: string) => {
    try {
      const chord = buildChord(chromaticRoot, qualityKey)
      const step: ResolvedChordStep = {
        numeral: `${chromaticRoot}${CHORD_TYPES[qualityKey].symbol}`,
        chord,
        role: 'chromatic',
        durationBeats: 4,
      }
      onSelect(step)
      onClose()
    } catch {
      // Fallback: ignore invalid combinations
    }
  }

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.picker} onClick={(e) => e.stopPropagation()}>
        <span className={styles.sectionLabel}>Diatonic chords</span>
        <div className={styles.chordGrid}>
          {key.diatonicChords.map((dc) => (
            <button
              key={dc.romanNumeral}
              className={styles.chordBtn}
              onClick={() => handleDiatonicSelect(dc.romanNumeral)}
            >
              <span className={styles.chordBtnNumeral}>{dc.romanNumeral}</span>
              <span className={styles.chordBtnName}>{chordToString(dc.chord)}</span>
            </button>
          ))}
        </div>

        {/* Seventh variants */}
        <span className={styles.sectionLabel}>Seventh chords</span>
        <div className={styles.chordGrid}>
          {key.diatonicChords
            .filter((dc) => dc.seventh)
            .map((dc) => {
              const seventhNumeral = `${dc.romanNumeral}7`
              return (
                <button
                  key={seventhNumeral}
                  className={styles.chordBtn}
                  onClick={() => handleDiatonicSelect(seventhNumeral)}
                >
                  <span className={styles.chordBtnNumeral}>{seventhNumeral}</span>
                  <span className={styles.chordBtnName}>{chordToString(dc.seventh!)}</span>
                </button>
              )
            })}
        </div>

        <div className={styles.divider} />

        <button
          className={styles.advancedToggle}
          data-open={showAdvanced}
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          Advanced
        </button>

        {showAdvanced && (
          <div className={styles.advancedSection}>
            {ADVANCED_CATEGORIES.map((cat) => (
              <div key={cat.label}>
                <span className={styles.sectionLabel}>{cat.label}</span>
                <div className={styles.qualityGrid}>
                  {cat.keys.map((qk) => (
                    <button
                      key={qk}
                      className={styles.qualityBtn}
                      onClick={() => handleAdvancedSelect(rootName, qk)}
                      title={CHORD_TYPES[qk].description}
                    >
                      {rootName}{CHORD_TYPES[qk].symbol || qk}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className={styles.divider} />
            <span className={styles.sectionLabel}>Chromatic root</span>
            <div className={styles.rootRow}>
              {NOTE_NAMES.map((note) => (
                <button
                  key={note}
                  className={styles.rootBtn}
                  onClick={() => handleAdvancedSelect(note, 'major')}
                >
                  {note}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
