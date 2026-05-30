import { useEffect, useState } from 'react'
import { determineProfile } from '../data/profiles'
import { saveParticipant, getStorageData } from '../utils/storage'
import StepBar from './StepBar'

export default function ProfileStep({ participant, onDone }) {
  const [profile, setProfile] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const p = determineProfile(
      participant?.journeyAnswers || {},
      participant?.quizScore || 0
    )
    setProfile(p)

    // Salva participante no localStorage
    saveParticipant({
      name: participant.name,
      journeyAnswers: participant.journeyAnswers,
      quizScore: participant.quizScore,
      profileId: p.id,
      completedAt: new Date().toISOString(),
    })
  }, [])

  function handleContinue() {
    onDone(profile)
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const quizTotal = 5
  const score = participant?.quizScore || 0
  const pct = Math.round((score / quizTotal) * 100)

  return (
    <div className="min-h-screen flex flex-col px-6 py-8 max-w-sm mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
            Etapa 3 de 4
          </span>
        </div>
        <StepBar total={4} current={2} />
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gold-400">Seu Perfil Espiritual</h2>
        </div>
      </div>

      {/* Profile card */}
      <div className="flex-1 animate-slide-up">
        {/* Emoji + name */}
        <div className="card text-center mb-4">
          <div className="text-6xl mb-3">{profile.emoji}</div>
          <h3 className="text-2xl font-bold text-white mb-1">{profile.name}</h3>
          <p className="text-gold-400 text-sm font-medium">{profile.tagline}</p>
        </div>

        {/* Description */}
        <div className="card mb-4">
          <p className="text-gray-300 text-sm leading-relaxed">{profile.description}</p>
        </div>

        {/* Verse */}
        <div className="verse-card mb-4">
          <p className="text-gold-300 text-sm leading-relaxed">{profile.verse}</p>
        </div>

        {/* Mission */}
        <div className="bg-gradient-to-br from-gold-500/10 to-gold-600/5 rounded-2xl p-4 border border-gold-500/20 mb-4">
          <p className="text-xs font-semibold text-gold-500 uppercase tracking-wider mb-2">
            Missão da semana
          </p>
          <p className="text-white text-sm leading-relaxed">{profile.mission}</p>
        </div>

        {/* Quiz score */}
        <div className="card flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center flex-shrink-0">
            <span className="text-dark-900 font-bold text-xl">{score}/{quizTotal}</span>
          </div>
          <div>
            <p className="text-white font-medium text-sm">Quiz Bíblico</p>
            <p className="text-gray-400 text-xs">{pct}% de acertos — {pct >= 80 ? 'Excelente!' : pct >= 60 ? 'Muito bom!' : 'Continue estudando!'}</p>
          </div>
        </div>
      </div>

      {/* Continue */}
      <button onClick={handleContinue} className="btn-gold mt-2">
        Ver minha missão secreta 🎯
      </button>
    </div>
  )
}
