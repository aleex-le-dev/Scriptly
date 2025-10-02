// Utilitaires de texte: normalisation sans accents et insensible à la casse

export function normalizeText(input) {
  return String(input || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}


