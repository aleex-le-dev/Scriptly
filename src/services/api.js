// Service d'accès API backend
// Fournit des fonctions isolant les URLs et la gestion des erreurs

const BASE_URL = 'http://127.0.0.1:3001'

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


