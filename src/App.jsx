import { useState, useEffect } from 'react'
import StartScreen from './components/StartScreen'
import JourneyStep from './components/JourneyStep'
import QuizStep from './components/QuizStep'
import ProfileStep from './components/ProfileStep'
import MissionStep from './components/MissionStep'
import LeaderView from './components/LeaderView'
import { getCurrentParticipant, setCurrentParticipant } from './utils/storage'
import { upsertParticipant } from './lib/db'

const STEPS = {
  START: 'start',
  JOURNEY: 'journey',
  QUIZ: 'quiz',
  PROFILE: 'profile',
  MISSION: 'mission',
  LEADER: 'leader',
}

export default function App() {
  const [step, setStep] = useState(STEPS.START)
  const [participant, setParticipant] = useState(null)

  useEffect(() => {
    const saved = getCurrentParticipant()
    if (saved) {
      setParticipant(saved)
      if (saved.profile) {
        setStep(STEPS.MISSION)
      } else if (saved.quizAnswers) {
        setStep(STEPS.PROFILE)
      } else if (saved.journeyAnswers) {
        setStep(STEPS.QUIZ)
      } else if (saved.name) {
        setStep(STEPS.JOURNEY)
      }
    }
  }, [])

  useEffect(() => {
    if (window.location.pathname === '/lider' || window.location.search.includes('lider')) {
      setStep(STEPS.LEADER)
    }
  }, [])

  function updateParticipant(data) {
    const updated = { ...participant, ...data }
    setParticipant(updated)
    setCurrentParticipant(updated)
    upsertParticipant(updated)
    return updated
  }

  function handleStart(name) {
    const p = { name, startedAt: new Date().toISOString() }
    setParticipant(p)
    setCurrentParticipant(p)
    upsertParticipant(p)
    setStep(STEPS.JOURNEY)
  }

  function handleJourneyDone(journeyAnswers) {
    updateParticipant({ journeyAnswers })
    setStep(STEPS.QUIZ)
  }

  function handleQuizDone(quizScore, quizAnswers) {
    updateParticipant({ quizScore, quizAnswers })
    setStep(STEPS.PROFILE)
  }

  function handleProfileDone(profile) {
    updateParticipant({ profile })
    setStep(STEPS.MISSION)
  }

  function goToLeader() {
    setStep(STEPS.LEADER)
  }

  function goBack() {
    setStep(STEPS.START)
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {step === STEPS.START && (
        <StartScreen onStart={handleStart} onLeader={goToLeader} />
      )}
      {step === STEPS.JOURNEY && (
        <JourneyStep participant={participant} onDone={handleJourneyDone} />
      )}
      {step === STEPS.QUIZ && (
        <QuizStep participant={participant} onDone={handleQuizDone} />
      )}
      {step === STEPS.PROFILE && (
        <ProfileStep participant={participant} onDone={handleProfileDone} />
      )}
      {step === STEPS.MISSION && (
        <MissionStep participant={participant} onBack={goBack} />
      )}
      {step === STEPS.LEADER && (
        <LeaderView onBack={goBack} />
      )}
    </div>
  )
}
