// Algoritmo de sorteio — forma uma corrente circular embaralhada
// Garante: ninguém tira a si mesmo, todos recebem uma pessoa

export function performDraw(names) {
  if (names.length < 2) return null

  const shuffled = [...names].sort(() => Math.random() - 0.5)

  // Verifica se algum índice aponta para si mesmo (corrente circular)
  // Na corrente: shuffled[0]→shuffled[1]→...→shuffled[n-1]→shuffled[0]
  // Como embaralhamos, precisamos garantir que shuffled[i] !== names_original[i]
  // Para corrente circular, basta garantir que shuffled[i] !== shuffled[(i+1)%n]
  // O que nunca acontece num array com elementos distintos

  const pairs = shuffled.map((name, i) => ({
    from: name,
    to: shuffled[(i + 1) % shuffled.length],
  }))

  return pairs
}

export function getWordFrequency(participants) {
  const words = {}
  participants.forEach((p) => {
    const word = (p.journeyAnswers?.word || '').trim().toLowerCase()
    if (word) words[word] = (words[word] || 0) + 1
  })
  return Object.entries(words)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }))
}
