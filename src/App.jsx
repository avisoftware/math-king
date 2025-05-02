import { useState, useEffect } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import { prefixer } from 'stylis'
import rtlPlugin from 'stylis-plugin-rtl'
import CssBaseline from '@mui/material/CssBaseline'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n/config'
import { GameProvider } from './context/GameContext'
import theme from './theme'
import StartScreen from './components/StartScreen'
import GameScreen from './components/GameScreen'
import GameOverScreen from './components/GameOverScreen'
import LeaderboardScreen from './components/LeaderboardScreen'
import './App.css'

// Create rtl cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
})

// Create ltr cache
const cacheLtr = createCache({
  key: 'mui',
})

function App() {
  const [currentScreen, setCurrentScreen] = useState('start')
  const [finalScore, setFinalScore] = useState(0)
  const [isRtl, setIsRtl] = useState(i18n.language === 'he')

  useEffect(() => {
    const handleLanguageChange = (lng) => {
      setIsRtl(lng === 'he')
      document.dir = lng === 'he' ? 'rtl' : 'ltr'
    }

    i18n.on('languageChanged', handleLanguageChange)
    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [])

  const screenComponents = {
    start: <StartScreen onStart={() => setCurrentScreen('game')} onLeaderboard={() => setCurrentScreen('leaderboard')} />,
    game: <GameScreen onGameOver={(score) => {
      setFinalScore(score)
      setCurrentScreen('gameOver')
    }} />,
    gameOver: <GameOverScreen 
      score={finalScore} 
      onPlayAgain={() => setCurrentScreen('start')}
      onLeaderboard={() => setCurrentScreen('leaderboard')}
    />,
    leaderboard: <LeaderboardScreen onBack={() => setCurrentScreen('start')} />
  }

  return (
    <I18nextProvider i18n={i18n}>
      <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <GameProvider>
            <div className="app-container">
              {screenComponents[currentScreen]}
            </div>
          </GameProvider>
        </ThemeProvider>
      </CacheProvider>
    </I18nextProvider>
  )
}

export default App
