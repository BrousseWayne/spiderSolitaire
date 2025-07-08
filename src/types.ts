import type { UniqueIdentifier } from "@dnd-kit/core";
import type { CSSProperties } from "react";

export type CardSuit = "Heart" | "Diamond" | "Club" | "Spade";
export type CardValue =
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

export type CardType = {
  suit: CardSuit;
  value: CardValue;
  isDiscovered: boolean;
};

export type CardsInGame = CardType & {
  id: string;
  stackId: number;
  indexInStack: number;
};

export type BoardType = {
  cards: CardsInGame[][];
  draw: CardsInGame[][];
};

export type RandomFunction = () => number;

export type CardKey = `${CardSuit}-${CardValue}`;

export type CardProps = {
  suit: CardSuit;
  value: CardValue;
  isDiscovered: boolean;
  title: string;
  style: CSSProperties;
  activeId: UniqueIdentifier;
};

export type SelectedCard = {
  stackIndex: number;
  cardIndex: number;
};

export type GameAction =
  | { type: "MOVE_CARD"; src: SelectedCard; dest: SelectedCard }
  | { type: "DRAW_FROM_PILE" }
  | { type: "UNDO" }
  | { type: "REDO" };

export type GameState = {
  present: BoardType;
  past: BoardType[];
  future: BoardType[];
  hasWon: boolean;
};

export type BackCardProps = {
  style: CSSProperties;
};

export type FormatType = 1 | 2 | 4;
