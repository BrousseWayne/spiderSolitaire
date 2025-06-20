import { useState } from "react";
import type { CardsInGame, SelectedCard } from "./types";
import Card from "./card";
import "./App.css";
import type Deck from "./deck";
import { Stack } from "./Stack";

interface BoardProps {
  board: CardsInGame[][];
  onMoveCard: (src: SelectedCard, dest: SelectedCard) => void;
}

export function Board({ board, onMoveCard }: BoardProps) {
  const [selectedCard, setSelectedCard] = useState<SelectedCard>();

  function isMoveLegal(
    selectedCard: SelectedCard,
    destinationCard: SelectedCard
  ) {
    function isStrictlyBefore() {
      const mapCardValue = new Map<string, number>();
      mapCardValue.set("A", 1);
      mapCardValue.set("2", 2);
      mapCardValue.set("3", 3);
      mapCardValue.set("4", 4);
      mapCardValue.set("5", 5);
      mapCardValue.set("6", 6);
      mapCardValue.set("7", 7);
      mapCardValue.set("8", 8);
      mapCardValue.set("9", 9);
      mapCardValue.set("10", 10);
      mapCardValue.set("J", 11);
      mapCardValue.set("Q", 12);
      mapCardValue.set("K", 13);

      const destValue = mapCardValue.get(
        board[destinationCard.stackIndex][destinationCard.cardIndex].value
      );
      const srcValue = mapCardValue.get(
        board[selectedCard.stackIndex][selectedCard.cardIndex].value
      );

      return destValue - srcValue === 1;
    }

    const t = isStrictlyBefore();
    console.log(t);
    return t;
  }

  function moveCard(stackIndex, cardIndex) {
    if (selectedCard) {
      if (isMoveLegal(selectedCard, { stackIndex, cardIndex })) {
        onMoveCard(selectedCard, { stackIndex, cardIndex });
        setSelectedCard(undefined);
      } else {
        setSelectedCard(undefined);
      }
    } else {
      setSelectedCard({ stackIndex, cardIndex });
    }
  }

  return (
    <div className="board">
      {board.map((stack, stackIndex) => (
        <Stack
          key={stackIndex}
          stack={stack}
          stackIndex={stackIndex}
          moveCard={moveCard}
        />
      ))}
    </div>
  );
}

export function createBoard(deck: Deck): CardsInGame[][] {
  const stacks: CardsInGame[][] = Array.from({ length: 10 }, () => []);

  for (let i = 0; i < 40; i++) {
    const card = deck.draw(1)[0];
    const stackId = i % 10;

    stacks[stackId].push({
      ...card,
      id: `${card.suit}-${card.value}-${Math.random() * 10}`,
      stackId,
      indexInStack: stacks[stackId].length,
    });
  }

  for (let i = 0; i < 4; i++) {
    const card = deck.draw(1)[0];
    const stackId = i % 10;

    stacks[stackId].push({
      ...card,
      id: `${card.suit}-${card.value}-${Math.random() * 10}`,
      stackId,
      indexInStack: stacks[stackId].length,
    });
  }

  for (let i = 0; i < 10; i++) {
    const card = deck.draw(1)[0];
    const stackId = i % 10;

    stacks[stackId].push({
      ...card,
      id: `${card.suit}-${card.value}-${Math.random() * 10}`,
      stackId,
      indexInStack: stacks[stackId].length,
      isDiscovered: true,
    });
  }

  return stacks;
}
