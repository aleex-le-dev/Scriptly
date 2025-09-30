// Composant Systeme: actions système (menu contextuel classique)
// - Ouvre une fenêtre CMD avec le script registre (admin requis)

import { systemContextMenuClassicAdmin } from '../services/api'

export function Systeme() {
  const openClassicMenuToggle = async () => { try { await systemContextMenuClassicAdmin() } catch {} }

  return (
    <div className="flex flex-wrap gap-3">
      <div
        onClick={openClassicMenuToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openClassicMenuToggle() }}
        className="flex-1 min-w-[220px] bg-white rounded-lg border border-gray-200 shadow-sm p-4 cursor-pointer hover:border-amber-400 hover:shadow transition"
      >
        <div className="text-sm font-medium text-gray-900">Menu contextuel classique</div>
        <div className="text-xs text-gray-600 mt-1">Active/restaure le menu classique (Win11)</div>
      </div>
    </div>
  )
}


