
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex relative">
      {/* Sidebar - fixed position on all devices */}
      <div 
        className={`${isMobile ? 'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out' : 'fixed inset-y-0 left-0 z-30'} ${
          isMobile && !showMobileSidebar ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {isMobile && showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileSidebar}
        />
      )}
      
      <div className={`flex-1 flex flex-col ${!isMobile ? 'ml-[250px]' : ''}`}>
        <Topbar>
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileSidebar} 
              className="mr-2"
            >
              <Menu size={24} />
            </Button>
          )}
        </Topbar>
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};
