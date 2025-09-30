// Composant Reseau: actions réseau (DNS Cloudflare)
// - Nécessite le backend lancé en administrateur pour ouvrir le .bat

import { networkCloudflareDnsAdmin } from '../services/api'

export function Reseau() {
  const openCloudflareDns = async () => { try { await networkCloudflareDnsAdmin() } catch {} }

  return (
    <div className="flex flex-wrap gap-3">
      <div
        onClick={openCloudflareDns}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openCloudflareDns() }}
        className="w-64 bg-white rounded-lg border border-gray-200 shadow-sm p-4 cursor-pointer hover:border-blue-400 hover:shadow transition"
      >
        <div className="text-sm font-medium text-gray-900">🌐 DNS Cloudflare</div>
        <div className="text-xs text-gray-600 mt-1">Ouvre le gestionnaire DNS Cloudflare (admin)</div>
      </div>
    </div>
  )
}


