import { createContext, useContext, useState } from "react";
import type { FormatType } from "./types";

type GameConfig = {
  suits: FormatType;
  setSuits: (suits: FormatType) => void;
};

const GameConfigContext = createContext<GameConfig | undefined>(undefined);

export function GameConfigProvider({ children }) {
  const [suits, setSuits] = useState<FormatType>(1);
  return (
    <GameConfigContext.Provider value={{ suits, setSuits }}>
      {children}
    </GameConfigContext.Provider>
  );
}

export function useGameConfig() {
  const context = useContext(GameConfigContext);
  if (!context)
    throw new Error("useGameConfig must be used inside GameConfigProvider");
  return context;
}
