import './App.css'
import { ToastContainer } from './components/Toast'
import { useToast } from './hooks/useToast'
import { Disks } from './components/Disks'
import { Reseau } from './components/Reseau'

function App() {
  // Toasts via hook
  const { toasts, removeToast } = useToast()

  return (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex flex-col items-stretch gap-6">
        <div>
          <h2 className='text-xl font-semibold text-gray-900'>Réseau</h2>
          <p className="text-sm text-gray-600">Scripts liés à la configuration réseau (DNS Cloudflare).</p>
          <div className="mt-3">
            <Reseau />
          </div>
        </div>
        <div>
          <h2 className='text-xl font-semibold text-gray-900'>Disque dur</h2>
          <p className="text-sm text-gray-600">Regroupe tous les scripts liés aux opérations sur les disques.</p>
          <div className="mt-3">
            <Disks />
          </div>
        </div>
      </div>
    </div>

    <ToastContainer toasts={toasts} onRemove={removeToast} />
  </div>
  )
}

export default App
