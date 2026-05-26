import type { AppPage } from '../hooks/usePageRoute'

interface PageNavigationProps {
  currentPage: AppPage
  onNavigate: (page: AppPage) => void
}

export function PageNavigation({ currentPage, onNavigate }: PageNavigationProps) {
  return (
    <nav className="page-nav" aria-label="Task pages">
      <button
        type="button"
        className={`page-nav-button ${currentPage === 'tasks' ? 'active' : ''}`}
        onClick={() => onNavigate('tasks')}
      >
        My Tasks
      </button>
      <button
        type="button"
        className={`page-nav-button ${currentPage === 'past-due' ? 'active' : ''}`}
        onClick={() => onNavigate('past-due')}
      >
        Past Deadline
      </button>
    </nav>
  )
}
