import type { FormEvent } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { FilterState, Task, TaskDraft } from '../taskStore'
import { TaskBoard } from './TaskBoard'
import { TaskComposer } from './TaskComposer'

interface TaskWorkspaceProps {
  draft: TaskDraft
  setDraft: Dispatch<SetStateAction<TaskDraft>>
  editingId: string | null
  categories: string[]
  highlightedTasks: Task[]
  today: number
  now: number
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
  search: string
  setSearch: Dispatch<SetStateAction<string>>
  filters: FilterState
  setFilters: Dispatch<SetStateAction<FilterState>>
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onStatusChange: (taskId: string, status: Task['status']) => void
}

export function TaskWorkspace({
  draft,
  setDraft,
  editingId,
  categories,
  highlightedTasks,
  today,
  now,
  onSubmit,
  onCancel,
  search,
  setSearch,
  filters,
  setFilters,
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskWorkspaceProps) {
  return (
    <section className="content-grid">
      <TaskComposer
        draft={draft}
        setDraft={setDraft}
        editingId={editingId}
        categories={categories}
        highlightedTasks={highlightedTasks}
        today={today}
        now={now}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />

      <TaskBoard
        search={search}
        setSearch={setSearch}
        filters={filters}
        setFilters={setFilters}
        categories={categories}
        tasks={tasks}
        today={today}
        now={now}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
      />
    </section>
  )
}
