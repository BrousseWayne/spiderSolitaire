// ProfileButton.tsx
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link } from "react-router";
import { Logout } from "./logout";

interface ProfileButtonProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
}

export function UserPopoverMenu({
  isAuthenticated,
  setIsAuthenticated,
}: ProfileButtonProps) {
  if (!isAuthenticated) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-2 space-y-1">
        <Link to="/profile">
          <div className="cursor-pointer w-full text-left px-2 py-1.5 rounded-sm text-sm hover:bg-muted transition-colors">
            Profile
          </div>
        </Link>
        <Logout
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
      </PopoverContent>
    </Popover>
  );
}
