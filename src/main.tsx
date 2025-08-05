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
import ForgotPasswordCard from "./forgotPasswordCard.tsx";
import { PasswordResetCard } from "./passwordResetCard.tsx";
import { VerifyEmail } from "./verifyEmail.tsx";
import { AuthContextProvider } from "./authContext.tsx";
import SecureRoutes from "./secureRoutes.tsx";
import { Layout } from "./Layout.tsx";

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

//TODO: Redirect the user to the game sometimes perhaps
//TODO: the redirect to the profile page should be only once (the user first login)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <GameConfigProvider>
          <GameStateProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route element={<SecureRoutes />}>
                  <Route path="/profile" element={<Profile />} />
                </Route>
                <Route path="/login" element={<LoginCard />} />
                <Route path="/register" element={<RegisterCard />} />
                <Route path="/spidy" element={<App />} />
                <Route
                  path="/forgot-password"
                  element={<ForgotPasswordCard />}
                />
                <Route path="/password-reset" element={<PasswordResetCard />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
              </Route>
            </Routes>
          </GameStateProvider>
        </GameConfigProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
);

//TODO: A context for the AUTH, add a logout button create a global layout with the logout button active if user is logged
//TODO: Invalidate token and delog user
