import { useState } from "react";
import "./App.css";
import Deck from "./deck";
import type { BoardType, CardType, CardsInGame, SelectedCard } from "./types";
import { DndContext, type UniqueIdentifier } from "@dnd-kit/core";
import { Board, Draw, Foundation } from "./board";

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
  const [board, setBoard] = useState<BoardType>(() => createBoard(new Deck(2)));
  const [activeId, setActiveId] = useState<UniqueIdentifier>();

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

    const updatedBoard = newBoard.map((stack, si) =>
      stack.map((card, ci) => ({
        ...card,
        stackId: si,
        indexInStack: ci,
      }))
    );

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

  function drawFromPile() {
    const drawedCards = board.draw.pop();
    if (!drawedCards) return;

    const newBoard = board.cards.map((stack) => [...stack]);

    drawedCards.forEach((element, index) => {
      newBoard[index].push({
        ...element,
        isDiscovered: true,
        indexInStack: newBoard[index].length,
      });
    });

    setBoard({ cards: newBoard, draw: board.draw });
  }

  const array = [1, 2, 3, 4, 5, 6, 7, 8];

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
        <div className="top-bar">
          <Draw draw={board.draw} onClick={drawFromPile} />
          <div className="win-stacks">
            {array.map((array, arrayIndex) => (
              <Foundation key={arrayIndex} id={arrayIndex} />
            ))}
          </div>
        </div>
        <Board board={board.cards} activeId={activeId ?? ""} />
      </div>
    </DndContext>
  );
}

export default App;
