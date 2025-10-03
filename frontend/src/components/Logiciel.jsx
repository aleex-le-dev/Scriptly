// Composant Logiciel: liens directs vers des logiciels (installateurs officiels)

import { Highlight } from './Highlight'
import { normalizeText } from '../utils/text'

export function Logiciel({ query = '' }) {
  const apps = [
    {
      key: 'chrome',
      title: 'Google Chrome',
      desc: 'Téléchargement direct (64-bit, MSI entreprise).',
      href: 'https://dl.google.com/dl/chrome/install/googlechromestandaloneenterprise64.msi',
      icon: 'https://www.google.com/chrome/static/images/favicons/favicon-32x32.png',
      keywords: 'logiciel chrome navigateur google telechargement direct msi'
    },
    {
      key: 'vlc',
      title: 'VLC media player',
      desc: 'Téléchargement direct (Windows 64-bit).',
      href: 'https://download.videolan.org/pub/videolan/vlc/last/win64/vlc-3.0.21-win64.exe',
      icon: 'https://www.videolan.org/images/favicon.ico',
      keywords: 'logiciel vlc video lecteur mediaplayer videolan telechargement direct'
    },
    {
      key: 'sumatra',
      title: 'Sumatra PDF',
      desc: 'Téléchargement direct (64-bit, installateur).',
      href: 'https://www.sumatrapdfreader.org/dl/rel/3.5.2/SumatraPDF-3.5.2-64-install.exe',
      icon: 'https://www.sumatrapdfreader.org/favicon.ico',
      keywords: 'logiciel sumatra pdf lecteur telechargement direct'
    }
  ]

  const isVisible = (text) => {
    const q = normalizeText(String(query || '').trim())
    if (q.length < 3) return true
    return normalizeText(text).includes(q)
  }

  return (
    <div className="flex flex-wrap gap-3">
      {apps.filter(a => isVisible(a.title + ' ' + a.desc + ' ' + a.keywords + ' google')).map(app => (
        <a
          key={app.key}
          href={app.href}
          target="_blank"
          rel="noreferrer noopener"
          className="w-64 bg-white/40 backdrop-blur-xl backdrop-saturate-150 rounded-2xl border border-white/30 shadow-lg p-4 cursor-pointer hover:bg-white/50 hover:shadow-xl transition block"
        >
          <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
            {app.icon && (
              <img src={app.icon} alt="" className="h-5 w-5 rounded-sm" loading="lazy" />
            )}
            <span><Highlight text={app.title} query={query} /></span>
          </div>
          <div className="text-xs text-gray-600 mt-1"><Highlight text={app.desc} query={query} /></div>
        </a>
      ))}
    </div>
  )
}


