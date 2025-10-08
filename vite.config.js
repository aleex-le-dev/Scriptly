import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync, writeFileSync, mkdirSync, existsSync, statSync, readdirSync } from 'fs'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss({
      config: './tailwind.config.js'
    }),
    // Plugin pour créer .htaccess automatiquement
    {
      name: 'create-htaccess',
      writeBundle() {
        try {
          const htaccessContent = `RewriteEngine On

# Redirection HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Redirection vers le backend Render
RewriteCond %{REQUEST_URI} ^/api/(.*)$
RewriteRule ^api/(.*)$ https://scriptly-i60u.onrender.com/$1 [R=307,L]

# Servir les fichiers statiques du frontend
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteCond %{REQUEST_URI} !^/scripts/
RewriteRule ^(.*)$ /index.html [L]

# Headers de sécurité
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Cache pour les assets statiques
<FilesMatch "\\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 month"
    Header set Cache-Control "public, immutable"
</FilesMatch>

# Autoriser les téléchargements de scripts et exécutables
<FilesMatch "\\.(bat|ps1|sh|exe|zip)$">
    Header set Content-Disposition "attachment"
    Header set Cache-Control "no-cache, no-store, must-revalidate"
</FilesMatch>

# Compression gzip
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/json
</IfModule>`;
          
          writeFileSync('dist/.htaccess', htaccessContent);
          console.log('✓ .htaccess créé dans dist/')
        } catch (error) {
          console.warn('⚠ Impossible de créer .htaccess:', error.message)
        }
      }
    },
    // Plugin pour copier tous les scripts depuis public/scripts vers dist/scripts
    {
      name: 'copy-scripts',
      writeBundle() {
        try {
          const publicScriptsDir = 'public/scripts';
          const distScriptsDir = 'dist/scripts';
          
          if (!existsSync(publicScriptsDir)) {
            console.warn('⚠ Dossier public/scripts non trouvé');
            return;
          }

          // Copier récursivement tout le dossier scripts
          const copyRecursive = (src, dest) => {
            if (!existsSync(src)) return;
            
            const stats = statSync(src);
            if (stats.isDirectory()) {
              if (!existsSync(dest)) mkdirSync(dest, { recursive: true });
              const files = readdirSync(src);
              files.forEach(file => {
                copyRecursive(resolve(src, file), resolve(dest, file));
              });
            } else {
              const destDir = resolve(dest, '..');
              if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });
              copyFileSync(src, dest);
            }
          };

          copyRecursive(publicScriptsDir, distScriptsDir);
          console.log('✓ Tous les scripts copiés dans dist/scripts')
        } catch (error) {
          console.warn('⚠ Impossible de copier les scripts:', error.message)
        }
      }
    }
  ],
})
