// Composant Reseau: actions réseau (DNS Cloudflare)
// - Nécessite le backend lancé en administrateur pour ouvrir le .bat

import { networkCloudflareDnsAdmin } from '../services/api'
import { Highlight } from './Highlight'
import { normalizeText } from '../utils/text'

export function Reseau({ query = '' }) {
  const openCloudflareDns = async () => { try { await networkCloudflareDnsAdmin() } catch { /* noop */ } }
  const visible = (text) => {
    const q = normalizeText(String(query || '').trim())
    if (q.length < 3) return true
    return normalizeText(text).includes(q)
  }

  return (
    <div className="flex flex-wrap gap-3">
      {visible('reseau dns cloudflare') && (
      <div
        onClick={openCloudflareDns}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openCloudflareDns() }}
        className="w-64 bg-white/40 backdrop-blur-xl backdrop-saturate-150 rounded-2xl border border-white/30 shadow-lg p-4 cursor-pointer hover:bg-white/50 hover:shadow-xl transition"
      >
        <div className="text-sm font-medium text-gray-900"><Highlight text="🌐 DNS Cloudflare" query={query} /></div>
        <div className="text-xs text-gray-600 mt-1">Remplace les DNS par Cloudflare (admin)</div>
      </div>
      )}
    </div>
  )
}


