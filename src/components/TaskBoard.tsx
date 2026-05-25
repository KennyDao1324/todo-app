import type { Dispatch, SetStateAction } from 'react'
import { statusOptions, type FilterState, type Task } from '../taskStore'
import {
  formatCountdown,
  formatDate,
  isWithinAlertWindow,
  predictorLabel,
} from '../utils/taskHelpers'

interface TaskBoardProps {
  search: string
  setSearch: Dispatch<SetStateAction<string>>
  filters: FilterState
  setFilters: Dispatch<SetStateAction<FilterState>>
  categories: string[]
  tasks: Task[]
  today: number
  now: number
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onStatusChange: (taskId: string, status: Task['status']) => void
}

export function TaskBoard({
  search,
  setSearch,
  filters,
  setFilters,
  categories,
  tasks,
  today,
  now,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskBoardProps) {
  return (
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
            {['All', 'High', 'Medium', 'Low'].map((option) => (
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
        {tasks.length > 0 ? (
          tasks.map((task) => {
            const label = predictorLabel(task, today)

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
                      onChange={(event) => onStatusChange(task.id, event.target.value as Task['status'])}
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
                  <button type="button" className="ghost-button" onClick={() => onEdit(task)}>
                    Edit
                  </button>
                  <button type="button" className="danger-button" onClick={() => onDelete(task.id)}>
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
  )
}
