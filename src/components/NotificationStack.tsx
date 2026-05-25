import type { Task } from '../taskStore'
import { formatCountdown } from '../utils/taskHelpers'

interface NotificationStackProps {
  tasks: Task[]
  now: number
}

export function NotificationStack({ tasks, now }: NotificationStackProps) {
  if (tasks.length === 0) {
    return null
  }

  return (
    <aside className="notification-stack" aria-live="assertive" aria-label="Urgent task alerts">
      {tasks.map((task) => (
        <article key={task.id} className="notification-toast">
          <p className="notification-label">Urgent task</p>
          <strong>{task.title}</strong>
          <p className="notification-copy">Please do this task immediately before it is late.</p>
          <span className="notification-time">{formatCountdown(task.dueDate, now)}</span>
        </article>
      ))}
    </aside>
  )
}
