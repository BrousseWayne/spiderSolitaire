import { getCardImage } from "./cards";
import cardBack from "./assets/cards back/tile023.png";
import "./App.css";

import type { CardProps } from "./types";

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

  function handleClick() {
    if (!isDiscovered) return;
    onSelect();
  }

  return (
    <div
      className={`card ${isDiscovered ? "" : "isNotDiscovered"}`}
      onClick={handleClick}
      title={title}
      style={{ position: "absolute", ...style }}
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
