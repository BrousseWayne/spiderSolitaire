import { CARD_VALUES } from "./constants";
import type { GameAction, GameState, SelectedCard } from "./types";

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "MOVE_CARD":
      return moveCards(state, action.src, action.dest);
    case "DRAW_FROM_PILE":
      return drawFromPile(state);
    default:
      return state;
  }
}

function moveCards(
  state: GameState,
  src: SelectedCard,
  dest: SelectedCard
): GameState {
  if (!isMoveValid(state, src, dest)) return state;

  const newCards = state.cards.map((stack) => [...stack]);
  const movingCards = newCards[src.stackIndex].splice(src.cardIndex);

  const destStackLength = newCards[dest.stackIndex].length;
  const updatedMovingCards = movingCards.map((card, i) => ({
    ...card,
    stackId: dest.stackIndex,
    indexInStack: destStackLength + i,
  }));

  newCards[dest.stackIndex].push(...updatedMovingCards);

  const sourceStack = newCards[src.stackIndex];
  if (sourceStack.length > 0) {
    const lastIndex = sourceStack.length - 1;
    sourceStack[lastIndex] = { ...sourceStack[lastIndex], isDiscovered: true };
  }

  return { ...state, cards: newCards };
}

function drawFromPile(state: GameState): GameState {
  if (state.draw.length === 0) return state;

  const newDraw = [...state.draw];
  const newCards = state.cards.map((stack) => [...stack]);
  const drawnCards = newDraw.pop()!;

  drawnCards.forEach((card, index) => {
    newCards[index].push({
      ...card,
      isDiscovered: true,
      indexInStack: newCards[index].length,
    });
  });

  return { cards: newCards, draw: newDraw };
}

function isMoveValid(
  state: GameState,
  src: SelectedCard,
  dest: SelectedCard
): boolean {
  const srcStack = state.cards[src.stackIndex];
  const movingCards = srcStack.slice(src.cardIndex);

  const firstSuit = movingCards[0].suit;
  const isSequenceValid = movingCards.every((card, i) => {
    if (i === 0) return true;
    const prevValue = CARD_VALUES.get(movingCards[i - 1].value);
    const currValue = CARD_VALUES.get(card.value);
    return card.suit === firstSuit && currValue === prevValue! - 1;
  });

  if (!isSequenceValid) return false;

  const destStack = state.cards[dest.stackIndex];
  if (destStack.length === 0) return true;

  const topDestCard = destStack[destStack.length - 1];
  return (
    CARD_VALUES.get(topDestCard.value)! -
      CARD_VALUES.get(movingCards[0].value)! ===
    1
  );
}
