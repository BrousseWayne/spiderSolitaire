import { useReducer, useState } from "react";
import "./App.css";
import Deck from "./deck";
import type { BoardType, CardType, CardsInGame, SelectedCard } from "./types";
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { Board, Draw, Foundation } from "./board";
import { gameReducer } from "./gameReducer";

function createBoard(deck: Deck): BoardType {
  const stacks: CardsInGame[][] = Array.from({ length: 10 }, () => []);
  const draw: CardsInGame[][] = Array.from({ length: 5 }, () => []);

  const assignedId = new Map<string, number>();

  function createIdString(card: CardType) {
    return `${card.suit}-${card.value}`;
  }

  function assignId(card: CardType) {
    const partialId = createIdString(card);
    if (assignedId.get(partialId) === 0) {
      return `${partialId}-1`;
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
  const [state, dispatch] = useReducer(gameReducer, null, () =>
    createBoard(new Deck(2))
  );
  const [activeId, setActiveId] = useState<UniqueIdentifier>();
  const [movingCards, setMovingCards] = useState<CardsInGame[]>([]);

  const handleDragStart = ({ active }: DragStartEvent) => {
    const [_, __, stackIndex, cardIndex] = active.id.split("-");
    const stack = state.cards[parseInt(stackIndex)];
    setMovingCards(stack.slice(parseInt(cardIndex)));
    setActiveId(active.id);
  };

  const handleDragEnd = ({ over }: DragEndEvent) => {
    if (!over || !activeId) {
      setMovingCards([]);
      return;
    }

    const [_, __, stackIndex, cardIndex] = activeId.split("-");
    const src = {
      stackIndex: parseInt(stackIndex),
      cardIndex: parseInt(cardIndex),
    };

    const destStackIndex = parseInt(over.id.replace("stack-", ""));
    const dest = {
      stackIndex: destStackIndex,
      cardIndex: state.cards[destStackIndex].length,
    };

    dispatch({ type: "MOVE_CARD", src, dest });
    setMovingCards([]);
  };

  const array = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="container">
        <div className="top-bar">
          <Draw
            draw={state.draw}
            onClick={() => dispatch({ type: "DRAW_FROM_PILE" })}
          />
          <div className="win-stacks">
            {array.map((array, arrayIndex) => (
              <Foundation key={arrayIndex} id={arrayIndex} />
            ))}
          </div>
        </div>
        <Board board={state.cards} activeId={activeId ?? ""} />
      </div>
    </DndContext>
  );
}

export default App;
