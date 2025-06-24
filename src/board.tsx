import { useDroppable, type UniqueIdentifier } from "@dnd-kit/core";
import Card, { BackCard } from "./card";
import type { CardsInGame } from "./types";

interface StackProps {
  stack: CardsInGame[];
  stackIndex: number;
  activeId: UniqueIdentifier;
}

export function Stack({ stack, stackIndex, activeId }: StackProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `stack-${stackIndex}`,
  });

  return (
    <div ref={setNodeRef} className="stack">
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
  );
}

export function Foundation({ id }) {
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
