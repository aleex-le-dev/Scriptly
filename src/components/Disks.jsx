// Composant Disks: regroupe les actions liées aux disques (BitLocker, CHKDSK, Défrag, Format)

import { openLocalScript } from '../services/api'
import { Highlight } from './Highlight'
import { ScriptItem } from './ScriptItem'
import { normalizeText } from '../utils/text'

export function Disks({ query = '' }) {
  const openPsCheckAdmin = () => openLocalScript('disks/batch/check-bitlocker.bat')
  const openPsOffAdmin = () => openLocalScript('disks/batch/bitlocker-off.bat')
  const openPsChkdsk = () => openLocalScript('disks/powershells/chkdsk-drive.ps1')
  const openPsDefrag = () => openLocalScript('disks/powershells/defrag-drive.ps1')
  const openPsFormatAdmin = () => openLocalScript('disks/batch/format-drive.bat')

  const visible = (text) => {
    const q = normalizeText(String(query || '').trim())
    if (q.length < 3) return true
    return normalizeText(text).includes(q)
  }

  return (
    <>
      {visible('bitlocker verifier status manage-bde') && (
        <ScriptItem title={<Highlight text="Vérifier BitLocker" query={query} />} label="bitlocker" icon="🔒" desc="Ouvre la vérification (admin)" onClick={openPsCheckAdmin} accent="gray" />
      )}
      {visible('bitlocker off desactiver disable') && (
        <ScriptItem title={<Highlight text="Désactiver BitLocker" query={query} />} label="bitlocker off" icon="🛑" desc="Désactive sur un volume (admin)" onClick={openPsOffAdmin} accent="gray" />
      )}
      {visible('chkdsk verifier disque erreurs') && (
        <ScriptItem title={<Highlight text="CHKDSK" query={query} />} label="chkdsk" icon="🧰" desc="Analyse et réparation" onClick={openPsChkdsk} accent="gray" />
      )}
      {visible('defragmenter optimiser disque') && (
        <ScriptItem title={<Highlight text="Défragmenter" query={query} />} label="defrag défragmenter" icon="🧩" desc="Optimise les disques" onClick={openPsDefrag} accent="gray" />
      )}
      {visible('formater format drive disque cle admin') && (
        <ScriptItem title={<Highlight text="Diskpart (admin)" query={query} />} label="diskpart format drive" icon="💽" desc="Outil de formatage disque dur et clé usb" onClick={openPsFormatAdmin} accent="gray" />
      )}
    </>
  )
}
