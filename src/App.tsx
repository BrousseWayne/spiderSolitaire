import { useState } from "react";
import "./App.css";
import Deck from "./deck";
import type { BoardType, Card, CardsInGame, SelectedCard } from "./types";
import { DndContext } from "@dnd-kit/core";
import { Board, Draw } from "./board";

function createBoard(deck: Deck): BoardType {
  const stacks: CardsInGame[][] = Array.from({ length: 10 }, () => []);
  const draw: CardsInGame[][] = Array.from({ length: 5 }, () => []);

  const assignedId = new Map<string, number>();

  function createIdString(card: Card) {
    return `${card.suit}-${card.value}`;
  }

  function assignId(card: Card) {
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

//TODO:Not enough need to compute the whole stack must be the same color to be moved
// TODO:and care about the draw, it could fuck up a stack
//TODO:implement drag and drop
//TODO: create a border around the empty stack area

function App() {
  const [board, setBoard] = useState<BoardType>(() => createBoard(new Deck(2)));
  const [activeId, setActiveId] = useState<string | null>(null);

  function isMoveLegal(src: SelectedCard, dest: SelectedCard) {
    const mapCardValue = new Map<string, number>([
      ["A", 1],
      ["2", 2],
      ["3", 3],
      ["4", 4],
      ["5", 5],
      ["6", 6],
      ["7", 7],
      ["8", 8],
      ["9", 9],
      ["10", 10],
      ["J", 11],
      ["Q", 12],
      ["K", 13],
    ]);

    const srcCard = board.cards[src.stackIndex][src.cardIndex];
    for (
      let index = src.cardIndex;
      index < board.cards[src.stackIndex].length;
      index++
    ) {
      if (board.cards[src.stackIndex][index].suit !== srcCard.suit) return;
    }

    const destStack = board.cards[dest.stackIndex];
    const destCard = destStack[dest.cardIndex - 1];

    if (destStack.length === 0) return true;

    if (!destCard) return false;

    const srcValue = mapCardValue.get(srcCard.value);
    const destValue = mapCardValue.get(destCard.value);

    return destValue - srcValue === 1;
  }

  function moveCard(src: SelectedCard, dest: SelectedCard) {
    const newBoard = board.cards.map((stack) => [...stack]);

    const movingCards = newBoard[src.stackIndex].splice(src.cardIndex);
    newBoard[dest.stackIndex].push(...movingCards);

    // Update indexes & stack IDs
    const updatedBoard = newBoard.map((stack, si) =>
      stack.map((card, ci) => ({
        ...card,
        stackId: si,
        indexInStack: ci,
      }))
    );

    // Discover new top card on src stack
    const remainingStack = updatedBoard[src.stackIndex];
    if (remainingStack.length > 0) {
      const topCardIndex = remainingStack.length - 1;
      remainingStack[topCardIndex] = {
        ...remainingStack[topCardIndex],
        isDiscovered: true,
      };
    }

    setBoard({ cards: updatedBoard, draw: board.draw });
  }

  return (
    <DndContext
      onDragStart={({ active }) => setActiveId(active.id)}
      onDragEnd={({ over, active }) => {
        if (!over) return;

        console.log(active);
        console.log("Active ID:", active.id);

        const activeId = active.id;
        const destStackId = over.id;

        const [_, __, stackIndex, cardIndex] = activeId.split("-");
        const src = {
          stackIndex: parseInt(stackIndex),
          cardIndex: parseInt(cardIndex),
        };

        const destStackIndex = parseInt(destStackId.replace("stack-", ""));
        const dest = {
          stackIndex: destStackIndex,
          cardIndex: board.cards[destStackIndex].length,
        };

        if (!isMoveLegal(src, dest)) return;

        moveCard(src, dest);
      }}
    >
      <div className="container">
        <Draw draw={board.draw} />
        <Board board={board.cards} activeId={activeId ?? ""} />
      </div>
    </DndContext>
  );
}

export default App;
