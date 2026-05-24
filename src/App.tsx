import { type FormEvent, useEffect, useMemo, useState } from 'react'
import './App.css'
import {
  categoryOptions,
  emptyTaskDraft,
  loadTasks,
  saveTasks,
  statusOptions,
  type FilterState,
  type Priority,
  type Task,
  type TaskDraft,
} from './taskStore'

const priorityOptions: Priority[] = ['High', 'Medium', 'Low']

const initialFilters: FilterState = {
  priority: 'All',
  category: 'All',
  dueDate: 'All',
  status: 'All',
}

const formatDate = (value: string) => {
  if (!value) {
    return 'No due date'
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`))
}

const formatCountdown = (value: string, now: number) => {
  if (!value) {
    return 'No deadline'
  }

  const dueTime = new Date(`${value}T23:59:59`).getTime()
  const diff = dueTime - now
  const isPast = diff < 0
  const absoluteDiff = Math.abs(diff)
  const totalSeconds = Math.floor(absoluteDiff / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const time = [hours, minutes, seconds].map((part) => String(part).padStart(2, '0')).join(':')

  return isPast ? `Overdue by ${days}d ${time}` : `${days}d ${time} left`
}

const isWithinAlertWindow = (value: string, now: number) => {
  if (!value) {
    return false
  }

  const dueTime = new Date(`${value}T23:59:59`).getTime()
  const diff = dueTime - now
  return diff > 0 && diff <= 1000 * 60 * 60 * 12
}

const toDateValue = (value: string) => {
  if (!value) {
    return Number.POSITIVE_INFINITY
  }

  return new Date(`${value}T00:00:00`).getTime()
}

const isOverdue = (task: Task, today: number) =>
  Boolean(task.dueDate) && task.status !== 'Done' && toDateValue(task.dueDate) < today

const isDueSoon = (task: Task, today: number) => {
  if (!task.dueDate || task.status === 'Done') {
    return false
  }

  const diff = toDateValue(task.dueDate) - today
  return diff >= 0 && diff <= 1000 * 60 * 60 * 24 * 2
}

const matchesDueDateFilter = (task: Task, filter: FilterState['dueDate'], today: number) => {
  if (filter === 'All') {
    return true
  }

  if (filter === 'Overdue') {
    return isOverdue(task, today)
  }

  if (filter === 'Due Soon') {
    return isDueSoon(task, today)
  }

  if (filter === 'No Date') {
    return !task.dueDate
  }

  return false
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks())
  const [draft, setDraft] = useState<TaskDraft>(emptyTaskDraft())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [search, setSearch] = useState('')
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key) {
        setTasks(loadTasks())
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const today = useMemo(() => {
    const value = new Date(now)
    value.setHours(0, 0, 0, 0)
    return value.getTime()
  }, [now])

  const categories = useMemo(() => {
    const fromTasks = tasks.map((task) => task.category)
    return Array.from(new Set([...categoryOptions, ...fromTasks])).sort()
  }, [tasks])

  const highlightedTasks = useMemo(
    () =>
      tasks.filter(
        (task) => isOverdue(task, today) || isDueSoon(task, today) || task.priority === 'High',
      ),
    [tasks, today],
  )

  const alertNotifications = useMemo(
    () =>
      tasks
        .filter((task) => task.status !== 'Done' && isWithinAlertWindow(task.dueDate, now))
        .sort((left, right) => toDateValue(left.dueDate) - toDateValue(right.dueDate)),
    [now, tasks],
  )

  const filteredTasks = useMemo(() => {
    const term = search.trim().toLowerCase()

    return [...tasks]
      .filter((task) => (filters.priority === 'All' ? true : task.priority === filters.priority))
      .filter((task) => (filters.category === 'All' ? true : task.category === filters.category))
      .filter((task) => (filters.status === 'All' ? true : task.status === filters.status))
      .filter((task) => matchesDueDateFilter(task, filters.dueDate, today))
      .filter((task) => {
        if (!term) {
          return true
        }

        return [task.title, task.description, task.category].some((value) =>
          value.toLowerCase().includes(term),
        )
      })
      .sort((left, right) => toDateValue(left.dueDate) - toDateValue(right.dueDate))
  }, [filters, search, tasks, today])

  const taskSummary = useMemo(
    () => ({
      total: tasks.length,
      completed: tasks.filter((task) => task.status === 'Done').length,
      overdue: tasks.filter((task) => isOverdue(task, today)).length,
      inProgress: tasks.filter((task) => task.status === 'In Progress').length,
    }),
    [tasks, today],
  )

  const predictorLabel = (task: Task) => {
    if (isOverdue(task, today)) {
      return 'Overdue'
    }

    if (isDueSoon(task, today)) {
      return 'Urgent'
    }

    if (task.priority === 'High' && task.status !== 'Done') {
      return 'High focus'
    }

    return 'On track'
  }

  const resetDraft = () => {
    setDraft(emptyTaskDraft())
    setEditingId(null)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextTask: Task = {
      id: editingId ?? crypto.randomUUID(),
      title: draft.title.trim(),
      description: draft.description.trim(),
      priority: draft.priority,
      dueDate: draft.dueDate,
      category: draft.category.trim(),
      status: draft.status,
      createdAt: editingId
        ? tasks.find((task) => task.id === editingId)?.createdAt ?? new Date().toISOString()
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (!nextTask.title || !nextTask.category) {
      return
    }

    setTasks((currentTasks) => {
      if (!editingId) {
        return [nextTask, ...currentTasks]
      }

      return currentTasks.map((task) => (task.id === editingId ? nextTask : task))
    })

    resetDraft()
  }

  const handleEdit = (task: Task) => {
    setEditingId(task.id)
    setDraft({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      category: task.category,
      status: task.status,
    })
  }

  const handleDelete = (taskId: string) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId))

    if (editingId === taskId) {
      resetDraft()
    }
  }

  const handleStatusChange = (taskId: string, status: Task['status']) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, status, updatedAt: new Date().toISOString() } : task,
      ),
    )
  }

  return (
    <main className="app-shell">
      {alertNotifications.length > 0 ? (
        <aside className="notification-stack" aria-live="assertive" aria-label="Urgent task alerts">
          {alertNotifications.map((task) => (
            <article key={task.id} className="notification-toast">
              <p className="notification-label">Urgent task</p>
              <strong>{task.title}</strong>
              <p className="notification-copy">
                Please do this task immediately before it is late.
              </p>
              <span className="notification-time">{formatCountdown(task.dueDate, now)}</span>
            </article>
          ))}
        </aside>
      ) : null}

      <section className="hero-panel">
        <div>
          <p className="eyebrow">TaskFlow OS</p>
          <h1>My Tasks</h1>
          <p className="hero-copy">Track priorities, manage deadlines, and keep work moving.</p>
        </div>

        <div className="hero-grid" aria-label="Task summary">
          <article className="metric-card">
            <span>Total tasks</span>
            <strong>{taskSummary.total}</strong>
          </article>
          <article className="metric-card">
            <span>In progress</span>
            <strong>{taskSummary.inProgress}</strong>
          </article>
          <article className="metric-card alert">
            <span>Overdue</span>
            <strong>{taskSummary.overdue}</strong>
          </article>
          <article className="metric-card success">
            <span>Completed</span>
            <strong>{taskSummary.completed}</strong>
          </article>
        </div>
      </section>

      <section className="content-grid">
        <aside className="composer-card">
          <div className="section-heading">
            <div>
              <p className="section-kicker">{editingId ? 'Edit task' : 'New task'}</p>
              <h2>{editingId ? 'Update task' : 'Add task'}</h2>
            </div>
            {editingId ? (
              <button type="button" className="ghost-button" onClick={resetDraft}>
                Cancel
              </button>
            ) : null}
          </div>

          <form className="task-form" onSubmit={handleSubmit}>
            <label>
              Title
              <input
                value={draft.title}
                onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                placeholder="Task title"
                required
              />
            </label>

            <label>
              Description
              <textarea
                value={draft.description}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, description: event.target.value }))
                }
                placeholder="Task description"
                rows={5}
              />
            </label>

            <div className="form-row">
              <label>
                Priority
                <select
                  value={draft.priority}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      priority: event.target.value as Priority,
                    }))
                  }
                >
                  {priorityOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Status
                <select
                  value={draft.status}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      status: event.target.value as Task['status'],
                    }))
                  }
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="form-row">
              <label>
                Due date
                <input
                  type="date"
                  value={draft.dueDate}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, dueDate: event.target.value }))
                  }
                />
              </label>

              <label>
                Category
                <input
                  list="category-suggestions"
                  value={draft.category}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, category: event.target.value }))
                  }
                  placeholder="Category"
                  required
                />
                <datalist id="category-suggestions">
                  {categories.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </label>
            </div>

              <button type="submit" className="primary-button">
              {editingId ? 'Save task' : 'Add task'}
              </button>
          </form>

          <div className="smart-panel">
            <div className="section-heading compact">
              <div>
                <p className="section-kicker">Priority</p>
                <h2>Focus now</h2>
              </div>
            </div>

            {highlightedTasks.length > 0 ? (
              <div className="alert-stack">
                {highlightedTasks.slice(0, 4).map((task) => (
                  <article key={task.id} className="alert-card">
                    <div>
                      <strong>{task.title}</strong>
                      <p>
                        {task.category} • {formatCountdown(task.dueDate, now)}
                      </p>
                    </div>
                    <span className={`chip ${predictorLabel(task).toLowerCase().replace(' ', '-')}`}>
                      {predictorLabel(task)}
                    </span>
                  </article>
                ))}
              </div>
            ) : (
              <p className="empty-copy">No urgent tasks right now.</p>
            )}
          </div>
        </aside>

        <section className="board-card">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Tasks</p>
              <h2>All tasks</h2>
            </div>
            <input
              className="search-input"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tasks"
              aria-label="Search tasks"
            />
          </div>

          <div className="filters-grid">
            <label>
              Priority
              <select
                value={filters.priority}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    priority: event.target.value as FilterState['priority'],
                  }))
                }
              >
                {['All', ...priorityOptions].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Category
              <select
                value={filters.category}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    category: event.target.value,
                  }))
                }
              >
                <option value="All">All</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Due date
              <select
                value={filters.dueDate}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    dueDate: event.target.value as FilterState['dueDate'],
                  }))
                }
              >
                {['All', 'Due Soon', 'Overdue', 'No Date'].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Status
              <select
                value={filters.status}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    status: event.target.value as FilterState['status'],
                  }))
                }
              >
                <option value="All">All</option>
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="task-list" role="list" aria-live="polite">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => {
                const label = predictorLabel(task)

                return (
                  <article key={task.id} className="task-card" role="listitem">
                    <div className="task-main">
                      <div className="task-header">
                        <div>
                          <div className="task-title-row">
                            <h3>{task.title}</h3>
                            <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                              {task.priority}
                            </span>
                            <span className={`chip ${label.toLowerCase().replace(' ', '-')}`}>
                              {label}
                            </span>
                          </div>
                          <p className="task-meta">
                            {task.category} • {formatDate(task.dueDate)}
                          </p>
                          <p
                            className={`task-countdown ${
                              isWithinAlertWindow(task.dueDate, now) ? 'alert' : ''
                            }`}
                          >
                            {formatCountdown(task.dueDate, now)}
                          </p>
                        </div>

                        <select
                          className="status-select"
                          value={task.status}
                          onChange={(event) =>
                            handleStatusChange(task.id, event.target.value as Task['status'])
                          }
                          aria-label={`Update status for ${task.title}`}
                        >
                          {statusOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      <p className="task-description">{task.description || 'No description added.'}</p>
                    </div>

                    <div className="task-actions">
                      <button type="button" className="ghost-button" onClick={() => handleEdit(task)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="danger-button"
                        onClick={() => handleDelete(task.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                )
              })
            ) : (
              <div className="empty-state">
                <h3>No tasks found</h3>
                <p>Try another filter or add a new task.</p>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  )
}

export default App
