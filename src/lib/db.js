import { supabase } from './supabase'

function toRow(p) {
  return {
    name: p.name,
    journey_answers: p.journeyAnswers || null,
    quiz_score: p.quizScore ?? null,
    quiz_answers: p.quizAnswers || null,
    profile_id: p.profile?.id || p.profileId || null,
    assigned_to: p.assignedTo || null,
  }
}

function fromRow(row) {
  return {
    name: row.name,
    journeyAnswers: row.journey_answers,
    quizScore: row.quiz_score,
    quizAnswers: row.quiz_answers,
    profileId: row.profile_id,
    assignedTo: row.assigned_to,
    createdAt: row.created_at,
  }
}

export async function upsertParticipant(participant) {
  const { error } = await supabase
    .from('participants')
    .upsert(toRow(participant), { onConflict: 'name' })
  if (error) console.error('upsertParticipant:', error)
}

export async function getParticipants() {
  const { data, error } = await supabase
    .from('participants')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) console.error('getParticipants:', error)
  return (data || []).map(fromRow)
}

export async function getAssignment(name) {
  const { data, error } = await supabase
    .from('participants')
    .select('assigned_to')
    .eq('name', name)
    .maybeSingle()
  if (error) console.error('getAssignment:', error)
  return data?.assigned_to || null
}

export async function checkDrawDone() {
  const { data, error } = await supabase
    .from('participants')
    .select('id')
    .not('assigned_to', 'is', null)
    .limit(1)
  if (error) console.error('checkDrawDone:', error)
  return (data?.length || 0) > 0
}

export async function saveDrawPairs(pairs) {
  await Promise.all(
    pairs.map(({ from, to }) =>
      supabase.from('participants').update({ assigned_to: to }).eq('name', from)
    )
  )
}

export async function deleteAllParticipants() {
  const { error } = await supabase
    .from('participants')
    .delete()
    .gt('created_at', '1900-01-01T00:00:00Z')
  if (error) console.error('deleteAllParticipants:', error)
}
