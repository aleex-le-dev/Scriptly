# Scriptly — Guide de développement

Site statique React + Vite + Tailwind pour télécharger des scripts Windows (.bat / .ps1).
Hébergé sur Apache (pas de backend). Les scripts sont dans `public/scripts/` et copiés dans `dist/scripts/` au build.

---

## Architecture du projet

```
public/scripts/
├── general/batch/          # Script principal mega-script (Scripts-by-AleexLeDev.bat)
├── systeme/batch/          # Système : SFC, DISM, registre, nettoyage, pilotes, WU...
├── networks/batch/         # Réseau : DNS, Wi-Fi, ipconfig, réparation réseau
├── disks/batch/            # Disques : BitLocker, CHKDSK, défrag, formatage
├── disks/powershells/      # Scripts PowerShell disques
├── applications/batch/     # Mise à jour : winget update
├── nirsoft/batch/          # Mots de passe : Nirsoft WebBrowserPassView
└── hardware/batch/         # Matériel : écran tactile

src/
├── components/
│   ├── Catalog.jsx         # Layout catégories + sidebar
│   ├── Systeme.jsx         # Entrées catégorie Système
│   ├── Reseau.jsx          # Entrées catégorie Réseau
│   ├── Disks.jsx           # Entrées catégorie Disques
│   ├── Application.jsx     # Entrées catégorie Mise à jour
│   ├── Nirsoft.jsx         # Entrées catégorie Mots de passe
│   ├── General.jsx         # Entrées catégorie Général
│   ├── Logiciel.jsx        # Entrées catégorie Logiciels (téléchargements externes)
│   ├── ScriptItem.jsx      # Composant carte de script (glassmorphique)
│   └── Highlight.jsx       # Surlignage de la recherche
├── services/api.js         # openLocalScript() — téléchargement via <a download>
└── utils/text.js           # normalizeText() pour la recherche
```

---

## Créer un nouveau script .bat

### Template de base (avec admin)

```bat
@echo off
chcp 65001 >nul
title Mon Script - Description courte

net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

cls
echo ================================================
echo     TITRE DU SCRIPT
echo ================================================
echo.

REM === Code principal ici ===

echo.
pause
exit
```

### Template sans admin (scripts qui n'ont pas besoin d'élévation)

```bat
@echo off
chcp 65001 >nul
title Mon Script - Description courte

cls
echo ================================================
echo     TITRE DU SCRIPT
echo ================================================
echo.

REM === Code principal ici ===

echo.
pause
```

### Règles obligatoires pour les scripts

1. **Toujours `@echo off` en ligne 1**
2. **`chcp 65001 >nul`** — pour supporter les accents dans la console
3. **`title`** — titre descriptif affiché dans la barre de la fenêtre CMD
4. **Auto-élévation admin** — obligatoire si le script utilise des commandes admin (`sfc`, `dism`, `netsh`, `reg`, `net user`, `diskpart`, `manage-bde`, etc.) :
   ```bat
   net session >nul 2>&1
   if %errorlevel% neq 0 (
       powershell -Command "Start-Process '%~f0' -Verb RunAs"
       exit /b
   )
   ```
5. **`pause`** avant `exit` — pour que l'utilisateur voie le résultat
6. **Pas d'accents dans les `echo`** — utiliser des équivalents sans accents (ex: `Reparation` au lieu de `Réparation`) car même avec chcp 65001, certaines consoles ne les affichent pas correctement dans les echo
7. **Ne JAMAIS utiliser `if not defined MSYSTEM`** — si besoin de compatibilité Git Bash, utiliser `if defined MSYSTEM ("%ComSpec%" /c "%~f0" & exit /b)`. La version `not defined` fait boucler le script dans CMD normal.

### Script avec menu interactif

Pour un script avec plusieurs options, utiliser des labels et `set /p` :

```bat
:menu
cls
echo ================================================
echo     TITRE DU MENU
echo ================================================
echo.
echo   [1] Option 1
echo   [2] Option 2
echo   [0] Quitter
echo.
set /p choice=Votre choix:

if "%choice%"=="1" goto option1
if "%choice%"=="2" goto option2
if "%choice%"=="0" goto exit_script
goto menu

:option1
REM ...
pause
goto menu

:option2
REM ...
pause
goto menu

:exit_script
exit
```

### Commandes qui nécessitent admin

| Commande | Usage |
|----------|-------|
| `sfc /scannow` | Réparation fichiers système |
| `dism /online /...` | Image Windows |
| `netsh interface ...` | Configuration réseau/DNS |
| `reg add/delete` | Registre Windows |
| `net user` | Gestion utilisateurs |
| `net localgroup` | Groupes locaux |
| `diskpart` | Gestion disques |
| `manage-bde` | BitLocker |
| `chkdsk` | Vérification disques |
| `cleanmgr` | Nettoyage disque (mieux en admin) |
| `wmic` | Infos système |
| `bcdedit` | Boot configuration |

