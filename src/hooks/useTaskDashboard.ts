import { useMemo } from 'react'
import type { FilterState, Task } from '../taskStore'
import {
  isDueSoon,
  isOverdue,
  isWithinAlertWindow,
  matchesDueDateFilter,
  toDateValue,
} from '../utils/taskHelpers'

const sortTasks = (left: Task, right: Task) => {
  if (left.pinned !== right.pinned) {
    return left.pinned ? -1 : 1
  }

  return toDateValue(left.dueDate) - toDateValue(right.dueDate)
}

interface UseTaskDashboardOptions {
  tasks: Task[]
  filters: FilterState
  search: string
  today: number
  now: number
}

export const useTaskDashboard = ({
  tasks,
  filters,
  search,
  today,
  now,
}: UseTaskDashboardOptions) => {
  const categories = useMemo(() => {
    const fromTasks = tasks.map((task) => task.category)
    return Array.from(new Set(fromTasks)).sort()
  }, [tasks])

  const highlightedTasks = useMemo(
    () =>
      tasks.filter(
        (task) => isOverdue(task, today) || isDueSoon(task, today) || task.priority === 'High',
      ),
    [tasks, today],
  )
  const sortedHighlightedTasks = useMemo(() => [...highlightedTasks].sort(sortTasks), [highlightedTasks])

  const alertNotifications = useMemo(
    () =>
      tasks
        .filter((task) => task.status !== 'Done' && isWithinAlertWindow(task.dueDate, now))
        .sort(sortTasks),
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
      .sort(sortTasks)
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

  const pastDueTasks = useMemo(
    () =>
      tasks
        .filter((task) => Boolean(task.dueDate) && toDateValue(task.dueDate) < today)
        .sort((left, right) => {
          if (left.pinned !== right.pinned) {
            return left.pinned ? -1 : 1
          }

          return toDateValue(right.dueDate) - toDateValue(left.dueDate)
        }),
    [tasks, today],
  )

  return {
    categories,
    highlightedTasks: sortedHighlightedTasks,
    alertNotifications,
    filteredTasks,
    taskSummary,
    pastDueTasks,
  }
}
