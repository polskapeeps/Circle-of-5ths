import { AppShell } from './components/layout/AppShell'
import { ChordGrid } from './components/chords/ChordGrid'
import { CircleOfFifths } from './components/circle/CircleOfFifths'
import { ProgressionPanel } from './components/progressions/ProgressionPanel'

export default function App() {
  return (
    <AppShell
      sidebar={<ChordGrid />}
      center={<CircleOfFifths />}
      panel={<ProgressionPanel />}
    />
  )
}
