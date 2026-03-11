import { CHORD_TYPES, MAJOR_DIATONIC_TRIADS, MINOR_DIATONIC_TRIADS } from '../data/chords'
import { NOTE_NAMES, FLAT_NAMES, makeNote, noteToPitchClass } from '../data/notes'
import { SCALE_INTERVALS } from '../data/scales'
import { resolveChordStep } from './progressionResolver'
import { keyPrefersFlats } from './noteUtils'
import type { ChordCategory, Mode, Note, PitchClass, RandomOptions, ResolvedChordStep } from '../types/music'

const MAJOR_ROMAN = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii']
const MINOR_ROMAN = ['i', 'ii', 'III', 'iv', 'v', 'VI', 'VII']

const QUALITY_SUFFIXES: Record<ChordCategory, string[]> = {
  triad: [''],
  seventh: ['7'],
  extended: ['9', '11', '13'],
  altered: ['7#9', '7b9', '7#11', '7alt'],
  sus: ['sus2', 'sus4'],
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function buildNumeralString(degree: number, mode: Mode, category: ChordCategory): string {
  const romans = mode === 'minor' ? MINOR_ROMAN : MAJOR_ROMAN
  const base = romans[degree - 1]

  if (category === 'triad') return base

  const suffix = pickRandom(QUALITY_SUFFIXES[category])

  // For sus chords, use the major numeral form since sus replaces the third
  if (category === 'sus') {
    const majorBase = MAJOR_ROMAN[degree - 1]
    return `${majorBase}${suffix}`
  }

  return `${base}${suffix}`
}

export function randomChordInKey(
  rootName: string,
  mode: Mode,
  options: RandomOptions
): ResolvedChordStep {
  const degrees = options.allowedDegrees ?? [1, 2, 3, 4, 5, 6, 7]
  const degree = pickRandom(degrees)
  const category = pickRandom(options.chordCategories)

  if (options.constrainToScale) {
    const numeral = buildNumeralString(degree, mode, category)
    return resolveChordStep(rootName, mode, numeral)
  }

  // Chromatic: possibly flat/sharp a diatonic degree
  const accidentals = ['', '', '', 'b', '#'] // weighted toward no accidental
  const accidental = pickRandom(accidentals)
  const romans = mode === 'minor' ? MINOR_ROMAN : MAJOR_ROMAN
  const base = romans[degree - 1]
  const suffix = category === 'triad' ? '' : pickRandom(QUALITY_SUFFIXES[category])
  const numeral = `${accidental}${base}${suffix}`

  try {
    return resolveChordStep(rootName, mode, numeral)
  } catch {
    // Fallback to diatonic if chromatic numeral fails
    return resolveChordStep(rootName, mode, buildNumeralString(degree, mode, category))
  }
}

export function generateRandomProgression(
  rootName: string,
  mode: Mode,
  length: number,
  options: RandomOptions
): ResolvedChordStep[] {
  const steps: ResolvedChordStep[] = []

  for (let i = 0; i < length; i++) {
    let attempt = randomChordInKey(rootName, mode, options)
    // Avoid consecutive duplicate chords (try up to 3 times)
    let tries = 0
    while (
      tries < 3 &&
      steps.length > 0 &&
      attempt.numeral === steps[steps.length - 1].numeral
    ) {
      attempt = randomChordInKey(rootName, mode, options)
      tries++
    }
    steps.push(attempt)
  }

  return steps
}

export function randomNoteFromScale(rootName: string, mode: Mode): Note {
  const intervals = SCALE_INTERVALS[mode] ?? SCALE_INTERVALS.major
  const rootPc = noteToPitchClass(rootName)
  const useFlats = keyPrefersFlats(rootName, mode)
  const names = useFlats ? FLAT_NAMES : NOTE_NAMES

  const interval = pickRandom(intervals)
  const pc = ((rootPc + interval) % 12) as PitchClass
  return makeNote(names[pc])
}

export function randomNoteChromatically(): Note {
  const pc = Math.floor(Math.random() * 12) as PitchClass
  return makeNote(NOTE_NAMES[pc])
}
