// Service d'accès API backend
// Fournit des fonctions isolant les URLs et la gestion des erreurs

const BASE_URL = 'http://127.0.0.1:3001'
const ALT_BASE_URLS = ['http://127.0.0.1:3001', 'http://localhost:3001']

export async function fetchHealth() {
  const response = await fetch(`${BASE_URL}/health`)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  return response.json()
}

export async function runPowershellMessage() {
  const response = await fetch(`${BASE_URL}/test-message`)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  return response.json()
}

export async function runBatchWindow() {
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

// Disks tools API
export async function psCheckBitlockerAdmin() {
  const res = await fetch(`${BASE_URL}/disk/check-bitlocker-admin`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function psBitlockerOffAdmin() {
  const res = await fetch(`${BASE_URL}/disk/bitlocker-off-admin`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function psChkdskUi() {
  const res = await fetch(`${BASE_URL}/disk/chkdsk?ui=1`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function psDefragUi() {
  const res = await fetch(`${BASE_URL}/disk/defrag?ui=1`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function psFormatDriveUi() {
  const res = await fetch(`${BASE_URL}/disk/format?ui=1`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function psFormatDriveAdmin() {
  const res = await fetch(`${BASE_URL}/disk/format-admin`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// psVolumeInfoUi removed per request

export async function bitlockerStatusDrive(letter) {
  const url = `${BASE_URL}/bitlocker/status/${letter}`
  console.log('[API] GET', url)
  const response = await fetch(url)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json()
}


