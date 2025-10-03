// Toggle pour basculer entre mode sombre et clair
import { useDarkMode } from '../contexts/DarkModeContext'

export function DarkModeToggle() {
  const { isDark, toggleDarkMode } = useDarkMode()

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-xl bg-white/30 dark:bg-black/30 backdrop-blur-xl border border-white/30 dark:border-white/20 hover:bg-white/40 dark:hover:bg-black/40 transition-all duration-200 cursor-pointer shadow-lg"
      aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
    >
      {isDark ? (
        <span className="text-xl">☀️</span>
      ) : (
        <span className="text-xl">🌙</span>
      )}
    </button>
  )
}
