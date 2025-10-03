// Composant Disks: regroupe les actions liées aux disques (BitLocker, CHKDSK, Défrag, Format)
// - Nécessite que le backend soit lancé en administrateur pour certaines actions

import { useState } from 'react'
import { listDrives, psCheckBitlockerAdmin, psBitlockerOffAdmin, psChkdskUi, psDefragUi, psFormatDriveAdmin } from '../services/api'
import { Highlight } from './Highlight'
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
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        {visible('lister disques drives list') && (
        <div
          onClick={handleList}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleList() }}
          className="w-64 bg-white/40 backdrop-blur-xl backdrop-saturate-150 rounded-2xl border border-white/30 shadow-lg p-4 cursor-pointer hover:bg-white/50 hover:shadow-xl transition"
        >
          <div className="text-sm font-medium text-gray-900"><Highlight text="📂 Lister les disques" query={query} /></div>
          <div className="text-xs text-gray-600 mt-1"><Highlight text="Affiche les lecteurs détectés" query={query} /></div>
        </div>
        )}
        {visible('bitlocker verifier status manage-bde') && (
        <div
          onClick={openPsCheckAdmin}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openPsCheckAdmin() }}
          className="w-64 bg-white/40 backdrop-blur-xl backdrop-saturate-150 rounded-2xl border border-white/30 shadow-lg p-4 cursor-pointer hover:bg-white/50 hover:shadow-xl transition"
        >
          <div className="text-sm font-medium text-gray-900"><Highlight text="🔒 Vérifier BitLocker" query={query} /></div>
          <div className="text-xs text-gray-600 mt-1"><Highlight text="Ouvre la vérification (admin)" query={query} /></div>
        </div>
        )}
        {visible('bitlocker off desactiver disable') && (
        <div
          onClick={openPsOffAdmin}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openPsOffAdmin() }}
          className="w-64 bg-white/40 backdrop-blur-xl backdrop-saturate-150 rounded-2xl border border-white/30 shadow-lg p-4 cursor-pointer hover:bg-white/50 hover:shadow-xl transition"
        >
          <div className="text-sm font-medium text-gray-900"><Highlight text="🛑 Désactiver BitLocker" query={query} /></div>
          <div className="text-xs text-gray-600 mt-1"><Highlight text="Désactive sur un volume (admin)" query={query} /></div>
        </div>
        )}
        {visible('chkdsk verifier disque erreurs') && (
        <div
          onClick={openPsChkdsk}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openPsChkdsk() }}
          className="w-64 bg-white/40 backdrop-blur-xl backdrop-saturate-150 rounded-2xl border border-white/30 shadow-lg p-4 cursor-pointer hover:bg-white/50 hover:shadow-xl transition"
        >
          <div className="text-sm font-medium text-gray-900"><Highlight text="🧰 CHKDSK" query={query} /></div>
          <div className="text-xs text-gray-600 mt-1"><Highlight text="Analyse et réparation" query={query} /></div>
        </div>
        )}
        {visible('defragmenter optimiser disque') && (
        <div
          onClick={openPsDefrag}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openPsDefrag() }}
          className="w-64 bg-white/40 backdrop-blur-xl backdrop-saturate-150 rounded-2xl border border-white/30 shadow-lg p-4 cursor-pointer hover:bg-white/50 hover:shadow-xl transition"
        >
          <div className="text-sm font-medium text-gray-900"><Highlight text="🧩 Défragmenter" query={query} /></div>
          <div className="text-xs text-gray-600 mt-1"><Highlight text="Optimise les disques" query={query} /></div>
        </div>
        )}
        {visible('formater format drive disque cle admin') && (
        <div
          onClick={openPsFormatAdmin}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openPsFormatAdmin() }}
          className="w-64 bg-white/40 backdrop-blur-xl backdrop-saturate-150 rounded-2xl border border-white/30 shadow-lg p-4 cursor-pointer hover:bg-white/50 hover:shadow-xl transition"
        >
          <div className="text-sm font-medium text-gray-900"><Highlight text="💽 Diskpart (admin)" query={query} /></div>
          <div className="text-xs text-gray-600 mt-1"><Highlight text="Outil de formatage disque dur et clé usb" query={query} /></div>
        </div>
        )}
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

