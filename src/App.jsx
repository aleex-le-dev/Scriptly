import './App.css'
import { ToastContainer } from './components/Toast'
import { ServerActions } from './components/ServerActions'
import { useToast } from './hooks/useToast'

function App() {
  // Toasts via hook
  const { toasts, addToast, removeToast } = useToast()

  return (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
    <h1 className='text-3xl font-bold text-center text-gray-900'>Tests de scripts locaux</h1>
    <ServerActions onSuccess={(m) => addToast(m, 'success')} onError={(m) => addToast(m, 'error')} />
    <p className="text-sm text-gray-600">Assurez-vous que le serveur local tourne et que vous l'exécutez en tant qu'administrateur pour certains scripts.</p>

    <ToastContainer toasts={toasts} onRemove={removeToast} />
  </div>
  )
}

export default App
