// Composant Reseau: actions réseau (DNS Cloudflare)
// - Nécessite le backend lancé en administrateur pour ouvrir le .bat

import { networkCloudflareDnsAdmin } from '../services/api'

export function Reseau() {
  const openCloudflareDns = async () => { try { await networkCloudflareDnsAdmin() } catch {} }

  return (
    <div className="flex flex-col gap-2">
      <button onClick={openCloudflareDns} className="w-full px-3 py-1.5 rounded-md bg-blue-700 text-white text-sm">🌐 Ouvrir gestionnaire DNS Cloudflare (Admin)</button>
    </div>
  )
}


