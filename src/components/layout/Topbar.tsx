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
import { useProfile } from '@/hooks/useProfile';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TopbarProps {
  children?: React.ReactNode;
    onToggleSidebar?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ children, onToggleSidebar }) => {
  const isMobile = useIsMobile();
  const { logout } = useAuth();
  const { profile } = useProfile();

  const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    return names.map((n) => n[0]).join('');
  };
  
  return (
    <header className="h-16 border-b border-slate-200 bg-white px-4 md:px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        {isMobile && onToggleSidebar &&(
          <Button variant="ghost" size="icon" className="mr-2" onClick={onToggleSidebar} name="menu">
            <Menu className="w-5 h-5" />
          </Button>
        )}
        {children}
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        {!isMobile && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="default" size="icon" asChild>
                  <Link to="/missions/create">
                    <Plus size={16} />
                    <span className="sr-only">Nouvelle Mission</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Créer une nouvelle mission</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full" size="icon">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt="Utilisateur" />
                <AvatarFallback className="bg-leadryve-purple text-white">
                  {profile ? getInitials(profile.name) : '...'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{profile?.name}</p>
                <p className="text-xs text-slate-500">{profile?.company_email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile-update">Profil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/settings">Paramètres du compte</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
