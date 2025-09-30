// Composant Maintenance: ouvre l'outil batch de maintenance (admin requis)

import { maintenanceToolAdmin } from '../services/api'

export function Maintenance() {
  const openTool = async () => { try { await maintenanceToolAdmin() } catch {} }

  return (
    <div className="flex flex-wrap gap-3">
      <div
        onClick={openTool}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openTool() }}
        className="flex-1 min-w-[220px] bg-white rounded-lg border border-gray-200 shadow-sm p-4 cursor-pointer hover:border-teal-400 hover:shadow transition"
      >
        <div className="text-sm font-medium text-gray-900">Outil de maintenance</div>
        <div className="text-xs text-gray-600 mt-1">Suite complète: mises à jour, réseau, nettoyage</div>
      </div>
    </div>
  )
}


