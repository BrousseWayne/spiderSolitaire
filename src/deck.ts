import type { Card, CardSuit, CardValue, RandomFunction } from "./types";

export default class Deck {
  private deck: Card[];
  private repeatCreate: number;
  private savedDeck: string;

  constructor(repeatCreateDeck = 2) {
    this.repeatCreate = repeatCreateDeck;
    this.deck = this.createDeck(repeatCreateDeck);
    this.shuffle();

    this.savedDeck = this.toJSON();
    console.log(this.savedDeck);
  }

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
          deck.push({ suit, value, isDiscovered: false });
        }
      }
    }

    return deck;
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
