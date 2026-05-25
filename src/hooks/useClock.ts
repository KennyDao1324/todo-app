import { useEffect, useMemo, useState } from 'react'

export const useClock = () => {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  const today = useMemo(() => {
    const value = new Date(now)
    value.setHours(0, 0, 0, 0)
    return value.getTime()
  }, [now])

  return { now, today }
}
