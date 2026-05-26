import { statusOptions, type Task } from '../taskStore'
import { formatDate, predictorLabel } from '../utils/taskHelpers'

interface PastDuePageProps {
  tasks: Task[]
  today: number
  onViewDetails: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onStatusChange: (taskId: string, status: Task['status']) => void
  onTogglePin: (taskId: string) => void
}

export function PastDuePage({
  tasks,
  today,
  onViewDetails,
  onEdit,
  onDelete,
  onStatusChange,
  onTogglePin,
}: PastDuePageProps) {
  return (
    <section className="board-card past-due-page">
      <div className="section-heading">
        <div>
          <p className="section-kicker">History</p>
          <h2>Past deadline tasks</h2>
        </div>
        <div className="past-due-summary">
          <strong>{tasks.length}</strong>
          <span>task{tasks.length === 1 ? '' : 's'} past deadline</span>
        </div>
      </div>

      <div className="task-list" role="list" aria-live="polite">
        {tasks.length > 0 ? (
          tasks.map((task) => {
            const label = predictorLabel(task, today)

            return (
              <article key={task.id} className="task-card past-due-card" role="listitem">
                <div className="task-main">
                  <div className="task-header">
                    <div>
                      <div className="task-title-row">
                        <button
                          type="button"
                          className={`pin-button ${task.pinned ? 'active' : ''}`}
                          onClick={() => onTogglePin(task.id)}
                          aria-label={task.pinned ? `Unpin ${task.title}` : `Pin ${task.title}`}
                        >
                          {task.pinned ? 'Pinned' : 'Pin'}
                        </button>
                        <h3>{task.title}</h3>
                        <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                          {task.priority}
                        </span>
                        <span className={`chip ${label.toLowerCase().replace(' ', '-')}`}>
                          {label}
                        </span>
                      </div>
                      <p className="task-meta">
                        {task.category} • Due {formatDate(task.dueDate)}
                      </p>
                      <p className="task-countdown alert">
                        {task.dueDate ? `Missed ${formatDate(task.dueDate)}` : 'Deadline has passed'}
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
                  <button type="button" className="ghost-button" onClick={() => onViewDetails(task)}>
                    View
                  </button>
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
            <h3>No past-due tasks</h3>
            <p>Tasks that miss their deadline will appear here.</p>
          </div>
        )}
      </div>
    </section>
  )
}
