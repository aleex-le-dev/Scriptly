// Composant Reseau: actions réseau (DNS Cloudflare)
// - Nécessite le backend lancé en administrateur pour ouvrir le .bat

import { openLocalScript } from '../services/api'
import { Highlight } from './Highlight'
import { ScriptItem } from './ScriptItem'
import { normalizeText } from '../utils/text'

export function Reseau({ query = '' }) {
  const openCloudflareDns = async () => { try { await openLocalScript('networks/batch/cloudflare-dns-manager.bat') } catch { /* noop */ } }
  const openWifiPasswords = async () => { try { await openLocalScript('networks/batch/wifi-passwords.bat') } catch { /* noop */ } }
  const openNetworkRepair = async () => { try { await openLocalScript('networks/batch/network-repair.bat') } catch { /* noop */ } }

  const visible = (text) => {
    const q = normalizeText(String(query || '').trim())
    if (q.length < 3) return true
    return normalizeText(text).includes(q)
  }

  return (
    <>
      {visible('reseau dns cloudflare') && (
        <ScriptItem
          title={<Highlight text="DNS Cloudflare" query={query} />}
          label="dns cloudflare"
          desc="Remplace les DNS par Cloudflare (admin)"
          onClick={openCloudflareDns}
          accent="blue"
          icon="🌐"
        />
      )}
      {visible('reseau wifi mot de passe cles security key') && (
        <ScriptItem
          title={<Highlight text="Mots de passe Wi-Fi" query={query} />}
          label="wifi password mot de passe export"
          desc="Affiche et exporte les clés Wi-Fi enregistrées"
          onClick={openWifiPasswords}
          accent="rose"
          icon="📶"
        />
      )}
      {visible('reseau reparer internet ipconfig flushdns reset winsock') && (
        <ScriptItem
          title={<Highlight text="Réparer le réseau" query={query} />}
          label="network repair ipconfig fluishdns reset"
          desc="Réinitialise IP, DNS et Winsock pour réparer la connexion"
          onClick={openNetworkRepair}
          accent="cyan"
          icon="🔧"
        />
      )}
    </>
  )
}


