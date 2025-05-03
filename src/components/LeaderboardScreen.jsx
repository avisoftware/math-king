import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useGame } from "../context/useGame";
import { StyledBox } from "./StyledBox";
import { motion } from "framer-motion";
import styled from "styled-components";

const LeaderboardContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 1.5rem;
  width: 100%;
  max-width: 500px;
  overflow: hidden;
`;

const ScoreEntry = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin: 0.5rem 0;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.8rem;
  transition: transform 0.2s;

  &:hover {
    transform: translateX(5px);
    background: rgba(255, 255, 255, 0.1);
  }
`;

const LeaderboardScreen = ({ onBack }) => {
  const { t } = useTranslation();
  const { getLeaderboard } = useGame();
  const leaderboard = getLeaderboard();

  return (
    <StyledBox>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          width: "100%",
          padding: 3,
          alignItems: "center",
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
            {t("leaderboard")}
          </Typography>
        </motion.div>

        <LeaderboardContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {leaderboard.length > 0 ? (
            leaderboard.map((entry, index) => (
              <ScoreEntry
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "white",
                      opacity: 0.8,
                      fontWeight: 600,
                      minWidth: "2rem",
                    }}
                  >
                    #{index + 1}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ color: "white", fontWeight: 500 }}
                  >
                    {entry.name}
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "white",
                    fontWeight: 600,
                  }}
                >
                  {entry.score}
                </Typography>
              </ScoreEntry>
            ))
          ) : (
            <Typography
              variant="h6"
              sx={{
                color: "white",
                textAlign: "center",
                opacity: 0.7,
              }}
            >
              {t("noScores")}
            </Typography>
          )}
        </LeaderboardContainer>

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

export default LeaderboardScreen;
