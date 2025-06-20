import { useState } from "react";
import "./App.css";
import Deck from "./deck";
import type { CardsInGame, SelectedCard } from "./types";
import { DndContext } from "@dnd-kit/core";
import { Board, createBoard } from "./board";

//TODO:Not enough need to compute the whole stack must be the same color to be moved
// TODO:and care about the draw, it could fuck up a stack
//TODO:implement drag and drop
//TODO:Must be able to put a King on an empty stack
//TODO: create a border around the empty stack area

function App() {
  // const deckRef = useRef<Deck>(new Deck());
  const [board, setBoard] = useState<CardsInGame[][]>(() => {
    // const deck = new Deck(2);
    // deckRef.current = deck;
    return createBoard(new Deck(2));
  });

  function onMoveCard(
    selectedCard: SelectedCard,
    destinationCard: SelectedCard
  ) {
    const newBoard = board.map((stack) => [...stack]);

    const movingCards = newBoard[selectedCard.stackIndex].splice(
      selectedCard.cardIndex
    );

    newBoard[destinationCard.stackIndex].push(...movingCards);

    const updatedBoard = newBoard.map((stack, si) =>
      stack.map((card, ci) => ({
        ...card,
        stackId: si,
        indexInStack: ci,
      }))
    );

    const remainingStack = updatedBoard[selectedCard.stackIndex];
    if (remainingStack.length > 0) {
      const topCardIndex = remainingStack.length - 1;
      remainingStack[topCardIndex] = {
        ...remainingStack[topCardIndex],
        isDiscovered: true,
      };
    }

    setBoard(updatedBoard);
  }

  return (
    <DndContext
      onDragEnd={({ over, active }) => {
        if (!over) return;

        const activeId = active.id; // card id (title we passed to useDraggable)
        const destStackId = over.id; // stack id like "stack-3"

        const [suit, value, stackIndex, cardIndex] = activeId.split("-");
        const src = {
          stackIndex: parseInt(stackIndex),
          cardIndex: parseInt(cardIndex),
        };

        const destStackIndex = parseInt(destStackId.replace("stack-", ""));

        onMoveCard(src, {
          stackIndex: destStackIndex,
          cardIndex: board[destStackIndex].length, // put it on top
        });
      }}
    >
      <div className="container">
        <Board board={board} onMoveCard={onMoveCard} />
      </div>
    </DndContext>
  );
}

export default App;
