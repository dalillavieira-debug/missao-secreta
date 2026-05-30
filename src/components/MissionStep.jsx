import { useState, useEffect } from 'react'
import { getAssignment, checkDrawDone } from '../lib/db'
import StepBar from './StepBar'

export default function MissionStep({ participant, onBack }) {
  const [assignment, setAssignment] = useState(null)
  const [drawReady, setDrawReady] = useState(false)

  useEffect(() => {
    checkAssignment()
    const interval = setInterval(checkAssignment, 5000)
    return () => clearInterval(interval)
  }, [])

  async function checkAssignment() {
    const done = await checkDrawDone()
    setDrawReady(done)
    if (done) {
      const a = await getAssignment(participant?.name)
      setAssignment(a)
    }
  }

  return (
    <div className="min-h-screen flex flex-col px-6 py-8 max-w-sm mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
            Etapa 4 de 4
          </span>
        </div>
        <StepBar total={4} current={3} done />
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gold-400">Missão Secreta</h2>
        </div>
      </div>

      {/* Waiting for draw */}
      {!drawReady && (
        <div className="flex-1 flex flex-col items-center justify-center animate-slide-up">
          <div className="text-6xl mb-6 animate-bounce-slow">🙏</div>
          <div className="card text-center w-full">
            <h3 className="text-xl font-bold text-white mb-2">Aguardando o sorteio</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Suas respostas foram salvas! Aguarde o líder iniciar o sorteio da missão secreta.
            </p>
            <div className="flex items-center justify-center gap-2 text-gold-400 text-sm">
              <div className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
              <span>Aguardando...</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs">
              Enquanto isso, ore por nossa célula e prepare seu coração.
            </p>
          </div>
        </div>
      )}

      {/* Draw done — show mission */}
      {drawReady && assignment && (
        <div className="flex-1 animate-slide-up">
          {/* Secret reveal */}
          <div className="bg-gradient-to-br from-gold-500/20 to-gold-600/10 rounded-3xl p-6 border border-gold-500/30 mb-5 text-center">
            <p className="text-gold-400 text-xs font-semibold uppercase tracking-widest mb-3">
              Sua Missão Secreta
            </p>
            <div className="text-4xl mb-3">🤫</div>
            <p className="text-gray-300 text-sm mb-3">Durante esta semana, ore por:</p>
            <p className="text-3xl font-bold text-white">{assignment}</p>
          </div>

          {/* Instructions */}
          <div className="card mb-4">
            <p className="text-gold-400 text-xs font-semibold uppercase tracking-wider mb-3">
              Como cumprir sua missão
            </p>
            <div className="space-y-3">
              {[
                { icon: '🙏', text: 'Ore por essa pessoa todos os dias esta semana.' },
                { icon: '💬', text: 'Envie pelo menos uma mensagem de encorajamento.' },
                { icon: '📖', text: 'Peça a Deus um versículo para compartilhar com ela.' },
                { icon: '🤫', text: 'Mantenha em segredo até o próximo encontro!' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0">{icon}</span>
                  <p className="text-gray-300 text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reveal teaser */}
          <div className="bg-dark-700/50 rounded-2xl p-4 border border-dark-600 mb-4">
            <p className="text-center text-gray-400 text-xs leading-relaxed">
              Na próxima célula, vamos tentar descobrir quem estava orando por quem. 🎉
            </p>
          </div>
        </div>
      )}

      {/* Draw done but no assignment yet */}
      {drawReady && !assignment && (
        <div className="flex-1 flex items-center justify-center">
          <div className="card text-center">
            <p className="text-xl mb-2">⚠️</p>
            <p className="text-white font-medium mb-2">Seu nome não foi encontrado no sorteio</p>
            <p className="text-gray-400 text-sm">Peça ao líder para incluir você no sorteio.</p>
          </div>
        </div>
      )}

      {/* Back button */}
      <button onClick={onBack} className="btn-outline mt-4">
        Voltar ao início
      </button>
    </div>
  )
}
