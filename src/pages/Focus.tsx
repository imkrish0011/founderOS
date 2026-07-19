import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Square, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFocus } from '@/hooks/useFocus';

const INITIAL_TIME = 50 * 60; // 50 minutes

export default function Focus() {
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [task, setTask] = useState('');
  const { logSession } = useFocus();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      logSession(50); // Log 50 minutes when timer reaches 0 naturally
      alert("Pomodoro complete! Logged 50 minutes of focus time.");
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => setIsRunning(!isRunning);
  
  const resetTimer = () => {
    setIsRunning(false);
    // If they were partially through, maybe we want to log the diff? 
    // For simplicity, we just reset.
    setTimeLeft(INITIAL_TIME);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col items-center justify-center max-w-2xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full text-center space-y-12"
      >
        <div className="space-y-4">
          <Input 
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="What is your singular focus right now?"
            className="text-center bg-transparent border-none text-xl md:text-2xl font-light placeholder:text-muted-foreground/50 focus-visible:ring-0 shadow-none h-14"
          />
          <div className="w-16 h-px bg-border mx-auto" />
        </div>

        <div className="text-8xl md:text-[140px] font-light tracking-tighter text-foreground tabular-nums select-none">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div className="flex items-center justify-center gap-6">
          <Button 
            onClick={toggleTimer}
            variant="outline" 
            size="icon" 
            className="w-16 h-16 rounded-full bg-muted/20 border-border hover:bg-muted/40 hover:border-muted"
          >
            {isRunning ? <Square className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </Button>
          <Button 
            onClick={resetTimer}
            variant="ghost" 
            size="icon" 
            className="w-16 h-16 rounded-full text-muted-foreground hover:text-foreground"
          >
            <RefreshCcw className="w-6 h-6" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
