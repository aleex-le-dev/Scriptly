import './App.css'
import { ToastContainer } from './components/Toast'
import { useToast } from './hooks/useToast'
import { Disks } from './components/Disks'
import { Reseau } from './components/Reseau'
import { Application } from './components/Application'
import { Systeme } from './components/Systeme'
import { Maintenance } from './components/Maintenance'
import { Search } from './components/Search'

function App() {
  // Toasts via hook
  const { toasts, removeToast } = useToast()

  return (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <Search placeholder="Rechercher une action ou section..." />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl shadow-lg border border-teal-200 p-6">
          <h2 className='text-xl font-semibold text-teal-900 mb-2'>🛠️ Maintenance</h2>
          <p className="text-sm text-teal-700 mb-4">Outil tout-en-un: mises à jour, réseau, nettoyage, réparations.</p>
          <Maintenance />
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-lg border border-amber-200 p-6">
          <h2 className='text-xl font-semibold text-amber-900 mb-2'>⚙️ Système</h2>
          <p className="text-sm text-amber-700 mb-4">Tweaks Windows 11 (registre, Explorer).</p>
          <Systeme />
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg border border-purple-200 p-6">
          <h2 className='text-xl font-semibold text-purple-900 mb-2'>📦 Applications</h2>
          <p className="text-sm text-purple-700 mb-4">Mises à jour système et applications via winget.</p>
          <Application />
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg border border-blue-200 p-6">
          <h2 className='text-xl font-semibold text-blue-900 mb-2'>🌐 Réseau</h2>
          <p className="text-sm text-blue-700 mb-4">Scripts liés à la configuration réseau (DNS Cloudflare).</p>
          <Reseau />
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg border border-gray-200 p-6 md:col-span-2 lg:col-span-3">
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>💾 Disque dur</h2>
          <p className="text-sm text-gray-700 mb-4">Regroupe tous les scripts liés aux opérations sur les disques.</p>
          <Disks />
        </div>
      </div>
    </div>

    <ToastContainer toasts={toasts} onRemove={removeToast} />
  </div>
  )
}

export default App
