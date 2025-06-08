import { useMemo } from "react";
import "./App.css";

// composition d'un deck

//52 cartes
//4 couleurs HCDP
//1-10
//J Q K

// spider 2 decks

type CardSuit = "Heart" | "Diamond" | "Club" | "Spade";
type CardValue =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K";

type Card = {
  suit: CardSuit;
  value: CardValue;
};

type RandomFunction = () => number;

class Deck {
  private deck: Card[];
  private repeatCreate: number;

  constructor(repeatCreateDeck = 2) {
    this.repeatCreate = repeatCreateDeck;
    this.deck = this.createDeck(repeatCreateDeck);
    this.shuffle();
  }

  /** Creates a fresh ordered deck */
  private createDeck(repeatCreateDeck: number): Card[] {
    const suits: CardSuit[] = ["Heart", "Diamond", "Club", "Spade"];
    const values: CardValue[] = [
      "A",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
    ];

    const deck: Card[] = [];
    for (let index = 0; index < repeatCreateDeck; index++) {
      for (const suit of suits) {
        for (const value of values) {
          deck.push({ suit, value });
        }
      }
    }

    return deck;
  }

  /** Classic Fisher-Yates shuffle (optionally takes a custom RNG) */
  shuffle(randomFn: RandomFunction = Math.random): void {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(randomFn() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  /** Shuffle with a specific seed using internal LCG */
  shuffleWithSeed(seed: number): void {
    const seededRandom = this.createSeededRandom(seed);
    this.shuffle(seededRandom);
  }

  /** Linear Congruential Generator for seedable randomness */
  private createSeededRandom(seed: number): RandomFunction {
    let m = 0x80000000; // 2**31
    let a = 1103515245;
    let c = 12345;
    let state = seed;

    return () => {
      state = (a * state + c) % m;
      return state / m;
    };
  }

  reset(): void {
    this.deck = this.createDeck(this.repeatCreate);
  }

  get cards(): Card[] {
    return this.deck;
  }

  draw(count: number = 1): Card[] {
    if (count > this.deck.length) {
      throw new Error("Not enough cards in the deck.");
    }
    return this.deck.splice(0, count);
  }
}

type CardKey = `${CardSuit}-${CardValue}`;

// Import all card images from assets folder eagerly as URLs
const cardImages: Record<string, string> = import.meta.glob(
  "./assets/high contrast cards/*.png",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

const cardsMap = new Map<CardKey, string>();

console.log("Loaded cardsMap:", cardsMap);

for (const path in cardImages) {
  const fileName = path.split("/").pop();
  if (!fileName) continue;

  // Example fileName: Heart-A.png, Club-10.png
  const [suit, valueWithExt] = fileName.split("-");
  const value = valueWithExt.replace(".png", "");

  console.log(`File: ${fileName}, Suit: ${suit}, Value: ${value}`);

  // Validate suits and values (basic check)
  const validSuits = ["Heart", "Diamond", "Club", "Spade"];
  const validValues = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];

  if (validSuits.includes(suit) && validValues.includes(value)) {
    const key = `${suit}-${value}` as CardKey;
    cardsMap.set(key, cardImages[path]);
  }
}

// Function to get the image URL by suit and value
export function getCardImage(
  suit: CardSuit,
  value: CardValue
): string | undefined {
  return cardsMap.get(`${suit}-${value}`);
}

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
