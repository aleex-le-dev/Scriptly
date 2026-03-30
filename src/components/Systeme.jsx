// Composant Systeme: actions système (menu contextuel classique)
// - Ouvre une fenêtre CMD avec le script registre (admin requis)

import { openLocalScript } from '../services/api'
import { Highlight } from './Highlight'
import { ScriptItem } from './ScriptItem'
import { normalizeText } from '../utils/text'
import { useState } from 'react'

export function Systeme({ query = '' }) {
  const [showUnlockNotes, setShowUnlockNotes] = useState(false)

  const openClassicMenuToggle = () => openLocalScript('systeme/batch/context-menu-classic-toggle.bat')
  const openUserManagement = () => openLocalScript('systeme/batch/user-management.bat')
  const openSfcScan = () => openLocalScript('systeme/batch/sfc-scan.bat')
  const openDismCheck = () => openLocalScript('systeme/batch/dism-check.bat')
  const openDismRestore = () => openLocalScript('systeme/batch/dism-restore.bat')
  const openDiskCleanup = () => openLocalScript('systeme/batch/disk-cleanup.bat')
  const openTempCleanup = () => openLocalScript('systeme/batch/temp-cleanup.bat')
  const openRegistryCleanup = () => openLocalScript('systeme/batch/registry-cleanup.bat')
  const openDriversList = () => openLocalScript('systeme/batch/drivers-list.bat')
  const openSystemReport = () => openLocalScript('systeme/batch/system-report.bat')
  const openWindowsUpdateRepair = () => openLocalScript('systeme/batch/windows-update-repair.bat')
  const openResetWuServices = () => openLocalScript('systeme/batch/reset-wu-services.bat')
  const openTouchManager = () => openLocalScript('hardware/batch/touch-manager.bat')
  const openBrowserPasswords = () => openLocalScript('nirsoft/batch/webbrowserpassview-export.bat')
  
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
      {visible('systeme sfc scannow fichiers systeme corruption reparer') && (
        <ScriptItem
          title={<Highlight text="SFC /Scannow" query={query} />}
          label="sfc scannow system files repair"
          desc="Analyse et répare les fichiers système corrompus"
          onClick={openSfcScan}
          accent="blue"
          icon="🛡️"
        />
      )}
      {visible('systeme dism check checkhealth verification image windows') && (
        <ScriptItem
          title={<Highlight text="DISM CheckHealth" query={query} />}
          label="dism check health image"
          desc="Vérifie l'état de l'image système Windows"
          onClick={openDismCheck}
          accent="blue"
          icon="🔍"
        />
      )}
      {visible('systeme dism restore health image windows reparer') && (
        <ScriptItem
          title={<Highlight text="DISM Restore Health" query={query} />}
          label="dism restore health image repair"
          desc="Répare l'image système Windows (si SFC échoue)"
          onClick={openDismRestore}
          accent="blue"
          icon="🩹"
        />
      )}
      {visible('systeme nettoyage disque cleanmgr espace') && (
        <ScriptItem
          title={<Highlight text="Nettoyage de disque" query={query} />}
          label="nettoyage disque cleanmgr"
          desc="Libère de l'espace disque (Cleanmgr)"
          onClick={openDiskCleanup}
          accent="emerald"
          icon="🧹"
        />
      )}
      {visible('systeme nettoyage temp fichiers temporaires cache') && (
        <ScriptItem
          title={<Highlight text="Vider les fichiers temporaires" query={query} />}
          label="nettoyage temp cache"
          desc="Supprime les fichiers temporaires et le cache"
          onClick={openTempCleanup}
          accent="red"
          icon="🗑️"
        />
      )}
      {visible('systeme registre nettoyage optimisation registry cleanup') && (
        <ScriptItem
          title={<Highlight text="Nettoyage du Registre" query={query} />}
          label="registre registry cleanup optimisation"
          desc="Analyse, nettoie et sauvegarde le registre Windows"
          onClick={openRegistryCleanup}
          accent="red"
          icon="🗃️"
        />
      )}
      {visible('systeme update windows reparation service wuauserv composants') && (
        <ScriptItem
          title={<Highlight text="Réparer Windows Update" query={query} />}
          label="windows update repair service"
          desc="Réinitialise les composants Windows Update (cache + services)"
          onClick={openWindowsUpdateRepair}
          accent="orange"
          icon="🔄"
        />
      )}
      {visible('systeme reset services windows update wuauserv bits cryptsvc redemarrer') && (
        <ScriptItem
          title={<Highlight text="Reset services Windows Update" query={query} />}
          label="reset windows update services wuauserv bits"
          desc="Redémarre les services wuauserv, cryptsvc, appidsvc, bits"
          onClick={openResetWuServices}
          accent="orange"
          icon="🔃"
        />
      )}
      {visible('systeme pilotes drivers liste export') && (
        <ScriptItem
          title={<Highlight text="Lister les pilotes" query={query} />}
          label="pilotes drivers list export"
          desc="Exporte la liste des pilotes installés sur le bureau"
          onClick={openDriversList}
          accent="indigo"
          icon="📝"
        />
      )}
      {visible('systeme rapport system report infos systeminfo ipconfig driverquery') && (
        <ScriptItem
          title={<Highlight text="Rapport système complet" query={query} />}
          label="rapport systeme system report"
          desc="Génère 3 rapports sur le bureau (système, réseau, pilotes)"
          onClick={openSystemReport}
          accent="indigo"
          icon="📊"
        />
      )}
      {visible('materiel ecran tactile touch screen manager restart desactiver activer pilote') && (
        <ScriptItem
          title={<Highlight text="Gestion écran tactile" query={query} />}
          label="ecran tactile touch screen manager restart disable enable"
          desc="Redémarrer, désactiver ou activer le pilote tactile"
          onClick={openTouchManager}
          accent="violet"
          icon="👆"
        />
      )}
      {visible('passwords mots de passe navigateurs export chrome edge firefox nirsoft') && (
        <ScriptItem
          title={<Highlight text="Export Mots de Passe Navigateurs" query={query} />}
          label="passwords mots de passe export browser"
          desc="Exporte les mots de passe Chrome/Edge/Firefox (Nirsoft)"
          onClick={openBrowserPasswords}
          accent="fuchsia"
          icon="🔑"
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
