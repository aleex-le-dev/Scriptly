// Composant Disks: regroupe les actions liées aux disques (BitLocker, CHKDSK, Défrag, Format)
// - Nécessite que le backend soit lancé en administrateur pour certaines actions

import { useState } from 'react'
import { listDrives, psCheckBitlockerAdmin, psBitlockerOffAdmin, psChkdskUi, psDefragUi, psFormatDriveAdmin } from '../services/api'
import { Highlight } from './Highlight'
import { ScriptItem } from './ScriptItem'
import { normalizeText } from '../utils/text'

export function Disks({ query = '' }) {
  const [drives, setDrives] = useState([])

  const handleList = async () => {
    try {
      const data = await listDrives()
      setDrives(Array.isArray(data) ? data : [])
    } catch {
      /* noop */
    }
  }

  const openPsCheckAdmin = async () => { try { await psCheckBitlockerAdmin() } catch { /* noop */ } }
  const openPsOffAdmin = async () => { try { await psBitlockerOffAdmin() } catch { /* noop */ } }
  const openPsChkdsk = async () => { try { await psChkdskUi() } catch { /* noop */ } }
  const openPsDefrag = async () => { try { await psDefragUi() } catch { /* noop */ } }
  const openPsFormatAdmin = async () => { try { await psFormatDriveAdmin() } catch { /* noop */ } }

  const visible = (text) => {
    const q = normalizeText(String(query || '').trim())
    if (q.length < 3) return true
    return normalizeText(text).includes(q)
  }

  return (
    <>
      {visible('lister disques drives list') && (
        <ScriptItem title={<Highlight text="Lister les disques" query={query} />} icon="📂" desc="Affiche les lecteurs détectés" onClick={handleList} accent="gray" />
      )}
      {visible('bitlocker verifier status manage-bde') && (
        <ScriptItem title={<Highlight text="Vérifier BitLocker" query={query} />} icon="🔒" desc="Ouvre la vérification (admin)" onClick={openPsCheckAdmin} accent="gray" />
      )}
      {visible('bitlocker off desactiver disable') && (
        <ScriptItem title={<Highlight text="Désactiver BitLocker" query={query} />} icon="🛑" desc="Désactive sur un volume (admin)" onClick={openPsOffAdmin} accent="gray" />
      )}
      {visible('chkdsk verifier disque erreurs') && (
        <ScriptItem title={<Highlight text="CHKDSK" query={query} />} icon="🧰" desc="Analyse et réparation" onClick={openPsChkdsk} accent="gray" />
      )}
      {visible('defragmenter optimiser disque') && (
        <ScriptItem title={<Highlight text="Défragmenter" query={query} />} icon="🧩" desc="Optimise les disques" onClick={openPsDefrag} accent="gray" />
      )}
      {visible('formater format drive disque cle admin') && (
        <ScriptItem title={<Highlight text="Diskpart (admin)" query={query} />} icon="💽" desc="Outil de formatage disque dur et clé usb" onClick={openPsFormatAdmin} accent="gray" />
      )}

      {drives?.length > 0 && (
        <div className="col-span-2 text-xs text-gray-700">
          <div className="font-medium mb-1">💿 Disques détectés</div>
          <div className="flex flex-wrap gap-2">
            {drives.map(d => (
              <span key={d.Name} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                <span>💾</span>
                <span className="font-mono">{d.Name}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

