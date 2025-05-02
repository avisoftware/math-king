import { useState, useEffect } from 'react'
import { Box, Button, Typography, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useGame } from '../context/useGame'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import ReactConfetti from 'react-confetti'
import { StyledBox as BaseBox } from './StyledBox'

const StyledBox = styled(BaseBox)`
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
`

const ContentBox = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const GameOverScreen = ({ score, onPlayAgain, onLeaderboard }) => {
  const { t } = useTranslation()
  const { saveScore, getLeaderboard } = useGame()
  const [playerName, setPlayerName] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isHighScore, setIsHighScore] = useState(false)
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const leaderboard = getLeaderboard()
    const isNewHighScore = leaderboard.length === 0 || score > Math.min(...leaderboard.map(entry => entry.score))
    setIsHighScore(isNewHighScore)
  }, [score, getLeaderboard])

  const handleSubmit = () => {
    if (playerName.trim()) {
      saveScore(playerName.trim())
      setIsSubmitted(true)
      onLeaderboard()
    }
  }

  return (
    <StyledBox>
      {isHighScore && !isSubmitted && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={true}
          numberOfPieces={200}
          gravity={0.2}
        />
      )}
      
      <ContentBox
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h2" component="h2" gutterBottom>
          {t('gameOver')}
        </Typography>
        
        <Typography variant="h4" component="h3" gutterBottom>
          {t('finalScore')}: {score}
        </Typography>

        {isHighScore && !isSubmitted && (
          <Typography 
            variant="h5" 
            component="h3" 
            gutterBottom 
            color="primary"
            sx={{ fontWeight: 'bold', animation: 'pulse 1.5s infinite' }}
          >
            🎉 {t('newHighScore')} 🎉
          </Typography>
        )}

        {!isSubmitted && (
          <>
            <TextField
              label={t('enterName')}
              variant="outlined"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSubmit}
              disabled={!playerName.trim()}
              fullWidth
            >
              {t('submit')}
            </Button>
          </>
        )}

        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={onPlayAgain}
          fullWidth
        >
          {t('playAgain')}
        </Button>

        <Button
          variant="outlined"
          color="inherit"
          size="large"
          onClick={onLeaderboard}
          fullWidth
        >
          {t('viewLeaderboard')}
        </Button>
      </ContentBox>

      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </StyledBox>
  )
}

export default GameOverScreen