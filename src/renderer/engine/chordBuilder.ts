import { CHORD_TYPES } from '../data/chords'
import { noteToPitchClass, makeNote, NOTE_NAMES, FLAT_NAMES } from '../data/notes'
import type { Chord, ChordFunction, Note, PitchClass } from '../types/music'

const FLAT_ROOTS = new Set(['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'])

export function buildChord(
  rootName: string,
  qualityKey: string,
  romanNumeral?: string,
  chordFunction?: ChordFunction
): Chord {
  const chordType = CHORD_TYPES[qualityKey]
  if (!chordType) throw new Error(`Unknown chord quality: ${qualityKey}`)

  const rootPc = noteToPitchClass(rootName)
  const useFlats = FLAT_ROOTS.has(rootName)
  const names = useFlats ? FLAT_NAMES : NOTE_NAMES
  const root = makeNote(rootName)

  const notes: Note[] = chordType.intervals.map((semitones) => {
    const pc = ((rootPc + semitones) % 12 + 12) % 12 as PitchClass
    return makeNote(names[pc])
  })

  return {
    root,
    type: chordType,
    notes,
    romanNumeral,
    function: chordFunction,
  }
}

export function chordToString(chord: Chord): string {
  return `${chord.root.name}${chord.type.symbol}`
}

export function chordNotesToString(chord: Chord): string {
  return chord.notes.map((n) => n.name).join(' - ')
}
