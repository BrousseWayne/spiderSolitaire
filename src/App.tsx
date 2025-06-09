import { useMemo, useState } from "react";
import "./App.css";
import { getCardImage } from "./cards";
import Deck from "./deck";
import type { Card as CardType, CardProps } from "./types";
import cardBack from "./assets/cards back/tile016.png";

function Card({
  suit,
  value,
  title,
  flipped,
  onFlip,
}: CardProps & { flipped: boolean; onFlip: () => void; title?: string }) {
  const frontImage = getCardImage(suit, value);
  const backImage = cardBack;

  return (
    <div
      className={`card ${flipped ? "flipped" : ""}`}
      onClick={onFlip}
      title={title}
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

function App() {
  const deck = useMemo(() => new Deck(2), []);

  const [cards, setCards] = useState(
    deck.cards.map((card) => ({ ...card, flipped: true }))
  );

  function flipCard(index: number) {
    setCards((prevCards) =>
      prevCards.map((card, i) =>
        i === index ? { ...card, flipped: !card.flipped } : card
      )
    );
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {cards.map((card, index) => (
        <Card
          key={index}
          suit={card.suit}
          value={card.value}
          flipped={card.flipped}
          onFlip={() => flipCard(index)}
          title={`${card.value} of ${card.suit}`}
        />
      ))}
    </div>
  );
}

export default App;
