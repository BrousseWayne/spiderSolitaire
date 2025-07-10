import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { GameConfigProvider } from "./gameContext.tsx";

import { useGameConfig } from "./gameContext";
import { useNavigate } from "react-router";
import { Button } from "./components/ui/button.tsx";
import { GameStateProvider } from "./gameStateContext.tsx";

function Landing() {
  const navigate = useNavigate();

  const startGame = (suits) => {
    navigate("/spidy", { state: { suits } });
  };

  return (
    <div className="flex items-center justify-center h-screen gap-5">
      <Button variant={"outline"} onClick={() => startGame(1)}>
        1 Suit
      </Button>
      <Button variant={"outline"} onClick={() => startGame(2)}>
        2 Suits
      </Button>
      <Button variant={"outline"} onClick={() => startGame(4)}>
        4 Suits
      </Button>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <GameConfigProvider>
        <GameStateProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/spidy" element={<App />} />
          </Routes>
        </GameStateProvider>
      </GameConfigProvider>
    </BrowserRouter>
  </StrictMode>
);
