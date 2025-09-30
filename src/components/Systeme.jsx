// Composant Systeme: actions système (menu contextuel classique)
// - Ouvre une fenêtre CMD avec le script registre (admin requis)

import { systemContextMenuClassicAdmin } from '../services/api'

export function Systeme() {
  const openClassicMenuToggle = async () => { try { await systemContextMenuClassicAdmin() } catch {} }

  return (
    <div className="flex flex-col gap-2">
      <button onClick={openClassicMenuToggle} className="w-full px-3 py-1.5 rounded-md bg-amber-700 text-white text-sm">🗂️ Menu contextuel classique (Windows 11)</button>
    </div>
  )
}


