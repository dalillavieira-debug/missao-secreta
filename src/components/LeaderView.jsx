import { useState, useEffect } from 'react'
import {
  Users, BarChart2, Award, Shuffle, Eye, EyeOff,
  RefreshCw, ArrowLeft, Trash2, CheckCircle
} from 'lucide-react'
import { getParticipants, saveDraw, resetSession, isDrawDone, getStorageData } from '../utils/storage'
import { performDraw, getWordFrequency } from '../utils/draw'
import { spiritualProfiles } from '../data/profiles'

const TABS = ['participants', 'words', 'quiz', 'profiles', 'draw']
const TAB_LABELS = {
  participants: 'Participantes',
  words: 'Palavras',
  quiz: 'Quiz',
  profiles: 'Perfis',
  draw: 'Sorteio',
}
const TAB_ICONS = {
  participants: Users,
  words: BarChart2,
  quiz: Award,
  profiles: '🪪',
  draw: Shuffle,
}

export default function LeaderView({ onBack }) {
  const [tab, setTab] = useState('participants')
  const [participants, setParticipants] = useState([])
  const [pairs, setPairs] = useState([])
  const [drawDone, setDrawDone] = useState(false)
  const [showDraw, setShowDraw] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [drawAnimating, setDrawAnimating] = useState(false)

  function loadData() {
    const data = getStorageData()
    setParticipants(data.participants || [])
    setDrawDone(data.drawDone || false)
    if (data.pairs) setPairs(data.pairs)
  }

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 3000)
    return () => clearInterval(interval)
  }, [])

  function handleDraw() {
    if (participants.length < 2) return
    setDrawAnimating(true)
    setTimeout(() => {
      const names = participants.map((p) => p.name)
      const result = performDraw(names)
      if (result) {
        setPairs(result)
        saveDraw(result)
        setDrawDone(true)
        loadData()
      }
      setDrawAnimating(false)
    }, 1500)
  }

  function handleReset() {
    if (confirmReset) {
      resetSession()
      setParticipants([])
      setPairs([])
      setDrawDone(false)
      setConfirmReset(false)
      loadData()
    } else {
      setConfirmReset(true)
      setTimeout(() => setConfirmReset(false), 5000)
    }
  }

  const wordFreq = getWordFrequency(participants)
  const quizRanking = [...participants]
    .filter((p) => p.quizScore !== undefined)
    .sort((a, b) => (b.quizScore || 0) - (a.quizScore || 0))

  const profileCounts = participants.reduce((acc, p) => {
    if (p.profileId) acc[p.profileId] = (acc[p.profileId] || 0) + 1
    return acc
  }, {})

  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto">
      {/* Header */}
      <div className="px-4 pt-6 pb-3 border-b border-dark-600">
        <div className="flex items-center justify-between mb-3">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
            <ArrowLeft size={18} />
            Voltar
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="p-2 rounded-xl hover:bg-dark-700 transition-colors"
              title="Atualizar"
            >
              <RefreshCw size={16} className="text-gray-400" />
            </button>
            <button
              onClick={handleReset}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                confirmReset
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'hover:bg-dark-700 text-gray-500'
              }`}
            >
              <Trash2 size={14} />
              {confirmReset ? 'Confirmar reset' : 'Resetar'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
            <span className="text-dark-900 text-lg">✝</span>
          </div>
          <div>
            <h1 className="font-bold text-white">Painel do Líder</h1>
            <p className="text-xs text-gray-500">
              {participants.length} participante{participants.length !== 1 ? 's' : ''} · {drawDone ? 'Sorteio feito ✓' : 'Aguardando sorteio'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-dark-600 px-2 gap-1 flex-shrink-0">
        {TABS.map((t) => {
          const Icon = typeof TAB_ICONS[t] === 'string' ? null : TAB_ICONS[t]
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-1.5 px-3 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-all ${
                tab === t
                  ? 'border-gold-500 text-gold-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {Icon ? <Icon size={14} /> : <span>{TAB_ICONS[t]}</span>}
              {TAB_LABELS[t]}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">

        {/* PARTICIPANTS TAB */}
        {tab === 'participants' && (
          <>
            {participants.length === 0 ? (
              <EmptyState text="Nenhum participante ainda. Aguarde as pessoas responderem." />
            ) : (
              participants.map((p, i) => (
                <div key={p.name} className="card flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-500/30 to-gold-600/20 flex items-center justify-center flex-shrink-0 font-bold text-gold-400 text-sm">
                    {p.name[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm">{p.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      Quiz: {p.quizScore ?? '—'}/5 · Perfil: {p.profileId ? spiritualProfiles[p.profileId]?.name : '—'}
                    </p>
                  </div>
                  <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                </div>
              ))
            )}
          </>
        )}

        {/* WORDS TAB */}
        {tab === 'words' && (
          <>
            <p className="text-xs text-gray-500 mb-2">Palavras mais usadas em "minha caminhada espiritual hoje":</p>
            {wordFreq.length === 0 ? (
              <EmptyState text="Ainda sem respostas para essa pergunta." />
            ) : (
              wordFreq.map(({ word, count }, i) => (
                <div key={word} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-4 text-right">{i + 1}</span>
                  <div className="flex-1 bg-dark-700 rounded-xl overflow-hidden h-9 flex items-center">
                    <div
                      className="bg-gradient-to-r from-gold-600 to-gold-500 h-full flex items-center px-3 transition-all duration-500"
                      style={{ width: `${(count / (wordFreq[0]?.count || 1)) * 100}%`, minWidth: '2rem' }}
                    >
                      <span className="text-dark-900 font-semibold text-xs capitalize truncate">{word}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 w-4">{count}×</span>
                </div>
              ))
            )}
          </>
        )}

        {/* QUIZ TAB */}
        {tab === 'quiz' && (
          <>
            <p className="text-xs text-gray-500 mb-2">Ranking por pontuação no quiz bíblico:</p>
            {quizRanking.length === 0 ? (
              <EmptyState text="Nenhum participante completou o quiz ainda." />
            ) : (
              quizRanking.map((p, i) => (
                <div key={p.name} className="card flex items-center gap-3">
                  <span className={`text-lg w-8 text-center ${i === 0 ? 'text-gold-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-gray-600'}`}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}º`}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-white text-sm">{p.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gold-400">{p.quizScore}/5</p>
                    <p className="text-xs text-gray-500">{Math.round((p.quizScore / 5) * 100)}%</p>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* PROFILES TAB */}
        {tab === 'profiles' && (
          <>
            <p className="text-xs text-gray-500 mb-2">Distribuição de perfis espirituais:</p>
            {Object.keys(spiritualProfiles).map((id) => {
              const prof = spiritualProfiles[id]
              const count = profileCounts[id] || 0
              return (
                <div key={id} className="card flex items-center gap-3">
                  <span className="text-2xl">{prof.emoji}</span>
                  <div className="flex-1">
                    <p className="font-medium text-white text-sm">{prof.name}</p>
                    <p className="text-xs text-gray-500">{prof.tagline}</p>
                  </div>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${
                    count > 0 ? 'bg-gold-500/20 text-gold-400' : 'bg-dark-600 text-gray-600'
                  }`}>
                    {count}
                  </div>
                </div>
              )
            })}
          </>
        )}

        {/* DRAW TAB */}
        {tab === 'draw' && (
          <div>
            {!drawDone ? (
              <div className="space-y-4">
                <div className="card text-center">
                  <p className="text-4xl mb-3">🎯</p>
                  <h3 className="text-lg font-bold text-white mb-2">Sortear Missão Secreta</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    Quando todos tiverem respondido, clique para realizar o sorteio. Cada pessoa receberá
                    alguém para orar durante a semana.
                  </p>
                  <p className="text-xs text-gray-500 mb-6">
                    {participants.length} participante{participants.length !== 1 ? 's' : ''} registrado{participants.length !== 1 ? 's' : ''}
                  </p>
                  <button
                    onClick={handleDraw}
                    disabled={participants.length < 2 || drawAnimating}
                    className="btn-gold flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    {drawAnimating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-dark-900 border-t-transparent rounded-full animate-spin" />
                        Sorteando...
                      </>
                    ) : (
                      <>
                        <Shuffle size={18} />
                        Realizar Sorteio
                      </>
                    )}
                  </button>
                  {participants.length < 2 && (
                    <p className="text-xs text-red-400 mt-2">São necessários ao menos 2 participantes.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500">Resultado do sorteio — visível apenas para o líder:</p>
                  <button
                    onClick={() => setShowDraw((s) => !s)}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gold-400 transition-colors"
                  >
                    {showDraw ? <EyeOff size={14} /> : <Eye size={14} />}
                    {showDraw ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex gap-3 mb-2">
                  <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
                  <p className="text-green-300 text-sm">Sorteio realizado! Os participantes já podem ver suas missões.</p>
                </div>

                {showDraw && pairs.map(({ from, to }) => (
                  <div key={from} className="card flex items-center gap-3">
                    <div className="flex-1">
                      <span className="text-white font-medium text-sm">{from}</span>
                      <span className="text-gray-500 text-sm mx-2">ora por</span>
                      <span className="text-gold-400 font-medium text-sm">{to}</span>
                    </div>
                    <span className="text-lg">🙏</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState({ text }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-4xl mb-3">⏳</p>
      <p className="text-gray-500 text-sm">{text}</p>
    </div>
  )
}
