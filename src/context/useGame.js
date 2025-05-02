import { useContext } from "react";
import { GameContext } from "./context";

export function useGame() {
  return useContext(GameContext);
}
