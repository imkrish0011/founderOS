import { create } from 'zustand';

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

export const useTimerStore = create<TimerState>((set) => ({
  timeLeft: INITIAL_TIME,
  isRunning: false,
  isMusicPlaying: false,
  task: '',
  setTask: (task) => set({ task }),
  toggleTimer: () => set((state) => ({ isRunning: !state.isRunning })),
  setRunning: (run) => set({ isRunning: run }),
  resetTimer: () => set({ timeLeft: INITIAL_TIME, isRunning: false }),
  tick: () => set((state) => ({ timeLeft: Math.max(0, state.timeLeft - 1) })),
  toggleMusic: () => set((state) => ({ isMusicPlaying: !state.isMusicPlaying })),
}));
