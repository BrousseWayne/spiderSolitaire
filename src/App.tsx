import { useMemo, useState } from "react";
import "./App.css";
import { getCardImage } from "./cards";
import Deck from "./deck";
import type { CardProps, Card } from "./types";
import cardBack from "./assets/cards back/tile016.png";

function Card({
  suit,
  value,
  title,
  flipped,
  onFlip,
  style,
}: CardProps & {
  flipped: boolean;
  onFlip: () => void;
  title?: string;
  style: object;
}) {
  const frontImage = getCardImage(suit, value);
  const backImage = cardBack;

  return (
    <div
      className={`card ${flipped ? "flipped" : ""}`}
      onClick={onFlip}
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

function Board({ board, flipCard }) {
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
              onFlip={() => flipCard(stackIndex, cardIndex)}
              style={{ top: `${cardIndex * 30}px` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function createBoard(deck: Deck): Card[][] {
  const stacks: Card[][] = Array.from({ length: 10 }, () => []);

  for (let i = 0; i < deck.cards.length; i++) {
    const card = deck.draw(1)[0];
    stacks[i % 10].push({ ...card });
  }

  stacks.forEach((stack) => {
    if (stack.length > 0) stack[stack.length - 1].flipped = false;
  });

  return stacks;
}

function App() {
  const deck = useMemo(() => new Deck(2), []);

  const [board, setBoard] = useState<Card[][]>(createBoard(deck));

  function flipCard(stackIndex: number, cardIndex: number) {
    setBoard((prevBoard) =>
      prevBoard.map((stack, si) =>
        si === stackIndex
          ? stack.map((card, ci) =>
              ci === cardIndex ? { ...card, flipped: !card.flipped } : card
            )
          : stack
      )
    );
  }

  return (
    <div className="container">
      <Board board={board} flipCard={flipCard} />
    </div>
  );
}

export default App;
