import { useEffect, useState } from 'react'

export type AppPage = 'tasks' | 'past-due'

const getPageFromHash = (): AppPage => {
  return window.location.hash === '#/past-due' ? 'past-due' : 'tasks'
}

export const usePageRoute = () => {
  const [page, setPage] = useState<AppPage>(() => getPageFromHash())

  useEffect(() => {
    const handleHashChange = () => {
      setPage(getPageFromHash())
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigateTo = (nextPage: AppPage) => {
    window.location.hash = nextPage === 'past-due' ? '/past-due' : '/'
  }

  return { page, navigateTo }
}
