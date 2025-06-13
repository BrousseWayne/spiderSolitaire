import { useMemo, useRef, useState } from "react";
import "./App.css";
import { getCardImage } from "./cards";
import Deck from "./deck";
import type { CardProps, Card, CardsInGame } from "./types";
import cardBack from "./assets/cards back/tile016.png";

function Card({
  suit,
  value,
  title,
  flipped,
  onSelect,
  style,
}: CardProps & {
  flipped: boolean;
  onSelect: () => void;
  title?: string;
  style: object;
}) {
  const frontImage = getCardImage(suit, value);
  const backImage = cardBack;

  return (
    <div
      className={`card ${flipped ? "flipped" : ""}`}
      onClick={onSelect}
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
  board: CardsInGame[];
  flipCard: () => void;
  onMoveCard: (src: number, dest: number) => void;
}

function Board({ board, flipCard, onMoveCard }: BoardProps) {
  const [selectedCard, setSelectedCard] = useState<SelectedCard>();

  function isMoveLegal(selectedCard, destinationCard) {
    return true;
  }

  function moveCard(stackIndex, cardIndex) {
    if (selectedCard) {
      console.log(
        "Try to move card to",
        stackIndex,
        cardIndex,
        "already selected card:",
        selectedCard
      );
      if (isMoveLegal(selectedCard, { stackIndex, cardIndex })) {
        onMoveCard(stackIndex, cardIndex);
        setSelectedCard(undefined);
        console.log("clear");
      }
    } else {
      setSelectedCard({ stackIndex, cardIndex });
      console.log("set card");
    }
  }

  console.log(selectedCard);
  console.log(board);
  return (
    <div className="board">
      {board.map((stack, stackIndex) => (
        <div key={stackIndex} className="stack">
          {stack.map((card, cardIndex) => (
            <Card
              key={cardIndex}
              suit={card.suit}
              value={card.value}
              flipped={card.flipped}
              onSelect={() => moveCard(stackIndex, cardIndex)}
              // isCovered=
              // onFlip={() => flipCard(stackIndex, cardIndex)}
              style={{ top: `${cardIndex * 30}px` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

//TODO:fix inconsistent hover on cards
//BUG: stacked cards can be flipped
//TODO: how to rotate screen for layout
// TODO: create a logging function for debug purposes

function createBoard(deck: Deck): CardsInGame[] {
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
      indexInStack: stacks[stackId].length, // Dynamic position
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

  console.log(stacks);

  return stacks.flat();
}

function App() {
  const deckRef = useRef<Deck>(new Deck());
  const [board, setBoard] = useState<CardsInGame[]>(() => {
    const deck = new Deck(2);
    deckRef.current = deck;
    return createBoard(deck);
  });

  console.log(deckRef.current.stockpile);

  function flipCard(stackIndex: number, cardIndex: number) {
    // setBoard((prevBoard) =>
    // prevBoard.map((stack, si) =>
    //   si === stackIndex
    //     ? stack.map((card, ci) =>
    //         ci === cardIndex ? { ...card, flipped: !card.flipped } : card
    //       )
    //     : stack
    // )
    // );
  }

  function onMoveCard(
    selectedCard: SelectedCard,
    destinationCard: SelectedCard
  ) {
    console.log("card was moved");
    const { stackIndex: selectedCardStackIndex, cardIndex: selectedCardIndex } =
      selectedCard;
    const { stackIndex: destCardStackIndex, cardIndex: destCardIndex } =
      destinationCard;

    setBoard((prevBoard) => {});
    // selectedCard, destinationCard;

    return { stackIndex, cardIndex };
  }

  return (
    <div className="container">
      <Board board={board} flipCard={flipCard} onMoveCard={onMoveCard} />
    </div>
  );
}

export default App;
