import { useMemo } from 'react'
import type { FilterState, Task } from '../taskStore'
import {
  isDueSoon,
  isOverdue,
  isWithinAlertWindow,
  matchesDueDateFilter,
  toDateValue,
} from '../utils/taskHelpers'

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

  return {
    categories,
    highlightedTasks,
    alertNotifications,
    filteredTasks,
    taskSummary,
  }
}
