import { useState } from 'react'
import { DarkModeProvider } from './contexts/DarkModeContext'
import { Search } from './components/Search'
import { Catalog } from './components/Catalog'
import { DarkModeToggle } from './components/DarkModeToggle'
import './App.css'

function App() {
  const [query, setQuery] = useState('')

  return (
    <DarkModeProvider>
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
            <div className="absolute right-0">
              <DarkModeToggle />
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
    </DarkModeProvider>
  )
}

export default App