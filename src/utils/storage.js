// Sessão local do participante atual (sessionStorage — não compartilhado)

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
