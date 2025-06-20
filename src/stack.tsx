import { useDroppable } from "@dnd-kit/core";
import Card from "./card";
import type { CardsInGame } from "./types";

interface StackProps {
  stack: CardsInGame[];
  stackIndex: number;
  moveCard: (stackIndex: number, cardIndex: number) => void;
}

export function Stack({ stack, stackIndex, moveCard }: StackProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `stack-${stackIndex}`,
  });

  return (
    <div
      ref={setNodeRef}
      className="stack"
      style={{
        border: isOver ? "2px dashed green" : "1px solid transparent",
        borderRadius: "8px",
        padding: "4px",
        zIndex: isOver ? "999" : "1",
      }}
    >
      {stack.map((card, cardIndex) => (
        <Card
          key={card.id}
          title={card.id}
          suit={card.suit}
          value={card.value}
          isDiscovered={card.isDiscovered}
          onSelect={() => moveCard(stackIndex, cardIndex)}
          style={{
            top: `${card.indexInStack * 30}px`,
            zIndex: card.indexInStack,
          }}
        />
      ))}
    </div>
  );
}
