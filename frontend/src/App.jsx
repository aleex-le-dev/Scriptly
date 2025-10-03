import './App.css'
import { useState } from 'react'
import { ToastContainer } from './components/Toast'
import { useToast } from './hooks/useToast'
import { Disks } from './components/Disks'
import { Reseau } from './components/Reseau'
import { Application } from './components/Application'
import { Systeme } from './components/Systeme'
import { Maintenance } from './components/Maintenance'
import { Search } from './components/Search'
import { Highlight } from './components/Highlight'
import { Logiciel } from './components/Logiciel'
import { Nirsoft } from './components/Nirsoft'
import { normalizeText } from './utils/text'

function App() {
  // Toasts via hook
  const { toasts, removeToast } = useToast()
  const [query, setQuery] = useState('')
  const q = normalizeText((query || '').trim())
  const visible = (text) => {
    if (q.length < 3) return true
    return normalizeText(text).includes(q)
  }

  return (
  <div className="min-h-screen bg-gray-50">
    {/* Barre de recherche fixe centrée en haut */}
    <div className="fixed top-0 left-0 right-0 z-50 bg-gray-50/95 backdrop-blur border-b border-gray-200">
      <div className="w-full py-4">
        <Search value={query} onChange={setQuery} placeholder="Rechercher un script..." />
      </div>
    </div>

    {/* Contenu avec offset pour la barre fixe et largeur pleine sans marges latérales */}
    <div className="w-full px-0 pt-24 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible('maintenance outil tout en un mises a jour reseau nettoyage reparations') && (
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl shadow-lg border border-teal-200 p-6">
          <h2 className='text-xl font-semibold text-teal-900 mb-2'><Highlight text="🛠️ Maintenance" query={query} /></h2>
          <p className="text-sm text-teal-700 mb-4"><Highlight text="Outil tout-en-un: mises à jour, réseau, nettoyage, réparations." query={query} /></p>
          <Maintenance query={query} />
        </div>
        )}
        {visible('systeme tweaks windows registre explorer menu contextuel') && (
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-lg border border-amber-200 p-6">
          <h2 className='text-xl font-semibold text-amber-900 mb-2'><Highlight text="⚙️ Système" query={query} /></h2>
          <p className="text-sm text-amber-700 mb-4"><Highlight text="Tweaks Windows 11 (registre, Explorer)." query={query} /></p>
          <Systeme query={query} />
        </div>
        )}
        {visible('applications mises a jour winget upgrade') && (
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg border border-purple-200 p-6">
          <h2 className='text-xl font-semibold text-purple-900 mb-2'><Highlight text="📦 Applications" query={query} /></h2>
          <p className="text-sm text-purple-700 mb-4"><Highlight text="Mises à jour système et applications via winget." query={query} /></p>
          <Application query={query} />
        </div>
        )}
        {visible('logiciels telechargement chrome vlc sumatra pdf navigateur lecteur') && (
        <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl shadow-lg border border-rose-200 p-6">
          <h2 className='text-xl font-semibold text-rose-900 mb-2'><Highlight text="💿 Logiciels" query={query} /></h2>
          <p className="text-sm text-rose-700 mb-4"><Highlight text="Liens directs vers Chrome, VLC, SumatraPDF." query={query} /></p>
          <Logiciel query={query} />
        </div>
        )}
        {visible('nirsoft utilitaires wifi licence cle bsod') && (
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl shadow-lg border border-indigo-200 p-6">
          <h2 className='text-xl font-semibold text-indigo-900 mb-2'><Highlight text="🧰 NirSoft" query={query} /></h2>
          <p className="text-sm text-indigo-700 mb-4"><Highlight text="Utilitaires portables (ProduKey, WirelessKeyView, BlueScreenView)." query={query} /></p>
          <Nirsoft query={query} />
        </div>
        )}
        {visible('reseau dns cloudflare configuration') && (
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg border border-blue-200 p-6">
          <h2 className='text-xl font-semibold text-blue-900 mb-2'><Highlight text="🌐 Réseau" query={query} /></h2>
          <p className="text-sm text-blue-700 mb-4"><Highlight text="Scripts liés à la configuration réseau (DNS Cloudflare)." query={query} /></p>
          <Reseau query={query} />
        </div>
        )}
        {visible('disque dur operations chkdsk defragmenter formater bitlocker') && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg border border-gray-200 p-6 md:col-span-2 lg:col-span-3">
          <h2 className='text-xl font-semibold text-gray-900 mb-2'><Highlight text="💾 Disque dur" query={query} /></h2>
          <p className="text-sm text-gray-700 mb-4"><Highlight text="Regroupe tous les scripts liés aux opérations sur les disques." query={query} /></p>
          <Disks query={query} />
        </div>
        )}
      </div>
    </div>

    <ToastContainer toasts={toasts} onRemove={removeToast} />
  </div>
  )
}

export default App
