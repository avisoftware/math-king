import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useGame } from "../context/useGame";
import styled from "styled-components";
import { motion } from "framer-motion";
import { StyledBox } from "./StyledBox";

const OperationsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  width: 100%;
  max-width: 400px;
  margin: 1rem 0 2rem 0;
`;

const OperationButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 1rem;
  padding: 2rem 1rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  .operation-symbol {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .operation-name {
    font-size: 1.2rem;
    opacity: 0.9;
  }

  &:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(-2px);
  }
`;

const ButtonContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
`;

const StartScreen = ({ onStart, onLeaderboard, onSettings }) => {
  const { t, i18n } = useTranslation();
  const { setCurrentOperation } = useGame();

  const operations = [
    { key: "addition", symbol: "+" },
    { key: "subtraction", symbol: "−" },
    { key: "multiplication", symbol: "×" },
    { key: "division", symbol: "÷" },
  ];

  const handleOperationClick = (operation) => {
    setCurrentOperation(operation);
    onStart();
  };

  return (
    <StyledBox dir={i18n.language === "he" ? "rtl" : "ltr"}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          width: "100%",
          padding: 3,
        }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "3rem", sm: "4rem" },
              fontWeight: 700,
              color: "white",
              textAlign: "center",
              textShadow: "0 2px 10px rgba(0,0,0,0.2)",
              marginBottom: 2,
            }}
          >
            {t("mathKing")}
          </Typography>
        </motion.div>

        <OperationsContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {operations.map((op, index) => (
            <OperationButton
              key={op.key}
              onClick={() => handleOperationClick(op.key)}
              as={motion.button}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              style={{
                background:
                  op.key === "addition"
                    ? "linear-gradient(135deg, #4CAF50, #388E3C)" // Green for addition
                    : op.key === "subtraction"
                    ? "linear-gradient(135deg, #FF5722, #E64A19)" // Orange/Red for subtraction
                    : op.key === "multiplication"
                    ? "linear-gradient(135deg, #9C27B0, #7B1FA2)" // Purple for multiplication
                    : "linear-gradient(135deg, #FFC107, #FFA000)", // Yellow/Gold for division
              }}
            >
              <span className="operation-symbol">{op.symbol}</span>
            </OperationButton>
          ))}
        </OperationsContainer>

        <ButtonContainer>
          <Button
            variant="contained"
            onClick={onLeaderboard}
            sx={{
              fontSize: "1.1rem",
              padding: "0.8rem",
              borderRadius: "0.8rem",
              background: "linear-gradient(135deg, #64B5F6, #42A5F5)",
              textTransform: "none",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              "&:hover": {
                background: "linear-gradient(135deg, #42A5F5, #2196F3)",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            {t("viewLeaderboard")}
          </Button>

          <Button
            variant="contained"
            onClick={onSettings}
            sx={{
              fontSize: "1.1rem",
              padding: "0.8rem",
              borderRadius: "0.8rem",
              background: "linear-gradient(135deg, #9575CD, #7E57C2)",
              textTransform: "none",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              "&:hover": {
                background: "linear-gradient(135deg, #7E57C2, #673AB7)",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            {t("settings")}
          </Button>
        </ButtonContainer>
      </Box>
    </StyledBox>
  );
};

export default StartScreen;
