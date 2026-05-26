import { useEffect } from 'react'
import type { Task } from '../taskStore'
import { formatCountdown, formatDate } from '../utils/taskHelpers'

interface TaskDetailsModalProps {
  task: Task | null
  now: number
  onClose: () => void
}

export function TaskDetailsModal({ task, now, onClose }: TaskDetailsModalProps) {
  useEffect(() => {
    if (!task) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [task, onClose])

  if (!task) {
    return null
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="task-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-details-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="task-modal-header">
          <div>
            <p className="section-kicker">Task details</p>
            <h2 id="task-details-title">{task.title}</h2>
          </div>
          <button type="button" className="ghost-button" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="task-modal-grid">
          <article className="task-modal-card">
            <span>Category</span>
            <strong>{task.category}</strong>
          </article>
          <article className="task-modal-card">
            <span>Priority</span>
            <strong>{task.priority}</strong>
          </article>
          <article className="task-modal-card">
            <span>Status</span>
            <strong>{task.status}</strong>
          </article>
          <article className="task-modal-card">
            <span>Due date</span>
            <strong>{formatDate(task.dueDate)}</strong>
          </article>
        </div>

        <div className="task-modal-panel">
          <h3>Description</h3>
          <p>{task.description || 'No description added.'}</p>
        </div>

        <div className="task-modal-panel">
          <h3>Deadline</h3>
          <p>{formatCountdown(task.dueDate, now)}</p>
        </div>
      </section>
    </div>
  )
}
