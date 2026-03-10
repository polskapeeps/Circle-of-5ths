import type { Progression } from '../types/music'

export const PROGRESSIONS: Progression[] = [
  // ═══════════════════════ POP ═══════════════════════
  {
    id: 'pop-1', name: 'The Axis of Awesome',
    numerals: ['I', 'V', 'vi', 'IV'],
    genre: ['pop', 'rock'], mood: ['uplifting', 'happy'], complexity: 1,
    description: 'The most common progression in modern pop music',
    famousExamples: ["Don't Stop Believin'", 'Let It Be', 'No Woman No Cry', 'With or Without You'],
    tags: ['classic', 'anthem', 'singalong']
  },
  {
    id: 'pop-2', name: 'Sensitive Singer-Songwriter',
    numerals: ['vi', 'IV', 'I', 'V'],
    genre: ['pop'], mood: ['sad', 'nostalgic'], complexity: 1,
    description: 'Same chords as Axis but starting on the minor — darker feel',
    famousExamples: ['Someone Like You', 'Numb', 'Africa'],
    tags: ['emotional', 'ballad']
  },
  {
    id: 'pop-3', name: 'Classic Pop',
    numerals: ['I', 'IV', 'V', 'I'],
    genre: ['pop', 'rock'], mood: ['happy', 'uplifting'], complexity: 1,
    description: 'The foundational pop/rock progression',
    famousExamples: ['Twist and Shout', 'La Bamba', 'Wild Thing'],
    tags: ['classic', 'simple']
  },
  {
    id: 'pop-4', name: 'Pachelbel Pop',
    numerals: ['I', 'V', 'vi', 'iii', 'IV', 'I', 'IV', 'V'],
    genre: ['pop', 'classical'], mood: ['uplifting', 'nostalgic'], complexity: 2,
    description: 'Extended Pachelbel Canon progression',
    famousExamples: ['Canon in D', 'Basket Case', 'Cryin'],
    tags: ['classical', 'extended']
  },
  {
    id: 'pop-5', name: 'Modern Pop Anthem',
    numerals: ['I', 'iii', 'vi', 'IV'],
    genre: ['pop'], mood: ['dreamy', 'nostalgic'], complexity: 2,
    description: 'Replacing V with iii for a softer, more wistful feel',
    tags: ['modern', 'soft']
  },
  {
    id: 'pop-6', name: 'The Deceptive',
    numerals: ['I', 'IV', 'vi', 'V'],
    genre: ['pop', 'rock'], mood: ['uplifting'], complexity: 1,
    description: 'Moving to vi before V creates a gentle surprise',
    tags: ['surprise', 'smooth']
  },

  // ═══════════════════════ ROCK ═══════════════════════
  {
    id: 'rock-1', name: 'Classic Rock I-bVII-IV',
    numerals: ['I', 'bVII', 'IV', 'I'],
    genre: ['rock'], mood: ['uplifting', 'groovy'], complexity: 2,
    description: 'Mixolydian borrowed chord — the rock power progression',
    famousExamples: ['Sweet Home Alabama', 'Hey Jude (coda)', 'Sympathy for the Devil'],
    tags: ['power', 'mixolydian', 'borrowed']
  },
  {
    id: 'rock-2', name: 'Grunge/Alt',
    numerals: ['i', 'bVI', 'bIII', 'bVII'],
    genre: ['rock'], mood: ['dark', 'aggressive'], complexity: 2,
    description: 'Minor key power chord progression',
    famousExamples: ['Smells Like Teen Spirit', 'Zombie'],
    tags: ['minor', 'power', 'alternative']
  },

  // ═══════════════════════ JAZZ ═══════════════════════
  {
    id: 'jazz-1', name: 'ii-V-I',
    numerals: ['ii7', 'V7', 'Imaj7'],
    genre: ['jazz'], mood: ['happy'], complexity: 2,
    description: 'The most fundamental jazz progression — the harmonic backbone',
    famousExamples: ['Autumn Leaves (part)', 'Satin Doll', 'Fly Me to the Moon'],
    tags: ['fundamental', 'standard', 'resolution']
  },
  {
    id: 'jazz-2', name: 'Minor ii-V-i',
    numerals: ['ii7b5', 'V7b9', 'i7'],
    genre: ['jazz'], mood: ['dark', 'mysterious'], complexity: 3,
    description: 'Minor key ii-V-i with altered dominant',
    famousExamples: ['Alone Together', 'Beautiful Love'],
    tags: ['minor', 'standard', 'altered']
  },
  {
    id: 'jazz-3', name: 'Rhythm Changes (A section)',
    numerals: ['Imaj7', 'vi7', 'ii7', 'V7'],
    genre: ['jazz'], mood: ['happy', 'groovy'], complexity: 3,
    description: 'From "I Got Rhythm" — basis of countless jazz standards',
    famousExamples: ['I Got Rhythm', 'Oleo', 'Anthropology'],
    tags: ['bebop', 'standard', 'turnaround']
  },
  {
    id: 'jazz-4', name: 'Tritone Sub ii-V',
    numerals: ['ii7', 'bII7', 'Imaj7'],
    genre: ['jazz'], mood: ['mysterious'], complexity: 4,
    description: 'Tritone substitution replaces V7 for chromatic bass line',
    tags: ['substitution', 'chromatic', 'advanced']
  },
  {
    id: 'jazz-5', name: 'Coltrane Changes',
    numerals: ['Imaj7', 'V7/bVI', 'bVImaj7', 'V7/bII', 'bIImaj7', 'V7', 'Imaj7'],
    genre: ['jazz'], mood: ['mysterious', 'ethereal'], complexity: 5,
    description: 'Giant Steps — symmetric major third cycle',
    famousExamples: ['Giant Steps', 'Countdown', '26-2'],
    tags: ['advanced', 'symmetric', 'coltrane']
  },
  {
    id: 'jazz-6', name: 'Backdoor ii-V',
    numerals: ['iv7', 'bVII7', 'Imaj7'],
    genre: ['jazz'], mood: ['dreamy'], complexity: 4,
    description: 'Backdoor dominant — approaching tonic from the "wrong" side',
    tags: ['backdoor', 'surprise', 'resolution']
  },
  {
    id: 'jazz-7', name: 'Bird Blues',
    numerals: ['Imaj7', 'iv7', 'bVII7', 'Imaj7', 'ii7', 'V7', 'I7', 'IV7', 'iv7', 'bVII7', 'Imaj7', 'V7'],
    genre: ['jazz', 'blues'], mood: ['groovy'], complexity: 5,
    description: 'Charlie Parker\'s blues — sophisticated harmony over 12-bar form',
    famousExamples: ['Blues for Alice', 'Chi Chi'],
    tags: ['blues', 'bebop', 'advanced']
  },

  // ═══════════════════════ NEO-SOUL / R&B ═══════════════════════
  {
    id: 'neosoul-1', name: 'Neo-Soul Butter',
    numerals: ['Imaj9', 'ii9', 'iii7', 'vi7'],
    genre: ['neo-soul', 'r&b'], mood: ['groovy', 'dreamy'], complexity: 3,
    description: 'Smooth, extended chord movement — the neo-soul sound',
    famousExamples: ['Tyrone', 'Brown Sugar'],
    tags: ['smooth', 'extended', 'warm']
  },
  {
    id: 'neosoul-2', name: 'Erykah Flow',
    numerals: ['Imaj9', '#IVm7b5', 'IV7', 'iii7'],
    genre: ['neo-soul'], mood: ['ethereal', 'groovy'], complexity: 4,
    description: 'Chromatic inner voice movement with Lydian color',
    tags: ['chromatic', 'lydian', 'erykah']
  },
  {
    id: 'neosoul-3', name: 'D\'Angelo Vibe',
    numerals: ['Imaj7', 'bVIImaj7', 'IV9', 'iv9'],
    genre: ['neo-soul', 'r&b'], mood: ['groovy', 'dark'], complexity: 3,
    description: 'Major to minor IV with borrowed bVII — smoky and deep',
    tags: ['borrowed', 'minor-iv', 'smoky']
  },
  {
    id: 'neosoul-4', name: 'Gospel Neo-Soul',
    numerals: ['Imaj7', 'I7', 'IVmaj7', 'iv7'],
    genre: ['neo-soul', 'gospel'], mood: ['uplifting', 'nostalgic'], complexity: 3,
    description: 'Gospel-influenced movement: major I becomes dominant to reach IV',
    famousExamples: ['Ordinary People', "Isn't She Lovely"],
    tags: ['gospel', 'classic', 'IV-iv']
  },

  // ═══════════════════════ LO-FI ═══════════════════════
  {
    id: 'lofi-1', name: 'Lo-fi Chill',
    numerals: ['IImaj7', 'V7', 'Imaj7', 'vi7'],
    genre: ['lo-fi'], mood: ['dreamy', 'nostalgic'], complexity: 3,
    description: 'Non-functional harmony — the IImaj7 gives it that lo-fi shimmer',
    tags: ['chill', 'study', 'non-functional']
  },
  {
    id: 'lofi-2', name: 'Jazzy Lo-fi',
    numerals: ['ii9', 'V13', 'Imaj9', 'vi9'],
    genre: ['lo-fi', 'jazz'], mood: ['dreamy', 'groovy'], complexity: 3,
    description: 'Extended jazz chords with lo-fi production aesthetic',
    tags: ['extended', 'jazzy', 'chill']
  },
  {
    id: 'lofi-3', name: 'Melancholy Beats',
    numerals: ['i9', 'bVImaj7', 'iv9', 'V7'],
    genre: ['lo-fi'], mood: ['sad', 'nostalgic'], complexity: 3,
    description: 'Minor key lo-fi with bittersweet extended chords',
    tags: ['minor', 'sad', 'extended']
  },
  {
    id: 'lofi-4', name: 'Study Session',
    numerals: ['Imaj7', 'iii7', 'vi9', 'IVmaj7'],
    genre: ['lo-fi', 'pop'], mood: ['dreamy', 'happy'], complexity: 2,
    description: 'Gentle, diatonic movement with ninth colors',
    tags: ['gentle', 'study', 'diatonic']
  },

  // ═══════════════════════ TRAP ═══════════════════════
  {
    id: 'trap-1', name: 'Dark Trap',
    numerals: ['i', 'bVI', 'bVII', 'i'],
    genre: ['trap'], mood: ['dark', 'aggressive'], complexity: 1,
    description: 'Simple minor key power — 808 bass friendly',
    famousExamples: ['Mask Off', 'XO Tour Llif3'],
    tags: ['dark', 'simple', '808']
  },
  {
    id: 'trap-2', name: 'Melodic Trap',
    numerals: ['i', 'bVI', 'bIII', 'bVII'],
    genre: ['trap'], mood: ['dark', 'sad'], complexity: 1,
    description: 'Minor key with all borrowed natural minor chords',
    famousExamples: ['Lucid Dreams', 'Robbery'],
    tags: ['melodic', 'emo', 'minor']
  },
  {
    id: 'trap-3', name: 'Trap Soul',
    numerals: ['i7', 'iv7', 'bVImaj7', 'V7'],
    genre: ['trap', 'r&b'], mood: ['dark', 'groovy'], complexity: 2,
    description: 'Minor trap with seventh chord sophistication',
    tags: ['trap-soul', 'smooth', 'minor']
  },

  // ═══════════════════════ EDM ═══════════════════════
  {
    id: 'edm-1', name: 'EDM Anthem',
    numerals: ['vi', 'IV', 'I', 'V'],
    genre: ['edm', 'pop'], mood: ['uplifting', 'happy'], complexity: 1,
    description: 'The festival anthem progression — big builds, bigger drops',
    famousExamples: ['Wake Me Up', 'Clarity', 'Titanium'],
    tags: ['anthem', 'festival', 'build']
  },
  {
    id: 'edm-2', name: 'Trance Gate',
    numerals: ['i', 'bVII', 'bVI', 'V'],
    genre: ['edm'], mood: ['uplifting', 'ethereal'], complexity: 2,
    description: 'Minor key with raised V for harmonic minor drama',
    tags: ['trance', 'euphoric', 'harmonic-minor']
  },
  {
    id: 'edm-3', name: 'Future Bass',
    numerals: ['I', 'iii', 'vi', 'V'],
    genre: ['edm'], mood: ['dreamy', 'uplifting'], complexity: 1,
    description: 'Dreamy progression with synth pad wash',
    tags: ['future-bass', 'synth', 'dreamy']
  },

  // ═══════════════════════ BLUES ═══════════════════════
  {
    id: 'blues-1', name: '12-Bar Blues',
    numerals: ['I7', 'I7', 'I7', 'I7', 'IV7', 'IV7', 'I7', 'I7', 'V7', 'IV7', 'I7', 'V7'],
    genre: ['blues', 'rock'], mood: ['groovy'], complexity: 2,
    description: 'The foundation of blues, rock, and jazz',
    famousExamples: ['Sweet Home Chicago', 'Hound Dog', 'Rock Around the Clock'],
    tags: ['12-bar', 'classic', 'foundation']
  },
  {
    id: 'blues-2', name: 'Quick Change Blues',
    numerals: ['I7', 'IV7', 'I7', 'I7', 'IV7', 'IV7', 'I7', 'I7', 'V7', 'IV7', 'I7', 'V7'],
    genre: ['blues'], mood: ['groovy'], complexity: 2,
    description: 'Early IV chord hit in bar 2 for more movement',
    tags: ['12-bar', 'quick-change']
  },

  // ═══════════════════════ GOSPEL ═══════════════════════
  {
    id: 'gospel-1', name: 'Gospel Turnaround',
    numerals: ['I', 'I7', 'IV', 'iv', 'I', 'V', 'I'],
    genre: ['gospel', 'r&b'], mood: ['uplifting', 'happy'], complexity: 3,
    description: 'The IV to iv plagal cadence — pure gospel soul',
    tags: ['turnaround', 'plagal', 'IV-iv']
  },
  {
    id: 'gospel-2', name: 'Shouting Music',
    numerals: ['I', 'bVII', 'IV', 'I'],
    genre: ['gospel'], mood: ['uplifting', 'happy'], complexity: 2,
    description: 'Mixolydian gospel shout — high energy praise',
    tags: ['praise', 'mixolydian', 'energy']
  },
  {
    id: 'gospel-3', name: 'Gospel ii-V with Subs',
    numerals: ['ii9', 'V13', '#Vdim7', 'vi7', 'ii9', 'V7', 'Imaj9'],
    genre: ['gospel', 'jazz'], mood: ['uplifting'], complexity: 4,
    description: 'Jazz-influenced gospel with diminished passing chord',
    tags: ['passing', 'diminished', 'sophisticated']
  },

  // ═══════════════════════ FUNK ═══════════════════════
  {
    id: 'funk-1', name: 'One Chord Funk',
    numerals: ['I9'],
    genre: ['funk'], mood: ['groovy'], complexity: 1,
    description: 'Funk lives in the rhythm, not the changes — one chord is enough',
    famousExamples: ['Get Up (I Feel Like Being a) Sex Machine', 'Chameleon'],
    tags: ['one-chord', 'rhythm', 'groove']
  },
  {
    id: 'funk-2', name: 'Funky Two-Chord',
    numerals: ['I7', 'IV7'],
    genre: ['funk', 'r&b'], mood: ['groovy'], complexity: 1,
    description: 'Two dominant 7ths rocking back and forth',
    famousExamples: ['Superstition', 'Play That Funky Music'],
    tags: ['two-chord', 'dominant', 'classic']
  },
  {
    id: 'funk-3', name: 'P-Funk Progression',
    numerals: ['I7', 'bVII7', 'IV9', 'I7'],
    genre: ['funk'], mood: ['groovy'], complexity: 2,
    description: 'Mixolydian funk with dominant extensions',
    famousExamples: ['Flash Light', 'Give Up the Funk'],
    tags: ['p-funk', 'mixolydian', 'party']
  },

  // ═══════════════════════ LATIN ═══════════════════════
  {
    id: 'latin-1', name: 'Bossa Nova Classic',
    numerals: ['Imaj7', 'ii7', 'iii7', 'vi7', 'ii7', 'V7', 'Imaj7'],
    genre: ['latin', 'jazz'], mood: ['dreamy', 'groovy'], complexity: 3,
    description: 'Smooth bossa nova voice leading',
    famousExamples: ['Girl from Ipanema', 'Corcovado'],
    tags: ['bossa', 'brazilian', 'smooth']
  },
  {
    id: 'latin-2', name: 'Andalusian Cadence',
    numerals: ['i', 'bVII', 'bVI', 'V'],
    genre: ['latin', 'rock'], mood: ['dark', 'mysterious'], complexity: 2,
    description: 'Flamenco-inspired descending progression — dramatic and timeless',
    famousExamples: ['Hit the Road Jack', 'Sultans of Swing (verse)', 'Stairway to Heaven'],
    tags: ['flamenco', 'descending', 'phrygian']
  },

  // ═══════════════════════ CLASSICAL / CINEMATIC ═══════════════════════
  {
    id: 'classical-1', name: 'Romantic Suspension',
    numerals: ['I', 'V/vi', 'vi', 'IV'],
    genre: ['classical', 'pop'], mood: ['nostalgic', 'sad'], complexity: 3,
    description: 'Secondary dominant to vi creates yearning before subdominant release',
    tags: ['secondary-dominant', 'romantic', 'yearning']
  },
  {
    id: 'classical-2', name: 'Chromatic Mediant Shift',
    numerals: ['I', 'bIIImaj7', 'I', 'bVImaj7'],
    genre: ['classical'], mood: ['mysterious', 'ethereal'], complexity: 4,
    description: 'Major third root movement — cinematic and otherworldly',
    famousExamples: ['Star Wars (Force Theme)', 'Lord of the Rings'],
    tags: ['chromatic-mediant', 'cinematic', 'film']
  },
  {
    id: 'classical-3', name: 'Circle of Fifths Descent',
    numerals: ['I', 'IV', 'vii°', 'iii', 'vi', 'ii', 'V', 'I'],
    genre: ['classical', 'jazz'], mood: ['happy'], complexity: 3,
    description: 'Full circle of fifths root movement — complete harmonic journey',
    tags: ['circle', 'sequential', 'complete']
  },

  // ═══════════════════════ MISC / CREATIVE ═══════════════════════
  {
    id: 'creative-1', name: 'The Mario Cadence',
    numerals: ['bVI', 'bVII', 'I'],
    genre: ['pop', 'rock'], mood: ['uplifting', 'happy'], complexity: 2,
    description: 'Borrowed chords resolving to tonic — triumphant finish',
    famousExamples: ['Super Mario Bros.', 'Livin\' on a Prayer (chorus end)'],
    tags: ['borrowed', 'triumph', 'ending']
  },
  {
    id: 'creative-2', name: 'Creep Progression',
    numerals: ['I', 'III', 'IV', 'iv'],
    genre: ['rock', 'pop'], mood: ['sad', 'dark'], complexity: 2,
    description: 'Major III is a chromatic shock, IV to iv adds melancholy',
    famousExamples: ['Creep', 'Space Oddity'],
    tags: ['chromatic', 'surprise', 'iconic']
  },
  {
    id: 'creative-3', name: 'Dorian Groove',
    numerals: ['i7', 'IV7'],
    genre: ['funk', 'neo-soul', 'r&b'], mood: ['groovy'], complexity: 2,
    description: 'Minor i with major IV = Dorian mode — funky and smooth',
    famousExamples: ['So What', 'Oye Como Va', 'Evil Ways'],
    tags: ['dorian', 'modal', 'two-chord']
  },
]
