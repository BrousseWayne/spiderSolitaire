import type { CardKey, CardSuit, CardValue } from "./types";

const cardImages: Record<string, string> = import.meta.glob(
  "./assets/high contrast cards/*.png",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

const cardsMap = new Map<CardKey, string>();

for (const path in cardImages) {
  const fileName = path.split("/").pop();
  if (!fileName) continue;

  const [suit, valueWithExt] = fileName.split("-");
  const value = valueWithExt.replace(".png", "");

  const validSuits: CardSuit[] = ["Heart", "Diamond", "Club", "Spade"];
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

export function getCardImage(
  suit: CardSuit,
  value: CardValue
): string | undefined {
  return cardsMap.get(`${suit}-${value}`);
}
