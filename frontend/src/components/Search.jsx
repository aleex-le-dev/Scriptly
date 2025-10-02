// Composant Search: barre de recherche réutilisable avec icône et styles
// Props: value (string), onChange (fn), placeholder (string)

export function Search({ value = '', onChange, placeholder = 'Rechercher…' }) {
  const handleChange = (e) => {
    if (typeof onChange === 'function') onChange(e.target.value)
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">🔎</span>
        <input
          aria-label="Recherche"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 bg-white shadow focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-sm"
        />
      </div>
    </div>
  )
}


