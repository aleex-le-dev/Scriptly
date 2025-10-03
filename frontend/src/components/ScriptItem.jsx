// ScriptItem: carte de script au style glassmorphique uniforme
// - Supporte onClick (bouton) ou href (lien)
// - title (string | ReactNode), desc (string), accent (tailwind color name)

export function ScriptItem({ title, desc, onClick, href, accent = 'teal', icon = null }) {
  const base = `w-full group relative overflow-hidden rounded-xl border border-white/30 bg-white/40 backdrop-blur-xl backdrop-saturate-150 shadow-lg transition hover:bg-white/55`
  const content = (
    <div className="p-3">
      <div className="flex items-center gap-3">
        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg bg-${accent}-100 text-${accent}-700 text-base shadow`}>{icon || '★'}</span>
        <div className="min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">{title}</div>
          {desc && <div className="text-xs text-gray-700/80 truncate">{desc}</div>}
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


