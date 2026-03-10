import type { Note, PitchClass } from '../types/music'

export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const
export const FLAT_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'] as const

export const ENHARMONIC_MAP: Record<string, string> = {
  'C#': 'Db', 'Db': 'C#',
  'D#': 'Eb', 'Eb': 'D#',
  'F#': 'Gb', 'Gb': 'F#',
  'G#': 'Ab', 'Ab': 'G#',
  'A#': 'Bb', 'Bb': 'A#',
}

export function noteToPitchClass(name: string): PitchClass {
  const sharpIndex = NOTE_NAMES.indexOf(name as typeof NOTE_NAMES[number])
  if (sharpIndex >= 0) return sharpIndex as PitchClass
  const flatIndex = FLAT_NAMES.indexOf(name as typeof FLAT_NAMES[number])
  if (flatIndex >= 0) return flatIndex as PitchClass
  throw new Error(`Unknown note: ${name}`)
}

export function makeNote(name: string, octave?: number): Note {
  const pitchClass = noteToPitchClass(name)
  return {
    name,
    pitchClass,
    octave,
    midi: octave !== undefined ? pitchClass + (octave + 1) * 12 : undefined
  }
}

// Circle of Fifths order (clockwise from top)
export const CIRCLE_MAJOR_KEYS = ['C', 'G', 'D', 'A', 'E', 'B', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F'] as const
export const CIRCLE_MINOR_KEYS = ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'Ebm', 'Bbm', 'Fm', 'Cm', 'Gm', 'Dm'] as const

// Key signature: number of sharps (positive) or flats (negative)
export const KEY_SIGNATURES: Record<string, number> = {
  'C': 0, 'G': 1, 'D': 2, 'A': 3, 'E': 4, 'B': 5, 'Gb': -6, 'Db': -5, 'Ab': -4, 'Eb': -3, 'Bb': -2, 'F': -1,
  'Am': 0, 'Em': 1, 'Bm': 2, 'F#m': 3, 'C#m': 4, 'G#m': 5, 'Ebm': -6, 'Bbm': -5, 'Fm': -4, 'Cm': -3, 'Gm': -2, 'Dm': -1,
}

// Map of key colors for the circle visualization
export const KEY_COLORS: Record<string, string> = {
  'C': 'var(--key-c)',
  'G': 'var(--key-g)',
  'D': 'var(--key-d)',
  'A': 'var(--key-a)',
  'E': 'var(--key-e)',
  'B': 'var(--key-b)',
  'Gb': 'var(--key-fs)',
  'Db': 'var(--key-db)',
  'Ab': 'var(--key-ab)',
  'Eb': 'var(--key-eb)',
  'Bb': 'var(--key-bb)',
  'F': 'var(--key-f)',
}

// Relative minor for each major key
export const RELATIVE_MINOR: Record<string, string> = {
  'C': 'Am', 'G': 'Em', 'D': 'Bm', 'A': 'F#m', 'E': 'C#m', 'B': 'G#m',
  'Gb': 'Ebm', 'Db': 'Bbm', 'Ab': 'Fm', 'Eb': 'Cm', 'Bb': 'Gm', 'F': 'Dm',
}

export const RELATIVE_MAJOR: Record<string, string> = Object.fromEntries(
  Object.entries(RELATIVE_MINOR).map(([maj, min]) => [min, maj])
)
