export type PitchClass = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11

export interface Note {
  name: string
  pitchClass: PitchClass
  octave?: number
  midi?: number
}

export interface Interval {
  semitones: number
  name: string
  shortName: string
}

export type ChordQuality =
  | 'major' | 'minor' | 'diminished' | 'augmented'
  | 'dominant7' | 'major7' | 'minor7' | 'minorMajor7'
  | 'half-diminished' | 'diminished7'
  | 'dominant9' | 'major9' | 'minor9'
  | 'dominant11' | 'minor11'
  | 'dominant13' | 'major13' | 'minor13'
  | 'sus2' | 'sus4' | 'add9' | 'add11'
  | '7sharp9' | '7flat9' | '7sharp11' | '7alt'

export type ChordCategory = 'triad' | 'seventh' | 'extended' | 'altered' | 'sus'

export interface ChordType {
  quality: ChordQuality
  symbol: string
  intervals: number[]
  category: ChordCategory
  description: string
}

export interface Chord {
  root: Note
  type: ChordType
  notes: Note[]
  romanNumeral?: string
  function?: ChordFunction
}

export type ChordFunction =
  | 'tonic' | 'subdominant' | 'dominant'
  | 'secondary-dominant' | 'borrowed' | 'substitute'
  | 'passing' | 'chromatic-mediant'

export type Mode = 'major' | 'minor' | 'dorian' | 'mixolydian' | 'lydian' | 'phrygian' | 'locrian'

export interface Key {
  root: Note
  mode: Mode
  signature: number
  diatonicChords: DiatonicChord[]
  relativeKey: string
  parallelKey: string
}

export interface DiatonicChord {
  degree: 1 | 2 | 3 | 4 | 5 | 6 | 7
  romanNumeral: string
  chord: Chord
  seventh?: Chord
  extensions?: Chord[]
}

export type Genre =
  | 'pop' | 'rock' | 'jazz' | 'neo-soul' | 'r&b'
  | 'lo-fi' | 'trap' | 'edm' | 'classical'
  | 'gospel' | 'blues' | 'funk' | 'latin'

export type Mood =
  | 'happy' | 'sad' | 'dreamy' | 'dark'
  | 'uplifting' | 'mysterious' | 'aggressive'
  | 'nostalgic' | 'ethereal' | 'groovy'

export interface Progression {
  id: string
  name: string
  numerals: string[]
  genre: Genre[]
  mood: Mood[]
  complexity: 1 | 2 | 3 | 4 | 5
  description: string
  famousExamples?: string[]
  tags: string[]
}

export interface Voicing {
  name: string
  notes: Note[]
  style: 'jazz' | 'pop' | 'classical' | 'neo-soul' | 'gospel'
  hand: 'left' | 'right' | 'both'
}

export type SequenceRole = 'diatonic' | 'borrowed' | 'secondary' | 'chromatic'

export interface ResolvedChordStep {
  numeral: string
  chord: Chord
  role: SequenceRole
  durationBeats: number
}

export interface ResolvedProgression {
  progression: Progression
  keyName: string
  chords: ResolvedChordStep[]
  score: number
  matchReasons: string[]
  noteCoverage: {
    selected: string[]
    matched: string[]
    missing: string[]
  }
  scaleFit: {
    inScaleChordTones: number
    totalChordTones: number
    ratio: number
    isFullyDiatonic: boolean
  }
}

export interface ProductionIdea {
  id: string
  title: string
  category: 'palette' | 'cadence' | 'movement'
  summary: string
  numerals: string[]
  tags: string[]
  chords: ResolvedChordStep[]
}
