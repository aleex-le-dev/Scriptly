// Téléchargement direct des scripts packagés dans public/scripts

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
