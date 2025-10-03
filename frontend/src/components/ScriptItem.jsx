// ScriptItem: carte de script au style glassmorphique uniforme
// - Supporte onClick (bouton) ou href (lien)
// - title (string | ReactNode), desc (string), accent (tailwind color name)

export function ScriptItem({ title, label = '', desc, onClick, href, accent = 'teal', icon = null }) {
  const base = `w-full group relative overflow-hidden rounded-xl border border-white/30 dark:border-white/20 bg-white/40 dark:bg-black/40 backdrop-blur-xl backdrop-saturate-150 shadow-lg transition hover:bg-white/55 dark:hover:bg-black/55 cursor-pointer`

  // Détection d'icône automatique basée sur des mots-clés si aucune icône n'est fournie
  const pickAutoIcon = (text) => {
    const t = String(text || '').toLowerCase()
    if (!t) return null
    if (t.includes('bitlocker')) return '🔒'
    if (t.includes('chkdsk')) return '🧰'
    if (t.includes('défrag') || t.includes('defrag')) return '🧩'
    if (t.includes('diskpart') || t.includes('disque') || t.includes('drive')) return '💽'
    if (t.includes('dns')) return '🌐'
    if (t.includes('winget') || t.includes('mise') || t.includes('update') || t.includes('upgrade')) return '📦'
    if (t.includes('menu') || t.includes('contextuel')) return '🗂️'
    if (t.includes('maintenance')) return '🛠️'
    if (t.includes('chrome') || t.includes('navigateur') || t.includes('browser')) return '🌐'
    return null
  }

  const resolvedIcon = icon || pickAutoIcon(label) || '★'
  const content = (
    <div className="p-3">
      <div className="flex items-center gap-3">
        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg bg-${accent}-100 text-${accent}-700 text-base shadow`}>{resolvedIcon}</span>
        <div className="min-w-0">
          <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{title}</div>
          {desc && <div className="text-xs text-gray-700/80 dark:text-gray-200/80 truncate">{desc}</div>}
        </div>
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={base} title={typeof desc === 'string' ? desc : ''}>
        {content}
      </a>
    )
  }

  return (
    <div role="button" tabIndex={0} onClick={onClick} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.() }} className={base} title={typeof desc === 'string' ? desc : ''}>
      {content}
    </div>
  )
}


