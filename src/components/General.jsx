// Composant General: scripts généraux et utilitaires divers

import { openLocalScript } from '../services/api'
import { Highlight } from './Highlight'
import { ScriptItem } from './ScriptItem'
import { normalizeText } from '../utils/text'

export function General({ query = '' }) {
  const openScriptsByAleexLeDev = async () => { 
    try { 
      await openLocalScript('general/batch/Scripts-by-AleexLeDev.bat') 
    } catch { /* noop */ } 
  }
  
  const visible = (text) => {
    const q = normalizeText(String(query || '').trim())
    if (q.length < 3) return true
    return normalizeText(text).includes(q)
  }

  return (
    <>
      {visible('scripts aleexledev boite outils windows maintenance reseau systeme') && (
        <ScriptItem
          title={<Highlight text="Scripts by AleexLeDev" query={query} />}
          label="scripts aleexledev boite outils"
          desc="Boîte à outils Windows complète - Maintenance, réseau, système"
          onClick={openScriptsByAleexLeDev}
          accent="emerald"
          icon="🛠️"
        />
      )}
    </>
  )
}
