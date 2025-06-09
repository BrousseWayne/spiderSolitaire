import { useMemo, useState } from "react";
import "./App.css";
import { getCardImage } from "./cards";
import Deck from "./deck";
import type { CardProps } from "./types";
import cardBack from "./assets/cards back/tile016.png";

function Card({ suit, value, title }: CardProps & { title?: string }) {
  const [flipped, setFlipped] = useState(false);
  const frontImage = getCardImage(suit, value);
  const backImage = cardBack;

  return (
    <div
      className={`card ${flipped ? "flipped" : ""}`}
      onClick={() => setFlipped(!flipped)}
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

  const cardsToShow = deck.cards.slice(0, 104);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {cardsToShow.map((card, id) => {
        return (
          <Card
            key={id}
            suit={card.suit}
            value={card.value}
            title={`${card.value} of ${card.suit}`}
          />
        );
      })}
    </div>
  );
}

export default App;
