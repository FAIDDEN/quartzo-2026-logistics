import { useStore } from './store'
import Sidebar   from './components/Layout/Sidebar'
import Header    from './components/Layout/Header'
import Chatbot   from './components/AI/Chatbot'
import Dashboard from './pages/Dashboard'
import Artists   from './pages/Artists'
import Flights   from './pages/Flights'
import Transfers from './pages/Transfers'
import Hotels    from './pages/Hotels'
import TimeTable from './pages/TimeTable'
import Drivers   from './pages/Drivers'
import Settings  from './pages/Settings'

const PAGES = {
  dashboard: Dashboard,
  artists:   Artists,
  flights:   Flights,
  transfers: Transfers,
  hotels:    Hotels,
  timetable: TimeTable,
  drivers:   Drivers,
  settings:  Settings,
}

export default function App() {
  const page = useStore(s => s.page)
  const PageComponent = PAGES[page] || Dashboard

  return (
    <div className="flex h-screen bg-q-950 overflow-hidden font-body">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <PageComponent />
        </main>
      </div>
      <Chatbot />
    </div>
  )
}
