import { NOTE_NAMES, FLAT_NAMES, noteToPitchClass, makeNote } from '../data/notes'
import type { Note, PitchClass } from '../types/music'

// Preferred spelling for keys that use flats
const FLAT_KEYS = new Set(['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Dm', 'Gm', 'Cm', 'Fm', 'Bbm', 'Ebm'])

export function transposeNote(note: Note, semitones: number): Note {
  const newPitchClass = ((note.pitchClass + semitones) % 12 + 12) % 12 as PitchClass
  const name = NOTE_NAMES[newPitchClass]
  return makeNote(name, note.octave !== undefined ? note.octave + Math.floor((note.pitchClass + semitones) / 12) : undefined)
}

export function getScaleNotes(rootName: string, intervals: number[], keyContext?: string): Note[] {
  const useFlats = keyContext ? FLAT_KEYS.has(keyContext) : FLAT_KEYS.has(rootName)
  const rootPc = noteToPitchClass(rootName)
  const names = useFlats ? FLAT_NAMES : NOTE_NAMES

  return intervals.map((semitones) => {
    const pc = ((rootPc + semitones) % 12 + 12) % 12 as PitchClass
    return makeNote(names[pc])
  })
}

export function getNoteName(pitchClass: PitchClass, useFlats: boolean): string {
  return useFlats ? FLAT_NAMES[pitchClass] : NOTE_NAMES[pitchClass]
}

export function pitchClassDistance(from: PitchClass, to: PitchClass): number {
  return ((to - from) % 12 + 12) % 12
}
