import { useEffect, useState } from 'react'

// Gate: composant de protection simple par mot de passe en mémoire de session
// - Affiche un champ mot de passe et vérifie contre une valeur attendue
// - Stocke un drapeau en sessionStorage pour éviter de redemander pendant la session
// - N'effectue aucune transmission réseau (client-only)
export function Gate({ children, expected = 'AetA', storageKey = 'gate_ok' }) {
  const [ok, setOk] = useState(false)
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      const v = sessionStorage.getItem(storageKey)
      if (v === '1') setOk(true)
    } catch {}
  }, [storageKey])

  const submit = (e) => {
    e?.preventDefault()
    if (String(pwd) === String(expected)) {
      try { sessionStorage.setItem(storageKey, '1') } catch {}
      setOk(true)
    } else {
      setError('Mot de passe incorrect')
    }
  }

  if (ok) return children

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-black">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-white/30 dark:border-white/20 bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-lg p-4">
        <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Accès protégé</div>
        <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">Mot de passe</label>
        <input
          type="password"
          value={pwd}
          onChange={(e) => { setPwd(e.target.value); setError('') }}
          className="w-full px-3 py-2 rounded-lg bg-white/70 dark:bg-black/50 border border-white/40 dark:border-white/30 text-black dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Entrer le mot de passe"
          autoFocus
        />
        {error && <div className="mt-2 text-xs text-red-600">{error}</div>}
        <button type="submit" className="mt-3 w-full px-3 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 text-sm">Valider</button>
      </form>
    </div>
  )
}


