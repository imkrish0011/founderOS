import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { FloatingTimer } from '@/components/FloatingTimer';
import { useNotifications } from '@/hooks/useNotifications';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function AppLayout() {
  useNotifications();

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden pb-16 md:pb-0 relative">
        {/* Header Placeholder (with sunrise gradient) */}
        <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-border bg-background/50 backdrop-blur z-10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="md:hidden mr-2 flex-shrink-0">
              <img src="/src/assets/logo.png" alt="FounderOS Logo" className="w-6 h-6 object-contain" style={{ mixBlendMode: 'screen' }} />
            </div>
            <h2 className="text-base md:text-lg sunrise-header font-medium truncate">Good Morning, Krish 🌿</h2>
          </div>
          <div className="md:hidden flex-shrink-0 ml-2">
            <ThemeToggle />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          <Outlet />
        </div>
      </main>

      <MobileNav />
      <FloatingTimer />
    </div>
  );
}
