## Scripts et fonctionnalités

- Gestion utilisateurs (Système): `public/scripts/systeme/batch/user-management.bat`
  - Lister utilisateurs actifs (Admin, Actif, MDP défini)
  - Ajouter, supprimer, ajouter/retirer des administrateurs
  - Modifier un mot de passe et forcer le changement au prochain logon

- Menu contextuel classique (Système): `public/scripts/systeme/batch/context-menu-classic-toggle.bat`
  - Active/désactive le menu classique de Windows 11 (élevé UAC automatique)

- Verrouillage d’accès UI
  - Mot de passe de session: composant `Gate` (mot de passe `AetA`)
  - Bouton 🔒 pour effacer la session et re-verrouiller
  - Blocage clic droit et F12/Fn+F12

## Utilisation

1. `npm install`
2. `npm run dev`
3. Accéder à l’interface, entrer le mot de passe `AetA`.
