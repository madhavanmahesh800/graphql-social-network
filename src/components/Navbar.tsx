
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleUser, LogOut, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Link to="/feed" className="flex items-center text-xl font-bold tracking-tight">
            <span className="text-primary">GraphQL</span>Social
          </Link>
          <div className="hidden md:flex items-center rounded-md border">
            <Search className="mx-2 h-4 w-4 shrink-0 opacity-50" />
            <Input className="h-9 w-[200px] lg:w-[300px] border-none bg-transparent focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent" placeholder="Search..." />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon">
              <Link to={`/profile/${user?.username}`}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={user?.username || ""} />
                  <AvatarFallback>
                    <CircleUser className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
