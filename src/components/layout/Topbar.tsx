import React from 'react';
import { Bell, Plus, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';

interface TopbarProps {
  children?: React.ReactNode;
    onToggleSidebar?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ children, onToggleSidebar }) => {
  const isMobile = useIsMobile();
  const { logout } = useAuth();
  
  return (
    <header className="h-16 border-b border-slate-200 bg-white px-4 md:px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        {isMobile && onToggleSidebar &&(
          <Button variant="ghost" size="icon" className="mr-2" onClick={onToggleSidebar} name="menu">
            <Menu className="w-5 h-5" />
          </Button>
        )}
        {children}
        
        {/* <div className={`relative ${isMobile ? 'w-full max-w-[180px]' : 'w-full max-w-md'}`}>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-8 bg-slate-50 border-slate-200"
          />
        </div> */}
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        {!isMobile && (
          <Button variant="default" size="sm" asChild>
            <Link to="/missions/create">
              <Plus size={16} className="mr-1" />
              New Mission
            </Link>
          </Button>
        )}
        
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[280px] md:w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer">
              <p className="font-medium">Mission "Tech SaaS in California" completed</p>
              <p className="text-xs text-slate-500">2 minutes ago</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer">
              <p className="font-medium">New leads available in "UK Startups"</p>
              <p className="text-xs text-slate-500">3 hours ago</p>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-leadryve-purple cursor-pointer">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full" size="icon">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="bg-leadryve-purple text-white">JS</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">John Smith</p>
                <p className="text-xs text-slate-500">john@example.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              Account settings
            </DropdownMenuItem>
            {/* <DropdownMenuItem>
              Billing
            </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};