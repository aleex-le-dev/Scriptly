import { useEffect, useState } from 'react'
import { probeLocalAgent, runOnLoadActions } from './services/api'
import { DarkModeProvider } from './contexts/DarkModeContext'
import { Search } from './components/Search'
import { Catalog } from './components/Catalog'
import { DarkModeToggle } from './components/DarkModeToggle'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [agentUp, setAgentUp] = useState(false)

  useEffect(() => {
    let alive = true
    const check = async () => {
      const ok = await probeLocalAgent()
      if (alive) setAgentUp(ok)
      if (ok) {
        // Déclenchement auto si paramètre ?run=
        runOnLoadActions()
      }
    }
    check()
    const id = setInterval(check, 5000)
    return () => { alive = false; clearInterval(id) }
  }, [])

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
            <div className={`mb-4 p-3 rounded border ${agentUp ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
              {agentUp ? (
                <div className="flex items-center gap-2 text-sm">
                  <span>✅ Agent local détecté sur 127.0.0.1:3001</span>
                  <a className="underline" href="http://127.0.0.1:3001/health" target="_blank" rel="noreferrer">vérifier</a>
                </div>
              ) : (
                <div className="text-sm flex flex-col gap-1">
                  <div>⚠ Aucun agent local détecté. Les scripts seront téléchargés au lieu d'être exécutés automatiquement.</div>
                  <div className="flex gap-3 flex-wrap">
                    <a className="underline font-medium" href="/bootstrap-launcher.bat" download>Installer le lanceur (admin)</a>
                    <a className="underline" href="script-launcher://run?run=winget" title="Nécessite le lanceur installé">Tester le lancement</a>
                  </div>
                </div>
              )}
            </div>
            <Catalog query={query} />
          </div>
        </div>
      </div>
    </DarkModeProvider>
  )
}

export default App