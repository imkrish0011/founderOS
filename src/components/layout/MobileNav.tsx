import { NavLink } from 'react-router-dom';
import { LayoutDashboard, KanbanSquare, GraduationCap, Target, BookOpen, BookText, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

// Show all items on mobile bottom nav, but make them scrollable horizontally
const mobileNavItems = [
  { name: 'Home', path: '/', icon: LayoutDashboard },
  { name: 'ArchViz', path: '/archviz', icon: KanbanSquare },
  { name: 'Learn', path: '/learning', icon: GraduationCap },
  { name: 'Library', path: '/library', icon: BookOpen },
  { name: 'Journal', path: '/journal', icon: BookText },
  { name: 'Progress', path: '/progress', icon: TrendingUp },
  { name: 'Focus', path: '/focus', icon: Target },
];

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-border bg-background/80 backdrop-blur-md z-50 flex items-center overflow-x-auto px-2 pb-safe scrollbar-none gap-2">
      {mobileNavItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center min-w-[64px] h-12 px-1 rounded-xl transition-all duration-200",
              isActive ? "text-foreground bg-accent/50" : "text-muted-foreground hover:text-foreground/80 hover:bg-accent/20"
            )
          }
        >
          <item.icon className="w-5 h-5" />
          <span className="text-[10px] font-medium">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
}
