import { useEffect, useMemo, useState } from 'react'
import { useIdeaStore } from '../../stores/useIdeaStore'
import { useKeyStore } from '../../stores/useKeyStore'
import { useProgressionStore } from '../../stores/useProgressionStore'
import { useChordStore } from '../../stores/useChordStore'
import { Badge } from '../shared/Badge'
import { ProgressionCard } from './ProgressionCard'
import { getResolvedProgressions, getScaleFormula } from '../../engine/recommendationEngine'
import { analyzeKey, getKeyDisplayName } from '../../engine/keyAnalyzer'
import { chordToString } from '../../engine/chordBuilder'
import type { Genre, Mood } from '../../types/music'
import styles from './ProgressionPanel.module.css'

const ALL_GENRES: Genre[] = ['pop', 'rock', 'jazz', 'neo-soul', 'r&b', 'lo-fi', 'trap', 'edm', 'blues', 'gospel', 'funk', 'latin', 'classical']
const ALL_MOODS: Mood[] = ['happy', 'sad', 'dreamy', 'dark', 'uplifting', 'mysterious', 'aggressive', 'nostalgic', 'ethereal', 'groovy']
const COMPLEXITY_OPTIONS = [1, 2, 3, 4, 5] as const

const GENRE_COLORS: Partial<Record<Genre, string>> = {
  'pop': '#6366f1',
  'rock': '#ef4444',
  'jazz': '#f59e0b',
  'neo-soul': '#a855f7',
  'r&b': '#ec4899',
  'lo-fi': '#22d3ee',
  'trap': '#64748b',
  'edm': '#10b981',
  'blues': '#3b82f6',
  'gospel': '#f97316',
  'funk': '#eab308',
  'latin': '#14b8a6',
  'classical': '#8b5cf6',
}

