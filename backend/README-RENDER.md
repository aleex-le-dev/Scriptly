# 🚀 Déploiement sur Render

## Étapes de déploiement

### 1. Préparer le repository
```bash
# S'assurer que tous les fichiers sont commités
git add .
git commit -m "Préparation déploiement Render"
git push origin main
```

### 2. Créer un service sur Render

1. Aller sur [render.com](https://render.com)
2. Se connecter avec GitHub
3. Cliquer sur "New +" → "Web Service"
4. Connecter votre repository
5. Configurer :
   - **Name** : `backend-api`
   - **Environment** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Plan** : `Free` (ou `Starter` pour plus de ressources)

### 3. Variables d'environnement

Dans l'interface Render, ajouter :
- `NODE_ENV` = `production`
- `PORT` = `10000` (Render utilise ce port)
- `HOST` = `0.0.0.0`

### 4. Déploiement automatique

Render déploiera automatiquement à chaque push sur la branche `main`.

## Configuration des scripts PowerShell

⚠️ **Important** : Les scripts PowerShell ne fonctionneront pas sur Render car c'est un environnement Linux. 

Pour adapter votre API :
1. Créer des endpoints qui retournent des instructions
2. Utiliser des webhooks pour déclencher des actions locales
3. Déployer sur un serveur Windows (Azure, AWS EC2 Windows)

## URLs de test

Une fois déployé :
- **API** : `https://votre-app.onrender.com`
- **Health** : `https://votre-app.onrender.com/health`
- **Routes** : `https://votre-app.onrender.com/__routes`

## Monitoring

- Logs disponibles dans l'interface Render
- Métriques de performance
- Redémarrage automatique en cas de crash

