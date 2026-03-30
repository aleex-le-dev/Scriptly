// Composant Reseau: actions réseau (DNS Cloudflare)
// - Nécessite le backend lancé en administrateur pour ouvrir le .bat

import { openLocalScript } from '../services/api'
import { Highlight } from './Highlight'
import { ScriptItem } from './ScriptItem'
import { normalizeText } from '../utils/text'

export function Reseau({ query = '' }) {
  const openCloudflareDns = () => openLocalScript('networks/batch/cloudflare-dns-manager.bat')
  const openDnsOptions = () => openLocalScript('networks/batch/dns-options.bat')
  const openWifiPasswords = () => openLocalScript('networks/batch/wifi-passwords.bat')
  const openNetworkRepair = () => openLocalScript('networks/batch/network-repair.bat')
  const openIpconfigAll = () => openLocalScript('networks/batch/ipconfig-all.bat')
  const openRestartAdapters = () => openLocalScript('networks/batch/restart-adapters.bat')

  const visible = (text) => {
    const q = normalizeText(String(query || '').trim())
    if (q.length < 3) return true
    return normalizeText(text).includes(q)
  }

  return (
    <>
      {visible('reseau dns cloudflare ipv4 ipv6') && (
        <ScriptItem
          title={<Highlight text="DNS Cloudflare (avancé)" query={query} />}
          label="dns cloudflare ipv4 ipv6"
          desc="Gestionnaire DNS Cloudflare avec IPv4/IPv6, restauration et affichage"
          onClick={openCloudflareDns}
          accent="blue"
          icon="🌐"
        />
      )}
      {visible('reseau dns google cloudflare custom personnalise restaurer') && (
        <ScriptItem
          title={<Highlight text="Options DNS (Google / Cloudflare / Custom)" query={query} />}
          label="dns google cloudflare custom"
          desc="Change les DNS : Google, Cloudflare, personnalisés ou restaurer"
          onClick={openDnsOptions}
          accent="blue"
          icon="🔗"
        />
      )}
      {visible('reseau wifi mot de passe cles security key supprimer rapport') && (
        <ScriptItem
          title={<Highlight text="Mots de passe Wi-Fi" query={query} />}
          label="wifi password mot de passe export supprimer"
          desc="Affiche, supprime et exporte les clés Wi-Fi enregistrées"
          onClick={openWifiPasswords}
          accent="rose"
          icon="📶"
        />
      )}
      {visible('reseau ipconfig all information configuration ip') && (
        <ScriptItem
          title={<Highlight text="ipconfig /all" query={query} />}
          label="ipconfig all network info"
          desc="Affiche toutes les informations réseau"
          onClick={openIpconfigAll}
          accent="gray"
          icon="📋"
        />
      )}
      {visible('reseau redemarrer cartes adaptateurs wifi ethernet') && (
        <ScriptItem
          title={<Highlight text="Redémarrer les cartes réseau" query={query} />}
          label="restart network adapters wifi ethernet"
          desc="Désactive puis réactive Wi-Fi et Ethernet"
          onClick={openRestartAdapters}
          accent="amber"
          icon="🔌"
        />
      )}
      {visible('reseau reparer internet ipconfig flushdns reset winsock') && (
        <ScriptItem
          title={<Highlight text="Réparer le réseau" query={query} />}
          label="network repair ipconfig flushdns reset"
          desc="Réinitialise IP, DNS et Winsock pour réparer la connexion"
          onClick={openNetworkRepair}
          accent="cyan"
          icon="🔧"
        />
      )}
    </>
  )
}


