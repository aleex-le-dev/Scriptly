// Composant Application: gestion des mises à jour via winget
// - Ouvre une fenêtre CMD avec le menu winget (admin requis)

import { appsWingetUpdateAdmin } from '../services/api'

export function Application() {
  const openWingetManager = async () => { try { await appsWingetUpdateAdmin() } catch {} }

  return (
    <div className="flex flex-col gap-2">
      <button onClick={openWingetManager} className="w-full px-3 py-1.5 rounded-md bg-purple-700 text-white text-sm">📦 Ouvrir gestionnaire mises à jour (winget)</button>
    </div>
  )
}


