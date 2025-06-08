import type { CardKey, CardSuit, CardValue } from "./types";

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
