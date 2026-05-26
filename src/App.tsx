import { type FormEvent, useState } from 'react'
import './App.css'
import { HeroSection } from './components/HeroSection'
import { NotificationStack } from './components/NotificationStack'
import { PageNavigation } from './components/PageNavigation'
import { PastDuePage } from './components/PastDuePage'
import { TaskWorkspace } from './components/TaskWorkspace'
import { useClock } from './hooks/useClock'
import { usePageRoute } from './hooks/usePageRoute'
import { useTaskDashboard } from './hooks/useTaskDashboard'
import { useTaskManager } from './hooks/useTaskManager'
import { type FilterState } from './taskStore'
import { initialFilters } from './utils/taskHelpers'

function App() {
  const { now, today } = useClock()
  const { page, navigateTo } = usePageRoute()
  const {
    tasks,
    draft,
    setDraft,
    editingId,
    saveTask,
    resetDraft,
    startEditingTask,
    deleteTask,
    updateTaskStatus,
  } = useTaskManager()
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [search, setSearch] = useState('')
  const { categories, highlightedTasks, alertNotifications, filteredTasks, taskSummary, pastDueTasks } =
    useTaskDashboard({
      tasks,
      filters,
      search,
      today,
      now,
    })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    saveTask()
  }

  return (
    <main className="app-shell">
      <NotificationStack tasks={alertNotifications} now={now} />
      <PageNavigation currentPage={page} onNavigate={navigateTo} />
      <HeroSection {...taskSummary} />
      {page === 'past-due' ? (
        <PastDuePage
          tasks={pastDueTasks}
          today={today}
          onEdit={startEditingTask}
          onDelete={deleteTask}
          onStatusChange={updateTaskStatus}
        />
      ) : (
        <TaskWorkspace
          draft={draft}
          setDraft={setDraft}
          editingId={editingId}
          categories={categories}
          highlightedTasks={highlightedTasks}
          today={today}
          now={now}
          onSubmit={handleSubmit}
          onCancel={resetDraft}
          search={search}
          setSearch={setSearch}
          filters={filters}
          setFilters={setFilters}
          tasks={filteredTasks}
          onEdit={startEditingTask}
          onDelete={deleteTask}
          onStatusChange={updateTaskStatus}
        />
      )}
    </main>
  )
}

export default App
