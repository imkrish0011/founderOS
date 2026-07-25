import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, RefreshCcw, Music, Trophy, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useFocus } from '@/hooks/useFocus';
import { useTimerStore, PRESETS } from '@/store/useTimerStore';
import { useStatsStore } from '@/store/useStatsStore';

const completionQuotes = [
  "You just leveled up. 🔥",
  "Session complete. You're unstoppable.",
  "Deep work pays compound interest.",
  "Another block of genius, locked in.",
  "Focus is your superpower.",
];

export default function Focus() {
  const { timeLeft, totalTime, isRunning, task, activePreset, sessionsToday,
    setTask, toggleTimer, resetTimer, tick, setRunning, setPreset } = useTimerStore();
  const { logSession } = useFocus();
  const { dayStreak } = useStatsStore();
  const [showCompletion, setShowCompletion] = useState(false);
  const [completionQuote, setCompletionQuote] = useState('');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setRunning(false);
      logSession(PRESETS[activePreset].minutes);
      setCompletionQuote(completionQuotes[Math.floor(Math.random() * completionQuotes.length)]);
      setShowCompletion(true);
      setTimeout(() => setShowCompletion(false), 5000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, tick, setRunning, logSession, activePreset]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // SVG circular progress
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const progress = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;
  const strokeDashoffset = circumference * (1 - progress);

  // Breathing animation state
  const [breathPhase, setBreathPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [breathCount, setBreathCount] = useState(0);
  
  const startBreathing = () => {
    setBreathPhase('inhale');
    setBreathCount(0);
    const cycle = () => {
      let count = 0;
      const run = () => {
        if (count >= 3) {
          setBreathPhase('idle');
          return;
        }
        setBreathPhase('inhale');
        setBreathCount(count + 1);
        setTimeout(() => {
          setBreathPhase('hold');
          setTimeout(() => {
            setBreathPhase('exhale');
            setTimeout(() => {
              count++;
              run();
            }, 4000); // exhale 4s
          }, 4000); // hold 4s
        }, 4000); // inhale 4s
      };
      run();
    };
    cycle();
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center max-w-2xl mx-auto px-4 py-6 md:p-6 relative">
      
      {/* Completion Toast */}
      <AnimatePresence>
        {showCompletion && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50"
          >
            <Card className="glass-card px-6 py-4 text-center border-green-500/30 bg-green-500/5 backdrop-blur-xl">
              <Trophy className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">{completionQuote}</p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full text-center space-y-8 md:space-y-10"
      >
        {/* Task Input */}
        <div className="space-y-4">
          <Input 
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="What is your singular focus right now?"
            className="text-center bg-transparent border-none text-lg md:text-2xl font-light placeholder:text-muted-foreground/50 focus-visible:ring-0 shadow-none h-12 md:h-14"
          />
          <div className="w-16 h-px bg-border mx-auto" />
        </div>

        {/* Preset Selector */}
        <div className="flex items-center justify-center gap-2 md:gap-3">
          {PRESETS.map((preset, i) => (
            <button
              key={preset.label}
              onClick={() => setPreset(i)}
              disabled={isRunning}
              className={`
                px-3 py-2 md:px-4 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300
                ${activePreset === i 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105' 
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted border border-border'}
                ${isRunning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span className="mr-1">{preset.icon}</span> {preset.label} · {preset.minutes}m
            </button>
          ))}
        </div>

        {/* Circular Timer */}
        <div className="relative inline-flex items-center justify-center">
          {/* SVG Ring */}
          <svg className="w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] md:w-[340px] md:h-[340px] -rotate-90" viewBox="0 0 320 320">
            {/* Background ring */}
            <circle
              cx="160" cy="160" r={radius}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="4"
            />
            {/* Progress ring */}
            <circle
              cx="160" cy="160" r={radius}
              fill="none"
              stroke={isRunning ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-linear"
            />
            {/* Glowing dot at the progress end */}
            {progress > 0 && progress < 1 && (
              <circle
                cx={160 + radius * Math.cos(2 * Math.PI * progress - Math.PI / 2)}
                cy={160 + radius * Math.sin(2 * Math.PI * progress - Math.PI / 2)}
                r="6"
                fill={isRunning ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                className="transition-all duration-1000 ease-linear"
              >
                {isRunning && (
                  <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
                )}
              </circle>
            )}
          </svg>
          
          {/* Timer Text (centered inside ring) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tighter text-foreground tabular-nums select-none">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            {isRunning && (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-xs text-muted-foreground mt-2 uppercase tracking-widest"
              >
                Focusing...
              </motion.p>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 md:gap-6">
          <Button 
            onClick={toggleTimer}
            variant="outline" 
            size="icon" 
            className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-border transition-all duration-300 ${
              isRunning 
                ? 'bg-destructive/10 border-destructive/30 hover:bg-destructive/20 text-destructive' 
                : 'bg-primary/10 border-primary/30 hover:bg-primary/20 text-primary'
            }`}
          >
            {isRunning ? <Square className="w-5 h-5 md:w-6 md:h-6" /> : <Play className="w-5 h-5 md:w-6 md:h-6 ml-0.5" />}
          </Button>
          <Button 
            onClick={resetTimer}
            variant="ghost" 
            size="icon" 
            className="w-14 h-14 md:w-16 md:h-16 rounded-full text-muted-foreground hover:text-foreground"
          >
            <RefreshCcw className="w-5 h-5 md:w-6 md:h-6" />
          </Button>
        </div>

        {/* Session Stats Row */}
        <div className="flex items-center justify-center gap-6 md:gap-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Trophy className="w-4 h-4 text-green-500" />
            <span><span className="text-foreground font-medium">{sessionsToday}</span> sessions today</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Flame className="w-4 h-4 text-orange-500" />
            <span><span className="text-foreground font-medium">{dayStreak}</span> day streak</span>
          </div>
        </div>

        {/* Breathing Exercise */}
        {!isRunning && breathPhase === 'idle' && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={startBreathing}
            className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors uppercase tracking-widest mx-auto block"
          >
            ✦ Breathe before you begin ✦
          </motion.button>
        )}
        
        <AnimatePresence>
          {breathPhase !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                animate={{
                  scale: breathPhase === 'inhale' ? 1.4 : breathPhase === 'hold' ? 1.4 : 1,
                  opacity: breathPhase === 'exhale' ? 0.4 : 1,
                }}
                transition={{ duration: 4, ease: 'easeInOut' }}
                className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center"
              >
                <div className="w-4 h-4 rounded-full bg-primary/60" />
              </motion.div>
              <p className="text-sm text-muted-foreground uppercase tracking-widest">
                {breathPhase === 'inhale' && 'Breathe in...'}
                {breathPhase === 'hold' && 'Hold...'}
                {breathPhase === 'exhale' && 'Breathe out...'}
              </p>
              <p className="text-xs text-muted-foreground/50">{breathCount}/3</p>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
