import './App.css'
import { useState, useEffect, useMemo } from 'react'
import { ToastContainer } from './components/Toast'
import { useToast } from './hooks/useToast'
import { Catalog } from './components/Catalog'
import { Search } from './components/Search'
import { DarkModeToggle } from './components/DarkModeToggle'
import { DarkModeProvider } from './contexts/DarkModeContext'
import { Highlight } from './components/Highlight'
import { Logiciel } from './components/Logiciel'
import { Nirsoft } from './components/Nirsoft'
import { Card } from './components/Card'
import { normalizeText } from './utils/text'

function App() {
  // Toasts via hook
  const { toasts, removeToast } = useToast()
  const [query, setQuery] = useState('')
  // Plus de cartes repliables: closeAll devient un noop
  const closeAll = () => {}
  const q = normalizeText((query || '').trim())
  const cardKeywords = useMemo(() => ({
    maintenance: 'maintenance outil tout en un mises a jour reseau nettoyage reparations update updates',
    systeme: 'systeme tweaks windows registre explorer menu contextuel classique toggle',
    applications: 'applications winget update upgrade mises a jour',
    logiciels: 'logiciels telechargement chrome google vlc sumatra pdf navigateur browser download',
    nirsoft: 'nirsoft produkey pro product key wirelesskeyview wifi webbrowserpassview web browser pass view mots de passe password',
    reseau: 'reseau dns cloudflare configuration network',
    disques: 'disque disques operations chkdsk defragmenter defrag formater format bitlocker lister drives diskpart',
  }), [])
  // plus utilisé dans la vue catalogue

  // Ancien comportement d'ouverture automatique désactivé (catalogue)
  useEffect(() => {
    // noop
  }, [q, cardKeywords])

  return (
  <DarkModeProvider>
    <div className="min-h-screen bg-gray-50 dark:bg-black" onClick={closeAll}>
      {/* Barre de recherche fixe avec effet verre (transparence + blur) */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-6xl mx-auto py-4 flex items-center relative">
          <Search value={query} onChange={setQuery} placeholder="Rechercher un script..." />
          <div className="absolute right-0">
            <DarkModeToggle />
          </div>
        </div>
      </div>

    {/* Contenu avec offset */}
    <div className="w-full pt-24 pb-10" onClick={(e) => e.stopPropagation()}>
      <div className="w-full px-2 md:px-3 max-w-6xl mx-auto">
        <Catalog query={query} />
      </div>
    </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  </DarkModeProvider>
  )
}

export default App
