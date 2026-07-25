import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ActivityLog {
  id: string;
  type: 'focus' | 'learning' | 'archviz' | 'journal';
  description: string;
  timestamp: number;
}

interface StatsState {
  focusSecondsThisWeek: number;
  dayStreak: number;
  lastActiveDate: string | null;
  recentActivity: ActivityLog[];
  
  addFocusSeconds: (seconds: number) => void;
  updateStreak: () => void;
  addActivity: (activity: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set) => ({
      focusSecondsThisWeek: 0,
      dayStreak: 0,
      lastActiveDate: null,
      recentActivity: [],

      addFocusSeconds: (seconds) =>
        set((state) => ({
          focusSecondsThisWeek: state.focusSecondsThisWeek + seconds,
        })),

      updateStreak: () =>
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          if (state.lastActiveDate === today) return state; // Already active today
          
          let newStreak = state.dayStreak;
          if (state.lastActiveDate) {
            const lastDate = new Date(state.lastActiveDate);
            const currentDate = new Date(today);
            const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
            
            if (diffDays === 1) {
              newStreak += 1; // Consecutive day
            } else if (diffDays > 1) {
              newStreak = 1; // Streak broken
            }
          } else {
            newStreak = 1;
          }
          
          return {
            dayStreak: newStreak,
            lastActiveDate: today
          };
        }),

      addActivity: (activity) =>
        set((state) => {
          const newActivity: ActivityLog = {
            ...activity,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
          };
          
          // Keep only the last 10 activities
          const updatedActivity = [newActivity, ...state.recentActivity].slice(0, 10);
          
          return { recentActivity: updatedActivity };
        }),
    }),
    {
      name: 'founderos-stats',
    }
  )
);
