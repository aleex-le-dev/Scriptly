// Composant Disks: regroupe les actions liées aux disques (BitLocker, CHKDSK, Défrag, Format)

import { openLocalScript } from '../services/api'
import { Highlight } from './Highlight'
import { ScriptItem } from './ScriptItem'
import { normalizeText } from '../utils/text'

export function Disks({ query = '' }) {
  const openBitlockerManager = () => openLocalScript('disks/batch/bitlocker-manager.bat')
  const openChkdskAll = () => openLocalScript('disks/batch/chkdsk-all.bat')
  const openPsDefrag = () => openLocalScript('disks/powershells/defrag-drive.ps1')
  const openFormatDrive = () => openLocalScript('disks/batch/format-drive.bat')

  const visible = (text) => {
    const q = normalizeText(String(query || '').trim())
    if (q.length < 3) return true
    return normalizeText(text).includes(q)
  }

  return (
    <>
      {visible('bitlocker verifier status manage-bde dechiffrer desactiver') && (
        <ScriptItem title={<Highlight text="BitLocker (vérifier / déchiffrer)" query={query} />} label="bitlocker manage-bde" icon="🔒" desc="Vérifie le chiffrement et propose le déchiffrement (admin)" onClick={openBitlockerManager} accent="gray" />
      )}
      {visible('chkdsk verifier disque erreurs analyse tous lecteurs') && (
        <ScriptItem title={<Highlight text="CHKDSK (tous les lecteurs)" query={query} />} label="chkdsk all drives" icon="🧰" desc="Analyse et réparation de tous les disques" onClick={openChkdskAll} accent="gray" />
      )}
      {visible('defragmenter optimiser disque') && (
        <ScriptItem title={<Highlight text="Défragmenter" query={query} />} label="defrag défragmenter" icon="🧩" desc="Optimise les disques" onClick={openPsDefrag} accent="gray" />
      )}
      {visible('formater format drive disque cle admin diskpart ntfs fat32 exfat') && (
        <ScriptItem title={<Highlight text="Diskpart - Formatage (admin)" query={query} />} label="diskpart format drive ntfs fat32" icon="💽" desc="Formatage complet avec choix du système de fichiers" onClick={openFormatDrive} accent="gray" />
      )}
    </>
  )
}
