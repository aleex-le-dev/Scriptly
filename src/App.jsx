import { useEffect, useState } from 'react'
import { DarkModeProvider } from './contexts/DarkModeContext'
import { Gate } from './components/Gate'
import { Search } from './components/Search'
import { Catalog } from './components/Catalog'
import { DarkModeToggle } from './components/DarkModeToggle'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const lockAccess = () => {
    sessionStorage.removeItem('gate_ok')
    window.location.reload()
  }

  useEffect(() => {
    const onContextMenu = (e) => {
      e.preventDefault()
    }
    const onKeyDown = (e) => {
      // Bloque F12 (inclut Fn+F12 via keyCode/which 123)
      const isF12 = e.key === 'F12' || e.keyCode === 123 || e.which === 123
      if (isF12) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    window.addEventListener('contextmenu', onContextMenu)
    window.addEventListener('keydown', onKeyDown, { capture: true })
    return () => {
      window.removeEventListener('contextmenu', onContextMenu)
      window.removeEventListener('keydown', onKeyDown, { capture: true })
    }
  }, [])

  return (
    <DarkModeProvider>
      <Gate expected="AetA" storageKey="gate_ok">
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        {/* Header avec recherche et toggle dark mode */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-transparent">
          <div className="max-w-6xl mx-auto py-4 flex items-center relative">
            <div className="w-full max-w-3xl mx-auto">
              <div className="relative">
                <Search
                  value={query}
                  onChange={setQuery}
                  placeholder="Rechercher un script..."
                />
              </div>
            </div>
            <div className="absolute right-0 flex items-center gap-2">
              <DarkModeToggle />
              <button
                onClick={lockAccess}
                className="p-2 rounded-xl bg-white/30 dark:bg-black/30 backdrop-blur-xl border border-white/30 dark:border-white/20 hover:bg-white/40 dark:hover:bg-black/40 transition-all duration-200 cursor-pointer shadow-lg"
                aria-label="Verrouiller l'accès"
                title="Verrouiller l'accès (efface la session)"
              >
                <span className="text-xl">🔒</span>
              </button>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="w-full pt-24 pb-10">
          <div className="max-w-6xl mx-auto px-4">
            <Catalog query={query} />
          </div>
        </div>
      </div>
      </Gate>
    </DarkModeProvider>
  )
}

export default App