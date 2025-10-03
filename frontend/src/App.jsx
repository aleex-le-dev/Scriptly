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
import { Card } from './components/Card'
import { normalizeText } from './utils/text'

function App() {
  // Toasts via hook
  const { toasts, removeToast } = useToast()
  const [query, setQuery] = useState('')
  // Ouverture des catégories (repliées par défaut)
  const [open, setOpen] = useState({
    maintenance: false,
    systeme: false,
    applications: false,
    logiciels: false,
    nirsoft: false,
    reseau: false,
    disques: false,
  })
  const toggle = (key) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }))
  const q = normalizeText((query || '').trim())
  const visible = (text) => {
    if (q.length < 3) return true
    return normalizeText(text).includes(q)
  }

  return (
  <div className="min-h-screen bg-gray-50">
    {/* Barre de recherche fixe avec effet verre (transparence + blur) */}
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/30 backdrop-blur-md border-b border-white/20 shadow-sm">
      <div className="max-w-6xl mx-auto py-4">
        <Search value={query} onChange={setQuery} placeholder="Rechercher un script..." />
      </div>
    </div>

    {/* Contenu avec offset, largeur contenue et marges latérales */}
    <div className="w-full pt-24 pb-10">
      <div className="w-full px-2 md:px-3">
        <div className="flex flex-wrap justify-start gap-6">
        {visible('maintenance outil tout en un mises a jour reseau nettoyage reparations') && (
        <Card
          title={<Highlight text="🛠️ Maintenance" query={query} />}
          description={<Highlight text="Outil tout-en-un: mises à jour, réseau, nettoyage, réparations." query={query} />}
          gradient="from-teal-100/60 to-teal-50/60"
          border="border-teal-300/50"
          text="text-teal-900"
          textMuted="text-teal-700"
          isOpen={open.maintenance}
          onToggle={() => toggle('maintenance')}
        >
          <Maintenance query={query} />
        </Card>
        )}
        {visible('systeme tweaks windows registre explorer menu contextuel') && (
        <Card
          title={<Highlight text="⚙️ Système" query={query} />}
          description={<Highlight text="Tweaks Windows 11 (registre, Explorer)." query={query} />}
          gradient="from-amber-100/60 to-amber-50/60"
          border="border-amber-300/50"
          text="text-amber-900"
          textMuted="text-amber-700"
          isOpen={open.systeme}
          onToggle={() => toggle('systeme')}
        >
          <Systeme query={query} />
        </Card>
        )}
        {visible('applications mises a jour winget upgrade') && (
        <Card
          title={<Highlight text="📦 Applications" query={query} />}
          description={<Highlight text="Mises à jour système et applications via winget." query={query} />}
          gradient="from-purple-100/60 to-purple-50/60"
          border="border-purple-300/50"
          text="text-purple-900"
          textMuted="text-purple-700"
          isOpen={open.applications}
          onToggle={() => toggle('applications')}
        >
          <Application query={query} />
        </Card>
        )}
        {visible('logiciels telechargement chrome vlc sumatra pdf navigateur lecteur') && (
        <Card
          title={<Highlight text="💿 Logiciels" query={query} />}
          description={<Highlight text="Liens directs vers Chrome, VLC, SumatraPDF." query={query} />}
          gradient="from-rose-100/60 to-rose-50/60"
          border="border-rose-300/50"
          text="text-rose-900"
          textMuted="text-rose-700"
          isOpen={open.logiciels}
          onToggle={() => toggle('logiciels')}
        >
          <Logiciel query={query} />
        </Card>
        )}
        {visible('nirsoft utilitaires wifi licence cle bsod') && (
        <Card
          title={<Highlight text="🧰 NirSoft" query={query} />}
          description={<Highlight text="Utilitaires portables (ProduKey, WirelessKeyView, BlueScreenView)." query={query} />}
          gradient="from-indigo-100/60 to-indigo-50/60"
          border="border-indigo-300/50"
          text="text-indigo-900"
          textMuted="text-indigo-700"
          isOpen={open.nirsoft}
          onToggle={() => toggle('nirsoft')}
        >
          <Nirsoft query={query} />
        </Card>
        )}
        {visible('reseau dns cloudflare configuration') && (
        <Card
          title={<Highlight text="🌐 Réseau" query={query} />}
          description={<Highlight text="Scripts liés à la configuration réseau (DNS Cloudflare)." query={query} />}
          gradient="from-blue-100/60 to-blue-50/60"
          border="border-blue-300/50"
          text="text-blue-900"
          textMuted="text-blue-700"
          isOpen={open.reseau}
          onToggle={() => toggle('reseau')}
        >
          <Reseau query={query} />
        </Card>
        )}
        {visible('disque dur operations chkdsk defragmenter formater bitlocker') && (
        <Card
          title={<Highlight text="💾 Disque dur" query={query} />}
          description={<Highlight text="Regroupe tous les scripts liés aux opérations sur les disques." query={query} />}
          gradient="from-gray-100/60 to-gray-50/60"
          border="border-gray-300/50"
          text="text-gray-900"
          textMuted="text-gray-700"
          isOpen={open.disques}
          onToggle={() => toggle('disques')}
        >
          <Disks query={query} />
        </Card>
        )}
        </div>
      </div>
    </div>

    <ToastContainer toasts={toasts} onRemove={removeToast} />
  </div>
  )
}

export default App
