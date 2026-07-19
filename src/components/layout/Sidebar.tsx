import { NavLink } from 'react-router-dom';
import { LayoutDashboard, KanbanSquare, GraduationCap, Library, BookOpen, LineChart, Target, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { ThemeToggle } from '@/components/ThemeToggle';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'ArchViz', path: '/archviz', icon: KanbanSquare },
  { name: 'Learning', path: '/learning', icon: GraduationCap },
  { name: 'Library', path: '/library', icon: Library },
  { name: 'Journal', path: '/journal', icon: BookOpen },
  { name: 'Progress', path: '/progress', icon: LineChart },
  { name: 'Focus', path: '/focus', icon: Target },
];

export function Sidebar() {
  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <aside className="w-64 border-r border-border hidden md:flex flex-col bg-background/50 backdrop-blur">
      <div className="h-16 flex items-center justify-between px-6 border-b border-border">
        <div className="flex items-center gap-2">
          <img src="/src/assets/logo.png" alt="FounderOS Logo" className="w-6 h-6 object-contain" />
          <span className="font-medium tracking-wide text-foreground">FounderOS</span>
        </div>
        <ThemeToggle />
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
              )
            }
          >
            <item.icon className="w-4 h-4" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Lock OS</span>
        </button>
      </div>
    </aside>
  );
}
