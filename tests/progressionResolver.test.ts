import { describe, expect, it } from 'vitest'
import { resolveChordStep } from '../src/renderer/engine/progressionResolver'
import { getResolvedProgressions } from '../src/renderer/engine/recommendationEngine'

describe('progressionResolver', () => {
  it('realizes diatonic extended chords in major keys', () => {
    const step = resolveChordStep('C', 'major', 'Imaj7')

    expect(step.chord.root.name).toBe('C')
    expect(step.chord.type.symbol).toBe('maj7')
    expect(step.chord.notes.map((note) => note.name)).toEqual(['C', 'E', 'G', 'B'])
  })

  it('supports borrowed flat-degree chords', () => {
    const step = resolveChordStep('C', 'major', 'bVII')

    expect(step.chord.root.name).toBe('Bb')
    expect(step.chord.type.symbol).toBe('')
    expect(step.role).toBe('borrowed')
  })

  it('supports secondary dominants', () => {
    const step = resolveChordStep('C', 'major', 'V/vi')

    expect(step.chord.root.name).toBe('E')
    expect(step.chord.type.symbol).toBe('')
    expect(step.role).toBe('secondary')
  })

  it('resolves half-diminished minor cadences', () => {
    const step = resolveChordStep('A', 'minor', 'ii7b5')

    expect(step.chord.root.name).toBe('B')
    expect(step.chord.type.symbol).toBe('m7b5')
    expect(step.chord.notes.map((note) => note.name)).toEqual(['B', 'D', 'F', 'A'])
  })

  it('filters progression recommendations by selected scale notes', () => {
    const progressions = getResolvedProgressions('C', 'major', { selectedNotes: ['B'] })

    expect(progressions.length).toBeGreaterThan(0)
    expect(progressions.every((progression) => progression.noteCoverage.matched.includes('B'))).toBe(true)
  })

  it('tracks whether a progression stays fully inside the selected scale', () => {
    const diatonic = getResolvedProgressions('C', 'major').find((progression) => progression.progression.id === 'pop-1')
    const borrowed = getResolvedProgressions('C', 'major').find((progression) => progression.progression.id === 'rock-1')

    expect(diatonic).toBeDefined()
    expect(diatonic?.scaleFit.isFullyDiatonic).toBe(true)
    expect(borrowed?.scaleFit.isFullyDiatonic).toBe(false)
  })
})
