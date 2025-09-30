// Composant regroupant les boutons d'actions serveur
// - Déclenche les scripts PS1 et BAT

import { runPowershellMessage, runBatchWindow } from '../services/api'

export function ServerActions({ onSuccess, onError }) {

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
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <button onClick={onClickTestPs1} className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 w-full sm:w-auto">PowerShell: MessageBox</button>
      <button onClick={onClickTestBat} className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 w-full sm:w-auto">Batch: Fenêtre CMD</button>
    </div>
  )
}


