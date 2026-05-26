import type { ThemeMode } from '../hooks/useTheme'

interface ThemeToggleProps {
  theme: ThemeMode
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button type="button" className="theme-toggle" onClick={onToggle} aria-label="Toggle theme">
      <span className="theme-toggle-label">{theme === 'light' ? 'Light mode' : 'Dark mode'}</span>
      <span className="theme-toggle-value">{theme === 'light' ? 'Switch to dark' : 'Switch to light'}</span>
    </button>
  )
}