### Commandes qui fonctionnent sans admin

| Commande | Usage |
|----------|-------|
| `winget` | Fonctionne sans admin mais mieux avec |
| `ipconfig` | Affichage config réseau |
| `driverquery` | Liste pilotes (mieux en admin) |
| `systeminfo` | Infos système (lecture) |
| `netsh wlan show profiles` | Profils Wi-Fi (lecture) |
| `curl` / `certutil` | Téléchargement fichiers |

---

## Ajouter un script au site web

### 1. Placer le fichier .bat

Mettre le script dans le bon dossier de `public/scripts/<categorie>/batch/`.

### 2. Ajouter l'entrée dans le composant React

Ouvrir le composant de la catégorie correspondante (`Systeme.jsx`, `Reseau.jsx`, etc.) et ajouter :

```jsx
// 1. Déclarer la fonction d'ouverture
const openMonScript = () => openLocalScript('categorie/batch/mon-script.bat')

// 2. Ajouter dans le return, avec filtrage par recherche
{visible('mots cles recherche pour ce script') && (
  <ScriptItem
    title={<Highlight text="Titre affiché" query={query} />}
    label="mots cles pour auto-icon"
    desc="Description courte de ce que fait le script"
    onClick={openMonScript}
    accent="blue"
    icon="🔧"
  />
)}
```

### Props de ScriptItem

| Prop | Type | Description |
|------|------|-------------|
| `title` | `ReactNode` | Titre affiché — toujours wrapper avec `<Highlight text="..." query={query} />` |
| `label` | `string` | Mots-clés pour l'auto-détection d'icône (optionnel si `icon` fourni) |
| `desc` | `string` | Description courte sous le titre |
| `onClick` | `function` | Fonction de téléchargement — `() => openLocalScript('chemin/relatif.bat')` |
| `accent` | `string` | Couleur Tailwind : `blue`, `amber`, `teal`, `red`, `emerald`, `indigo`, `violet`, `rose`, `cyan`, `orange`, `gray`, `fuchsia` |
| `icon` | `string` | Emoji icône |

### Fonction `visible()` pour la recherche

Chaque composant catégorie a une fonction `visible(text)` qui retourne `true` si la query de recherche (min 3 caractères) matche le texte fourni. Inclure dans le texte :
- Le nom de la catégorie
- Le nom du script
- Des mots-clés en français ET anglais
- Des termes techniques associés

Exemple : `'systeme sfc scannow fichiers systeme corruption reparer'`

### 3. Mettre à jour le script principal

Si le nouveau script doit aussi être dans le mega-script `Scripts-by-AleexLeDev.bat`, l'ajouter dans la bonne catégorie du menu principal.

---

## Catégories du site (Catalog.jsx)

| Clé | Label sidebar | Composant | Dossier scripts |
|-----|---------------|-----------|-----------------|
| `general` | 🔧 AleexLeDev | `General` | `general/batch/` |
| `nirsoft` | 🧰 Mot de passe | `Nirsoft` | `nirsoft/batch/` |
| `systeme` | ⚙️ Système | `Systeme` | `systeme/batch/` |
| `applications` | 📦 Mise à jour | `Application` | `applications/batch/` |
| `logiciels` | 💿 Logiciels | `Logiciel` | _(liens externes)_ |
| `reseau` | 🌐 Réseau | `Reseau` | `networks/batch/` |
| `disques` | 💾 Disques | `Disks` | `disks/batch/` + `disks/powershells/` |

Note : `hardware/batch/` est affiché dans la catégorie Système sur le site.

---

## Build et déploiement

```bash
npm run build        # Génère dist/ avec assets + scripts + .htaccess
```

Le build Vite :
1. Compile React/Tailwind dans `dist/assets/`
2. Crée automatiquement `dist/.htaccess` (plugin create-htaccess dans vite.config.js)
3. Copie `public/scripts/` vers `dist/scripts/` (plugin copy-scripts)

Déployer = uploader le contenu de `dist/` sur l'hébergeur Apache.

### .htaccess important

Toutes les directives Apache doivent être wrappées dans `<IfModule>` pour éviter les erreurs 500 si un module n'est pas chargé :
```apache
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
</IfModule>
```

---

## API de téléchargement (api.js)

```js
openLocalScript('categorie/batch/nom-script.bat')
```

Crée un `<a href="/scripts/..." download>` temporaire et le clique. Pas de backend.
