import { useEffect, useReducer, useState } from "react";
import "./App.css";
import Deck from "./deck";
import type { BoardType, CardType, CardsInGame } from "./types";
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { Board, Draw, Foundation } from "./board";
import { gameReducer } from "./gameReducer";
import { Button } from "./components/ui/button";

function createBoard(deck: Deck): BoardType {
  const stacks: CardsInGame[][] = Array.from({ length: 10 }, () => []);
  const draw: CardsInGame[][] = Array.from({ length: 5 }, () => []);

  const assignedId = new Map<string, number>();

  function createIdString(card: CardType) {
    return `${card.suit}-${card.value}`;
  }

  function assignId(card: CardType) {
    const partialId = createIdString(card);
    if (assignedId.get(partialId)! >= 0) {
      const curr = assignedId.get(partialId)! + 1;
      assignedId.set(partialId, curr);
      return `${partialId}-${curr}`;
    } else {
      assignedId.set(partialId, 0);
      return `${partialId}-0`;
    }
  }

  function drawCards(
    cardsToDraw: number,
    storage: CardsInGame[][],
    isDiscovered: boolean,
    stacks: number
  ) {
    for (let i = 0; i < cardsToDraw; i++) {
      const card = deck.draw(1)[0];
      const stackId = i % stacks;

      storage[stackId].push({
        ...card,
        id: assignId(card),
        stackId,
        indexInStack: storage[stackId].length,
        isDiscovered,
      });
    }
  }

  drawCards(40, stacks, false, 10);
  drawCards(4, stacks, false, 10);
  drawCards(10, stacks, true, 10);
  drawCards(deck.cards.length, draw, false, 5);

  return { cards: stacks, draw: draw };
}

function App() {
  const [state, dispatch] = useReducer(gameReducer, {
    present: createBoard(new Deck(2, 1)),
    past: [],
    future: [],
    hasWon: false,
  });

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
