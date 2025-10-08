// Catalog: présentation scalable des catégories et scripts
// - Barre latérale catégories (avec compteurs)
// - Zone de contenu: grille de scripts (2 colonnes sur mobile, + sur large)
// - Utilise les composants de catégories existants pour rendre les ScriptItem

import { useMemo, useState } from 'react'
import { Highlight } from './Highlight'
import { Application } from './Application'
import { Systeme } from './Systeme'
import { Logiciel } from './Logiciel'
import { Nirsoft } from './Nirsoft'
import { Reseau } from './Reseau'
import { Disks } from './Disks'
import { General } from './General'
import { normalizeText } from '../utils/text'

export function Catalog({ query = '' }) {
  const q = normalizeText(String(query || '').trim())

  const categories = useMemo(() => ([
    { key: 'general', label: '🔧 AleexLeDev', component: General },
    { key: 'nirsoft', label: '🧰 Mot de passe', component: Nirsoft },
    { key: 'systeme', label: '⚙️ Système', component: Systeme },
    { key: 'applications', label: '📦 Mise à jour', component: Application },
    { key: 'logiciels', label: '💿 Logiciels', component: Logiciel },
    { key: 'reseau', label: '🌐 Réseau', component: Reseau },
    { key: 'disques', label: '💾 Disques', component: Disks },
  ]), [])

  const [active, setActive] = useState('all')

  const SidebarItem = ({ id, label, count }) => (
    <button
      onClick={() => setActive(id)}
      className={`w-full text-left px-3 py-2 rounded-xl transition border cursor-pointer ${active === id ? 'bg-white/50 dark:bg-black/50 border-white/40 dark:border-white/30 shadow-md' : 'bg-white/30 dark:bg-black/30 border-white/20 dark:border-white/20 hover:bg-white/40 dark:hover:bg-black/40'} backdrop-blur-xl`}
    >
      <span className="inline-flex items-center gap-2 text-black dark:text-white">
        <span>{label}</span>
        {typeof count === 'number' && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 border border-white/30 dark:border-white/20">{count}</span>
        )}
      </span>
    </button>
  )

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)] gap-4">
      <aside className="md:sticky md:top-24 md:self-start">
        <div className="rounded-2xl border border-white/30 dark:border-white/20 bg-white/30 dark:bg-black/30 backdrop-blur-xl p-3 shadow-lg">
          <div className="mb-2 font-semibold text-black dark:text-white">Catégories</div>
          <div className="flex md:block gap-2 md:gap-0 overflow-auto">
            <div className="grid grid-cols-2 md:block gap-2 md:gap-0">
              <SidebarItem id="all" label={<Highlight text="📚 Tout" query={query} />} />
              {categories.map(cat => (
                <div key={cat.key} className="md:mt-2">
                  <SidebarItem id={cat.key} label={<Highlight text={cat.label} query={query} />} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <section>
        <div className="rounded-2xl border border-white/30 dark:border-white/20 bg-white/30 dark:bg-black/30 backdrop-blur-xl p-4 shadow-lg">
          {active === 'all' ? (
            <div className="space-y-6">
              {categories.map(cat => {
                const Comp = cat.component
                return (
                  <div key={cat.key}>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{cat.label}</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Comp query={query} />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            (() => {
              const cat = categories.find(c => c.key === active)
              if (!cat) return null
              const Comp = cat.component
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Comp query={query} />
                </div>
              )
            })()
          )}
        </div>
      </section>
    </div>
  )
}


