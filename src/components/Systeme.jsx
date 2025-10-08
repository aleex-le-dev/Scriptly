// Composant Systeme: actions système (menu contextuel classique)
// - Ouvre une fenêtre CMD avec le script registre (admin requis)

import { openLocalScript } from '../services/api'
import { Highlight } from './Highlight'
import { ScriptItem } from './ScriptItem'
import { normalizeText } from '../utils/text'
import { useState } from 'react'

export function Systeme({ query = '' }) {
  const [showUnlockNotes, setShowUnlockNotes] = useState(false)

  const openClassicMenuToggle = async () => { try { await openLocalScript('systeme/batch/context-menu-classic-toggle.bat') } catch { /* noop */ } }
  const openUserManagement = async () => { try { await openLocalScript('systeme/batch/user-management.bat') } catch { /* noop */ } }
  const openUnlockNotes = async () => { setShowUnlockNotes(v => !v) }
  const visible = (text) => {
    const q = normalizeText(String(query || '').trim())
    if (q.length < 3) return true
    return normalizeText(text).includes(q)
  }

  return (
    <>
      {visible('systeme menu contextuel classique explorer windows 11') && (
        <ScriptItem
          title={<Highlight text="Menu contextuel classique" query={query} />}
          label="menu contextuel classique"
          desc="Active/restaure le menu classique (Win11)"
          onClick={openClassicMenuToggle}
          accent="amber"
          icon="🗂️"
        />
      )}
      {visible('systeme utilisateur user management admin ajouter supprimer mot de passe') && (
        <ScriptItem
          title={<Highlight text="Gestion des utilisateurs locaux" query={query} />}
          label="utilisateurs locaux admin ajout suppression mot de passe"
          desc="Lister, ajouter/supprimer, droits administrateurs et réinitialiser le mot de passe"
          onClick={openUserManagement}
          accent="teal"
          icon="👤"
        />
      )}
      {visible('systeme notes debloquer session windows utilman cmd reset mot de passe pin') && (
        <div className="space-y-2">
          <ScriptItem
            title={<Highlight text="Notes: Débloquer une session Windows" query={query} />}
            label="notes debloquer session utilman cmd reset mdp pin"
            desc={showUnlockNotes ? 'Masquer le guide' : 'Afficher le guide hors-ligne (WinRE)'}
            onClick={openUnlockNotes}
            accent="violet"
            icon="📝"
          />
          {showUnlockNotes && (
            <div className="w-full rounded-xl border border-white/30 dark:border-white/20 bg-white/40 dark:bg-black/40 backdrop-blur-xl p-3 text-sm text-black dark:text-white whitespace-pre-wrap font-mono">
              {`1) Démarrer sur une clé USB Windows (WinRE/WinPE) puis ouvrir l'invite de commande.

2) Identifier la lettre du disque contenant Windows:
   > diskpart
   > list volume
   Repérer le volume où se trouve le dossier \\Windows (ex: Z:)

   S'il n'y en a pas (pas de lettre sur le volume Windows):
   > select volume X
   > assign letter=Z
   > exit

3) Vérifier la présence des fichiers cibles:
   > dir Z:\\windows\\system32\\cmd.exe
   > dir Z:\\windows\\system32\\utilman.exe

4) Remplacer utilman.exe par cmd.exe (sauvegarder si besoin avant):
   (Optionnel) Sauvegarde:
   > copy Z:\\windows\\system32\\utilman.exe Z:\\windows\\system32\\utilman.exe.bak
   Remplacement:
   > copy Z:\\windows\\system32\\cmd.exe Z:\\windows\\system32\\utilman.exe
   Tapez O (Oui) si demandé pour remplacer.

5) Redémarrer le PC normalement.

6) À l'écran de connexion, cliquer sur le bouton "Ergonomie" (facilités d'accès):
   Une fenêtre CMD s'ouvre avec privilèges système.

7) Changer le mot de passe du compte désiré:
   > net user nom_utilisateur nouveau_motdepasse
   Exemple:
   > net user martin 123456

8) (Recommandé) Restaurer utilman.exe d'origine après récupération:
   > copy Z:\\windows\\system32\\utilman.exe.bak Z:\\windows\\system32\\utilman.exe

9) Sécurité:
   - N'effectuer ces opérations que si vous êtes autorisé.
   - Supprimer la sauvegarde .bak et activer des protections (BitLocker, etc.).`}
            </div>
          )}
        </div>
      )}
    </>
  )
}
