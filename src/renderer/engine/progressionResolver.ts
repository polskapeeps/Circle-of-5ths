import { CHORD_TYPES, MAJOR_DIATONIC_TRIADS, MINOR_DIATONIC_TRIADS } from '../data/chords'
import { buildChord } from './chordBuilder'
import { getPitchClassName, keyPrefersFlats } from './noteUtils'
import { noteToPitchClass } from '../data/notes'
import type {
  Chord,
  ChordQuality,
  Mode,
  Progression,
  ResolvedChordStep,
  ResolvedProgression,
  SequenceRole,
} from '../types/music'

const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11]
const MINOR_SCALE_INTERVALS = [0, 2, 3, 5, 7, 8, 10]

const DEGREE_MAP: Record<string, number> = {
  I: 1,
  II: 2,
  III: 3,
  IV: 4,
  V: 5,
  VI: 6,
  VII: 7,
}

interface ParsedNumeral {
  accidentalOffset: number
  accidentalToken: string
  degree: number
  isMinorShape: boolean
  suffix: string
  raw: string
}

function normalizeNumeral(numeral: string): string {
  return numeral.replace(/Â/g, '').replace(/°/g, 'dim').replace(/\s+/g, '')
}

function parseNumeral(numeral: string): ParsedNumeral {
  const normalized = normalizeNumeral(numeral)
  const match = normalized.match(/^([b#]*)([ivIV]+)(.*)$/)

  if (!match) {
    throw new Error(`Unsupported numeral: ${numeral}`)
  }

  const [, accidentals, roman, suffix] = match
  const degree = DEGREE_MAP[roman.toUpperCase()]

  if (!degree) {
    throw new Error(`Unsupported scale degree: ${numeral}`)
  }

  const accidentalOffset = [...accidentals].reduce((sum, symbol) => sum + (symbol === '#' ? 1 : -1), 0)

  return {
    accidentalOffset,
    accidentalToken: accidentals,
    degree,
    isMinorShape: roman === roman.toLowerCase(),
    suffix,
    raw: numeral,
  }
}

function getDegreeInterval(parsed: ParsedNumeral, mode: Mode): number {
  const useMajorReference = parsed.accidentalToken.length > 0 || mode !== 'minor'
  const intervals = useMajorReference ? MAJOR_SCALE_INTERVALS : MINOR_SCALE_INTERVALS
  return intervals[parsed.degree - 1] + parsed.accidentalOffset
}

function getRole(parsed: ParsedNumeral, mode: Mode, isSecondary: boolean): SequenceRole {
  if (isSecondary) return 'secondary'
  if (parsed.accidentalToken.length === 0) return 'diatonic'
  if (mode === 'minor' && ['III', 'VI', 'VII'].includes(parsed.raw.toUpperCase())) return 'diatonic'
  return parsed.accidentalToken.includes('b') || parsed.accidentalToken.includes('#')
    ? 'borrowed'
    : 'chromatic'
}

function inferQuality(parsed: ParsedNumeral, mode: Mode): keyof typeof CHORD_TYPES {
  const normalizedSuffix = parsed.suffix.toLowerCase()

  if (normalizedSuffix === 'm7b5') return 'half-diminished'
  if (normalizedSuffix === '7b5' && parsed.isMinorShape) return 'half-diminished'
  if (normalizedSuffix === 'dim7') return 'diminished7'
  if (normalizedSuffix === 'dim') return 'diminished'
  if (normalizedSuffix === 'maj13') return 'major13'
  if (normalizedSuffix === 'maj9') return 'major9'
  if (normalizedSuffix === 'maj7') return 'major7'
  if (normalizedSuffix === 'm13') return 'minor13'
  if (normalizedSuffix === 'm11') return 'minor11'
  if (normalizedSuffix === 'm9') return 'minor9'
  if (normalizedSuffix === 'm7') return 'minor7'
  if (normalizedSuffix === 'm') return 'minor'
  if (normalizedSuffix === '13') return parsed.isMinorShape ? 'minor13' : 'dominant13'
  if (normalizedSuffix === '11') return parsed.isMinorShape ? 'minor11' : 'dominant11'
  if (normalizedSuffix === '9') return parsed.isMinorShape ? 'minor9' : 'dominant9'
  if (normalizedSuffix === '7b9') return '7flat9'
  if (normalizedSuffix === '7#9') return '7sharp9'
  if (normalizedSuffix === '7#11') return '7sharp11'
  if (normalizedSuffix === '7alt') return '7alt'
  if (normalizedSuffix === '7') return parsed.isMinorShape ? 'minor7' : 'dominant7'

  if (normalizedSuffix.length > 0) {
    return parsed.isMinorShape ? 'minor' : 'major'
  }

  if (mode === 'major' && parsed.accidentalToken.length === 0) {
    return MAJOR_DIATONIC_TRIADS[parsed.degree - 1]
  }

  if (mode === 'minor' && parsed.accidentalToken.length === 0) {
    return MINOR_DIATONIC_TRIADS[parsed.degree - 1]
  }

  return parsed.isMinorShape ? 'minor' : 'major'
}

function getSecondaryRootInterval(primary: ParsedNumeral, target: ParsedNumeral): number {
  const targetInterval = MAJOR_SCALE_INTERVALS[target.degree - 1] + target.accidentalOffset

  if (primary.degree === 5) return targetInterval + 7
  if (primary.degree === 7) return targetInterval - 1

  return targetInterval + MAJOR_SCALE_INTERVALS[primary.degree - 1]
}

function getAccidentalPreference(
  rootName: string,
  mode: Mode,
  parsed: ParsedNumeral,
  target?: ParsedNumeral
): 'flat' | 'sharp' | 'key' {
  if (parsed.accidentalToken.includes('b') || target?.accidentalToken.includes('b')) return 'flat'
  if (parsed.accidentalToken.includes('#') || target?.accidentalToken.includes('#')) return 'sharp'
  return keyPrefersFlats(rootName, mode) ? 'flat' : 'sharp'
}

function getRomanLabel(numeral: string, quality: ChordQuality): string {
  if (quality === 'major7') return `${numeral}maj7`
  if (quality === 'major9') return `${numeral}maj9`
  if (quality === 'major13') return `${numeral}maj13`
  if (quality === 'dominant7') return `${numeral}7`
  if (quality === 'dominant9') return `${numeral}9`
  if (quality === 'dominant11') return `${numeral}11`
  if (quality === 'dominant13') return `${numeral}13`
  if (quality === 'minor7') return `${numeral}7`
  if (quality === 'minor9') return `${numeral}9`
  if (quality === 'minor11') return `${numeral}11`
  if (quality === 'minor13') return `${numeral}13`
  if (quality === 'half-diminished') return `${numeral}7b5`
  if (quality === 'diminished7') return `${numeral}dim7`
  return numeral
}

export function resolveChordStep(rootName: string, mode: Mode, numeral: string): ResolvedChordStep {
  const [head, targetPart] = numeral.split('/')
  const parsed = parseNumeral(head)
  const target = targetPart ? parseNumeral(targetPart) : undefined
  const qualityKey = inferQuality(parsed, mode)
  const tonicPc = noteToPitchClass(rootName)
  const interval = target
    ? getSecondaryRootInterval(parsed, target)
    : getDegreeInterval(parsed, mode)
  const pitchClass = ((tonicPc + interval) % 12 + 12) % 12
  const preference = getAccidentalPreference(rootName, mode, parsed, target)
  const spelledRoot = getPitchClassName(pitchClass as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11, preference, rootName, mode)
  const chord = buildChord(spelledRoot, qualityKey, getRomanLabel(numeral, CHORD_TYPES[qualityKey].quality))

  return {
    numeral,
    chord,
    role: getRole(parsed, mode, Boolean(target)),
    durationBeats: 4,
  }
}

export function resolveProgression(rootName: string, mode: Mode, progression: Progression): ResolvedProgression {
  return {
    progression,
    keyName: `${rootName} ${mode}`,
    chords: progression.numerals.map((numeral) => resolveChordStep(rootName, mode, numeral)),
    score: 0,
    matchReasons: [],
  }
}

export function progressionTension(chords: ResolvedChordStep[]): number {
  return chords.reduce((sum, step) => {
    if (step.chord.type.category === 'altered') return sum + 3
    if (step.chord.type.category === 'extended') return sum + 2
    if (step.role === 'secondary' || step.role === 'borrowed') return sum + 2
    if (step.chord.type.category === 'seventh') return sum + 1
    return sum
  }, 0)
}

export function sequenceToChordNames(sequence: ResolvedChordStep[] | Chord[]): string[] {
  return sequence.map((entry) => {
    const chord = 'chord' in entry ? entry.chord : entry
    return `${chord.root.name}${chord.type.symbol}`
  })
}
