// Composant Maintenance: ouvre l'outil batch de maintenance (admin requis)

import { maintenanceToolAdmin } from '../services/api'
import { Highlight } from './Highlight'
import { normalizeText } from '../utils/text'

export function Maintenance({ query = '' }) {
  const openTool = async () => { try { await maintenanceToolAdmin() } catch {} }
  const visible = (text) => {
    const q = normalizeText(String(query || '').trim())
    if (q.length < 3) return true
    return normalizeText(text).includes(q)
  }

  return (
    <div className="flex flex-wrap gap-3">
      {visible('maintenance outil tout en un nettoyeur reparation maj updates') && (
      <div
        onClick={openTool}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openTool() }}
        className="w-64 bg-white rounded-lg border border-gray-200 shadow-sm p-4 cursor-pointer hover:border-teal-400 hover:shadow transition"
      >
        <div className="text-sm font-medium text-gray-900"><Highlight text="🛠️ Outil de maintenance" query={query} /></div>
        <div className="text-xs text-gray-600 mt-1">Suite complète: mises à jour, réseau, nettoyage</div>
      </div>
      )}
    </div>
  )
}


