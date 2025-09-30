// Composant Disks: regroupe les actions liées aux disques (BitLocker, CHKDSK, Défrag, Format)
// - Nécessite que le backend soit lancé en administrateur pour fonctionner

import { useState } from 'react'
import { listDrives, psCheckBitlockerAdmin, psBitlockerOffAdmin, psChkdskUi, psDefragUi, psFormatDriveUi, psFormatDriveAdmin } from '../services/api'

export function Disks() {
  const [loading, setLoading] = useState(false)
  const [drives, setDrives] = useState([])

  const handleList = async () => {
    setLoading(true)
    try {
      const data = await listDrives()
      setDrives(Array.isArray(data) ? data : [])
    } catch (e) {
      // no-op: keep silent UI
    } finally {
      setLoading(false)
    }
  }

  const openPsCheckAdmin = async () => { try { await psCheckBitlockerAdmin() } catch {} }
  const openPsOffAdmin = async () => { try { await psBitlockerOffAdmin() } catch {} }
  const openPsChkdsk = async () => { try { await psChkdskUi() } catch {} }
  const openPsDefrag = async () => { try { await psDefragUi() } catch {} }
  const openPsFormat = async () => { try { await psFormatDriveUi() } catch {} }
  const openPsFormatAdmin = async () => { try { await psFormatDriveAdmin() } catch {} }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <button onClick={handleList} disabled={loading} className="w-full px-3 py-1.5 rounded-md bg-gray-800 text-white text-sm disabled:opacity-60">📂 Lister les disques</button>
        <button onClick={openPsCheckAdmin} className="w-full px-3 py-1.5 rounded-md bg-gray-800 text-white text-sm">🔒 Vérifier BitLocker (Admin)</button>
        <button onClick={openPsOffAdmin} className="w-full px-3 py-1.5 rounded-md bg-gray-800 text-white text-sm">🛑 Désactiver BitLocker (Admin)</button>
        <button onClick={openPsChkdsk} className="w-full px-3 py-1.5 rounded-md bg-gray-800 text-white text-sm">🧰 CHKDSK</button>
        <button onClick={openPsDefrag} className="w-full px-3 py-1.5 rounded-md bg-gray-800 text-white text-sm">🧩 Défragmenter</button>
        <button onClick={openPsFormatAdmin} className="w-full px-3 py-1.5 rounded-md bg-gray-800 text-white text-sm">💽 Formater disque/clé (Admin)</button>
      </div>

      {drives?.length > 0 && (
        <div className="text-xs text-gray-700">
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
    </div>
  )
}


