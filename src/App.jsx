import './App.css'
import { ToastContainer } from './components/Toast'
import { useToast } from './hooks/useToast'
import { DebugPanel } from './components/DebugPanel'

function App() {
  // Toasts via hook
  const { toasts, addToast, removeToast } = useToast()

  return (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex flex-col items-stretch gap-4">
        <h1 className='text-2xl font-semibold text-gray-900 text-center'>Interface</h1>
        <p className="text-sm text-gray-600 text-center">Les actions de test sont disponibles dans le panneau Debug.</p>
      </div>
    </div>

    <ToastContainer toasts={toasts} onRemove={removeToast} />
    <DebugPanel onError={(m) => addToast(m, 'error')} />
  </div>
  )
}

export default App
