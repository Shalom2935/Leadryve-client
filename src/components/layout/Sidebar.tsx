import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Target, 
  Settings, 
  Menu, 
  X,
  LogOut,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';

export const Sidebar: React.FC<{ onCollapse?: (collapsed: boolean) => void }> = ({ onCollapse }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { logout } = useAuth();

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      onCollapse && onCollapse(!prev);
      return !prev;
    });
  };

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) => {
    const isActive = location.pathname === to;
    
    return (
      <Link 
        to={to} 
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
          isActive 
            ? "bg-leadryve-purple text-white" 
            : "text-slate-600 hover:bg-leadryve-light-purple hover:text-leadryve-purple"
        )}
      >
        <Icon size={20} />
        {!collapsed && <span>{label}</span>}
      </Link>
    );
  };

  const sidebarWidth = isMobile 
    ? "w-[250px] max-w-[80vw]" // Ajout max-w pour mobile
    : (collapsed ? "w-[70px]" : "w-[250px]");

  return (
    <aside 
      className={cn(
        "bg-white border-r border-slate-200 transition-all duration-300 flex flex-col h-screen overflow-y-auto", // Ajout overflow-y-auto
        sidebarWidth
      )}
    >
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        {(!collapsed || isMobile) && (
          <Link to="/" className="flex items-center gap-2">
            <img src="/Logo.svg" alt="Leadryve Logo" className="h-8 w-auto" />
          </Link>
        )}
        {collapsed && !isMobile && (
          <Link to="/" className="flex items-center justify-center w-full">
            <img src="/favicon.png" alt="Leadryve Icon" className="h-8 w-8" />
          </Link>
        )}
        {!isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="text-slate-500"
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </Button>
        )}
      </div>

      <div className="flex-1 px-3 py-6 flex flex-col gap-2 overflow-y-auto">
        <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
        <NavItem to="/missions" icon={Target} label="Missions" />
        <NavItem to="/settings" icon={Settings} label="Paramètres" />
        
        {isMobile && (
          <Link 
            to="/missions/create"
            className="mt-4 flex items-center gap-2 bg-leadryve-purple text-white px-3 py-2 rounded-lg text-sm font-medium"
          >
            <Plus size={18} />
            <span>Nouvelle Mission</span>
          </Link>
        )}
      </div>

      <div className="border-t border-slate-200 p-4">
        <Button 
          variant="ghost" 
          size={collapsed && !isMobile ? "icon" : "sm"} 
          className="text-slate-600 w-full"
          onClick={logout}
        >
          <LogOut size={16} />
          {(!collapsed || isMobile) && <span className="ml-2">Se déconnecter</span>}
        </Button>
      </div>
    </aside>
  );
};