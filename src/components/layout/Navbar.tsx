
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ChartLine,
  Home,
  LogIn,
  User,
  Wallet,
} from "lucide-react";

const Navbar = () => {
  // This would be replaced with actual auth state later
  const isLoggedIn = false;

  return (
    <header className="sticky top-0 z-50 border-b border-border/20 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-lg font-semibold tracking-tight">
              Quantica Capital
            </span>
          </Link>
          {isLoggedIn && (
            <nav className="hidden md:flex gap-6">
              <Link
                to="/dashboard"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                to="/trading"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Trading
              </Link>
              <Link
                to="/portfolio"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Portfolio
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Wallet className="h-4 w-4" />
              </Button>
              <Link to="/profile">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
