// Composant Highlight: surligne les occurrences de la requête dans le texte
// Props: text (string), query (string)

function escapeRegExp(input) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

import { normalizeText } from '../utils/text'

export function Highlight({ text = '', query = '' }) {
  const source = String(text)
  const qNorm = normalizeText(String(query || '').trim())
  if (qNorm.length < 3) return source

  // Recherche insensible aux accents/majuscules dans le texte normalisé
  const sNorm = normalizeText(source)
  const ranges = []
  let start = 0
  while (true) {
    const idx = sNorm.indexOf(qNorm, start)
    if (idx === -1) break
    ranges.push([idx, idx + qNorm.length])
    start = idx + qNorm.length
  }

  if (ranges.length === 0) return source

  const nodes = []
  let lastEnd = 0
  ranges.forEach(([a, b], i) => {
    if (a > lastEnd) nodes.push(<span key={`t${i}_pre`}>{source.slice(lastEnd, a)}</span>)
    nodes.push(
      <mark key={`m${i}`} className="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">
        {source.slice(a, b)}
      </mark>
    )
    lastEnd = b
  })
  if (lastEnd < source.length) nodes.push(<span key="t_last">{source.slice(lastEnd)}</span>)

  return <>{nodes}</>
}


