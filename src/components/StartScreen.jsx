import {
  Box,
  Button,
  Typography,
  IconButton,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useGame } from "../context/useGame";
import { VolumeUp, VolumeOff } from "@mui/icons-material";
import styled from "styled-components";
import { motion } from "framer-motion";
import { StyledBox } from "./StyledBox";

const TopBar = styled(Box)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding: 1rem;
  gap: 1rem;
  z-index: 10;
  direction: ltr !important; /* Force LTR direction */
`;

const ContentContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  width: 100%;
  max-width: 800px;
  margin-top: 80px;
`;

const OperationsContainer = styled(Box)`
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
  flex-wrap: wrap;
  justify-content: center;
`;

const OperationButton = styled(motion.button)`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: none;
  font-size: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: white;
  color: #333;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const StyledSelect = styled(Select)`
  color: white;
  & .MuiOutlinedInput-notchedOutline {
    border-color: white;
  }
  &:hover .MuiOutlinedInput-notchedOutline {
    border-color: white;
  }
  &.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: white;
  }
  & .MuiSelect-icon {
    color: white;
  }
`;

const StartScreen = ({ onStart, onLeaderboard }) => {
  const { t, i18n } = useTranslation();
  const { isMuted, toggleMute, setSelectedOperations } = useGame();

  const handleLanguageChange = (event) => {
    const lang = event.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    document.dir = lang === "he" ? "rtl" : "ltr";
  };

  const languages = [
    { code: "en", label: "English" },
    { code: "fr", label: "Français" },
    { code: "es", label: "Español" },
    { code: "he", label: "עברית" },
  ];

  const startWithOperation = (operation) => {
    setSelectedOperations({
      addition: operation === "addition",
      subtraction: operation === "subtraction",
      multiplication: operation === "multiplication",
      division: operation === "division",
    });
    onStart();
  };

  const operationButtons = [
    { type: "addition", symbol: "+", color: "#4CAF50" },
    { type: "subtraction", symbol: "−", color: "#FF9800" },
    { type: "multiplication", symbol: "×", color: "#2196F3" },
    { type: "division", symbol: "÷", color: "#9C27B0" },
  ];

  return (
    <StyledBox dir={i18n.language === "he" ? "rtl" : "ltr"}>
      <TopBar>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <StyledSelect
            value={i18n.language}
            onChange={handleLanguageChange}
            variant="outlined"
            sx={{ color: "white" }}
          >
            {languages.map(({ code, label }) => (
              <MenuItem key={code} value={code}>
                {label}
              </MenuItem>
            ))}
          </StyledSelect>
        </FormControl>
        <IconButton onClick={toggleMute} sx={{ color: "white" }}>
          {isMuted ? <VolumeOff /> : <VolumeUp />}
        </IconButton>
      </TopBar>

      <ContentContainer>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h1"
            component="h1"
            color="white"
            align="center"
            sx={{ mb: 4, fontWeight: "bold" }}
          >
            {t("mathKing")}
          </Typography>
        </motion.div>

        <OperationsContainer>
          {operationButtons.map(({ type, symbol, color }) => (
            <OperationButton
              key={type}
              as={motion.button}
              onClick={() => startWithOperation(type)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ backgroundColor: color, color: "white" }}
            >
              {symbol}
            </OperationButton>
          ))}
        </OperationsContainer>

        <Button
          variant="outlined"
          color="inherit"
          size="large"
          onClick={onLeaderboard}
          sx={{
            color: "white",
            borderColor: "white",
            width: "200px",
            height: "50px",
            fontSize: "1.1rem",
            marginTop: "2rem",
          }}
        >
          {t("viewLeaderboard")}
        </Button>
      </ContentContainer>
    </StyledBox>
  );
};

export default StartScreen;
