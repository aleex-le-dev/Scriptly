// Composant Application: gestion des mises à jour via winget
// - Ouvre une fenêtre CMD avec le menu winget (admin requis)

import { appsWingetUpdateAdmin } from '../services/api'
import { Highlight } from './Highlight'
import { normalizeText } from '../utils/text'

export function Application({ query = '' }) {
  const openWingetManager = async () => { try { await appsWingetUpdateAdmin() } catch { /* noop */ } }
  const visible = (text) => {
    const q = normalizeText(String(query || '').trim())
    if (q.length < 3) return true
    return normalizeText(text).includes(q)
  }

  return (
    <div className="flex flex-wrap gap-3">
      {visible('applications mise a jour winget upgrade') && (
      <div
        onClick={openWingetManager}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openWingetManager() }}
        className="w-64 bg-white rounded-lg border border-gray-200 shadow-sm p-4 cursor-pointer hover:border-purple-400 hover:shadow transition"
      >
        <div className="text-sm font-medium text-gray-900"><Highlight text="📦 Mises à jour (winget)" query={query} /></div>
        <div className="text-xs text-gray-600 mt-1">Gestionnaire de mises à jour des applications</div>
      </div>
      )}
    </div>
  )
}


