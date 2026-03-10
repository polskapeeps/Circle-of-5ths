import { PROGRESSIONS } from '../data/progressions'
import { resolveChordStep, resolveProgression, progressionTension } from './progressionResolver'
import { getScaleNotes } from './noteUtils'
import { SCALE_INTERVALS } from '../data/scales'
import type {
  Genre,
  Mode,
  Mood,
  ProductionIdea,
  Progression,
  ResolvedProgression,
} from '../types/music'

interface ProgressionFilters {
  genres?: Genre[]
  moods?: Mood[]
  complexityRange?: [number, number]
}

function getModeScale(mode: Mode) {
  return SCALE_INTERVALS[mode] ?? SCALE_INTERVALS.major
}

function scoreProgression(
  progression: Progression,
  mode: Mode,
  genres: Genre[],
  moods: Mood[]
): { score: number; reasons: string[] } {
  let score = 0
  const reasons: string[] = []

  const genreHits = progression.genre.filter((genre) => genres.includes(genre))
  if (genreHits.length > 0) {
    score += genreHits.length * 14
    reasons.push(`Fits ${genreHits.join(', ')}`)
  }

  const moodHits = progression.mood.filter((mood) => moods.includes(mood))
  if (moodHits.length > 0) {
    score += moodHits.length * 10
    reasons.push(`Leans ${moodHits.join(', ')}`)
  }

  const lowerJoined = progression.numerals.join(' ')
  const likelyMinor = /(^| )(i|iv|v|bVI|bIII|bVII)/.test(lowerJoined)
  const likelyMajor = /(^| )(I|IV|V|vi|ii)/.test(lowerJoined)

  if (mode === 'minor' && likelyMinor) {
    score += 12
    reasons.push('Natural fit for minor writing')
  } else if (mode === 'major' && likelyMajor) {
    score += 12
    reasons.push('Natural fit for major writing')
  }

  if (progression.complexity <= 2) {
    score += 4
    reasons.push('Fast to sketch')
  } else if (progression.complexity >= 4) {
    score += 3
    reasons.push('Adds richer movement')
  }

  return { score, reasons }
}

export function getResolvedProgressions(
  rootName: string,
  mode: Mode,
  filters: ProgressionFilters = {}
): ResolvedProgression[] {
  const genres = filters.genres ?? []
  const moods = filters.moods ?? []
  const range = filters.complexityRange ?? [1, 5]

  return PROGRESSIONS
    .filter((progression) => {
      if (genres.length > 0 && !progression.genre.some((genre) => genres.includes(genre))) return false
      if (moods.length > 0 && !progression.mood.some((mood) => moods.includes(mood))) return false
      return progression.complexity >= range[0] && progression.complexity <= range[1]
    })
    .map((progression) => {
      const resolved = resolveProgression(rootName, mode, progression)
      const { score, reasons } = scoreProgression(progression, mode, genres, moods)
      const tension = progressionTension(resolved.chords)

      return {
        ...resolved,
        score: score + tension,
        matchReasons: [...reasons, tension >= 8 ? 'Harmonic spice' : 'Balanced motion'],
      }
    })
    .sort((left, right) => right.score - left.score)
}

export function getProductionIdeas(rootName: string, mode: Mode): ProductionIdea[] {
  const isMinor = mode === 'minor'
  const templates = isMinor
    ? [
        {
          id: 'minor-palette',
          title: 'Dark palette',
          category: 'palette' as const,
          summary: 'Natural-minor pull with cinematic lift on the way back to the tonic.',
          numerals: ['i7', 'bVImaj7', 'iv9', 'V7'],
          tags: ['minor', 'cinematic', '808-ready'],
        },
        {
          id: 'minor-cadence',
          title: 'Minor resolve',
          category: 'cadence' as const,
          summary: 'Classic minor ii-V-i for a tighter hook or bridge landing.',
          numerals: ['ii7b5', 'V7b9', 'i9'],
          tags: ['jazz', 'cadence', 'tension'],
        },
        {
          id: 'minor-movement',
          title: 'Trap descent',
          category: 'movement' as const,
          summary: 'A descending loop that keeps the top line memorable and simple.',
          numerals: ['i', 'bVII', 'bVI', 'V'],
          tags: ['trap', 'descending', 'loop'],
        },
      ]
    : [
        {
          id: 'major-palette',
          title: 'Lush palette',
          category: 'palette' as const,
          summary: 'A quick neo-soul color set that still feels singable.',
          numerals: ['Imaj9', 'iii7', 'vi9', 'IVmaj7'],
          tags: ['neo-soul', 'warm', 'stacked'],
        },
        {
          id: 'major-cadence',
          title: 'Borrowed lift',
          category: 'cadence' as const,
          summary: 'The borrowed iv move adds instant emotion before you come home.',
          numerals: ['Imaj7', 'IVmaj7', 'iv7', 'I'],
          tags: ['borrowed', 'gospel', 'hook'],
        },
        {
          id: 'major-movement',
          title: 'Pop engine',
          category: 'movement' as const,
          summary: 'A reliable top-line loop with a strong pre-chorus launch.',
          numerals: ['I', 'V/vi', 'vi', 'IV'],
          tags: ['pop', 'anthem', 'lift'],
        },
      ]

  return templates.map((template) => ({
    ...template,
    chords: template.numerals.map((numeral) => resolveChordStep(rootName, mode, numeral)),
  }))
}

export function getScaleFormula(rootName: string, mode: Mode) {
  return getScaleNotes(rootName, getModeScale(mode), mode === 'minor' ? `${rootName}m` : rootName)
}
