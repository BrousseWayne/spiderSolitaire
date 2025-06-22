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
  activeId,
  style,
}: CardProps) {
  const frontImage = getCardImage(suit, value);
  const backImage = cardBack;

  const isActive = title === activeId;

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: title,
    disabled: !isDiscovered,
  });

  const draggableStyle: CSSProperties = {
    position: "absolute",
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: isActive ? 999 : style.zIndex,
    ...style,
  };

  return (
    <div
      ref={setNodeRef}
      className={`card ${isDiscovered ? "" : "isNotDiscovered"}`}
      title={title}
      style={draggableStyle}
      {...(isDiscovered ? listeners : {})}
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

export function BackCard({ onClick, style }) {
  const backImage = cardBack;

  return (
    <div className={`card `} onClick={onClick} style={style}>
      <div className="card-inner">
        <div className="card-face card-front">
          <img src={backImage} />
        </div>
        <div className="card-face card-back">
          <img src={backImage} />
        </div>
      </div>
    </div>
  );
}
