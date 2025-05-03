import { useState, useEffect, useCallback } from "react";
import { Box, Button, Typography, LinearProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useGame } from "../context/useGame";
import { generateProblem } from "../utils/mathProblems";
import styled from "styled-components";
import { motion } from "framer-motion";
import { StyledBox as BaseBox } from "./StyledBox";

const StyledBox = styled(BaseBox)`
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
  position: relative;
`;

const ProblemBox = styled(motion.div)`
  direction: ltr;
  background: rgba(255, 255, 255, 0.95);
  padding: 1.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
  backdrop-filter: blur(10px);
`;

const AnswerGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  width: 100%;
  max-width: 400px;
`;

const LivesIndicator = styled(Box)`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  align-items: center;
`;

const Heart = styled(motion.div)`
  font-size: 2rem;
  opacity: ${(props) => (props.filled ? 1 : 0.3)};
  filter: ${(props) => (props.filled ? "none" : "grayscale(100%)")};
`;

const LifeLostMessage = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(244, 67, 54, 0.9);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.5rem;
  z-index: 1000;
  text-align: center;
`;

const GameScreen = ({ onGameOver }) => {
  const { t } = useTranslation();
  const { isMuted, currentOperation, timePerQuestion } = useGame();
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [showingCorrectAnswer, setShowingCorrectAnswer] = useState(false);
  const [showLifeLostMessage, setShowLifeLostMessage] = useState(false);

  const getDifficulty = useCallback(() => {
    if (score >= 10) return "hard";
    if (score >= 5) return "medium";
    return "easy";
  }, [score]);

  const generateNewProblem = () => {
    const difficulty = getDifficulty();
    if (!currentOperation) return null;

    setCurrentProblem(generateProblem(difficulty, [currentOperation]));
    setIsCorrect(null);
  };

  const incrementScore = useCallback(() => {
    setScore((prev) => prev + 1);
  }, []);

  const decrementLives = useCallback(() => {
    setLives((prev) => prev - 1);
  }, []);

  useEffect(() => {
    generateNewProblem();
  }, []);

  const gameOver = () => {
    onGameOver && onGameOver(score);
  };

  const handleTimeOut = () => {
    decrementLives();
    showLifeLostNotification();
    if (lives <= 1) {
      setGameEnded(true);
      setShowingCorrectAnswer(true);
      setTimeout(() => {
        gameOver();
      }, 2000);
    } else {
      setTimeLeft(timePerQuestion);
      generateNewProblem();
    }
  };

  useEffect(() => {
    if (gameEnded) return;

    let timerId = null;
    const startTime = Date.now();
    const totalTime = timeLeft * 1000;

    const updateTimer = () => {
      const elapsedTime = Date.now() - startTime;
      const remaining = Math.max(0, totalTime - elapsedTime);
      const remainingSeconds = Math.ceil(remaining / 1000);

      if (remainingSeconds <= 0) {
        clearInterval(timerId);
        setTimeLeft(0);
        handleTimeOut();
      } else {
        setTimeLeft(remainingSeconds);
      }
    };

    timerId = setInterval(updateTimer, 100);

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [score, gameEnded, lives, timeLeft, handleTimeOut]);

  const showLifeLostNotification = () => {
    setShowLifeLostMessage(true);
    setTimeout(() => {
      setShowLifeLostMessage(false);
    }, 1500);
  };

  const handleAnswer = (answer) => {
    if (gameEnded) return;

    const correct = answer === currentProblem.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      if (!isMuted) {
        new Audio(import.meta.env.BASE_URL + "sounds/correct.mp3")
          .play()
          .catch(() => {});
      }
      incrementScore();
      setTimeLeft(timePerQuestion); // Reset timer using configured time
      setTimeout(generateNewProblem, 1000);
    } else {
      if (!isMuted) {
        new Audio(import.meta.env.BASE_URL + "sounds/incorrect.mp3")
          .play()
          .catch(() => {});
      }
      decrementLives();
      showLifeLostNotification();
      if (lives <= 1) {
        setGameEnded(true);
        setShowingCorrectAnswer(true);
        setTimeout(() => {
          gameOver();
        }, 2000);
      } else {
        setShowingCorrectAnswer(true);
        setTimeout(() => {
          setShowingCorrectAnswer(false);
          setIsCorrect(null);
          setTimeLeft(timePerQuestion);
          generateNewProblem();
        }, 2000);
      }
    }
  };

  if (!currentProblem) return null;

  return (
    <StyledBox>
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          position: "absolute",
          top: 20,
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" color="white" sx={{ fontSize: "2.25rem" }}>
            {score}
          </Typography>
          <Box sx={{ display: "flex", gap: "0.25rem" }}>
            {[...Array(3)].map((_, index) => (
              <Heart
                key={index}
                filled={index < lives}
                animate={{
                  scale: index === lives ? [1, 1.2, 1] : 1,
                  opacity: index < lives ? 1 : 0.3,
                }}
                transition={{ duration: 0.3 }}
              >
                ❤️
              </Heart>
            ))}
          </Box>
        </Box>
        <LinearProgress
          variant="determinate"
          value={(timeLeft / timePerQuestion) * 100}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: "rgba(255,255,255,0.2)",
            "& .MuiLinearProgress-bar": {
              backgroundColor: timeLeft < 5 ? "#f44336" : "white",
            },
          }}
        />
      </Box>
      <ProblemBox
        animate={{
          scale: isCorrect === null ? 1 : isCorrect ? 1.05 : 0.95,
          backgroundColor:
            isCorrect === null
              ? "rgba(255, 255, 255, 0.95)"
              : isCorrect
              ? "rgba(76, 175, 80, 0.95)"
              : "rgba(244, 67, 54, 0.95)",
        }}
        transition={{ duration: 0.2 }}
      >
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontSize: { xs: "2.5rem", sm: "3.5rem" },
            fontWeight: 600,
            color: isCorrect === null ? "#2f2f2f" : "#fff",
          }}
        >
          {currentProblem.problem} ={" "}
          {isCorrect == null ? "?" : currentProblem.correctAnswer}
        </Typography>
      </ProblemBox>

      <AnswerGrid>
        {currentProblem.answers.map((answer, index) => (
          <Button
            key={index}
            variant="contained"
            onClick={() => handleAnswer(answer)}
            disabled={isCorrect !== null || showingCorrectAnswer}
            sx={{
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
              padding: "1rem",
              borderRadius: "1rem",
              background: "linear-gradient(135deg,rgb(57, 168, 89),rgb(50, 157, 91))",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              "&:hover": {
                background:
                  "linear-gradient(135deg,rgb(161, 245, 66),rgb(163, 243, 33))",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
              },
              "&:disabled": {
                background: "linear-gradient(135deg, #9e9e9e, #757575)",
                opacity: 0.7,
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            {answer}
          </Button>
        ))}
      </AnswerGrid>

      <style jsx global>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </StyledBox>
  );
};

export default GameScreen;
