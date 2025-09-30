// Panneau de debug fixe contenant des actions front de test
// - Affiche des boutons pour tester le serveur et déclencher les scripts côté front

import { useState } from 'react'
import { fetchHealth } from '../services/api'

export function DebugPanel({ onError }) {
  const [serverState, setServerState] = useState('idle') // idle | loading | ok | error
  const [open, setOpen] = useState(false)

  const onClickHealth = async () => {
    setServerState('loading')
    try {
      const result = await fetchHealth()
      if (result?.status === 'ok') {
        setServerState('ok')
      } else {
        setServerState('error')
      }
    } catch {
      setServerState('error')
    }
    // Revenir à l'état neutre après un court délai pour feedback visuel
    setTimeout(() => setServerState('idle'), 1200)
  }

  // Boutons PowerShell/Batch retirés en debug

  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2 w-auto">
        <div className="flex items-center">
          <div className="text-[11px] text-gray-600">Debug</div>
          <button
            onClick={() => setOpen(v => !v)}
            className="ml-auto px-2 py-0.5 rounded-sm bg-white text-gray-700 text-[10px] inline-flex items-center gap-1 hover:bg-gray-50"
            aria-expanded={open}
            aria-controls="debug-panel-menu"
            title="Ouvrir le panneau de debug"
          >
            <svg className={`h-2 w-2 text-gray-600 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {open && (
          <div id="debug-panel-menu" className="mt-2 flex flex-col gap-2">
            <button
              onClick={onClickHealth}
              disabled={serverState === 'loading'}
              className={`px-2.5 py-1 rounded-md text-white text-[11px] inline-flex items-center justify-center whitespace-nowrap
                ${serverState === 'ok' ? 'bg-emerald-600'
                  : serverState === 'error' ? 'bg-red-600'
                  : serverState === 'loading' ? 'bg-gray-700 animate-pulse'
                  : 'bg-gray-800'}`}
            >
              Serveur
            </button>

          </div>
        )}
      </div>
    </div>
  )
}


