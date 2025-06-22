import { useDroppable } from "@dnd-kit/core";
import Card, { BackCard } from "./card";
import type { CardsInGame } from "./types";

interface StackProps {
  stack: CardsInGame[];
  stackIndex: number;
}
export function Stack({ stack, stackIndex }: StackProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `stack-${stackIndex}`,
  });

  return (
    <div
      ref={setNodeRef}
      className="stack"
      style={{
        position: "relative",
        minHeight: "150px",
        border: isOver ? "2px dashed green" : "1px solid transparent",
        borderRadius: "8px",
        padding: "4px",
      }}
    >
      {stack.map((card) => (
        <Card
          key={card.id}
          title={`${card.suit}-${card.value}-${stackIndex}-${card.indexInStack}`}
          suit={card.suit}
          value={card.value}
          isDiscovered={card.isDiscovered}
          style={{
            top: `${card.indexInStack * 30}px`,
            zIndex: card.indexInStack,
          }}
        />
      ))}
    </div>
  );
}

interface BoardProps {
  board: CardsInGame[][];
  activeId: string;
}

interface DrawPileProps {
  draw: CardsInGame[][];
}

export function Board({ board }: BoardProps) {
  return (
    <div className="board">
      {board.map((stack, stackIndex) => (
        <Stack key={stackIndex} stack={stack} stackIndex={stackIndex} />
      ))}
    </div>
  );
}

export function Draw({ draw }: DrawPileProps) {
  return (
    <div className="draw">
      {draw.map((stack, stackIndex) => (
        <BackCard
          style={{ left: `${stackIndex * 30}px` }}
          onClick={() => console.log("clicked")}
          key={stackIndex}
        />
      ))}
    </div>
  );
}
