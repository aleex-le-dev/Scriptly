# Déploiement sur O2Switch - Guide complet

## 1. Préparation du projet

### Structure requise
```
backend/
├── server.js
├── package.json
├── scripts/
│   └── linux/
└── .htaccess (optionnel)
```

### Modifications nécessaires pour O2Switch

#### server.js - Adapter pour Passenger
```javascript
// Remplacer le port par 'passenger' pour O2Switch
const PORT = process.env.PORT || 'passenger';

// Modifier la fonction listen
if (PORT === 'passenger') {
  // Mode O2Switch/Passenger
  httpServer = app;
} else {
  // Mode développement local
  httpServer = app.listen(PORT, HOST, () => {
    console.log(`Serveur démarré sur http://${HOST}:${PORT}`);
  });
}
```

#### package.json - Scripts de déploiement
```json
{
  "scripts": {
    "start": "node server.js",
    "postinstall": "chmod +x scripts/linux/*.sh"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## 2. Configuration O2Switch

### Via cPanel
1. **Accéder à cPanel** → Section "Logiciels" → "Setup Node.js App"
2. **Créer l'application** :
   - Version Node.js : 18.x ou 20.x
   - Mode : Production
   - Application root : `/home/votredomaine/backend`
   - Startup file : `server.js`

### Configuration SSH (si disponible)
```bash
# Ajouter Node.js au PATH
echo 'export PATH="$PATH:/opt/alt/alt-nodejs20/root/usr/bin/"' >> ~/.bashrc
source ~/.bashrc

# Vérifier l'installation
node --version
npm --version
```

## 3. Déploiement

### Méthode 1 : Upload FTP
1. Compresser le dossier `backend/`
2. Upload via cPanel File Manager
3. Extraire dans le répertoire de l'application

### Méthode 2 : Git (si disponible)
```bash
cd /home/votredomaine/backend
git clone https://github.com/votre-repo.git .
npm install
```

### Installation des dépendances
```bash
cd /home/votredomaine/backend
npm install --production
```

## 4. Configuration finale

### Variables d'environnement
Dans cPanel → "Setup Node.js App" → Variables d'environnement :
```
NODE_ENV=production
HOST=0.0.0.0
```

### Permissions des scripts
```bash
chmod +x scripts/linux/*.sh
```

### Test de l'application
```bash
# Vérifier que l'app démarre
node server.js

# Tester les endpoints
curl http://votredomaine.com/health
```

## 5. Configuration du frontend

### Mise à jour de l'URL API
```javascript
// frontend/src/services/api.js
const BASE_URL = isProduction 
  ? 'https://votredomaine.com'
  : 'http://127.0.0.1:3000'
```

### Build et déploiement frontend
```bash
cd frontend
npm run build
# Upload du dossier dist/ vers public_html/
```

## 6. Points importants O2Switch

### Limitations
- Pas d'accès root
- Scripts Linux uniquement (pas de Windows)
- Pas de processus en arrière-plan
- Ports limités

### Optimisations
- Utiliser `pm2` si disponible
- Configurer la compression gzip
- Optimiser les images
- Utiliser un CDN pour les assets statiques

### Monitoring
- Logs dans cPanel → "Logs d'erreur"
- Monitoring via "Setup Node.js App"
- Alertes par email configurées

## 7. Dépannage

### Problèmes courants
1. **Scripts non exécutables** : `chmod +x scripts/linux/*.sh`
2. **Port non configuré** : Utiliser `'passenger'` au lieu d'un numéro
3. **Dépendances manquantes** : Vérifier `npm install`
4. **Permissions** : Vérifier les droits sur les fichiers

### Logs utiles
```bash
# Logs d'erreur Node.js
tail -f ~/logs/nodejs_error.log

# Logs d'accès
tail -f ~/logs/access.log
```

## 8. Sécurité

### Recommandations
- Utiliser HTTPS (certificat Let's Encrypt)
- Configurer les CORS correctement
- Limiter les accès aux scripts sensibles
- Mettre à jour régulièrement les dépendances

### Configuration .htaccess
```apache
# Redirection HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Headers de sécurité
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
```
