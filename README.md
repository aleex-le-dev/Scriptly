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

## Utilisation en développement

1. `npm install`
2. `npm run dev`
3. Accéder à l’interface, entrer le mot de passe `AetA`.

## Compilation et mise en ligne

Pour déployer les nouveautés sur votre site web hébergé :

1. **Installer les dépendances (si ce n'est pas déjà fait)** :
   ```bash
   npm install
   ```

2. **Compiler le projet (OBLIGATOIRE avant mise en ligne)** :
   ```bash
   npm run build
   ```
   *Cette commande compile le code React/Tailwind dans `dist/assets/`, copie automatiquement les scripts de `public/scripts/` vers `dist/scripts/`, et génère le fichier `dist/.htaccess`.*

3. **Déployer sur le serveur** :
   - Transférez / uploadez l'intégralité du contenu du dossier **`dist/`** vers la racine de votre hébergement web (Apache, FTP, FileZilla, cPanel, etc.).

4. **Sauvegarder sur GitHub (optionnel mais recommandé)** :
   ```bash
   git add .
   git commit -m "Mise à jour des scripts et de l'interface"
   git push
   ```
