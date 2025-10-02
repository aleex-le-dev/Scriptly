// Composant Systeme: actions système (menu contextuel classique)
// - Ouvre une fenêtre CMD avec le script registre (admin requis)

import { systemContextMenuClassicAdmin } from '../services/api'
import { Highlight } from './Highlight'
import { normalizeText } from '../utils/text'

export function Systeme({ query = '' }) {
  const openClassicMenuToggle = async () => { try { await systemContextMenuClassicAdmin() } catch { /* noop */ } }
  const visible = (text) => {
    const q = normalizeText(String(query || '').trim())
    if (q.length < 3) return true
    return normalizeText(text).includes(q)
  }

  return (
    <div className="flex flex-wrap gap-3">
      {visible('systeme menu contextuel classique explorer windows 11') && (
      <div
        onClick={openClassicMenuToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openClassicMenuToggle() }}
        className="w-64 bg-white rounded-lg border border-gray-200 shadow-sm p-4 cursor-pointer hover:border-amber-400 hover:shadow transition"
      >
        <div className="text-sm font-medium text-gray-900"><Highlight text="🗂️ Menu contextuel classique" query={query} /></div>
        <div className="text-xs text-gray-600 mt-1">Active/restaure le menu classique (Win11)</div>
      </div>
      )}
    </div>
  )
}


