import { useMemo } from 'react'
import { clsx } from 'clsx'
import { useChordStore } from '../../stores/useChordStore'
import { useIdeaStore } from '../../stores/useIdeaStore'
import { useKeyStore } from '../../stores/useKeyStore'
import { useProgressionStore } from '../../stores/useProgressionStore'
import { useBuilderStore } from '../../stores/useBuilderStore'
import { getProductionIdeas, getScaleFormula } from '../../engine/recommendationEngine'
import { sequenceToChordNames } from '../../engine/progressionResolver'
import styles from './ProductionInsights.module.css'

export function ProductionInsights() {
  const selectedRoot = useKeyStore((state) => state.selectedRoot)
  const selectedMode = useKeyStore((state) => state.selectedMode)
  const selectedIdeaId = useIdeaStore((state) => state.selectedIdeaId)
  const setSelectedIdea = useIdeaStore((state) => state.setSelectedIdea)
  const setSelectedProgression = useProgressionStore((state) => state.setSelectedProgression)
  const setSelectedChord = useChordStore((state) => state.setSelectedChord)
  const loadProgression = useBuilderStore((state) => state.loadProgression)

  const scaleNotes = useMemo(
    () => getScaleFormula(selectedRoot, selectedMode),
    [selectedMode, selectedRoot]
  )

  const ideas = useMemo(
    () => getProductionIdeas(selectedRoot, selectedMode),
    [selectedMode, selectedRoot]
  )

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.title}>Quick ideas</h3>
        <span className={styles.subtitle}>Resolved for {selectedRoot} {selectedMode}</span>
      </div>

      <div className={styles.scalePanel}>
        <span className={styles.label}>Scale DNA</span>
        <div className={styles.noteRow}>
          {scaleNotes.map((note) => (
            <span key={note.name} className={styles.noteChip}>
              {note.name}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.ideaList}>
        {ideas.map((idea) => {
          const selected = selectedIdeaId === idea.id

          return (
            <button
              key={idea.id}
              className={clsx(styles.ideaCard, selected && styles.selected)}
              onClick={() => {
                setSelectedProgression(null)
                setSelectedChord(null)
                setSelectedIdea(selected ? null : idea.id)
                if (!selected) loadProgression(idea.chords)
              }}
            >
              <div className={styles.ideaHeader}>
                <span className={styles.ideaTitle}>{idea.title}</span>
                <span className={styles.ideaCategory}>{idea.category}</span>
              </div>
              <p className={styles.summary}>{idea.summary}</p>
              <div className={styles.line}>
                <span className={styles.label}>Numerals</span>
                <span className={styles.value}>{idea.numerals.join(' -> ')}</span>
              </div>
              <div className={styles.line}>
                <span className={styles.label}>Chords</span>
                <span className={styles.value}>{sequenceToChordNames(idea.chords).join(' -> ')}</span>
              </div>
              <div className={styles.tagRow}>
                {idea.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
