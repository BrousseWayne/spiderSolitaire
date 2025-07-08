import { CARD_VALUES } from "./constants";
import type {
  BoardType,
  CardsInGame,
  GameAction,
  GameState,
  SelectedCard,
} from "./types";

function resolveSequencesAndUpdate(state: GameState): GameState {
  const { sequences, updatedTableau, updatedStacks } = getCompletedSequences(
    state.present.cards
  );

  updatedStacks.forEach((stackIndex) => {
    const newTopCardIndex = updatedTableau[stackIndex].length - 1;
    if (newTopCardIndex >= 0) {
      const topCard = updatedTableau[stackIndex][newTopCardIndex];
      if (!topCard.isDiscovered) {
        updatedTableau[stackIndex][newTopCardIndex] = {
          ...topCard,
          isDiscovered: true,
        };
      }
    }
  });

  return {
    ...state,
    present: {
      ...state.present,
      cards: updatedTableau,
    },
  };
}

function isWinConditionMet(cards: CardsInGame[][]): boolean {
  return cards.every((stack) => stack.length === 0);
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "MOVE_CARD": {
      const movedState = moveCards(state, action.src, action.dest);

      const resolvedState = resolveSequencesAndUpdate(movedState);

      return {
        ...resolvedState,
        past: [state.present, ...movedState.past],
        hasWon: isWinConditionMet(resolvedState.present.cards),
      };
    }
    case "DRAW_FROM_PILE": {
      const drawnState = drawFromPile(state);
      const resolvedState = resolveSequencesAndUpdate(drawnState);
      return {
        ...resolvedState,
        hasWon: isWinConditionMet(resolvedState.present.cards),
      };
    }
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
  updatedStacks: number[];
} {
  const sequences: CardsInGame[][] = [];
  const updatedTableau = cards.map((stack) => [...stack]);
  const updatedStacks = [];

  for (let stackIndex = 0; stackIndex < updatedTableau.length; stackIndex++) {
    const stack = updatedTableau[stackIndex];
    if (stack.length < 13) continue;

    const potentialSequence = stack.slice(-13);
    if (isValidSequence(potentialSequence)) {
      console.log("valid sequence", stackIndex);
      updatedStacks.push(stackIndex);
      sequences.push(potentialSequence);
      updatedTableau[stackIndex] = stack.slice(0, -13);
    }
  }

  return { sequences, updatedTableau, updatedStacks };
}

function isValidSequence(cards: CardsInGame[]): boolean {
  const targetSuit = cards[0].suit;
  return cards.every(
    (card, index) =>
      card.suit === targetSuit && CARD_VALUES.get(card.value) === 13 - index
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
  if (!isMoveValid(state.present, src, dest)) return state;

  const newCards = state.present.cards.map((stack) => [...stack]);
  const movingCards = newCards[src.stackIndex].splice(src.cardIndex);

  newCards[dest.stackIndex] = [
    ...newCards[dest.stackIndex],
    ...movingCards,
  ].map((card, i) => ({ ...card, stackId: dest.stackIndex, indexInStack: i }));

  console.log("should be here");
  const sourceStack = newCards[src.stackIndex];
  console.log(sourceStack);
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
  const srcStack = presentState.cards[src.stackIndex];
  const movingCards = srcStack.slice(src.cardIndex);

  const firstSuit = movingCards[0].suit;
  const isSequenceValid = movingCards.every((card, i) => {
    if (i === 0) return true;
    const prevValue = CARD_VALUES.get(movingCards[i - 1].value);
    const currValue = CARD_VALUES.get(card.value);
    return card.suit === firstSuit && currValue === prevValue! - 1;
  });

  if (!isSequenceValid) return false;
  const destStack = presentState.cards[dest.stackIndex];
  if (destStack.length === 0) return true;

  const topDestCard = destStack[destStack.length - 1];
  return (
    CARD_VALUES.get(topDestCard.value)! -
      CARD_VALUES.get(movingCards[0].value)! ===
    1
  );
}
