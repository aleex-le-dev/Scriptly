// Composant Maintenance: ouvre l'outil batch de maintenance (admin requis)

import { maintenanceToolAdmin } from '../services/api'

export function Maintenance() {
  const openTool = async () => { try { await maintenanceToolAdmin() } catch {} }

  return (
    <div className="flex flex-col gap-2">
      <button onClick={openTool} className="w-full px-3 py-1.5 rounded-md bg-teal-700 text-white text-sm">🛠️ Ouvrir l'outil de maintenance (Admin)</button>
    </div>
  )
}


