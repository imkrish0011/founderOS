import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Music, Target } from 'lucide-react';
import { useTimerStore, INITIAL_TIME } from '@/store/useTimerStore';
import { useLocation, useNavigate } from 'react-router-dom';

export function FloatingTimer() {
  const { timeLeft, isRunning, isMusicPlaying, toggleTimer, toggleMusic } = useTimerStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Hide the floating widget if we are on the Focus page OR if timer hasn't started and music isn't playing
  const isFocusPage = location.pathname === '/focus';
  const isIdle = !isRunning && timeLeft === INITIAL_TIME && !isMusicPlaying;

  if (isFocusPage || isIdle) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex items-center gap-3 bg-card/80 backdrop-blur-md border border-border rounded-full p-2 pr-4 shadow-2xl"
      >
        <button 
          onClick={() => navigate('/focus')}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          <Target className="w-4 h-4" />
        </button>

        <div className="flex flex-col">
          <span className="text-sm font-medium tabular-nums leading-none">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Focusing</span>
        </div>

        <div className="flex items-center gap-1 ml-2 pl-2 border-l border-border/50">
          <button 
            onClick={toggleTimer}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          <button 
            onClick={toggleMusic}
            className={`p-2 rounded-full transition-colors ${isMusicPlaying ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}
          >
            <Music className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
