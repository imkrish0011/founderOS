import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden pb-16 md:pb-0">
        {/* Header Placeholder (with sunrise gradient) */}
        <header className="h-16 flex items-center px-6 border-b border-border bg-background/50 backdrop-blur z-10 shrink-0">
          <div className="flex items-center gap-2 md:hidden mr-4">
            <img src="/src/assets/logo.png" alt="FounderOS Logo" className="w-6 h-6 object-contain" />
          </div>
          <h2 className="text-lg sunrise-header font-medium">Good Morning, Krish 🌿</h2>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          <Outlet />
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
