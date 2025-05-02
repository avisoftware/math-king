import { useState, useCallback } from 'react'
import { GameContext } from './context'

export function GameProvider({ children }) {
  const [score, setScore] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [language, setLanguage] = useState('en')
  const [selectedOperations, setSelectedOperations] = useState({
    addition: true,
    subtraction: false,
    multiplication: false,
    division: false
  })

  const incrementScore = useCallback(() => {
    setScore(prev => prev + 1)
  }, [])

  const resetScore = useCallback(() => {
    setScore(0)
  }, [])

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev)
  }, [])

  const toggleOperation = useCallback((operation) => {
    setSelectedOperations(prev => ({
      ...prev,
      [operation]: !prev[operation]
    }))
  }, [])

  const changeLanguage = useCallback((lang) => {
    setLanguage(lang)
  }, [])

  const getLeaderboard = useCallback(() => {
    const leaderboard = localStorage.getItem('mathKingLeaderboard')
    return leaderboard ? JSON.parse(leaderboard) : []
  }, [])

  const saveScore = useCallback((name) => {
    const leaderboard = getLeaderboard()
    const newEntry = { name, score, date: new Date().toISOString() }
    const newLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)

    localStorage.setItem('mathKingLeaderboard', JSON.stringify(newLeaderboard))
    return newLeaderboard
  }, [score, getLeaderboard])

  const value = {
    score,
    isMuted,
    language,
    selectedOperations,
    incrementScore,
    resetScore,
    toggleMute,
    toggleOperation,
    changeLanguage,
    getLeaderboard,
    saveScore,
    setSelectedOperations
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}