import { useState, useCallback } from "react";
import { GameContext } from "./context";

export function GameProvider({ children }) {
  const [isMuted, setIsMuted] = useState(false);
  const [language, setLanguage] = useState("en");
  const [timePerQuestion, setTimePerQuestion] = useState(15);
  const [currentOperation, setCurrentOperation] = useState(null);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const changeLanguage = useCallback((lang) => {
    setLanguage(lang);
  }, []);

  const getLeaderboard = useCallback(() => {
    const leaderboard = localStorage.getItem("mathKingLeaderboard");
    return leaderboard ? JSON.parse(leaderboard) : [];
  }, []);

  const saveScore = useCallback(
    (name, score) => {
      const leaderboard = getLeaderboard();
      const newEntry = { name, score, date: new Date().toISOString() };
      const newLeaderboard = [...leaderboard, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      localStorage.setItem(
        "mathKingLeaderboard",
        JSON.stringify(newLeaderboard)
      );
      return newLeaderboard;
    },
    [ getLeaderboard]
  );

  const value = {
    isMuted,
    setIsMuted,
    language,
    timePerQuestion,
    currentOperation,
    toggleMute,
    changeLanguage,
    getLeaderboard,
    saveScore,
    setTimePerQuestion,
    setCurrentOperation,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
