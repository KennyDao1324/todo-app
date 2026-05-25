interface HeroSectionProps {
  total: number
  inProgress: number
  overdue: number
  completed: number
}

export function HeroSection({ total, inProgress, overdue, completed }: HeroSectionProps) {
  return (
    <section className="hero-panel">
      <div>
        <p className="eyebrow">TaskFlow OS</p>
        <h1>My Tasks</h1>
        <p className="hero-copy">Track priorities, manage deadlines, and keep work moving.</p>
      </div>

      <div className="hero-grid" aria-label="Task summary">
        <article className="metric-card">
          <span>Total tasks</span>
          <strong>{total}</strong>
        </article>
        <article className="metric-card">
          <span>In progress</span>
          <strong>{inProgress}</strong>
        </article>
        <article className="metric-card alert">
          <span>Overdue</span>
          <strong>{overdue}</strong>
        </article>
        <article className="metric-card success">
          <span>Completed</span>
          <strong>{completed}</strong>
        </article>
      </div>
    </section>
  )
}
