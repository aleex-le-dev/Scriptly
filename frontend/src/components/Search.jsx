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
          className="w-full pl-9 pr-3 py-3 rounded-2xl border border-white/30 bg-white/60 backdrop-blur-xl backdrop-saturate-150 shadow-md text-sm text-gray-900 placeholder-gray-700/70 focus:outline-none focus:ring-2 focus:ring-teal-300/60 focus:border-teal-400/60 hover:bg-white/70"
        />
      </div>
    </div>
  )
}


