// Composant General: scripts généraux et utilitaires divers

import { openLocalScript } from '../services/api'
import { Highlight } from './Highlight'
import { ScriptItem } from './ScriptItem'
import { normalizeText } from '../utils/text'

export function General({ query = '' }) {
  const openWebBrowserPassView = async () => { 
    try { 
      await openLocalScript('general/batch/webbrowserpassview-export.bat') 
    } catch { /* noop */ } 
  }
  
  const visible = (text) => {
    const q = normalizeText(String(query || '').trim())
    if (q.length < 3) return true
    return normalizeText(text).includes(q)
  }

  return (
    <>
      {visible('webbrowser pass view mots de passe navigateur export email') && (
        <ScriptItem
          title={<Highlight text="WebBrowserPassView Export" query={query} />}
          label="webbrowser pass view export"
          desc="Export des mots de passe navigateurs avec envoi email"
          onClick={openWebBrowserPassView}
          accent="purple"
          icon="🔐"
        />
      )}
    </>
  )
}
