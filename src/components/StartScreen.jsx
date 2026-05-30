import { useState } from 'react'
import { Cross, Users } from 'lucide-react'

export default function StartScreen({ onStart, onLeader }) {
  const [name, setName] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (name.trim().length < 2) return
    onStart(name.trim())
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 animate-fade-in">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold-600/5 rounded-full blur-2xl" />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Cross icon */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/25">
            <span className="text-dark-900 text-3xl">✝</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold leading-tight mb-3">
            <span className="gold-text">Missão Secreta</span>
            <br />
            <span className="text-white">da Conexão</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Hoje vamos relembrar nossa caminhada, refletir sobre o que Deus tem falado conosco e sair
            daqui com uma missão de oração para a semana.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Como você se chama?
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome..."
              className="input-field text-lg"
              autoFocus
              autoComplete="off"
              maxLength={40}
            />
          </div>

          <button
            type="submit"
            disabled={name.trim().length < 2}
            className="btn-gold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Começar ✨
          </button>
        </form>

        {/* Leader access */}
        <div className="mt-8 pt-6 border-t border-dark-600">
          <button
            onClick={onLeader}
            className="flex items-center justify-center gap-2 w-full text-gray-500 hover:text-gold-400 transition-colors text-sm py-2"
          >
            <Users size={16} />
            Acesso do Líder
          </button>
        </div>
      </div>
    </div>
  )
}
