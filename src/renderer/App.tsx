import { AppShell } from './components/layout/AppShell'
import { SidebarWorkspace } from './components/layout/SidebarWorkspace'
import { ProgressionPanel } from './components/progressions/ProgressionPanel'
import { IdeaWorkbench } from './components/workbench/IdeaWorkbench'

export default function App() {
  return (
    <AppShell
      sidebar={<SidebarWorkspace />}
      center={<IdeaWorkbench />}
      panel={<ProgressionPanel />}
    />
  )
}
