import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "./authContext";

export default function SecureRoutes() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log(loading, isAuthenticated);
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading || !isAuthenticated) return null;

  console.log("return outlet");
  return <Outlet />;
}
