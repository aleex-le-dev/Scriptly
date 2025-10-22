// Composant Logiciel: liens directs vers des logiciels (installateurs officiels)

import { Highlight } from './Highlight'
import { ScriptItem } from './ScriptItem'
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
    },
    {
      key: 'iobit-unlocker',
      title: 'IObit Unlocker',
      desc: 'Déverrouille et supprime les fichiers récalcitrants',
      href: 'https://www.iobit.com/fr/iobit-unlocker.php#',
      icon: '🔓',
      keywords: 'iobit unlocker debloquer supprimer fichier recalcitrant'
    },
    {
      key: 'activation-office-windows',
      title: 'Activation Office et Windows',
      desc: 'Outil d\'activation pour Office et Windows',
      href: 'https://drive.google.com/uc?export=download&id=1hvtgrHEb4uxshmCmBVlAySr50ETXA-Ah',
      icon: '⚡',
      keywords: 'activation office windows cle licence microsoft'
    },
    {
      key: 'office-2024',
      title: 'Office 2024',
      desc: 'Téléchargement direct Microsoft Office 2024',
      href: 'https://drive.usercontent.google.com/download?id=1wf1eqVkXIM0f0R2963Ee4RKK-a_rgWld&export=download&authuser=0&confirm=t&uuid=941d1835-9870-4115-8baa-5155c2bcbeb8&at=AKSUxGOpxt6HuTVCq4_qMaWEBFoX:1761170678446',
      icon: 'https://www.trustedtechteam.com/cdn/shop/files/office-2024.png?v=1756999675',
      keywords: 'office microsoft 2024 telechargement direct'
    }
  ]

  const isVisible = (text) => {
    const q = normalizeText(String(query || '').trim())
    if (q.length < 3) return true
    return normalizeText(text).includes(q)
  }

  return (
    <>
      {apps.filter(a => isVisible(a.title + ' ' + a.desc + ' ' + a.keywords + ' google iobit unlocker activation office windows microsoft')).map(app => (
        <ScriptItem
          key={app.key}
          title={<Highlight text={app.title} query={query} />}
          desc={app.desc}
          href={app.href}
          accent="rose"
          icon={app.icon ? (app.icon.startsWith('http') ? <img src={app.icon} alt="" className="h-5 w-5 rounded-sm" loading="lazy" /> : app.icon) : null}
        />
      ))}
    </>
  )
}


