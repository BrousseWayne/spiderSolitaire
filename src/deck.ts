import type {
  CardType,
  CardSuit,
  CardValue,
  RandomFunction,
  FormatType,
} from "./types";

export default class Deck {
  private deck: CardType[];
  private repeatCreate: number;
  private savedDeck: string;
  private format: FormatType;

  constructor(repeatCreateDeck = 2, format: FormatType = 4) {
    this.repeatCreate = repeatCreateDeck;
    this.format = format;
    this.deck = this.createDeck(repeatCreateDeck);
    this.shuffle();

    this.savedDeck = this.toJSON();
  }

  private createDeck(repeatCreateDeck: number): CardType[] {
    const deck: CardType[] = [];
    const suits: CardSuit[] = this.getSuitsForFormat();
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

    for (let i = 0; i < repeatCreateDeck; i++) {
      for (const suit of suits) {
        for (const value of values) {
          deck.push({ suit, value, isDiscovered: false });
        }
      }
    }
    return deck;
  }

  private getSuitsForFormat(): CardSuit[] {
    switch (this.format) {
      case 1:
        return Array(4).fill("Spade");
      case 2:
        return ["Spade", "Heart", "Spade", "Heart"];
      case 4:
        return ["Heart", "Diamond", "Club", "Spade"];
      default:
        throw new Error(`Invalid format: ${this.format}`);
    }
  }

  shuffle(randomFn: RandomFunction = Math.random): void {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(randomFn() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  shuffleWithSeed(seed: number): void {
    const seededRandom = this.createSeededRandom(seed);
    this.shuffle(seededRandom);
  }

  get stockpile(): number {
    return this.deck.length;
  }

  private createSeededRandom(seed: number): RandomFunction {
    let m = 0x80000000;
    let a = 1103515245;
    let c = 12345;
    let state = seed;

    return () => {
      state = (a * state + c) % m;
      return state / m;
    };
  }

  reset(): void {
    this.fromJSON(this.savedDeck);
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

  toJSON(): string {
    return JSON.stringify(this.deck);
  }

  fromJSON(json: string): void {
    this.deck = JSON.parse(json);
  }
}
