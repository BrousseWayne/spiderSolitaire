import { useRef, useState } from "react";
import "./App.css";
import { Logger } from "./utils";
import { getCardImage } from "./cards";
import Deck from "./deck";
import type { CardProps, Card, CardsInGame } from "./types";
import cardBack from "./assets/cards back/tile016.png";

function Card({ suit, value, title, isCovered, onSelect, style }: CardProps) {
  const frontImage = getCardImage(suit, value);
  const backImage = cardBack;

  function handleClick() {
    if (isCovered) return;
    onSelect();
  }

  return (
    <div
      className={`card ${isCovered ? "isCovered" : ""}`}
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

type SelectedCard = {
  stackIndex: number;
  cardIndex: number;
};

interface BoardProps {
  board: CardsInGame[];
  onMoveCard: (src: number, dest: number) => void;
}

function isCardCovered(card: CardsInGame, board: CardsInGame[]): boolean {
  const stack = board.filter((c) => c.stackId === card.stackId);
  const topCard = stack.reduce(
    (top, current) => (current.indexInStack > top.indexInStack ? current : top),
    stack[0]
  );

  return card.indexInStack !== topCard.indexInStack;
}

function Board({ board, onMoveCard }: BoardProps) {
  const [selectedCard, setSelectedCard] = useState<SelectedCard>();

  const stacks = Array.from({ length: 10 }, (_, i) =>
    board.filter((card) => card.stackId === i)
  );

  function isMoveLegal(selectedCard, destinationCard) {
    return true;
  }

  function moveCard(stackIndex, cardIndex) {
    if (selectedCard) {
      Logger.debug(
        "Try to move card to",
        stackIndex,
        cardIndex,
        "already selected card:",
        selectedCard
      );
      if (isMoveLegal(selectedCard, { stackIndex, cardIndex })) {
        // onMoveCard(selectedCard, { stackIndex, cardIndex });
        setSelectedCard(undefined);
        Logger.debug("clear");
      }
    } else {
      setSelectedCard({ stackIndex, cardIndex });
      Logger.debug("set card");
    }
  }

  return (
    <div className="board">
      {stacks.map((stack, stackIndex) => (
        <div key={stackIndex} className="stack">
          {stack.map((card, cardIndex) => (
            <Card
              key={card.id}
              suit={card.suit}
              value={card.value}
              isCovered={isCardCovered(card, board)}
              onSelect={() => moveCard(stackIndex, cardIndex)}
              style={{
                top: `${card.indexInStack * 30}px`,
                zIndex: card.indexInStack,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

//TODO:fix inconsistent hover on cards
//BUG: stacked cards can be isCovered
//TODO: how to rotate screen for layout
// TODO: create a logging function for debug purposes

function createBoard(deck: Deck): CardsInGame[] {
  const stacks: CardsInGame[][] = Array.from({ length: 10 }, () => []);

  for (let i = 0; i < 40; i++) {
    const card = deck.draw(1)[0];
    const stackId = i % 10;

    Logger.debug(card);

    stacks[stackId].push({
      ...card,
      id: `${card.suit}-${card.value}-${stackId}-${stacks[stackId].length}`,
      stackId,
      indexInStack: stacks[stackId].length,
    });
  }

  for (let i = 0; i < 4; i++) {
    const card = deck.draw(1)[0];
    const stackId = i % 10;

    stacks[stackId].push({
      ...card,
      id: `${card.suit}-${card.value}-${stackId}-${stacks[stackId].length}`,
      stackId,
      indexInStack: stacks[stackId].length,
    });
  }

  for (let i = 0; i < 10; i++) {
    const card = deck.draw(1)[0];
    const stackId = i % 10;

    stacks[stackId].push({
      ...card,
      id: `${card.suit}-${card.value}-${stackId}-${stacks[stackId].length}`,
      stackId,
      indexInStack: stacks[stackId].length,
    });
  }

  Logger.debug(
    stacks.flat().forEach((e) => {
      if (e.stackId === 0) Logger.debug(e);
    })
  );

  return stacks.flat();
}

function App() {
  const deckRef = useRef<Deck>(new Deck());
  const [board, setBoard] = useState<CardsInGame[]>(() => {
    const deck = new Deck(2);
    deckRef.current = deck;
    return createBoard(deck);
  });

  function flipCard(stackIndex: number, cardIndex: number) {
    // setBoard((prevBoard) =>
    // prevBoard.map((stack, si) =>
    //   si === stackIndex
    //     ? stack.map((card, ci) =>
    //         ci === cardIndex ? { ...card, isCovered: !card.isCovered } : card
    //       )
    //     : stack
    // )
    // );
  }

  function onMoveCard(
    selectedCard: SelectedCard,
    destinationCard: SelectedCard
  ) {
    Logger.debug("card was moved");
    const { stackIndex: selectedCardStackIndex, cardIndex: selectedCardIndex } =
      selectedCard;
    const { stackIndex: destCardStackIndex, cardIndex: destCardIndex } =
      destinationCard;

    setBoard((prevBoard) => {});
    // selectedCard, destinationCard;

    return { stackIndex, cardIndex };
  }

  return (
    <div className="container">
      <Board board={board} flipCard={flipCard} onMoveCard={onMoveCard} />
    </div>
  );
}

export default App;
