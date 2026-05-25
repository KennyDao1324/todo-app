import type { Dispatch, FormEvent, SetStateAction } from 'react'
import { categoryOptions, statusOptions, type Task, type TaskDraft } from '../taskStore'
import { formatCountdown, predictorLabel, priorityOptions } from '../utils/taskHelpers'

interface TaskComposerProps {
  draft: TaskDraft
  setDraft: Dispatch<SetStateAction<TaskDraft>>
  editingId: string | null
  categories: string[]
  highlightedTasks: Task[]
  today: number
  now: number
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}

export function TaskComposer({
  draft,
  setDraft,
  editingId,
  categories,
  highlightedTasks,
  today,
  now,
  onSubmit,
  onCancel,
}: TaskComposerProps) {
  return (
    <aside className="composer-card">
      <div className="section-heading">
        <div>
          <p className="section-kicker">{editingId ? 'Edit task' : 'New task'}</p>
          <h2>{editingId ? 'Update task' : 'Add task'}</h2>
        </div>
        {editingId ? (
          <button type="button" className="ghost-button" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>

      <form className="task-form" onSubmit={onSubmit}>
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
                  priority: event.target.value as TaskDraft['priority'],
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
                  status: event.target.value as TaskDraft['status'],
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
              {[...new Set([...categoryOptions, ...categories])].sort().map((category) => (
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
            {highlightedTasks.slice(0, 4).map((task) => {
              const label = predictorLabel(task, today)

              return (
                <article key={task.id} className="alert-card">
                  <div>
                    <strong>{task.title}</strong>
                    <p>
                      {task.category} • {formatCountdown(task.dueDate, now)}
                    </p>
                  </div>
                  <span className={`chip ${label.toLowerCase().replace(' ', '-')}`}>{label}</span>
                </article>
              )
            })}
          </div>
        ) : (
          <p className="empty-copy">No urgent tasks right now.</p>
        )}
      </div>
    </aside>
  )
}
