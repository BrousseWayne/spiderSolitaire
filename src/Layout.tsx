// Layout.tsx
import { Outlet } from "react-router";
import { useAuth } from "./authContext";
import { UserPopoverMenu } from "./userPopoverMenu";

export function Layout() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  return (
    <div className="app-layout">
      <UserPopoverMenu
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
