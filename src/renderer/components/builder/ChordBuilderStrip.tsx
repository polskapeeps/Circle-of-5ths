import { useCallback, useState } from 'react'
import { useBuilderStore } from '../../stores/useBuilderStore'
import { useKeyStore } from '../../stores/useKeyStore'
import { ChordSlot } from './ChordSlot'
import { ChordSlotPicker } from './ChordSlotPicker'
import type { RandomOptions, ResolvedChordStep } from '../../types/music'
import styles from './ChordBuilderStrip.module.css'

function getDefaultOptions(chromatic: boolean): RandomOptions {
  return {
    constrainToScale: !chromatic,
    chordCategories: ['triad', 'seventh'],
  }
}

export function ChordBuilderStrip() {
  const slots = useBuilderStore((s) => s.slots)
  const randomNote = useBuilderStore((s) => s.randomNote)
  const chromaticMode = useBuilderStore((s) => s.chromaticMode)
  const addSlot = useBuilderStore((s) => s.addSlot)
  const removeSlot = useBuilderStore((s) => s.removeSlot)
  const setSlotChord = useBuilderStore((s) => s.setSlotChord)
  const toggleSlotLock = useBuilderStore((s) => s.toggleSlotLock)
  const randomizeSlot = useBuilderStore((s) => s.randomizeSlot)
  const randomizeAllUnlocked = useBuilderStore((s) => s.randomizeAllUnlocked)
  const clearAll = useBuilderStore((s) => s.clearAll)
  const randomizeNote = useBuilderStore((s) => s.randomizeNote)
  const setChromaticMode = useBuilderStore((s) => s.setChromaticMode)

  const selectedRoot = useKeyStore((s) => s.selectedRoot)
  const selectedMode = useKeyStore((s) => s.selectedMode)

  const [pickerSlotId, setPickerSlotId] = useState<string | null>(null)

  const handleRandomizeAll = useCallback(() => {
    randomizeAllUnlocked(selectedRoot, selectedMode, getDefaultOptions(chromaticMode))
  }, [randomizeAllUnlocked, selectedRoot, selectedMode, chromaticMode])

  const handleRandomizeSlot = useCallback(
    (id: string) => {
      randomizeSlot(id, selectedRoot, selectedMode, getDefaultOptions(chromaticMode))
    },
    [randomizeSlot, selectedRoot, selectedMode, chromaticMode]
  )

  const handleRandomNote = useCallback(() => {
    randomizeNote(selectedRoot, selectedMode)
  }, [randomizeNote, selectedRoot, selectedMode])

  const handlePickerSelect = useCallback(
    (chord: ResolvedChordStep) => {
      if (pickerSlotId) {
        setSlotChord(pickerSlotId, chord, 'manual')
      }
    },
    [pickerSlotId, setSlotChord]
  )

  return (
    <div className={styles.strip}>
      <div className={styles.header}>
        <span className={styles.title}>Chord Builder</span>

        <div className={styles.controls}>
          <button
            className={styles.chromaticToggle}
            data-active={chromaticMode}
            onClick={() => setChromaticMode(!chromaticMode)}
            title={chromaticMode ? 'Chromatic mode: randomize from all 12 notes' : 'Scale mode: randomize within current scale'}
          >
            <span className={styles.chromaticDot} />
            {chromaticMode ? 'Chromatic' : 'In Scale'}
          </button>

          <button className={styles.primaryBtn} onClick={handleRandomizeAll}>
            Randomize All
          </button>
          <button className={styles.controlBtn} onClick={handleRandomNote}>
            Random Note
          </button>
          <button className={styles.controlBtn} onClick={clearAll}>
            Clear
          </button>
        </div>
      </div>

      {randomNote && (
        <div className={styles.randomNoteDisplay}>
          <span className={styles.randomNoteLabel}>Random note:</span>
          <span className={styles.randomNotePill}>{randomNote.name}</span>
        </div>
      )}

      <div className={styles.slotRow}>
        {slots.map((slot) => (
          <div key={slot.id} className={styles.slotWrapper}>
            <ChordSlot
              slot={slot}
              onClickSlot={(id) => setPickerSlotId(id)}
              onLock={toggleSlotLock}
              onRandomize={handleRandomizeSlot}
              onRemove={removeSlot}
            />
            {pickerSlotId === slot.id && (
              <ChordSlotPicker
                rootName={selectedRoot}
                mode={selectedMode}
                onSelect={handlePickerSelect}
                onClose={() => setPickerSlotId(null)}
              />
            )}
          </div>
        ))}
        <button className={styles.addSlotBtn} onClick={addSlot} title="Add chord slot">
          +
        </button>
      </div>
    </div>
  )
}
