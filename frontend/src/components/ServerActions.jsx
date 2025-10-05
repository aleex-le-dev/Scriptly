// Composant regroupant les boutons d'actions serveur
// - Déclenche les scripts PS1 et BAT

import { openLocalScript } from '../services/api'

export function ServerActions({ onSuccess, onError }) {

  const onClickTestPs1 = async () => { openLocalScript('disks/powershells/list-drives.ps1') }

  const onClickTestBat = async () => { openLocalScript('maintenance/batch/windows-maintenance-admin.bat') }

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <button onClick={onClickTestPs1} className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 w-full sm:w-auto">PowerShell: MessageBox</button>
      <button onClick={onClickTestBat} className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 w-full sm:w-auto">Batch: Fenêtre CMD</button>
    </div>
  )
}


