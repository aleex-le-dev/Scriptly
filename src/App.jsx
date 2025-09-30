import './App.css'
import { useState } from 'react'
import { ToastContainer } from './components/Toast'

function App() {
  // Toast list state and helpers
  const [toasts, setToasts] = useState([])
  const addToast = (message, type = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    setToasts(prev => [{ id, message, type }, ...prev])
  }
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id))
  async function onClickHealth() {
    try {
      const response = await fetch('http://127.0.0.1:3001/health')
      const result = await response.json()
      if (result?.status === 'ok') {
        addToast('Serveur OK', 'success')
      } else {
        addToast('Serveur non disponible', 'error')
      }
    } catch {
      addToast('Erreur réseau vers le serveur local', 'error')
    }
  }
  async function onClickTestPs1() {
    try {
      const response = await fetch('http://127.0.0.1:3001/test-message')
      const result = await response.json()
      if (!result.ok) {
        addToast(`Erreur d'exécution: ${result.stderr || 'échec'}`, 'error')
      } else {
        addToast('Script PowerShell exécuté', 'success')
      }
    } catch {
      addToast('Erreur réseau vers le serveur local', 'error')
    }
  }

  async function onClickTestBat() {
    try {
      const response = await fetch('http://127.0.0.1:3001/test-bat')
      const result = await response.json()
      if (!result.ok) {
        addToast(`Erreur d'exécution: ${result.stderr || 'échec'}`,'error')
      } else {
        addToast('Script Batch exécuté', 'success')
      }
    } catch {
      addToast('Erreur réseau vers le serveur local', 'error')
    }
  }

  return (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
    <h1 className='text-3xl font-bold text-center text-gray-900'>Tests de scripts locaux</h1>
    <div className="flex gap-3">
      <button onClick={onClickHealth} className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-black">Tester le serveur</button>
      <button onClick={onClickTestPs1} className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700">PowerShell: MessageBox</button>
      <button onClick={onClickTestBat} className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">Batch: Fenêtre CMD</button>
    </div>
    <p className="text-sm text-gray-600">Assurez-vous que le serveur local tourne et que vous l'exécutez en tant qu'administrateur pour certains scripts.</p>

    <ToastContainer toasts={toasts} onRemove={removeToast} />
  </div>
  )
}

export default App
