export type Priority = 'High' | 'Medium' | 'Low'
export type TaskStatus = 'To Do' | 'In Progress' | 'Done'

export interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  dueDate: string
  category: string
  status: TaskStatus
  createdAt: string
  updatedAt: string
}

export interface TaskDraft {
  title: string
  description: string
  priority: Priority
  dueDate: string
  category: string
  status: TaskStatus
}

export interface FilterState {
  priority: Priority | 'All'
  category: string
  dueDate: 'All' | 'Due Soon' | 'Overdue' | 'No Date'
  status: TaskStatus | 'All'
}

const storageKey = 'taskflow-os::tasks'
const legacyDescription = ''
const updatedDescription = 'Practice makes perfect :)'

export const statusOptions: TaskStatus[] = ['To Do', 'In Progress', 'Done']
export const categoryOptions = ['Design', 'Engineering', 'Marketing', 'Operations', 'Personal']

const seedTasks = (): Task[] => [
  {
    id: crypto.randomUUID(),
    title: 'Submit project proposal',
    description: 'Finalize the document and send it before the deadline.',
    priority: 'High',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().slice(0, 10),
    category: 'Work',
    status: 'In Progress',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Buy groceries',
    description: 'Practice makes perfect :)',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toISOString().slice(0, 10),
    category: 'Personal',
    status: 'To Do',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Pay internet bill',
    description: 'Payment is overdue. Complete it today.',
    priority: 'High',
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString().slice(0, 10),
    category: 'Bills',
    status: 'To Do',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const emptyTaskDraft = (): TaskDraft => ({
  title: '',
  description: '',
  priority: 'Medium',
  dueDate: '',
  category: 'Personal',
  status: 'To Do',
})

const migrateTasks = (tasks: Task[]): Task[] =>
  tasks.map((task) =>
    task.description === legacyDescription
      ? { ...task, description: updatedDescription, updatedAt: new Date().toISOString() }
      : task,
  )

export const loadTasks = (): Task[] => {
  const raw = window.localStorage.getItem(storageKey)

  if (!raw) {
    const seeded = seedTasks()
    window.localStorage.setItem(storageKey, JSON.stringify(seeded))
    return seeded
  }

  try {
    const parsed = JSON.parse(raw) as Task[]
    const migrated = migrateTasks(parsed)
    window.localStorage.setItem(storageKey, JSON.stringify(migrated))
    return migrated
  } catch {
    const seeded = seedTasks()
    window.localStorage.setItem(storageKey, JSON.stringify(seeded))
    return seeded
  }
}

export const saveTasks = (tasks: Task[]) => {
  window.localStorage.setItem(storageKey, JSON.stringify(tasks))
}
