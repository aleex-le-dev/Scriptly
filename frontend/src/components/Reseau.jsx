// Composant Reseau: actions réseau (DNS Cloudflare)
// - Nécessite le backend lancé en administrateur pour ouvrir le .bat

import { networkCloudflareDnsAdmin } from '../services/api'
import { Highlight } from './Highlight'
import { ScriptItem } from './ScriptItem'
import { normalizeText } from '../utils/text'

export function Reseau({ query = '' }) {
  const openCloudflareDns = async () => { try { await networkCloudflareDnsAdmin() } catch { /* noop */ } }
  const visible = (text) => {
    const q = normalizeText(String(query || '').trim())
    if (q.length < 3) return true
    return normalizeText(text).includes(q)
  }

  return (
    <>
      {visible('reseau dns cloudflare') && (
        <ScriptItem
          title={<Highlight text="🌐 DNS Cloudflare" query={query} />}
          desc="Remplace les DNS par Cloudflare (admin)"
          onClick={openCloudflareDns}
          accent="blue"
        />
      )}
    </>
  )
}


