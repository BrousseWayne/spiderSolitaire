import {
  useDraggable,
  useDroppable,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import Card, { BackCard } from "./card";
import type { BoardType, CardsInGame, CardType } from "./types";
import type Deck from "./deck";
import type { CSSProperties } from "react";

interface StackProps {
  stackArra: number;
  stack: CardsInGame[];
  stackIndex: number;
  activeId: UniqueIdentifier;
}

interface FoundationProps {
  id: number;
}

export function createBoard(deck: Deck): BoardType {
  const stacks: CardsInGame[][] = Array.from({ length: 10 }, () => []);
  const draw: CardsInGame[][] = Array.from({ length: 5 }, () => []);

  const assignedId = new Map<string, number>();

  function createIdString(card: CardType) {
    return `${card.suit}-${card.value}`;
  }

  function assignId(card: CardType) {
    const partialId = createIdString(card);
    if (assignedId.get(partialId)! >= 0) {
      const curr = assignedId.get(partialId)! + 1;
      assignedId.set(partialId, curr);
      return `${partialId}-${curr}`;
    } else {
      assignedId.set(partialId, 0);
      return `${partialId}-0`;
    }
  }

  function drawCards(
    cardsToDraw: number,
    storage: CardsInGame[][],
    isDiscovered: boolean,
    stacks: number
  ) {
    for (let i = 0; i < cardsToDraw; i++) {
      const card = deck.draw(1)[0];
      const stackId = i % stacks;

      storage[stackId].push({
        ...card,
        id: assignId(card),
        stackId,
        indexInStack: storage[stackId].length,
        isDiscovered,
      });
    }
  }

  drawCards(40, stacks, false, 10);
  drawCards(4, stacks, false, 10);
  drawCards(10, stacks, true, 10);
  drawCards(deck.cards.length, draw, false, 5);

  return { cards: stacks, draw: draw };
}

export function Stack({ stack, stackIndex, activeId, stackArea }: StackProps) {
  const { setNodeRef } = useDroppable({
    id: `stackArea-${stackArea}`,
  });

  const {
    attributes,
    listeners,
    setNodeRef: test,
    transform,
  } = useDraggable({
    id: `stack-${stackIndex}`,
  });

  const draggableStyle: CSSProperties = {
    position: "absolute",
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: "auto",
  };

  return (
    <div ref={setNodeRef} className="stack-area">
      <div
        ref={test}
        className="stack"
        style={draggableStyle}
        {...listeners}
        {...attributes}
      >
        {stack.map((card) => (
          <Card
            key={card.id}
            title={`${card.suit}-${card.value}-${stackIndex}-${card.indexInStack}`}
            suit={card.suit}
            value={card.value}
            activeId={activeId}
            isDiscovered={card.isDiscovered}
            style={{
              top: `${card.indexInStack * 30}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function Foundation({ id }: FoundationProps) {
  return (
    <div className="emptyStack">
      <div className="card-inner card-empty" key={id}>
        {id}
      </div>
    </div>
  );
}

interface BoardProps {
  board: CardsInGame[][];
  activeId: UniqueIdentifier;
}

interface DrawPileProps {
  draw: CardsInGame[][];
  onClick: () => void;
}

export function Board({ board, activeId }: BoardProps) {
  return (
    <div className="board">
      {board.map((stack, stackIndex) => (
        <Stack
          stackArea={stackIndex}
          key={stackIndex}
          stack={stack}
          stackIndex={stackIndex}
          activeId={activeId}
        />
      ))}
    </div>
  );
}

export function Draw({ draw, onClick }: DrawPileProps) {
  return (
    <div className="draw" onClick={onClick}>
      {draw.map((stack, stackIndex) => (
        <BackCard style={{ left: `${stackIndex * 20}px` }} key={stackIndex} />
      ))}
    </div>
  );
}

//TODO: duplicate state undo/redo
