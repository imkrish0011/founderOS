import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { FloatingTimer } from '@/components/FloatingTimer';
import { useNotifications } from '@/hooks/useNotifications';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function AppLayout() {
  useNotifications();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning, Krish 🌿";
    if (hour < 18) return "Good Afternoon, Krish 🌿";
    return "Good Evening, Krish 🌙";
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden pb-16 md:pb-0 relative">
        {/* Header */}
        <header className="h-14 md:h-16 flex items-center justify-between px-3 md:px-6 border-b border-border bg-background/50 backdrop-blur z-10 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="md:hidden mr-1 flex-shrink-0">
              <img src="/src/assets/logo.png" alt="FounderOS Logo" className="w-6 h-6 object-contain" style={{ mixBlendMode: 'screen' }} />
            </div>
            <h2 className="text-sm md:text-lg sunrise-header font-medium truncate">{getGreeting()}</h2>
          </div>
          <div className="md:hidden flex-shrink-0 ml-2">
            <ThemeToggle />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-3 md:p-8 lg:p-12">
          <Outlet />
        </div>
      </main>

      <MobileNav />
      <FloatingTimer />
    </div>
  );
}
