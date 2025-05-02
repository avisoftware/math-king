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
`;

const ProblemBox = styled(motion.div)`
  direction: ltr;
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
`;

const AnswerGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  width: 100%;
  max-width: 400px;
`;

const GameScreen = ({ onGameOver }) => {
  const { t } = useTranslation();
  const { score, incrementScore, isMuted, selectedOperations } = useGame();
  const [timeLeft, setTimeLeft] = useState(15); // 15 seconds per question
  const [currentProblem, setCurrentProblem] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [showingCorrectAnswer, setShowingCorrectAnswer] = useState(false);

  const getDifficulty = useCallback(() => {
    if (score >= 10) return "hard";
    if (score >= 5) return "medium";
    return "easy";
  }, [score]);

  const generateNewProblem = () => {
    const difficulty = getDifficulty();
    // Filter enabled operations
    const availableOperations = Object.entries(selectedOperations)
      .filter(([, enabled]) => enabled)
      .map(([op]) => op);

    if (availableOperations.length === 0) return null;

    setCurrentProblem(generateProblem(difficulty, availableOperations));
    setIsCorrect(null);
  };

  useEffect(() => {
    generateNewProblem();
  }, []);

  useEffect(() => {
    if (gameEnded) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameEnded(true);
          setShowingCorrectAnswer(true);
          setTimeout(() => {
            onGameOver(score);
          }, 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [score, onGameOver, gameEnded]);

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
      setTimeLeft(15); // Reset timer for next question
      setTimeout(generateNewProblem, 1000);
    } else {
      if (!isMuted) {
        new Audio(import.meta.env.BASE_URL + "sounds/incorrect.mp3")
          .play()
          .catch(() => {});
      }
      setGameEnded(true);
      setShowingCorrectAnswer(true);
      setTimeout(() => {
        onGameOver(score);
      }, 4000);
    }
  };

  if (!currentProblem) return null;

  return (
    <StyledBox>
      <Box sx={{ width: "100%", maxWidth: 400, position: "absolute", top: 20 }}>
        <Typography variant="h6" color="white" gutterBottom>
          {t("score")}: {score}
        </Typography>
        <Typography variant="h6" color="white" gutterBottom>
          {t("timeLeft")}: {timeLeft}s
        </Typography>
        <LinearProgress
          variant="determinate"
          value={(timeLeft / 15) * 100}
          sx={{ height: 10, borderRadius: 5 }}
        />
      </Box>

      <ProblemBox
        animate={{
          scale: isCorrect === null ? 1 : isCorrect ? 1.05 : 0.95,
          backgroundColor:
            isCorrect === null ? "white" : isCorrect ? "#4caf50" : "#f44336",
        }}
        transition={{ duration: 0.2 }}
      >
        <Typography variant="h2" component="h2" gutterBottom>
          {currentProblem.problem} ={" "}
          {isCorrect == null ? "?" : currentProblem.correctAnswer}
        </Typography>
        {isCorrect !== null && !isCorrect && (
          <Typography variant="h4" component="p" color="white">
            {t("incorrect")} {currentProblem.correctAnswer}
          </Typography>
        )}
      </ProblemBox>

      <AnswerGrid>
        {currentProblem.answers.map((answer, index) => (
          <Button
            key={index}
            variant="contained"
            color={
              showingCorrectAnswer && answer === currentProblem.correctAnswer
                ? "success"
                : isCorrect !== null && answer === currentProblem.correctAnswer
                ? "success"
                : isCorrect === false && answer !== currentProblem.correctAnswer
                ? "secondary"
                : "secondary"
            }
            size="large"
            onClick={() => handleAnswer(answer)}
            disabled={isCorrect !== null || showingCorrectAnswer}
            sx={{
              fontSize: "1.5rem",
              padding: "1rem",
              backgroundColor:
                showingCorrectAnswer && answer === currentProblem.correctAnswer
                  ? "#4caf50"
                  : undefined,
            }}
          >
            {answer}
          </Button>
        ))}
      </AnswerGrid>
    </StyledBox>
  );
};

export default GameScreen;
