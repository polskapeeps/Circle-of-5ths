import { useMemo } from 'react'
import { PROGRESSIONS } from '../../data/progressions'
import { useProgressionStore } from '../../stores/useProgressionStore'
import { Badge } from '../shared/Badge'
import { ProgressionCard } from './ProgressionCard'
import type { Genre, Mood } from '../../types/music'
import styles from './ProgressionPanel.module.css'

const ALL_GENRES: Genre[] = ['pop', 'rock', 'jazz', 'neo-soul', 'r&b', 'lo-fi', 'trap', 'edm', 'blues', 'gospel', 'funk', 'latin', 'classical']
const ALL_MOODS: Mood[] = ['happy', 'sad', 'dreamy', 'dark', 'uplifting', 'mysterious', 'aggressive', 'nostalgic', 'ethereal', 'groovy']

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
  const selectedGenres = useProgressionStore((s) => s.selectedGenres)
  const selectedMoods = useProgressionStore((s) => s.selectedMoods)
  const selectedProgressionId = useProgressionStore((s) => s.selectedProgressionId)
  const toggleGenre = useProgressionStore((s) => s.toggleGenre)
  const toggleMood = useProgressionStore((s) => s.toggleMood)
  const setSelectedProgression = useProgressionStore((s) => s.setSelectedProgression)
  const clearFilters = useProgressionStore((s) => s.clearFilters)

  const filtered = useMemo(() => {
    return PROGRESSIONS.filter((p) => {
      if (selectedGenres.length > 0 && !p.genre.some((g) => selectedGenres.includes(g))) return false
      if (selectedMoods.length > 0 && !p.mood.some((m) => selectedMoods.includes(m))) return false
      return true
    })
  }, [selectedGenres, selectedMoods])

  const hasFilters = selectedGenres.length > 0 || selectedMoods.length > 0

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>Progressions</h3>
        <span className={styles.count}>{filtered.length}</span>
        {hasFilters && (
          <button className={styles.clearBtn} onClick={clearFilters}>Clear</button>
        )}
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Genre</span>
          <div className={styles.filterPills}>
            {ALL_GENRES.map((g) => (
              <Badge
                key={g}
                label={g}
                active={selectedGenres.includes(g)}
                color={GENRE_COLORS[g]}
                onClick={() => toggleGenre(g)}
              />
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Mood</span>
          <div className={styles.filterPills}>
            {ALL_MOODS.map((m) => (
              <Badge
                key={m}
                label={m}
                active={selectedMoods.includes(m)}
                onClick={() => toggleMood(m)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.list}>
        {filtered.map((p) => (
          <ProgressionCard
            key={p.id}
            progression={p}
            isSelected={selectedProgressionId === p.id}
            onClick={() =>
              setSelectedProgression(selectedProgressionId === p.id ? null : p.id)
            }
          />
        ))}
        {filtered.length === 0 && (
          <div className={styles.empty}>No progressions match these filters</div>
        )}
      </div>
    </div>
  )
}
