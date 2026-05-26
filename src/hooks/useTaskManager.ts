import { useEffect, useState } from 'react'
import { emptyTaskDraft, loadTasks, saveTasks, type Task, type TaskDraft } from '../taskStore'

export const useTaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks())
  const [draft, setDraft] = useState<TaskDraft>(emptyTaskDraft())
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key) {
        setTasks(loadTasks())
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const resetDraft = () => {
    setDraft(emptyTaskDraft())
    setEditingId(null)
  }

  const saveTask = () => {
    const nextTask: Task = {
      id: editingId ?? crypto.randomUUID(),
      title: draft.title.trim(),
      description: draft.description.trim(),
      priority: draft.priority,
      dueDate: draft.dueDate,
      category: draft.category.trim(),
      status: draft.status,
      pinned: editingId ? tasks.find((task) => task.id === editingId)?.pinned ?? false : false,
      createdAt: editingId
        ? tasks.find((task) => task.id === editingId)?.createdAt ?? new Date().toISOString()
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (!nextTask.title || !nextTask.category) {
      return false
    }

    setTasks((currentTasks) => {
      if (!editingId) {
        return [nextTask, ...currentTasks]
      }

      return currentTasks.map((task) => (task.id === editingId ? nextTask : task))
    })

    resetDraft()
    return true
  }

  const startEditingTask = (task: Task) => {
    setEditingId(task.id)
    setDraft({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      category: task.category,
      status: task.status,
    })
  }

  const deleteTask = (taskId: string) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId))

    if (editingId === taskId) {
      resetDraft()
    }
  }

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, status, updatedAt: new Date().toISOString() } : task,
      ),
    )
  }

  const toggleTaskPinned = (taskId: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? { ...task, pinned: !task.pinned, updatedAt: new Date().toISOString() }
          : task,
      ),
    )
  }

  return {
    tasks,
    draft,
    setDraft,
    editingId,
    saveTask,
    resetDraft,
    startEditingTask,
    deleteTask,
    updateTaskStatus,
    toggleTaskPinned,
  }
}
