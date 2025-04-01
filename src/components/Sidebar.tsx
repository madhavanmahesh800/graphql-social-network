
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, PlusCircle, User, Users, Compass } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActiveRoute = (route: string) => {
    return location.pathname === route || 
      (route !== '/feed' && location.pathname.startsWith(route));
  };

  const navItems = [
    {
      name: "Feed",
      href: "/feed",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Explore",
      href: "/explore",
      icon: <Compass className="h-5 w-5" />,
    },
    {
      name: "Create Post",
      href: "/create-post",
      icon: <PlusCircle className="h-5 w-5" />,
    },
    {
      name: "Profile",
      href: `/profile/${user?.username}`,
      icon: <User className="h-5 w-5" />,
    },
  ];

  return (
    <aside className="hidden md:flex flex-col gap-6 border-r p-6 w-64 min-h-[calc(100vh-4rem)]">
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant={isActiveRoute(item.href) ? "default" : "ghost"}
            asChild
            className={cn(
              "justify-start gap-2",
              isActiveRoute(item.href) && "bg-primary text-primary-foreground"
            )}
          >
            <Link to={item.href}>
              {item.icon}
              {item.name}
            </Link>
          </Button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
