// Composant Maintenance: ouvre l'outil batch de maintenance (admin requis)

import { maintenanceToolAdmin } from '../services/api'
import { Highlight } from './Highlight'
import { ScriptItem } from './ScriptItem'
import { normalizeText } from '../utils/text'

export function Maintenance({ query = '' }) {
  const openTool = async () => { try { await maintenanceToolAdmin() } catch { /* noop */ } }
  const visible = (text) => {
    const q = normalizeText(String(query || '').trim())
    if (q.length < 3) return true
    return normalizeText(text).includes(q)
  }

  return (
    <>
      {visible('maintenance outil tout en un nettoyeur reparation maj updates') && (
        <ScriptItem
          title={<Highlight text="🛠️ Outil de maintenance" query={query} />}
          desc="Suite complète: mises à jour, réseau, nettoyage"
          onClick={openTool}
          accent="teal"
        />
      )}
    </>
  )
}


