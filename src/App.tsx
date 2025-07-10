import { useEffect, useState } from "react";
import "./App.css";
import type { CardsInGame } from "./types";
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { Board, Draw, Foundation } from "./board";
import { Button } from "./components/ui/button";
import { useGame } from "./gameStateContext";

//TODO: Fix gameconfig issue with the context

function App() {
  const { state, dispatch, newGame } = useGame();

  const [showWinModal, setShowWinModal] = useState(false);

  useEffect(() => {
    if (state.hasWon) {
      setShowWinModal(true);
    }
  }, [state.hasWon]);

  const [activeId, setActiveId] = useState<UniqueIdentifier>();
  const [movingCards, setMovingCards] = useState<CardsInGame[]>([]);

  const handleDragStart = ({ active }: DragStartEvent) => {
    const [_, __, stackIndex, cardIndex] = active.id.split("-");
    const stack = state.present.cards[parseInt(stackIndex)];
    setMovingCards(stack.slice(parseInt(cardIndex)));
    setActiveId(active.id);
  };

  const handleDragEnd = ({ over }: DragEndEvent) => {
    if (!over || !activeId) {
      setMovingCards([]);
      return;
    }

    const activeIdStr = String(activeId); // Convert to string first
    const [_, __, stackIndex, cardIndex] = activeIdStr.split("-");
    const src = {
      stackIndex: parseInt(stackIndex),
      cardIndex: parseInt(cardIndex),
    };

    const destStackIndex = parseInt(over.id.replace("stack-", ""));
    const dest = {
      stackIndex: destStackIndex,
      cardIndex: state.present.cards[destStackIndex].length,
    };

    dispatch({ type: "MOVE_CARD", src, dest });

    setMovingCards([]);
  };

  const array = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Undo onClick={() => dispatch({ type: "UNDO" })} />
      <Redo onClick={() => dispatch({ type: "REDO" })} />
      <NewGame onClick={() => newGame()} />

      <div className="container">
        <div className="top-bar">
          <Draw
            draw={state.present.draw}
            onClick={() => dispatch({ type: "DRAW_FROM_PILE" })}
          />
          <div className="win-stacks">
            {array.map((array, arrayIndex) => (
              <Foundation key={arrayIndex} id={arrayIndex} />
            ))}
          </div>
        </div>
        <Board board={state.present.cards} activeId={activeId ?? ""} />
      </div>
      {showWinModal && (
        <div className="overlay">
          <div className="modal">
            <p>You win</p>
            <Button onClick={() => setShowWinModal(false)}>Close</Button>
          </div>
        </div>
      )}
    </DndContext>
  );
}

function NewGame({ onClick }) {
  return (
    <Button variant="secondary" onClick={onClick} className="undo">
      NEW GAME
    </Button>
  );
}

function Undo({ onClick }) {
  return (
    <Button variant="secondary" onClick={onClick} className="undo">
      UNDO
    </Button>
  );
}
function Redo({ onClick }) {
  return (
    <Button variant="secondary" onClick={onClick} className="undo">
      REDO
    </Button>
  );
}

export default App;
