import { useState } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { journeyQuestions } from '../data/questions'
import StepBar from './StepBar'

export default function JourneyStep({ participant, onDone }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})

  const question = journeyQuestions[currentQ]
  const total = journeyQuestions.length
  const answer = answers[question.id] || ''

  function handleSelect(option) {
    setAnswers((prev) => ({ ...prev, [question.id]: option }))
  }

  function handleTextChange(e) {
    setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }))
  }

  function canProceed() {
    return answer && answer.trim().length > 0
  }

  function handleNext() {
    if (!canProceed()) return
    if (currentQ < total - 1) {
      setCurrentQ((q) => q + 1)
    } else {
      onDone(answers)
    }
  }

  function handleBack() {
    if (currentQ > 0) setCurrentQ((q) => q - 1)
  }

  return (
    <div className="min-h-screen flex flex-col px-6 py-8 max-w-sm mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
            Etapa 1 de 4
          </span>
          <span className="text-xs text-gray-500">
            {currentQ + 1}/{total}
          </span>
        </div>
        <StepBar total={4} current={0} />
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gold-400 mb-1">Revisão da Jornada</h2>
          <p className="text-sm text-gray-500">Olá, {participant?.name}! Vamos refletir juntos.</p>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 animate-slide-up" key={question.id}>
        <div className="card mb-4">
          <p className="text-base font-medium text-white leading-relaxed">
            {question.question}
          </p>
        </div>

        {/* Multiple choice */}
        {question.type === 'multiple' && (
          <div className="space-y-2">
            {question.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                className={`option-btn ${answer === opt ? 'selected' : ''}`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                      answer === opt
                        ? 'border-gold-500 bg-gold-500'
                        : 'border-gray-600'
                    }`}
                  >
                    {answer === opt && (
                      <span className="w-2 h-2 bg-dark-900 rounded-full" />
                    )}
                  </span>
                  {opt}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Open short */}
        {question.type === 'open-short' && (
          <input
            type="text"
            value={answer}
            onChange={handleTextChange}
            placeholder={question.placeholder}
            className="input-field text-lg text-center"
            autoFocus
            maxLength={30}
          />
        )}

        {/* Open long */}
        {question.type === 'open' && (
          <textarea
            value={answer}
            onChange={handleTextChange}
            placeholder={question.placeholder}
            className="input-field min-h-[120px] resize-none"
            autoFocus
            maxLength={300}
            rows={4}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6 pb-4">
        {currentQ > 0 && (
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-14 h-14 rounded-2xl border border-dark-600 hover:border-gold-500/50 transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-400" />
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className="btn-gold flex items-center justify-center gap-2 flex-1 disabled:opacity-40"
        >
          {currentQ < total - 1 ? (
            <>Próxima <ChevronRight size={18} /></>
          ) : (
            <>Continuar para o Quiz ✨</>
          )}
        </button>
      </div>
    </div>
  )
}
