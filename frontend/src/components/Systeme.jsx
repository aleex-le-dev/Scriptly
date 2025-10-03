// Composant Systeme: actions système (menu contextuel classique)
// - Ouvre une fenêtre CMD avec le script registre (admin requis)

import { systemContextMenuClassicAdmin } from '../services/api'
import { Highlight } from './Highlight'
import { ScriptItem } from './ScriptItem'
import { normalizeText } from '../utils/text'

export function Systeme({ query = '' }) {
  const openClassicMenuToggle = async () => { try { await systemContextMenuClassicAdmin() } catch { /* noop */ } }
  const visible = (text) => {
    const q = normalizeText(String(query || '').trim())
    if (q.length < 3) return true
    return normalizeText(text).includes(q)
  }

  return (
    <>
      {visible('systeme menu contextuel classique explorer windows 11') && (
        <ScriptItem
          title={<Highlight text="🗂️ Menu contextuel classique" query={query} />}
          desc="Active/restaure le menu classique (Win11)"
          onClick={openClassicMenuToggle}
          accent="amber"
        />
      )}
    </>
  )
}


