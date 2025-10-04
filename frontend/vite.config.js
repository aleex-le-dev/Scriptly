import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync } from 'fs'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss({
      config: './tailwind.config.js'
    }),
    // Plugin pour copier .htaccess automatiquement
    {
      name: 'copy-htaccess',
      writeBundle() {
        try {
          // Copier le .htaccess du frontend vers dist/
          copyFileSync('./dist/.htaccess', 'dist/.htaccess')
          console.log('✓ .htaccess copié dans dist/')
        } catch (error) {
          console.warn('⚠ Impossible de copier .htaccess:', error.message)
        }
      }
    }
  ],
})
