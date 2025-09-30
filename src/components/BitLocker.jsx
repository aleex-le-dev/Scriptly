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
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <div
          onClick={handleList}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleList() }}
          className="flex-1 min-w-[220px] bg-white rounded-lg border border-gray-200 shadow-sm p-4 cursor-pointer hover:border-gray-400 hover:shadow transition"
        >
          <div className="text-sm font-medium text-gray-900">📂 Lister les disques</div>
          <div className="text-xs text-gray-600 mt-1">Affiche les lecteurs détectés</div>
        </div>
        <div
          onClick={openPsCheckAdmin}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openPsCheckAdmin() }}
          className="flex-1 min-w-[220px] bg-white rounded-lg border border-gray-200 shadow-sm p-4 cursor-pointer hover:border-gray-400 hover:shadow transition"
        >
          <div className="text-sm font-medium text-gray-900">🔒 Vérifier BitLocker</div>
          <div className="text-xs text-gray-600 mt-1">Ouvre la vérification (admin)</div>
        </div>
        <div
          onClick={openPsOffAdmin}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openPsOffAdmin() }}
          className="flex-1 min-w-[220px] bg-white rounded-lg border border-gray-200 shadow-sm p-4 cursor-pointer hover:border-gray-400 hover:shadow transition"
        >
          <div className="text-sm font-medium text-gray-900">🛑 Désactiver BitLocker</div>
          <div className="text-xs text-gray-600 mt-1">Désactive sur un volume (admin)</div>
        </div>
        <div
          onClick={openPsChkdsk}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openPsChkdsk() }}
          className="flex-1 min-w-[220px] bg-white rounded-lg border border-gray-200 shadow-sm p-4 cursor-pointer hover:border-gray-400 hover:shadow transition"
        >
          <div className="text-sm font-medium text-gray-900">🧰 CHKDSK</div>
          <div className="text-xs text-gray-600 mt-1">Analyse et réparation</div>
        </div>
        <div
          onClick={openPsDefrag}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openPsDefrag() }}
          className="flex-1 min-w-[220px] bg-white rounded-lg border border-gray-200 shadow-sm p-4 cursor-pointer hover:border-gray-400 hover:shadow transition"
        >
          <div className="text-sm font-medium text-gray-900">🧩 Défragmenter</div>
          <div className="text-xs text-gray-600 mt-1">Optimise les disques</div>
        </div>
        <div
          onClick={openPsFormatAdmin}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openPsFormatAdmin() }}
          className="flex-1 min-w-[220px] bg-white rounded-lg border border-gray-200 shadow-sm p-4 cursor-pointer hover:border-gray-400 hover:shadow transition"
        >
          <div className="text-sm font-medium text-gray-900">💽 Formater (Admin)</div>
          <div className="text-xs text-gray-600 mt-1">Outil de formatage disque</div>
        </div>
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


