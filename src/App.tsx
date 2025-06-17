import { useRef, useState } from "react";
import "./App.css";
import { getCardImage } from "./cards";
import Deck from "./deck";
import type { CardProps, Card, CardsInGame } from "./types";
import cardBack from "./assets/cards back/tile023.png";

function Card({ suit, value, title, isCovered, onSelect, style }: CardProps) {
  const frontImage = getCardImage(suit, value);
  const backImage = cardBack;

  function handleClick() {
    if (isCovered) return;
    onSelect();
  }

  return (
    <div
      className={`card ${isCovered ? "isCovered" : ""}`}
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

function isCardCovered(card: CardsInGame, stack: CardsInGame[]): boolean {
  return card.indexInStack !== stack.length - 1;
}

function Board({ board, onMoveCard }: BoardProps) {
  const [selectedCard, setSelectedCard] = useState<SelectedCard>();

  function isMoveLegal(selectedCard, destinationCard) {
    return true;
  }

  function moveCard(stackIndex, cardIndex) {
    if (selectedCard) {
      if (isMoveLegal(selectedCard, { stackIndex, cardIndex })) {
        onMoveCard(selectedCard, { stackIndex, cardIndex });
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
              isCovered={isCardCovered(card, stack)}
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
      id: `${card.suit}-${card.value}-${stackId}-${stacks[stackId].length}`,
      stackId,
      indexInStack: stacks[stackId].length,
    });
  }

  for (let i = 0; i < 4; i++) {
    const card = deck.draw(1)[0];
    const stackId = i % 10;

    stacks[stackId].push({
      ...card,
      id: `${card.suit}-${card.value}-${stackId}-${stacks[stackId].length}`,
      stackId,
      indexInStack: stacks[stackId].length,
    });
  }

  for (let i = 0; i < 10; i++) {
    const card = deck.draw(1)[0];
    const stackId = i % 10;

    stacks[stackId].push({
      ...card,
      id: `${card.suit}-${card.value}-${stackId}-${stacks[stackId].length}`,
      stackId,
      indexInStack: stacks[stackId].length,
    });
  }

  return stacks;
}

function App() {
  const deckRef = useRef<Deck>(new Deck());
  const [board, setBoard] = useState<CardsInGame[][]>(() => {
    const deck = new Deck(2);
    deckRef.current = deck;
    return createBoard(deck);
  });

  function flipCard(stackIndex: number, cardIndex: number) {
    // implement later
  }

  function onMoveCard(
    selectedCard: SelectedCard,
    destinationCard: SelectedCard
  ) {
    const { stackIndex: selectedCardStackIndex, cardIndex: selectedCardIndex } =
      selectedCard;
    const { stackIndex: destCardStackIndex, cardIndex: destCardIndex } =
      destinationCard;

    const newBoard = [...board];

    const movingCards =
      newBoard[selectedCardStackIndex].splice(selectedCardIndex);

    newBoard[destCardStackIndex].push(...movingCards);

    newBoard.forEach((stack, si) => {
      stack.forEach((card, ci) => {
        card.stackId = si;
        card.indexInStack = ci;
      });
    });

    setBoard(newBoard);
  }

  return (
    <div className="container">
      <Board board={board} onMoveCard={onMoveCard} />
    </div>
  );
}

export default App;
