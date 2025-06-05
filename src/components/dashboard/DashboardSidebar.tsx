
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  ChartLine, 
  Briefcase, 
  Wallet, 
  User, 
  Settings, 
  ArrowLeft, 
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const DashboardSidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation();
  
  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 w-64 bg-card z-30 border-r border-border/50 pt-16 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16"
        )}
      >
       

        <div className="px-3 py-2">
          {isOpen && (
            <div className="flex items-center justify-center mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="font-bold text-primary text-xl">Q</span>
              </div>
              <span className="ml-2 font-medium text-lg">Quantica</span>
            </div>
          )}
          
          <nav className="space-y-1">
            {/* <SidebarItem to="/dashboard" icon={<LayoutDashboard />} text="Dashboard" isOpen={isOpen} isActive={location.pathname === "/dashboard"} /> */}
            {/* <SidebarItem to="/trading" icon={<ChartLine />} text="Trading" isOpen={isOpen} isActive={location.pathname === "/trading"} /> */}
            {/* <SidebarItem to="/portfolio" icon={<Briefcase />} text="Portfolio" isOpen={isOpen} isActive={location.pathname === "/portfolio"} /> */}
            {/* <SidebarItem to="/wallet" icon={<Wallet />} text="Wallet" isOpen={isOpen} isActive={location.pathname === "/wallet"} />           */}
            <SidebarItem to="/profile" icon={<User />} text="Profile" isOpen={isOpen} isActive={location.pathname === "/profile"} />
            {/* <SidebarItem to="/settings" icon={<Settings />} text="Settings" isOpen={isOpen} isActive={location.pathname === "/settings"} /> */}
          </nav>
          
          {/* {isOpen && (
            <div className="absolute bottom-4 left-0 right-0 px-3">
              <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
                <p className="text-xs text-center text-muted-foreground">
                  Quantica Stock Opening Account 
                </p>
              </div>
            </div>
          )} */}
        </div>
      </aside>

      {/* Toggle button for sidebar on mobile */}
      <Button 
        variant="outline" 
        size="icon" 
        className="fixed bottom-4 right-4 z-10 md:hidden shadow-lg" 
        onClick={() => setIsOpen(true)}
      >
        <LayoutDashboard className="h-4 w-4" />
      </Button>
    </>
  );
};

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  isOpen: boolean;
  isActive: boolean;
}

const SidebarItem = ({ to, icon, text, isOpen, isActive }: SidebarItemProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all",
        isActive 
          ? "bg-primary/20 text-primary" 
          : "hover:bg-primary/10 text-foreground",
        !isOpen && "justify-center md:px-0"
      )}
    >
      <span className={isActive ? "text-primary" : ""}>{icon}</span>
      {isOpen && <span>{text}</span>}
    </Link>
  );
};

export default DashboardSidebar;
