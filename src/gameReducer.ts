import { CARD_VALUES } from "./constants";
import type {
  BoardType,
  CardsInGame,
  GameAction,
  GameState,
  SelectedCard,
} from "./types";

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "MOVE_CARD": {
      console.log("enter move");
      const movedState = moveCards(state, action.src, action.dest);

      const { sequences, updatedTableau } = getCompletedSequences(
        movedState.present.cards
      );

      return {
        ...movedState,
        present: {
          ...movedState.present,
          cards: updatedTableau,
        },
        past: [state.present, ...movedState.past],
      };
    }
    case "DRAW_FROM_PILE":
      return drawFromPile(state);
    case "UNDO":
      return undo(state);
    case "REDO":
      return redo(state);
    default:
      return state;
  }
}

function getCompletedSequences(cards: CardsInGame[][]): {
  sequences: CardsInGame[][];
  updatedTableau: CardsInGame[][];
} {
  const sequences: CardsInGame[][] = [];
  const updatedTableau = cards.map((stack) => [...stack]);

  for (let stackIndex = 0; stackIndex < updatedTableau.length; stackIndex++) {
    const stack = updatedTableau[stackIndex];
    if (stack.length < 13) continue; // Not enough cards for K→A

    // Check if last 13 cards form a valid sequence
    const potentialSequence = stack.slice(-13);
    if (isValidSequence(potentialSequence)) {
      sequences.push(potentialSequence);
      updatedTableau[stackIndex] = stack.slice(0, -13); // Remove sequence
    }
  }

  return { sequences, updatedTableau };
}

function isValidSequence(cards: CardsInGame[]): boolean {
  const targetSuit = cards[0].suit;
  return cards.every(
    (card, index) =>
      card.suit === targetSuit && CARD_VALUES.get(card.value) === 13 - index // K=13, Q=12,...,A=1
  );
}
function undo(state: GameState) {
  if (state.past.length === 0) return state;

  const [previousState, ...remainingPast] = state.past;
  return {
    ...state,
    past: remainingPast,
    future: [state.present, ...state.future],
    present: previousState,
  };
}

function redo(state: GameState) {
  if (state.future.length === 0) return state;

  const [nextState, ...remainingFuture] = state.future;
  return {
    ...state,
    past: [state.present, ...state.past],
    future: remainingFuture,
    present: nextState,
  };
}

function moveCards(
  state: GameState,
  src: SelectedCard,
  dest: SelectedCard
): GameState {
  console.log("b4 check isMovevalid");
  if (!isMoveValid(state.present, src, dest)) return state;

  const newCards = state.present.cards.map((stack) => [...stack]);
  const movingCards = newCards[src.stackIndex].splice(src.cardIndex);

  newCards[dest.stackIndex] = [
    ...newCards[dest.stackIndex],
    ...movingCards,
  ].map((card, i) => ({ ...card, stackId: dest.stackIndex, indexInStack: i }));

  const sourceStack = newCards[src.stackIndex];
  if (sourceStack.length > 0) {
    const lastIndex = sourceStack.length - 1;
    sourceStack[lastIndex] = { ...sourceStack[lastIndex], isDiscovered: true };
  }

  return {
    ...state,
    present: { ...state.present, cards: newCards },
    past: [state.present, ...state.past],
    future: [],
  };
}

function drawFromPile(state: GameState): GameState {
  if (state.present.draw.length === 0) return state;

  const newDraw = [...state.present.draw];
  const newCards = state.present.cards.map((stack) => [...stack]);
  const drawnCards = newDraw.pop()!;

  drawnCards.forEach((card, index) => {
    newCards[index].push({
      ...card,
      isDiscovered: true,
      indexInStack: newCards[index].length,
    });
  });

  return {
    ...state,
    present: { ...state.present, cards: newCards, draw: newDraw },
    past: [state.present, ...state.past],
    future: [],
  };
}

function isMoveValid(
  presentState: BoardType,
  src: SelectedCard,
  dest: SelectedCard
): boolean {
  console.log("=== isMoveValid START ===");
  console.log("Source card:", src);
  console.log("Destination card:", dest);
  const srcStack = presentState.cards[src.stackIndex];
  const movingCards = srcStack.slice(src.cardIndex);

  const firstSuit = movingCards[0].suit;
  const isSequenceValid = movingCards.every((card, i) => {
    if (i === 0) return true;
    const prevValue = CARD_VALUES.get(movingCards[i - 1].value);
    const currValue = CARD_VALUES.get(card.value);
    return card.suit === firstSuit && currValue === prevValue! - 1;
  });

  console.log("b4 valid check");
  if (!isSequenceValid) return false;
  console.log("valid");
  const destStack = presentState.cards[dest.stackIndex];
  if (destStack.length === 0) return true;

  const topDestCard = destStack[destStack.length - 1];
  return (
    CARD_VALUES.get(topDestCard.value)! -
      CARD_VALUES.get(movingCards[0].value)! ===
    1
  );
}
