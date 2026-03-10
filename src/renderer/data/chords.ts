import type { ChordType } from '../types/music'

// Intervals as semitones from root
export const CHORD_TYPES: Record<string, ChordType> = {
  // Triads
  major: {
    quality: 'major', symbol: '', intervals: [0, 4, 7],
    category: 'triad', description: 'Bright, stable, resolved'
  },
  minor: {
    quality: 'minor', symbol: 'm', intervals: [0, 3, 7],
    category: 'triad', description: 'Dark, melancholic, introspective'
  },
  diminished: {
    quality: 'diminished', symbol: 'dim', intervals: [0, 3, 6],
    category: 'triad', description: 'Tense, unstable, wants to resolve'
  },
  augmented: {
    quality: 'augmented', symbol: 'aug', intervals: [0, 4, 8],
    category: 'triad', description: 'Mysterious, dreamy, suspended'
  },

  // Suspended
  sus2: {
    quality: 'sus2', symbol: 'sus2', intervals: [0, 2, 7],
    category: 'sus', description: 'Open, ambient, modern'
  },
  sus4: {
    quality: 'sus4', symbol: 'sus4', intervals: [0, 5, 7],
    category: 'sus', description: 'Suspended tension, wants to resolve to major'
  },

  // Seventh chords
  major7: {
    quality: 'major7', symbol: 'maj7', intervals: [0, 4, 7, 11],
    category: 'seventh', description: 'Lush, dreamy, sophisticated'
  },
  dominant7: {
    quality: 'dominant7', symbol: '7', intervals: [0, 4, 7, 10],
    category: 'seventh', description: 'Bluesy, driving, wants to resolve'
  },
  minor7: {
    quality: 'minor7', symbol: 'm7', intervals: [0, 3, 7, 10],
    category: 'seventh', description: 'Smooth, mellow, jazzy'
  },
  minorMajor7: {
    quality: 'minorMajor7', symbol: 'mMaj7', intervals: [0, 3, 7, 11],
    category: 'seventh', description: 'Dramatic, cinematic, James Bond'
  },
  'half-diminished': {
    quality: 'half-diminished', symbol: 'm7b5', intervals: [0, 3, 6, 10],
    category: 'seventh', description: 'Dark, yearning, jazzy tension'
  },
  diminished7: {
    quality: 'diminished7', symbol: 'dim7', intervals: [0, 3, 6, 9],
    category: 'seventh', description: 'Symmetrical, dramatic, passing chord'
  },

  // Extended chords
  major9: {
    quality: 'major9', symbol: 'maj9', intervals: [0, 4, 7, 11, 14],
    category: 'extended', description: 'Ethereal, neo-soul, lush'
  },
  dominant9: {
    quality: 'dominant9', symbol: '9', intervals: [0, 4, 7, 10, 14],
    category: 'extended', description: 'Funky, soulful, rich'
  },
  minor9: {
    quality: 'minor9', symbol: 'm9', intervals: [0, 3, 7, 10, 14],
    category: 'extended', description: 'Smooth, lo-fi, chill'
  },
  dominant11: {
    quality: 'dominant11', symbol: '11', intervals: [0, 4, 7, 10, 14, 17],
    category: 'extended', description: 'Open, suspended, complex'
  },
  minor11: {
    quality: 'minor11', symbol: 'm11', intervals: [0, 3, 7, 10, 14, 17],
    category: 'extended', description: 'Deep, atmospheric, lo-fi staple'
  },
  dominant13: {
    quality: 'dominant13', symbol: '13', intervals: [0, 4, 7, 10, 14, 17, 21],
    category: 'extended', description: 'Full, orchestral, sophisticated'
  },
  major13: {
    quality: 'major13', symbol: 'maj13', intervals: [0, 4, 7, 11, 14, 17, 21],
    category: 'extended', description: 'Lavish, wide, jazz ballad'
  },
  minor13: {
    quality: 'minor13', symbol: 'm13', intervals: [0, 3, 7, 10, 14, 17, 21],
    category: 'extended', description: 'Complex, expressive'
  },

  // Altered chords
  '7sharp9': {
    quality: '7sharp9', symbol: '7#9', intervals: [0, 4, 7, 10, 15],
    category: 'altered', description: 'Hendrix chord, gritty, electric'
  },
  '7flat9': {
    quality: '7flat9', symbol: '7b9', intervals: [0, 4, 7, 10, 13],
    category: 'altered', description: 'Dark dominant, jazz standard'
  },
  '7sharp11': {
    quality: '7sharp11', symbol: '7#11', intervals: [0, 4, 7, 10, 14, 18],
    category: 'altered', description: 'Lydian dominant, bright tension'
  },
  '7alt': {
    quality: '7alt', symbol: '7alt', intervals: [0, 4, 6, 10, 13],
    category: 'altered', description: 'Maximum tension, fully altered dominant'
  },

  // Add chords
  add9: {
    quality: 'add9', symbol: 'add9', intervals: [0, 4, 7, 14],
    category: 'sus', description: 'Pop sparkle, bright addition'
  },
  add11: {
    quality: 'add11', symbol: 'add11', intervals: [0, 4, 7, 17],
    category: 'sus', description: 'Open, modern pop'
  },
}

// Diatonic chord qualities for major scale degrees
export const MAJOR_DIATONIC_TRIADS = ['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished'] as const
export const MAJOR_DIATONIC_SEVENTHS = ['major7', 'minor7', 'minor7', 'major7', 'dominant7', 'minor7', 'half-diminished'] as const
export const MAJOR_ROMAN_NUMERALS = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii\u00B0'] as const

export const MINOR_DIATONIC_TRIADS = ['minor', 'diminished', 'major', 'minor', 'minor', 'major', 'major'] as const
export const MINOR_DIATONIC_SEVENTHS = ['minor7', 'half-diminished', 'major7', 'minor7', 'minor7', 'major7', 'dominant7'] as const
export const MINOR_ROMAN_NUMERALS = ['i', 'ii\u00B0', 'III', 'iv', 'v', 'VI', 'VII'] as const

// Chord function by scale degree (major key)
export const MAJOR_CHORD_FUNCTIONS = [
  'tonic', 'subdominant', 'tonic', 'subdominant', 'dominant', 'tonic', 'dominant'
] as const
