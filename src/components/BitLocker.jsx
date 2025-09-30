// Composant BitLocker: affiche le statut et permet de lancer un déchiffrement
// - Nécessite que le backend soit lancé en administrateur pour fonctionner

import { useState } from 'react'
import { listDrives, bitlockerStatusDrive, bitlockerOff } from '../services/api'

export function BitLocker() {
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState('')
  const [letter, setLetter] = useState('C')
  const [drives, setDrives] = useState([])

  const handleList = async () => {
    setLoading(true)
    try {
      const data = await listDrives()
      setDrives(Array.isArray(data) ? data : [])
      setOutput(JSON.stringify(data, null, 2))
    } catch (e) {
      setOutput(String(e?.message || 'Erreur inconnue'))
    } finally {
      setLoading(false)
    }
  }

  const handleCheck = async () => {
    setLoading(true)
    try {
      const res = await bitlockerStatusDrive(letter)
      setOutput(res?.stdout || res?.stderr || '')
    } catch (e) {
      setOutput(String(e?.message || 'Erreur inconnue'))
    } finally {
      setLoading(false)
    }
  }
  const handleDecrypt = async () => {
    setLoading(true)
    try {
      const res = await bitlockerOff(letter)
      setOutput(res?.stdout || res?.stderr || '')
    } catch (e) {
      setOutput(String(e?.message || 'Erreur inconnue'))
    } finally {
      setLoading(false)
    }
  }

  const handleOff = async () => {
    setLoading(true)
    try {
      const res = await bitlockerOff(letter)
      setOutput(res?.stdout || res?.stderr || '')
    } catch (e) {
      setOutput(String(e?.message || 'Erreur inconnue'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <button onClick={handleList} disabled={loading} className="px-3 py-1.5 rounded-md bg-gray-800 text-white text-sm disabled:opacity-60">Lister les disques</button>
      </div>

      {drives?.length > 0 && (
        <div className="text-xs text-gray-700">
          Disques: {drives.map(d => d.Name).join(', ')}
        </div>
      )}

      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-700">Lecteur</label>
        <input value={letter} onChange={(e) => setLetter(e.target.value.toUpperCase().slice(0,1))} className="w-12 px-2 py-1 border rounded-md text-sm" placeholder="C" />
        <button onClick={handleCheck} disabled={loading || !letter} className="px-3 py-1.5 rounded-md bg-gray-700 text-white text-sm disabled:opacity-60">Vérifier</button>
        <button onClick={handleDecrypt} disabled={loading || !letter} className="px-3 py-1.5 rounded-md bg-red-600 text-white text-sm disabled:opacity-60">
          Déchiffrer (off)
        </button>
      </div>
      <pre className="whitespace-pre-wrap text-xs bg-gray-50 border rounded-md p-3 max-h-64 overflow-auto">{output || 'Aucune sortie'}</pre>
    </div>
  )
}


