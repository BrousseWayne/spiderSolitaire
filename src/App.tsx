import { useState } from "react";
import "./App.css";
import { getCardImage } from "./cards";
import Deck from "./deck";
import type { CardProps, Card, CardsInGame } from "./types";
import cardBack from "./assets/cards back/tile023.png";

function Card({
  suit,
  value,
  title,
  isDiscovered,
  onSelect,
  style,
}: CardProps) {
  const frontImage = getCardImage(suit, value);
  const backImage = cardBack;

  function handleClick() {
    if (!isDiscovered) return;
    onSelect();
  }

  return (
    <div
      className={`card ${isDiscovered ? "" : "isNotDiscovered"}`}
      onClick={handleClick}
      title={title}
      style={{ position: "absolute", ...style }}
    >
      <div className="card-inner">
        <div className="card-face card-front">
          <img src={frontImage} />
        </div>
        <div className="card-face card-back">
          <img src={backImage} />
        </div>
      </div>
    </div>
  );
}

type SelectedCard = {
  stackIndex: number;
  cardIndex: number;
};

interface BoardProps {
  board: CardsInGame[][];
  onMoveCard: (src: SelectedCard, dest: SelectedCard) => void;
}

function isStrictlyBefore(
  selectedCard: SelectedCard,
  destinationCard: SelectedCard
) {
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

  return selectedCard;
}

function Board({ board, onMoveCard }: BoardProps) {
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
    //implement rules as a generic function that apply on the array

    console.log(selectedCard, destinationCard);
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
        <div key={stackIndex} className="stack">
          {stack.map((card, cardIndex) => (
            <Card
              key={card.id}
              suit={card.suit}
              value={card.value}
              isDiscovered={card.isDiscovered}
              onSelect={() => moveCard(stackIndex, cardIndex)}
              style={{
                top: `${card.indexInStack * 30}px`,
                zIndex: card.indexInStack,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function createBoard(deck: Deck): CardsInGame[][] {
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
    <div className="container">
      <Board board={board} onMoveCard={onMoveCard} />
    </div>
  );
}

export default App;
