import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";

export function SecureRoutes() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:3000/verify-token", {
          credentials: "include",
        });
        setAuthenticated(res.ok);
      } catch {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!loading && !authenticated) {
      navigate("/login");
    }
  }, [loading, authenticated, navigate]);

  if (loading || !authenticated) return null;

  return <Outlet />;
}

//TODO: spinner for the loading ?
//TODO: Flash when navigating ??
