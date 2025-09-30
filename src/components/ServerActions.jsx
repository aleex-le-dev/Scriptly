// Composant regroupant les boutons d'actions serveur
// - Déclenche la santé, script PS1 et script BAT

import { fetchHealth, runPowershellMessage, runBatchWindow } from '../services/api'

export function ServerActions({ onSuccess, onError }) {
  const onClickHealth = async () => {
    try {
      const result = await fetchHealth()
      if (result?.status === 'ok') onSuccess('Serveur OK')
      else onError('Serveur non disponible')
    } catch {
      onError('Erreur réseau vers le serveur local')
    }
  }

  const onClickTestPs1 = async () => {
    try {
      const result = await runPowershellMessage()
      if (!result.ok) onError(`Erreur d'exécution: ${result.stderr || 'échec'}`)
    } catch {
      onError('Erreur réseau vers le serveur local')
    }
  }

  const onClickTestBat = async () => {
    try {
      const result = await runBatchWindow()
      if (!result.ok) onError(`Erreur d'exécution: ${result.stderr || 'échec'}`)
    } catch {
      onError('Erreur réseau vers le serveur local')
    }
  }

  return (
    <div className="flex gap-3">
      <button onClick={onClickHealth} className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-black">Tester le serveur</button>
      <button onClick={onClickTestPs1} className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700">PowerShell: MessageBox</button>
      <button onClick={onClickTestBat} className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">Batch: Fenêtre CMD</button>
    </div>
  )
}


