import { getCardImage } from "./cards";
import cardBack from "./assets/cards back/tile023.png";
import "./App.css";

import type { CardProps } from "./types";
import { useDraggable } from "@dnd-kit/core";
import type { CSSProperties } from "react";

export default function Card({
  suit,
  value,
  title,
  isDiscovered,
  onSelect,
  style,
}: CardProps) {
  const frontImage = getCardImage(suit, value);
  const backImage = cardBack;

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: title, // unique id for this card
  });

  function handleClick() {
    if (!isDiscovered) return;
    onSelect();
  }

  const draggableStyle: CSSProperties = {
    position: "absolute",
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    ...style, // merge additional styles passed as props
  };

  return (
    <div
      ref={setNodeRef}
      className={`card ${isDiscovered ? "" : "isNotDiscovered"}`}
      onClick={handleClick}
      title={title}
      style={draggableStyle}
      {...listeners}
      {...attributes}
    >
      <div className="card-inner">
        <div className="card-face card-front">
          <img src={frontImage} />
        </div>
        <div className="card-face card-back">
          <img src={backImage} />
        </div>
      </div>
    </div>
  );
}
