// Composant Application: gestion des mises à jour via winget
// - Ouvre une fenêtre CMD avec le menu winget (admin requis)

import { appsWingetUpdateAdmin } from '../services/api'

export function Application() {
  const openWingetManager = async () => { try { await appsWingetUpdateAdmin() } catch {} }

  return (
    <div className="flex flex-wrap gap-3">
      <div
        onClick={openWingetManager}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openWingetManager() }}
        className="w-64 bg-white rounded-lg border border-gray-200 shadow-sm p-4 cursor-pointer hover:border-purple-400 hover:shadow transition"
      >
        <div className="text-sm font-medium text-gray-900">📦 Mises à jour (winget)</div>
        <div className="text-xs text-gray-600 mt-1">Gestionnaire de mises à jour des applications</div>
      </div>
    </div>
  )
}


