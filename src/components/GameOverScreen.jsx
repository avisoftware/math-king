import { useState, useEffect } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useGame } from "../context/useGame";
import styled from "styled-components";
import { motion } from "framer-motion";
import ReactConfetti from "react-confetti";
import { StyledBox as BaseBox } from "./StyledBox";

const StyledBox = styled(BaseBox)`
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
`;

const ContentBox = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 1.5rem;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const StyledTextField = styled(TextField)`
  input {
    color: white;
  }
  label {
    color: rgba(255, 255, 255, 0.7);
  }
  .MuiOutlinedInput-root {
    fieldset {
      border-color: rgba(255, 255, 255, 0.3);
    }
    &:hover fieldset {
      border-color: rgba(255, 255, 255, 0.5);
    }
    &.Mui-focused fieldset {
      border-color: white;
    }
  }
`;

const GameOverScreen = ({ score, onPlayAgain, onLeaderboard }) => {
  const { t } = useTranslation();
  const { saveScore, getLeaderboard } = useGame();
  const [playerName, setPlayerName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isHighScore, setIsHighScore] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const leaderboard = getLeaderboard();
    const isNewHighScore =
      leaderboard.length === 0 ||
      score > Math.max(...leaderboard.map((entry) => entry.score));
    setIsHighScore(isNewHighScore);
  }, [score, getLeaderboard]);

  const handleSubmit = () => {
    if (playerName.trim()) {
      saveScore(playerName.trim(), score);
      setIsSubmitted(true);
      onLeaderboard();
    }
  };

  return (
    <StyledBox>
      {isHighScore && !isSubmitted && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          width: "100%",
          padding: 3,
        }}
      >
        <ContentBox
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
        >
          <Typography
            variant="h2"
            sx={{
              color: "white",
              textAlign: "center",
              fontSize: { xs: "2.5rem", sm: "3rem" },
              fontWeight: 700,
              textShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
          >
            {t("gameOver")}
          </Typography>

          <Typography
            variant="h3"
            sx={{
              color: "white",
              textAlign: "center",
              fontSize: { xs: "2rem", sm: "2.5rem" },
              opacity: 0.9,
            }}
          >
            {t("finalScore")}: {score}
          </Typography>

          {isHighScore && !isSubmitted && (
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h5"
                color="white"
                sx={{
                  marginBottom: 2,
                  animation: "pulse 1.5s infinite",
                  "@keyframes pulse": {
                    "0%": { opacity: 1 },
                    "50%": { opacity: 0.6 },
                    "100%": { opacity: 1 },
                  },
                }}
              >
                {t("newHighScore")}!
              </Typography>
              <StyledTextField
                fullWidth
                label={t("enterName")}
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                variant="outlined"
                sx={{ marginBottom: 2 }}
              />
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!playerName.trim()}
                sx={{
                  background: "linear-gradient(135deg, #4caf50, #45a049)",
                  padding: "0.8rem 2rem",
                  fontSize: "1.1rem",
                  "&:hover": {
                    background: "linear-gradient(135deg, #45a049, #3d8b40)",
                  },
                }}
              >
                {t("submit")}
              </Button>
            </Box>
          )}

          {(!isHighScore || isSubmitted) && (
            <Button
              variant="contained"
              onClick={onPlayAgain}
              sx={{
                fontSize: "1.25rem",
                padding: "1rem 3rem",
                borderRadius: "1rem",
                background: "linear-gradient(135deg, #4caf50, #45a049)",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                color: "white",
                textTransform: "none",
                "&:hover": {
                  background: "linear-gradient(135deg, #45a049, #3d8b40)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              {t("playAgain")}
            </Button>
          )}
        </ContentBox>
      </Box>

      <style jsx global>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </StyledBox>
  );
};

export default GameOverScreen;
