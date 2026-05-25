import type { FilterState, Priority, Task } from '../taskStore'

export const priorityOptions: Priority[] = ['High', 'Medium', 'Low']

export const initialFilters: FilterState = {
  priority: 'All',
  category: 'All',
  dueDate: 'All',
  status: 'All',
}

export const formatDate = (value: string) => {
  if (!value) {
    return 'No due date'
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`))
}

export const formatCountdown = (value: string, now: number) => {
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

export const isWithinAlertWindow = (value: string, now: number) => {
  if (!value) {
    return false
  }

  const dueTime = new Date(`${value}T23:59:59`).getTime()
  const diff = dueTime - now
  return diff > 0 && diff <= 1000 * 60 * 60 * 12
}

export const toDateValue = (value: string) => {
  if (!value) {
    return Number.POSITIVE_INFINITY
  }

  return new Date(`${value}T00:00:00`).getTime()
}

export const isOverdue = (task: Task, today: number) =>
  Boolean(task.dueDate) && task.status !== 'Done' && toDateValue(task.dueDate) < today

export const isDueSoon = (task: Task, today: number) => {
  if (!task.dueDate || task.status === 'Done') {
    return false
  }

  const diff = toDateValue(task.dueDate) - today
  return diff >= 0 && diff <= 1000 * 60 * 60 * 24 * 2
}

export const matchesDueDateFilter = (
  task: Task,
  filter: FilterState['dueDate'],
  today: number,
) => {
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

export const predictorLabel = (task: Task, today: number) => {
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
