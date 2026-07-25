import { create } from 'zustand';
import { useStatsStore } from './useStatsStore';

export const INITIAL_TIME = 50 * 60; // 50 minutes

interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  isMusicPlaying: boolean;
  task: string;
  setTask: (task: string) => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  toggleMusic: () => void;
  setRunning: (run: boolean) => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  timeLeft: INITIAL_TIME,
  isRunning: false,
  isMusicPlaying: false,
  task: '',
  setTask: (task) => set({ task }),
  toggleTimer: () => {
    const isRunning = get().isRunning;
    if (isRunning) {
      // Pause: maybe update stats here if needed, but tick already handles it
      useStatsStore.getState().updateStreak();
    }
    set({ isRunning: !isRunning });
  },
  setRunning: (run) => set({ isRunning: run }),
  resetTimer: () => set({ timeLeft: INITIAL_TIME, isRunning: false }),
  tick: () => {
    const timeLeft = get().timeLeft;
    if (timeLeft > 0) {
      set({ timeLeft: timeLeft - 1 });
      // Record 1 second of focus time
      useStatsStore.getState().addFocusSeconds(1);
      // Update streak
      if (timeLeft % 60 === 0) {
         useStatsStore.getState().updateStreak();
      }
    } else {
      set({ isRunning: false });
      useStatsStore.getState().addActivity({
        type: 'focus',
        description: `Completed focus session${get().task ? `: ${get().task}` : ''}`
      });
    }
  },
  toggleMusic: () => set((state) => ({ isMusicPlaying: !state.isMusicPlaying })),
}));
