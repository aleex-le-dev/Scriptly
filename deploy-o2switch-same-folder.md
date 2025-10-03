# Déploiement Backend + Frontend sur O2Switch (même dossier)

## Structure finale sur O2Switch
```
public_html/
├── .htaccess                    # Configuration Apache
├── index.html                   # Frontend build
├── assets/                      # Assets frontend
├── backend/                     # Dossier backend
│   ├── server.js
│   ├── package.json
│   └── scripts/linux/
└── api/ -> backend/             # Lien symbolique (optionnel)
```

## 1. Configuration du backend

### Modifier server.js pour O2Switch
```javascript
// Détection O2Switch
const IS_PASSENGER = env.PORT === "passenger" || env.PASSENGER_APP_ENV;

// Configuration du port
const PORT = IS_PASSENGER ? 'passenger' : (env.PORT || 3000);
```

### Variables d'environnement O2Switch
Dans cPanel → "Setup Node.js App" :
- **Application root** : `/home/votredomaine/public_html/backend`
- **Startup file** : `server.js`
- **Variables** :
  - `NODE_ENV=production`
  - `PORT=passenger`

## 2. Configuration Apache (.htaccess)

### Proxy pour l'API
```apache
# Redirection /api/* vers le backend Node.js
RewriteCond %{REQUEST_URI} ^/api/(.*)$
RewriteRule ^api/(.*)$ http://localhost:3000/$1 [P,L]
```

### Servir le frontend
```apache
# Toutes les autres requêtes vers index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule ^(.*)$ /index.html [L]
```

## 3. Déploiement étape par étape

### Étape 1 : Upload du backend
1. Compresser le dossier `backend/`
2. Upload dans `public_html/backend/`
3. Extraire les fichiers

### Étape 2 : Configuration Node.js
1. cPanel → "Setup Node.js App"
2. Créer application :
   - **Root** : `/home/votredomaine/public_html/backend`
   - **Startup** : `server.js`
   - **Version** : Node.js 18.x ou 20.x

### Étape 3 : Installation dépendances
```bash
cd /home/votredomaine/public_html/backend
npm install --production
chmod +x scripts/linux/*.sh
```

### Étape 4 : Upload du frontend
1. Build du frontend : `npm run build`
2. Upload du contenu de `dist/` vers `public_html/`
3. Upload du fichier `.htaccess`

### Étape 5 : Test
```bash
# Vérifier que le backend démarre
cd /home/votredomaine/public_html/backend
node server.js

# Tester l'API
curl https://votredomaine.com/api/health

# Tester le frontend
curl https://votredomaine.com/
```

## 4. Configuration frontend

### URL API relative
```javascript
// frontend/src/services/api.js
const BASE_URL = isProduction 
  ? '/api'  // Chemin relatif
  : 'http://127.0.0.1:3000'
```

### Build pour production
```bash
cd frontend
npm run build
# Copier le contenu de dist/ vers public_html/
```

## 5. Avantages de cette configuration

### ✅ Même domaine
- Frontend : `https://votredomaine.com/`
- API : `https://votredomaine.com/api/`
- Pas de problèmes CORS

### ✅ Gestion simplifiée
- Un seul dossier à gérer
- Configuration Apache centralisée
- Déploiement unifié

### ✅ Performance
- Proxy Apache optimisé
- Cache configuré
- Compression gzip

## 6. Dépannage

### Problèmes courants
1. **API non accessible** : Vérifier le proxy Apache
2. **Frontend ne se charge pas** : Vérifier .htaccess
3. **Scripts non exécutables** : `chmod +x scripts/linux/*.sh`
4. **Backend ne démarre pas** : Vérifier les variables d'environnement

### Logs utiles
```bash
# Logs Apache
tail -f ~/logs/access.log
tail -f ~/logs/error.log

# Logs Node.js
tail -f ~/logs/nodejs_error.log
```

### Test de connectivité
```bash
# Test du proxy
curl -I https://votredomaine.com/api/health

# Test direct du backend
curl http://localhost:3000/health
```

## 7. Sécurité

### Recommandations
- HTTPS obligatoire
- Headers de sécurité configurés
- Limitation des accès aux scripts
- Mise à jour régulière des dépendances

### Configuration .htaccess sécurisée
```apache
# Blocage des accès directs aux scripts
<Files "*.sh">
    Order Deny,Allow
    Deny from all
</Files>

# Blocage des fichiers sensibles
<FilesMatch "\.(json|log|env)$">
    Order Deny,Allow
    Deny from all
</FilesMatch>
```
