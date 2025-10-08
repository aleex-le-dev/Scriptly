// Service d'accès API backend
// Fournit des fonctions isolant les URLs et la gestion des erreurs

// URL du backend - adapte automatiquement selon l'environnement
const isProduction = import.meta.env.PROD
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
const BASE_URL = isLocal
  ? 'http://127.0.0.1:3001'  // Local pour les scripts
  : 'https://scriptly-i60u.onrender.com'  // Render pour la production
const ALT_BASE_URLS = isLocal
  ? ['http://127.0.0.1:3001', 'http://localhost:3001']
  : ['https://scriptly-i60u.onrender.com']

export async function fetchHealth() {
  const response = await fetch(`${BASE_URL}/health`)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  return response.json()
}


export async function runPowershellMessage() {
  // Remplacé par un lancement local via openLocalScript si nécessaire
  const response = await fetch(`${BASE_URL}/test-message`)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  return response.json()
}

export async function runBatchWindow() {
  // Remplacé par un lancement local via openLocalScript si nécessaire
  const response = await fetch(`${BASE_URL}/test-bat`)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  return response.json()
}

// Réseau: Cloudflare DNS
export async function networkCloudflareDnsAdmin() {
  const res = await fetch(`${BASE_URL}/network/cloudflare-dns-admin`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// Applications: winget update
export async function appsWingetUpdateAdmin() {
  const res = await fetch(`${BASE_URL}/apps/winget-update-admin`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// Systeme: menu contextuel classique
export async function systemContextMenuClassicAdmin() {
  const res = await fetch(`${BASE_URL}/system/context-menu-classic-admin`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// Maintenance tool
export async function maintenanceToolAdmin() {
  const res = await fetch(`${BASE_URL}/maintenance/tool-admin`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// BitLocker API
export async function bitlockerStatus() {
  const url = `${BASE_URL}/bitlocker/status`
  console.log('[API] GET', url)
  try {
    const response = await fetch(url)
    console.log('[API] GET /bitlocker/status →', response.status)
    if (!response.ok) {
      // Fallback to legacy route if mounted path is unavailable
      const legacy = `${BASE_URL}/bitlocker-status`
      console.log('[API] Fallback GET', legacy)
      const res2 = await fetch(legacy)
      console.log('[API] GET /bitlocker-status →', res2.status)
      if (!res2.ok) throw new Error(`HTTP ${response.status}`)
      return res2.json()
    }
    return response.json()
  } catch (error) {
    console.error('[API] /bitlocker/status error:', error)
    throw error
  }
}

export async function bitlockerOff(letter) {
  const url = `${BASE_URL}/bitlocker/off`
  console.log('[API] POST', url, { letter })
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ letter })
    })
    console.log('[API] POST /bitlocker/off →', response.status)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    return response.json()
  } catch (error) {
    console.error('[API] /bitlocker/off error:', error)
    throw error
  }
}

export async function listDrives() {
  const tryJson = async (url) => {
    console.log('[API] GET', url)
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  }

  const tryStdout = async (url) => {
    console.log('[API] GET', url)
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    try {
      const parsed = JSON.parse(String(data?.stdout || '[]'))
      return Array.isArray(parsed) ? parsed : (parsed ? [parsed] : [])
    } catch {
      return []
    }
  }

  const tryAllBases = async (buildPath, parser) => {
    let lastError
    for (const base of ALT_BASE_URLS) {
      const url = `${base}${buildPath}`
      try {
        return await parser(url)
      } catch (e) {
        lastError = e
      }
    }
    throw lastError || new Error('All hosts failed')
  }

  // 1) Route principale avec ouverture UI et JSON brut
  try {
    return await tryAllBases('/bitlocker/drives?raw=1&ui=1', tryJson)
  } catch {
    // 2) Sans UI si indisponible
    try {
      return await tryAllBases('/bitlocker/drives?raw=1', tryJson)
    } catch {
      // 3) Fallback en parsant stdout sur la même route
      try {
        return await tryAllBases('/bitlocker/drives', tryStdout)
      } catch {
        // 4) Legacy /drives puis nouveau fallback direct /list-drives
        try {
          return await tryAllBases('/drives', tryStdout)
        } catch {
          return await tryAllBases('/list-drives', tryJson)
        }
      }
    }
  }
}

// Disks tools API - téléchargement direct des scripts
export async function psCheckBitlockerAdmin() {
  return openLocalScript('disks/batch/check-bitlocker.bat')
}

export async function psBitlockerOffAdmin() {
  return openLocalScript('disks/batch/bitlocker-off.bat')
}

export async function psChkdskUi() {
  return openLocalScript('disks/powershells/chkdsk-drive.ps1')
}

export async function psDefragUi() {
  return openLocalScript('disks/powershells/defrag-drive.ps1')
}

export async function psFormatDriveUi() {
  return openLocalScript('disks/powershells/format-drive.ps1')
}

export async function psFormatDriveAdmin() {
  return openLocalScript('disks/batch/format-drive.bat')
}

// psVolumeInfoUi removed per request

export async function bitlockerStatusDrive(letter) {
  const url = `${BASE_URL}/bitlocker/status/${letter}`
  console.log('[API] GET', url)
  const response = await fetch(url)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json()
}

// Lancement local d'un script packagé dans public/scripts
export function openLocalScript(relativePath, download = true) {
  try {
    const a = document.createElement('a')
    a.href = `/scripts/${relativePath}`
    if (download) a.setAttribute('download', '')
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    return { ok: true }
  } catch (error) {
    return { ok: false, error: error?.message || 'open failed' }
  }
}


