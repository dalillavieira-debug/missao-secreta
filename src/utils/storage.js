// Utilitários de localStorage
// Estrutura: cada participante tem { name, journeyAnswers, quizScore, profile, assignedTo, completedAt }

const STORAGE_KEY = 'missao_secreta_conexao'

export function getStorageData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { participants: [], drawDone: false }
  } catch {
    return { participants: [], drawDone: false }
  }
}

export function saveParticipant(participant) {
  const data = getStorageData()
  const existing = data.participants.findIndex((p) => p.name === participant.name)
  if (existing >= 0) {
    data.participants[existing] = { ...data.participants[existing], ...participant }
  } else {
    data.participants.push(participant)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  return data
}

export function getParticipants() {
  return getStorageData().participants
}

export function saveDraw(pairs) {
  const data = getStorageData()
  data.drawDone = true
  data.pairs = pairs // [{ from: 'Ana', to: 'João' }, ...]
  // Atualiza o campo assignedTo em cada participante
  pairs.forEach(({ from, to }) => {
    const idx = data.participants.findIndex((p) => p.name === from)
    if (idx >= 0) data.participants[idx].assignedTo = to
  })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getAssignment(name) {
  const data = getStorageData()
  const p = data.participants.find((p) => p.name === name)
  return p?.assignedTo || null
}

export function resetSession() {
  localStorage.removeItem(STORAGE_KEY)
}

export function isDrawDone() {
  return getStorageData().drawDone === true
}

export function getCurrentParticipant() {
  try {
    const raw = sessionStorage.getItem('current_participant')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setCurrentParticipant(data) {
  sessionStorage.setItem('current_participant', JSON.stringify(data))
}

export function clearCurrentParticipant() {
  sessionStorage.removeItem('current_participant')
}
