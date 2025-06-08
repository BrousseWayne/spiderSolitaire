import { useMemo } from "react";
import "./App.css";
import { getCardImage } from "./cards";
import Deck from "./deck";

// composition d'un deck

//52 cartes
//4 couleurs HCDP
//1-10
//J Q K

// spider 2 decks

function App() {
  const deck = useMemo(() => new Deck(2), []); // only create deck once

  const cardsToShow = deck.cards.slice(0, 104);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {cardsToShow.map((card, id) => {
        const src = getCardImage(card.suit, card.value);
        return (
          <div
            key={id}
            className="card-container"
            title={`${card.value} of ${card.suit}`}
          >
            {src ? (
              <img src={src} alt={`${card.suit} ${card.value}`} />
            ) : (
              <div className="noImage">No image</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default App;
