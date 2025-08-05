interface LogoutProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
}

export function Logout({ isAuthenticated, setIsAuthenticated }: LogoutProps) {
  const onClick = async () => {
    const res = await fetch("http://localhost:3000/logout", {
      method: "POST",
      credentials: "include",
    });
    if (res.ok) {
      setIsAuthenticated(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer w-full text-left px-2 py-1.5 rounded-sm text-sm hover:bg-muted transition-colors"
    >
      Logout
    </div>
  );
}
