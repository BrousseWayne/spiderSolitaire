import { createContext, useReducer, useContext } from "react";
import { gameReducer } from "./gameReducer";
import Deck from "./deck";
import { createBoard } from "./board";
import { useLocation } from "react-router";

const GameStateContext = createContext(undefined);

export function GameStateProvider({ children }) {
  const location = useLocation();
  const suitsFromLocation = location.state?.suits;

  const [state, dispatch] = useReducer(gameReducer, {
    present: createBoard(new Deck(2, suitsFromLocation)),
    past: [],
    future: [],
    hasWon: false,
  });

  function newGame() {
    const newDeck = new Deck(2, suitsFromLocation);
    const newBoard = createBoard(newDeck);
    dispatch({ type: "NEW_GAME", payload: newBoard });
  }

  return (
    <GameStateContext.Provider value={{ state, dispatch, newGame }}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameStateContext);
  if (!context)
    throw new Error("useGame must be used inside GameStateProvider");
  return context;
}