export function ProgressionPanel() {
  const selectedRoot = useKeyStore((state) => state.selectedRoot)
  const selectedMode = useKeyStore((state) => state.selectedMode)
  const selectedGenres = useProgressionStore((state) => state.selectedGenres)
  const selectedMoods = useProgressionStore((state) => state.selectedMoods)
  const selectedNotes = useProgressionStore((state) => state.selectedNotes)
  const complexityRange = useProgressionStore((state) => state.complexityRange)
  const selectedProgressionId = useProgressionStore((state) => state.selectedProgressionId)
  const toggleGenre = useProgressionStore((state) => state.toggleGenre)
  const toggleMood = useProgressionStore((state) => state.toggleMood)
  const toggleNote = useProgressionStore((state) => state.toggleNote)
  const setComplexityRange = useProgressionStore((state) => state.setComplexityRange)
  const setSelectedProgression = useProgressionStore((state) => state.setSelectedProgression)
  const clearFilters = useProgressionStore((state) => state.clearFilters)
  const setSelectedIdea = useIdeaStore((state) => state.setSelectedIdea)
  const selectedChord = useChordStore((state) => state.selectedChord)
  const setSelectedChord = useChordStore((state) => state.setSelectedChord)
  const [featuredProgressionId, setFeaturedProgressionId] = useState<string | null>(null)

  const scaleNotes = useMemo(
    () => getScaleFormula(selectedRoot, selectedMode),
    [selectedMode, selectedRoot]
  )

  const keySummary = useMemo(
    () => analyzeKey(selectedRoot, selectedMode),
    [selectedMode, selectedRoot]
  )

  const filtered = useMemo(
    () =>
      getResolvedProgressions(selectedRoot, selectedMode, {
        genres: selectedGenres,
        moods: selectedMoods,
        selectedNotes,
        complexityRange,
      }),
    [complexityRange, selectedGenres, selectedMoods, selectedMode, selectedNotes, selectedRoot]
  )

  useEffect(() => {
    if (filtered.length === 0) {
      setFeaturedProgressionId(null)
      return
    }

    if (!featuredProgressionId || !filtered.some((progression) => progression.progression.id === featuredProgressionId)) {
      setFeaturedProgressionId(filtered[0].progression.id)
    }
  }, [featuredProgressionId, filtered])

  const featuredProgression = filtered.find((progression) => progression.progression.id === featuredProgressionId) ?? filtered[0] ?? null

  const hasFilters =
    selectedNotes.length > 0 ||
    selectedGenres.length > 0 ||
    selectedMoods.length > 0 ||
    complexityRange[0] !== 1 ||
    complexityRange[1] !== 5

  const displayName = getKeyDisplayName(selectedRoot, selectedMode)

  function handleRandomize() {
    if (filtered.length === 0) return

    const pool = featuredProgression
      ? filtered.filter((progression) => progression.progression.id !== featuredProgression.progression.id)
      : filtered
    const source = pool.length > 0 ? pool : filtered
    const next = source[Math.floor(Math.random() * source.length)]

    setFeaturedProgressionId(next.progression.id)
    setSelectedIdea(null)
    setSelectedChord(null)
    setSelectedProgression(next.progression.id)
  }

  return (
    <div className={styles.panel}>
      <div className={styles.hero}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>Progression Studio</h3>
            <span className={styles.context}>{displayName}</span>
          </div>
          <div className={styles.headerMeta}>
            <span className={styles.count}>{filtered.length} matches</span>
            {hasFilters && (
              <button className={styles.clearBtn} onClick={clearFilters}>Reset</button>
            )}
          </div>
        </div>
        <p className={styles.heroCopy}>
          Lock scale notes, scan the diatonic chord map, and pull a random progression that still fits the key center you selected.
        </p>
        <div className={styles.actionRow}>
          <button className={styles.randomBtn} onClick={handleRandomize} disabled={filtered.length === 0}>
            Randomize Progression
          </button>
          <span className={styles.selectionMeta}>
            {selectedNotes.length > 0 ? `${selectedNotes.length} locked note${selectedNotes.length > 1 ? 's' : ''}` : 'No note locks'}
          </span>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.filterLabel}>Scale Note Focus</span>
          <span className={styles.helperText}>Select notes you want the progression to feature.</span>
        </div>
        <div className={styles.noteGrid}>
          {scaleNotes.map((note) => (
            <button
              key={note.name}
              className={styles.noteChip}
              data-active={selectedNotes.includes(note.name)}
              onClick={() => toggleNote(note.name)}
            >
              {note.name}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.filterLabel}>Chord Map</span>
          <span className={styles.helperText}>Jump straight from the key to its most useful chord colors.</span>
        </div>
        <div className={styles.chordGrid}>
          {keySummary.diatonicChords.map((diatonicChord) => {
            const displayChord = diatonicChord.seventh ?? diatonicChord.chord
            const chordId = chordToString(displayChord)
            const isSelected = selectedChord === chordId

            return (
              <button
                key={diatonicChord.degree}
                className={styles.chordChip}
                data-active={isSelected}
                onClick={() => {
                  setSelectedIdea(null)
                  setSelectedProgression(null)
                  setSelectedChord(isSelected ? null : chordId)
                }}
              >
                <span className={styles.chordNumeral}>{displayChord.romanNumeral}</span>
                <span className={styles.chordName}>{chordId}</span>
              </button>
            )
          })}
        </div>
      </section>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Genre</span>
          <div className={styles.filterPills}>
            {ALL_GENRES.map((genre) => (
              <Badge
                key={genre}
                label={genre}
                active={selectedGenres.includes(genre)}
                color={GENRE_COLORS[genre]}
                onClick={() => toggleGenre(genre)}
              />
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Mood</span>
          <div className={styles.filterPills}>
            {ALL_MOODS.map((mood) => (
              <Badge
                key={mood}
                label={mood}
                active={selectedMoods.includes(mood)}
                onClick={() => toggleMood(mood)}
              />
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Complexity</span>
          <div className={styles.filterPills}>
            {COMPLEXITY_OPTIONS.map((level) => (
              <Badge
                key={level}
                label={`${level}`}
                active={level >= complexityRange[0] && level <= complexityRange[1]}
                onClick={() => setComplexityRange([1, level])}
              />
            ))}
          </div>
        </div>
      </div>

      {featuredProgression && (
        <section className={styles.featuredCard}>
          <div className={styles.featuredHeader}>
            <div>
              <span className={styles.featuredLabel}>Featured pick</span>
              <strong className={styles.featuredTitle}>{featuredProgression.progression.name}</strong>
            </div>
            <button
              className={styles.previewBtn}
              onClick={() => {
                setSelectedIdea(null)
                setSelectedChord(null)
                setSelectedProgression(featuredProgression.progression.id)
              }}
            >
              Preview
            </button>
          </div>
          <span className={styles.featuredLine}>
            {featuredProgression.progression.numerals.join(' -> ')}
          </span>
          <span className={styles.featuredCopy}>
            {featuredProgression.noteCoverage.matched.length > 0
              ? `Selected note match: ${featuredProgression.noteCoverage.matched.join(', ')}`
              : featuredProgression.scaleFit.isFullyDiatonic
                ? 'Everything stays inside the selected scale.'
                : 'Includes a few borrowed tones for extra motion.'}
          </span>
        </section>
      )}

      <div className={styles.list}>
        {filtered.map((progression) => (
          <ProgressionCard
            key={progression.progression.id}
            progression={progression}
            isSelected={selectedProgressionId === progression.progression.id}
            onClick={() => {
              setSelectedIdea(null)
              setSelectedChord(null)
              setFeaturedProgressionId(progression.progression.id)
              setSelectedProgression(
                selectedProgressionId === progression.progression.id ? null : progression.progression.id
              )
            }}
          />
        ))}
        {filtered.length === 0 && (
          <div className={styles.empty}>No progressions match this key and note focus yet.</div>
        )}
      </div>
    </div>
  )
}
