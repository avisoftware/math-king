import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useGame } from '../context/useGame'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { StyledBox } from './StyledBox'

const ContentBox = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
`

const LeaderboardScreen = ({ onBack }) => {
  const { t } = useTranslation()
  const { getLeaderboard } = useGame()
  const leaderboard = getLeaderboard()

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <StyledBox>
      <ContentBox
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h2" gutterBottom align="center">
          {t('leaderboard')}
        </Typography>

        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('rank')}</TableCell>
                <TableCell>{t('name')}</TableCell>
                <TableCell align="right">{t('score')}</TableCell>
                <TableCell align="right">{t('date')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaderboard.map((entry, index) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: index < 3 ? 'rgba(255, 215, 0, 0.1)' : 'inherit'
                  }}
                >
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell>{entry.name}</TableCell>
                  <TableCell align="right">{entry.score}</TableCell>
                  <TableCell align="right">{formatDate(entry.date)}</TableCell>
                </TableRow>
              ))}
              {leaderboard.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No scores yet!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={onBack}
          >
            {t('back')}
          </Button>
        </Box>
      </ContentBox>
    </StyledBox>
  )
}

export default LeaderboardScreen