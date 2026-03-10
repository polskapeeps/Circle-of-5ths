import { SCALE_INTERVALS } from '../data/scales'
import {
  MAJOR_DIATONIC_TRIADS, MAJOR_DIATONIC_SEVENTHS, MAJOR_ROMAN_NUMERALS, MAJOR_CHORD_FUNCTIONS,
  MINOR_DIATONIC_TRIADS, MINOR_DIATONIC_SEVENTHS, MINOR_ROMAN_NUMERALS
} from '../data/chords'
import { RELATIVE_MINOR, RELATIVE_MAJOR, KEY_SIGNATURES } from '../data/notes'
import { getScaleNotes } from './noteUtils'
import { buildChord } from './chordBuilder'
import type { DiatonicChord, Key, Mode, Note, ChordFunction } from '../types/music'

export function analyzeKey(rootName: string, mode: Mode): Key {
  const scaleKey = mode === 'minor' ? 'minor' : 'major'
  const intervals = SCALE_INTERVALS[scaleKey]
  const scaleNotes = getScaleNotes(rootName, intervals, rootName)

  const isMajor = mode === 'major'
  const triadQualities = isMajor ? MAJOR_DIATONIC_TRIADS : MINOR_DIATONIC_TRIADS
  const seventhQualities = isMajor ? MAJOR_DIATONIC_SEVENTHS : MINOR_DIATONIC_SEVENTHS
  const romanNumerals = isMajor ? MAJOR_ROMAN_NUMERALS : MINOR_ROMAN_NUMERALS
  const chordFunctions = isMajor
    ? MAJOR_CHORD_FUNCTIONS
    : ['tonic', 'subdominant', 'tonic', 'subdominant', 'dominant', 'subdominant', 'dominant'] as const

  const diatonicChords: DiatonicChord[] = scaleNotes.map((note, i) => {
    const degree = (i + 1) as DiatonicChord['degree']
    const fn = chordFunctions[i] as ChordFunction
    const triad = buildChord(note.name, triadQualities[i], romanNumerals[i], fn)
    const seventh = buildChord(note.name, seventhQualities[i], romanNumerals[i] + '7', fn)

    return { degree, romanNumeral: romanNumerals[i], chord: triad, seventh }
  })

  const keyLabel = rootName + (mode === 'minor' ? 'm' : '')
  const relativeKey = isMajor
    ? (RELATIVE_MINOR[rootName] || '')
    : (RELATIVE_MAJOR[rootName + 'm'] || '')
  const parallelKey = isMajor
    ? rootName + 'm'
    : rootName

  return {
    root: scaleNotes[0],
    mode,
    signature: KEY_SIGNATURES[keyLabel] ?? 0,
    diatonicChords,
    relativeKey,
    parallelKey,
  }
}

export function getKeyDisplayName(rootName: string, mode: Mode): string {
  return `${rootName} ${mode.charAt(0).toUpperCase() + mode.slice(1)}`
}
