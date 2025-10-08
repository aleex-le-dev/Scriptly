// Composant Application: gestion des mises à jour via winget
// - Ouvre une fenêtre CMD avec le menu winget (admin requis)

import { openLocalScript } from '../services/api'
import { Highlight } from './Highlight'
import { ScriptItem } from './ScriptItem'
import { normalizeText } from '../utils/text'

export function Application({ query = '' }) {
  const openWingetManager = async () => {
    try {
      await openLocalScript('applications/batch/winget-update-admin.bat')
    } catch { /* noop */ }
  }
  const visible = (text) => {
    const q = normalizeText(String(query || '').trim())
    if (q.length < 3) return true
    return normalizeText(text).includes(q)
  }

  return (
    <>
      {visible('applications mise a jour winget upgrade') && (
        <ScriptItem
          title={<Highlight text="Mises à jour (winget)" query={query} />}
          label="mises à jour winget update"
          desc="Gestionnaire de mises à jour des applications"
          onClick={openWingetManager}
          accent="purple"
          icon="📦"
        />
      )}
    </>
  )
}


