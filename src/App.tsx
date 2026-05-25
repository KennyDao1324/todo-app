import { type FormEvent, useState } from 'react'
import './App.css'
import { HeroSection } from './components/HeroSection'
import { NotificationStack } from './components/NotificationStack'
import { TaskBoard } from './components/TaskBoard'
import { TaskComposer } from './components/TaskComposer'
import { useClock } from './hooks/useClock'
import { useTaskDashboard } from './hooks/useTaskDashboard'
import { useTaskManager } from './hooks/useTaskManager'
import { type FilterState } from './taskStore'
import { initialFilters } from './utils/taskHelpers'

function App() {
  const { now, today } = useClock()
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
  const { categories, highlightedTasks, alertNotifications, filteredTasks, taskSummary } =
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
      <HeroSection {...taskSummary} />

      <section className="content-grid">
        <TaskComposer
          draft={draft}
          setDraft={setDraft}
          editingId={editingId}
          categories={categories}
          highlightedTasks={highlightedTasks}
          today={today}
          now={now}
          onSubmit={handleSubmit}
          onCancel={resetDraft}
        />

        <TaskBoard
          search={search}
          setSearch={setSearch}
          filters={filters}
          setFilters={setFilters}
          categories={categories}
          tasks={filteredTasks}
          today={today}
          now={now}
          onEdit={startEditingTask}
          onDelete={deleteTask}
          onStatusChange={updateTaskStatus}
        />
      </section>
    </main>
  )
}

export default App
