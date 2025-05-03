import {
  Box,
  Button,
  Typography,
  Switch,
  Slider,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useGame } from "../context/useGame";
import { StyledBox } from "./StyledBox";
import { motion } from "framer-motion";
import styled from "styled-components";

const SettingSection = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 1rem;
  width: 100%;
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

const SettingsScreen = ({ onBack }) => {
  const { t, i18n } = useTranslation();
  const { timePerQuestion, setTimePerQuestion, isMuted, setIsMuted } =
    useGame();

  const handleTimeChange = (_, newValue) => {
    setTimePerQuestion(newValue);
  };

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

  return (
    <StyledBox dir={i18n.language === "he" ? "rtl" : "ltr"}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          maxWidth: 500,
          width: "100%",
          padding: 3,
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Typography
            variant="h3"
            sx={{
              color: "white",
              textAlign: "center",
              marginBottom: 4,
              fontWeight: 600,
              textShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
          >
            {t("settings")}
          </Typography>
        </motion.div>
        
        <SettingSection
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
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
        </SettingSection>

        <SettingSection
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Typography variant="h6" color="white" sx={{ marginBottom: 2 }}>
            {t("timePerQuestion")}
          </Typography>
          <Slider
            value={timePerQuestion}
            onChange={handleTimeChange}
            min={5}
            max={30}
            step={5}
            marks
            valueLabelDisplay="auto"
            sx={{
              color: "#4caf50",
              "& .MuiSlider-valueLabel": {
                backgroundColor: "#4caf50",
              },
              "& .MuiSlider-mark": {
                backgroundColor: "white",
              },
              "& .MuiSlider-rail": {
                opacity: 0.5,
              },
            }}
          />
          <Typography color="white" sx={{ marginTop: 1, textAlign: "center" }}>
            {timePerQuestion} {t("seconds")}
          </Typography>
        </SettingSection>

        <SettingSection
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={!isMuted}
                onChange={() => setIsMuted(!isMuted)}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "#4caf50",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#4caf50",
                  },
                }}
              />
            }
            label={<Typography color="white">{t("sound")}</Typography>}
          />
        </SettingSection>

        <Button
          variant="contained"
          onClick={onBack}
          sx={{
            marginTop: 2,
            fontSize: "1.1rem",
            padding: "0.8rem 2rem",
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
          {t("back")}
        </Button>
      </Box>
    </StyledBox>
  );
};

export default SettingsScreen;
