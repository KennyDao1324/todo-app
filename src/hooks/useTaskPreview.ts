import { useState } from 'react'
import type { Task } from '../taskStore'

export const useTaskPreview = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const openTaskPreview = (task: Task) => {
    setSelectedTask(task)
  }

  const closeTaskPreview = () => {
    setSelectedTask(null)
  }

  return {
    selectedTask,
    openTaskPreview,
    closeTaskPreview,
  }
}
