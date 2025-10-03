// Card réutilisable pour les catégories
// - Affiche un header (titre + description)
// - Largeur fixe, styles unifiés
// - Replié par défaut; s'ouvre au clic (ou Enter/Espace)

 export function Card({
  title,
  description,
  gradient = 'from-gray-100/60 to-gray-50/60',
  border = 'border-gray-200/50',
  text = 'text-gray-900',
  textMuted = 'text-gray-700',
  children,
}) {
  // plus d'interaction d'ouverture ici; la grille affiche directement les scripts
  return (
    <div
      className={`w-[360px] rounded-2xl shadow-2xl border ${border} border-white/30 p-6 select-none bg-gradient-to-br ${gradient} bg-white/30 backdrop-blur-xl backdrop-saturate-150`}
    >
      <h2 className={`text-xl font-semibold ${text} mb-2`}>{title}</h2>
      {description && <p className={`text-sm ${textMuted} mb-2`}>{description}</p>}
      <div className="pt-2 grid grid-cols-2 gap-2">
        {children}
      </div>
    </div>
  )
}


