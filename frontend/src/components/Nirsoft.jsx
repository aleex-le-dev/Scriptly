// Composant Nirsoft: liens directs vers utilitaires NirSoft (x64)

import { Highlight } from './Highlight'
import { ScriptItem } from './ScriptItem'
import { normalizeText } from '../utils/text'
import pkUrl from './software/ProduKey.zip?url'
import wkvUrl from './software/wirelesskeyview-x64.zip?url'
import wbpUrl from './software/webbrowserpassview.zip?url'

export function Nirsoft({ query = '' }) {
  const tools = [
    {
      key: 'produkey',
      title: 'ProduKey',
      desc: 'Récupère les clés produits Windows/Office. (zip local)',
      href: pkUrl,
      icon: 'https://www.nirsoft.net/nirsoft_unit.png',
      keywords: 'nirsoft produkey cle licence windows office'
    },
    {
      key: 'wirelesskeyview',
      title: 'WirelessKeyView',
      desc: 'Affiche les clés Wi‑Fi enregistrées. (zip local)',
      href: wkvUrl,
      icon: 'https://www.nirsoft.net/nirsoft_unit.png',
      keywords: 'nirsoft wifi wireless key view'
    },
    {
      key: 'webbrowserpassview',
      title: 'WebBrowserPassView',
      desc: 'Récupère les mots de passe enregistrés des navigateurs. (zip local)',
      href: wbpUrl,
      icon: 'https://www.nirsoft.net/nirsoft_unit.png',
      keywords: 'nirsoft webbrowser pass view mots de passe navigateurs'
    }
  ]

  const isVisible = (text) => {
    const q = normalizeText(String(query || '').trim())
    if (q.length < 3) return true
    return normalizeText(text).includes(q)
  }

  return (
    <>
      {tools.filter(t => isVisible(t.title + ' ' + t.desc + ' ' + t.keywords + ' web webbrowser pass view mots de passe produkey pro product key')).map(t => (
        <ScriptItem
          key={t.key}
          title={<Highlight text={t.title} query={query} />}
          desc={t.desc}
          href={t.href}
          accent="indigo"
          icon={t.icon ? <img src={t.icon} alt="" className="h-5 w-5 rounded-sm" loading="lazy" /> : null}
        />
      ))}
    </>
  )
}


