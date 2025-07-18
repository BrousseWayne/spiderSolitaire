import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { GameConfigProvider } from "./gameContext.tsx";

// import { useGameConfig } from "./gameContext";
import { GameStateProvider } from "./gameStateContext.tsx";
import { LoginCard } from "./loginCard.tsx";
import { RegisterCard } from "./registerCard.tsx";
import { Profile } from "./profile.tsx";
import { SecureRoutes } from "./secureRoutes.tsx";
import ForgotPasswordCard from "./forgotPasswordCard.tsx";
import { PasswordResetCard } from "./passwordResetCard.tsx";

// function Landing() {
//   const navigate = useNavigate();

//   const startGame = (suits) => {
//     navigate("/spidy", { state: { suits } });
//   };

//   return (
//     <div className="flex items-center justify-center h-screen gap-5">
//       <Button variant={"outline"} onClick={() => startGame(1)}>
//         1 Suit
//       </Button>
//       <Button variant={"outline"} onClick={() => startGame(2)}>
//         2 Suits
//       </Button>
//       <Button variant={"outline"} onClick={() => startGame(4)}>
//         4 Suits
//       </Button>
//     </div>
//   );
// }

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <GameConfigProvider>
        <GameStateProvider>
          <Routes>
            <Route element={<SecureRoutes />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/login" element={<LoginCard />} />
            <Route path="/register" element={<RegisterCard />} />
            <Route path="/spidy" element={<App />} />
            <Route path="/forgot-password" element={<ForgotPasswordCard />} />
            <Route path="/password-reset" element={<PasswordResetCard />} />
          </Routes>
        </GameStateProvider>
      </GameConfigProvider>
    </BrowserRouter>
  </StrictMode>
);

//TODO: A context for the AUTH, add a logout button create a global layout with the logout button active if user is logged
//TODO: Invalidate token and delog user
//TODO: Create your account ugly spacing
//TODO: redirect user after auth operation
