import {
  createContext,
  useEffect,
  useState,
  useContext,
  type ReactNode,
} from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  //TODO: add the user
  console.log("Enter the context");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch("http://localhost:3000/verify-token", {
          credentials: "include",
        });
        console.log("server answer", res.ok);
        setIsAuthenticated(res.ok);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within AuthContextProvider");
  return context;
}
