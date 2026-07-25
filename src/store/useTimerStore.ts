import { create } from 'zustand';
import { useStatsStore } from './useStatsStore';

export const INITIAL_TIME = 50 * 60; // 50 minutes

export const PRESETS = [
  { label: 'Pomodoro', minutes: 25, icon: '🍅' },
  { label: 'Deep Work', minutes: 50, icon: '🧠' },
  { label: 'Flow State', minutes: 90, icon: '🌊' },
] as const;

interface TimerState {
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
  isMusicPlaying: boolean;
  task: string;
  activePreset: number;
  sessionsToday: number;
  setTask: (task: string) => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  toggleMusic: () => void;
  setRunning: (run: boolean) => void;
  setPreset: (index: number) => void;
  incrementSessions: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  timeLeft: INITIAL_TIME,
  totalTime: INITIAL_TIME,
  isRunning: false,
  isMusicPlaying: false,
  task: '',
  activePreset: 1, // Deep Work default
  sessionsToday: 0,
  setTask: (task) => set({ task }),
  toggleTimer: () => {
    const isRunning = get().isRunning;
    if (isRunning) {
      useStatsStore.getState().updateStreak();
    }
    set({ isRunning: !isRunning });
  },
  setRunning: (run) => set({ isRunning: run }),
  resetTimer: () => set((state) => ({ timeLeft: state.totalTime, isRunning: false })),
  setPreset: (index) => {
    const preset = PRESETS[index];
    const totalSeconds = preset.minutes * 60;
    set({ activePreset: index, timeLeft: totalSeconds, totalTime: totalSeconds, isRunning: false });
  },
  incrementSessions: () => set((state) => ({ sessionsToday: state.sessionsToday + 1 })),
  tick: () => {
    const timeLeft = get().timeLeft;
    if (timeLeft > 0) {
      set({ timeLeft: timeLeft - 1 });
      useStatsStore.getState().addFocusSeconds(1);
      if (timeLeft % 60 === 0) {
         useStatsStore.getState().updateStreak();
      }
    } else {
      set({ isRunning: false });
      get().incrementSessions();
      useStatsStore.getState().addActivity({
        type: 'focus',
        description: `Completed focus session${get().task ? `: ${get().task}` : ''}`
      });
    }
  },
  toggleMusic: () => set((state) => ({ isMusicPlaying: !state.isMusicPlaying })),
}));
