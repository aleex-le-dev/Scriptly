// Toast UI components
// - ToastContainer: affiche une pile de toasts en haut, centrée à l'écran
// - Usage: <ToastContainer toasts={toasts} onRemove={handleRemoveToast} durationMs={2500} />
//   où `toasts` est un tableau [{ id, message, type: 'success' | 'error' }]

import { useEffect } from 'react'

/**
 * ToastItem: rendu d'un toast individuel avec auto-disparition
 */
function ToastItem({ id, message, type, onRemove, durationMs }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(id), durationMs)
    return () => clearTimeout(timer)
  }, [id, onRemove, durationMs])

  return (
    <div className={`pointer-events-auto flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg border w-max max-w-[90vw]
      ${type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'}`}
    >
      <span className={`inline-block h-2.5 w-2.5 rounded-full ${type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}

/**
 * ToastContainer: conteneur positionné en haut-centre empilant les toasts
 */
export function ToastContainer({ toasts, onRemove, durationMs = 2500 }) {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
      {toasts.map(t => (
        <ToastItem key={t.id} id={t.id} message={t.message} type={t.type} onRemove={onRemove} durationMs={durationMs} />
      ))}
    </div>
  )
}


