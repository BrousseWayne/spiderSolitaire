import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { GameConfigProvider } from "./gameContext.tsx";

import { useGameConfig } from "./gameContext";
import { useNavigate } from "react-router";
import { Button } from "./components/ui/button.tsx";

function Landing() {
  const { setSuits } = useGameConfig();
  const navigate = useNavigate();

  const startGame = (suits: number) => {
    setSuits(suits);
    navigate("/spidy");
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
    <GameConfigProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/spidy" element={<App />} />
        </Routes>
      </BrowserRouter>
    </GameConfigProvider>
  </StrictMode>
);
