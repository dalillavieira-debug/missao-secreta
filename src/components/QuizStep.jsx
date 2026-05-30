import { useState } from 'react'
import { CheckCircle, XCircle, ChevronRight } from 'lucide-react'
import { quizQuestions } from '../data/quiz'
import StepBar from './StepBar'

export default function QuizStep({ participant, onDone }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState([])

  const question = quizQuestions[currentQ]
  const total = quizQuestions.length
  const isCorrect = selected === question.correct

  function handleSelect(idx) {
    if (showFeedback) return
    setSelected(idx)
    const correct = idx === question.correct
    if (correct) setScore((s) => s + 1)
    setAnswers((prev) => [...prev, { questionId: question.id, selected: idx, correct }])
    setShowFeedback(true)
  }

  function handleNext() {
    if (currentQ < total - 1) {
      setCurrentQ((q) => q + 1)
      setSelected(null)
      setShowFeedback(false)
    } else {
      onDone(score + (selected === question.correct && !answers.find(a => a.questionId === question.id) ? 1 : 0), answers)
    }
  }

  function getOptionStyle(idx) {
    if (!showFeedback) {
      return selected === idx
        ? 'border-gold-500 bg-gold-500/20 text-gold-300'
        : 'border-dark-600 bg-dark-700 hover:border-gold-500/40'
    }
    if (idx === question.correct) return 'border-green-500 bg-green-500/20 text-green-300'
    if (idx === selected && !isCorrect) return 'border-red-500 bg-red-500/20 text-red-300'
    return 'border-dark-600 bg-dark-700/50 text-gray-500'
  }

  return (
    <div className="min-h-screen flex flex-col px-6 py-8 max-w-sm mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
            Etapa 2 de 4
          </span>
          <span className="text-xs text-gray-500 bg-dark-700 px-2 py-1 rounded-lg">
            {score} ✓ de {currentQ} respondidas
          </span>
        </div>
        <StepBar total={4} current={1} />
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gold-400 mb-1">Quiz Bíblico</h2>
          <p className="text-sm text-gray-500">Pergunta {currentQ + 1} de {total}</p>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 mb-6">
        {quizQuestions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              i < currentQ
                ? 'bg-gold-500'
                : i === currentQ
                ? 'bg-gold-400'
                : 'bg-dark-600'
            }`}
          />
        ))}
      </div>

      {/* Question card */}
      <div className="flex-1 animate-slide-up" key={question.id}>
        <div className="card mb-5">
          <p className="text-base font-medium text-white leading-relaxed">
            {question.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-4">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={showFeedback}
              className={`w-full text-left px-4 py-3.5 rounded-2xl border transition-all duration-200 text-sm font-medium ${getOptionStyle(idx)}`}
            >
              <span className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full border flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                  showFeedback && idx === question.correct
                    ? 'border-green-500 text-green-400'
                    : showFeedback && idx === selected && !isCorrect
                    ? 'border-red-500 text-red-400'
                    : 'border-current'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                {opt}
              </span>
            </button>
          ))}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`rounded-2xl p-4 flex gap-3 animate-slide-up ${
            isCorrect
              ? 'bg-green-500/10 border border-green-500/30'
              : 'bg-red-500/10 border border-red-500/30'
          }`}>
            {isCorrect ? (
              <CheckCircle size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`text-sm font-semibold mb-1 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? 'Correto!' : 'Não dessa vez...'}
              </p>
              <p className="text-xs text-gray-300 leading-relaxed">{question.reflection}</p>
            </div>
          </div>
        )}
      </div>

      {/* Next button */}
      {showFeedback && (
        <button
          onClick={handleNext}
          className="btn-gold flex items-center justify-center gap-2 mt-4 animate-slide-up"
        >
          {currentQ < total - 1 ? (
            <>Próxima pergunta <ChevronRight size={18} /></>
          ) : (
            <>Ver meu perfil espiritual ✨</>
          )}
        </button>
      )}
    </div>
  )
}
