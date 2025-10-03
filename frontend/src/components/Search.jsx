// Composant Search: barre de recherche réutilisable avec icône et styles
// Props: value (string), onChange (fn), placeholder (string)

import { useEffect, useRef } from 'react'

export function Search({ value = '', onChange, placeholder = 'Rechercher…' }) {
  const inputRef = useRef(null)
  const handleChange = (e) => {
    if (typeof onChange === 'function') onChange(e.target.value)
  }

  useEffect(() => {
    // Focus automatique au montage
    try { inputRef.current?.focus() } catch {}
  }, [])

  return (
    // Conteneur centré, largeur maximale et responsive
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-600/70">🔎</span>
        <input
          aria-label="Recherche"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          ref={inputRef}
          autoFocus
          className="w-full pl-9 pr-3 py-3 rounded-2xl glass bg-white/50 dark:bg-black/50 text-sm text-gray-900 dark:text-white placeholder-gray-700/70 dark:placeholder-gray-300/70 border border-white/30 dark:border-white/20 shadow-2xl transition focus:outline-none focus:ring-2 focus:ring-teal-300/70 focus:border-teal-400/70 hover:bg-white/60 dark:hover:bg-black/60"
        />
      </div>
    </div>
  )
}


