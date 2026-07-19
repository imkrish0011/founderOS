import { NavLink } from 'react-router-dom';
import { LayoutDashboard, KanbanSquare, GraduationCap, Library, BookOpen, LineChart, Target, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

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
    <aside className="w-64 border-r border-border hidden md:flex flex-col bg-charcoal-900/50 backdrop-blur">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <span className="font-medium tracking-wide text-foreground">FounderOS</span>
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
                  ? "bg-white/10 text-white"
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
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
          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-white w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Lock OS</span>
        </button>
      </div>
    </aside>
  );
}
