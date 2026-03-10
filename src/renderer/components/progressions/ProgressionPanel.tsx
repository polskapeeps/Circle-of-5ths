import { useMemo } from 'react'
import { useIdeaStore } from '../../stores/useIdeaStore'
import { useKeyStore } from '../../stores/useKeyStore'
import { useProgressionStore } from '../../stores/useProgressionStore'
import { useChordStore } from '../../stores/useChordStore'
import { Badge } from '../shared/Badge'
import { ProgressionCard } from './ProgressionCard'
import { getResolvedProgressions } from '../../engine/recommendationEngine'
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
  const complexityRange = useProgressionStore((state) => state.complexityRange)
  const selectedProgressionId = useProgressionStore((state) => state.selectedProgressionId)
  const toggleGenre = useProgressionStore((state) => state.toggleGenre)
  const toggleMood = useProgressionStore((state) => state.toggleMood)
  const setComplexityRange = useProgressionStore((state) => state.setComplexityRange)
  const setSelectedProgression = useProgressionStore((state) => state.setSelectedProgression)
  const clearFilters = useProgressionStore((state) => state.clearFilters)
  const setSelectedIdea = useIdeaStore((state) => state.setSelectedIdea)
  const setSelectedChord = useChordStore((state) => state.setSelectedChord)

  const filtered = useMemo(
    () =>
      getResolvedProgressions(selectedRoot, selectedMode, {
        genres: selectedGenres,
        moods: selectedMoods,
        complexityRange,
      }),
    [complexityRange, selectedGenres, selectedMoods, selectedMode, selectedRoot]
  )

  const hasFilters =
    selectedGenres.length > 0 ||
    selectedMoods.length > 0 ||
    complexityRange[0] !== 1 ||
    complexityRange[1] !== 5

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Progressions</h3>
          <span className={styles.context}>{selectedRoot} {selectedMode}</span>
        </div>
        <div className={styles.headerMeta}>
          <span className={styles.count}>{filtered.length}</span>
          {hasFilters && (
            <button className={styles.clearBtn} onClick={clearFilters}>Clear</button>
          )}
        </div>
      </div>

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

      <div className={styles.list}>
        {filtered.map((progression) => (
          <ProgressionCard
            key={progression.progression.id}
            progression={progression}
            isSelected={selectedProgressionId === progression.progression.id}
            onClick={() => {
              setSelectedIdea(null)
              setSelectedChord(null)
              setSelectedProgression(
                selectedProgressionId === progression.progression.id ? null : progression.progression.id
              )
            }}
          />
        ))}
        {filtered.length === 0 && (
          <div className={styles.empty}>No progressions match these filters.</div>
        )}
      </div>
    </div>
  )
}
