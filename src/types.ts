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

export type Card = {
  suit: CardSuit;
  value: CardValue;
  flip: () => void;
};

export type RandomFunction = () => number;

export type CardKey = `${CardSuit}-${CardValue}`;

export type CardProps = {
  suit: CardSuit;
  value: CardValue;
};
