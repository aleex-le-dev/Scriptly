import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
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
    // Plugin pour copier une sélection de scripts Windows dans dist/scripts
    {
      name: 'copy-windows-scripts',
      writeBundle() {
        try {
          const sources = [
            // Batch
            'backend/scripts/disks/batch/check-bitlocker.bat',
            'backend/scripts/disks/batch/bitlocker-off.bat',
            'backend/scripts/disks/batch/format-drive.bat',
            'backend/scripts/maintenance/batch/windows-maintenance-admin.bat',
            'backend/scripts/networks/batch/cloudflare-dns-manager.bat',
            'backend/scripts/applications/batch/winget-update-admin.bat',
            // PowerShells
            'backend/scripts/disks/powershells/check-bitlocker.ps1',
            'backend/scripts/disks/powershells/bitlocker-off.ps1',
            'backend/scripts/disks/powershells/chkdsk-drive.ps1',
            'backend/scripts/disks/powershells/defrag-drive.ps1',
            'backend/scripts/disks/powershells/format-drive.ps1',
            'backend/scripts/disks/powershells/list-drives.ps1',
          ];

          const distRoot = 'dist/scripts';
          mkdirSync(distRoot, { recursive: true });

          for (const src of sources) {
            if (!existsSync(src)) continue;
            const rel = src.replace(/^backend\/scripts\//, '');
            const dst = resolve(distRoot, rel);
            const dstDir = dst.substring(0, dst.lastIndexOf('/'));
            mkdirSync(dstDir, { recursive: true });
            copyFileSync(src, dst);
          }
          console.log('✓ Scripts Windows copiés dans dist/scripts')
        } catch (error) {
          console.warn('⚠ Impossible de copier les scripts Windows:', error.message)
        }
      }
    }
  ],
})
