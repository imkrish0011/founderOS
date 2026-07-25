import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, BookOpen, Bug, CheckCircle2, Zap, Flame, Clock, Target, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import GitHubCalendar from 'react-github-calendar';
import { useStatsStore } from '@/store/useStatsStore';
import { useTimerStore } from '@/store/useTimerStore';
import { useLearning } from '@/store/useLearning';

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function Dashboard() {
  const { focusSecondsThisWeek, dayStreak } = useStatsStore();
  const { modules } = useLearning();
  // Get first module with status in_progress or not_started
  const activeModule = modules.find(m => m.status === 'in_progress') || modules.find(m => m.status === 'not_started');
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning, Krish 🌿";
    if (hour < 18) return "Good Afternoon, Krish 🌿";
    return "Good Evening, Krish 🌙";
  };

  const getSubGreeting = () => {
    const day = new Date().getDay();
    const greetings = [
      "Rest and reflect today.",
      "The mountain is climbed one step at a time.",
      "One small step today builds tomorrow.",
      "Stay focused. Stay calm.",
      "What will you build today?",
      "Consistency is the key to mastery.",
      "Enjoy the process of becoming."
    ];
    return greetings[day];
  };

  // Convert seconds to hours formatted
  const focusHours = (focusSecondsThisWeek / 3600).toFixed(1);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Welcome Section */}
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={fadeIn}
        className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-light text-foreground mb-2 tracking-tight">
            {getGreeting()}
          </h1>
          <p className="text-muted-foreground tracking-wide">
            {getSubGreeting()}
          </p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button variant="outline" className="glass-card hover:bg-muted/50 rounded-full" asChild>
            <Link to="/focus"><Clock className="w-4 h-4 mr-2" /> Start Focus</Link>
          </Button>
          <Button variant="outline" className="glass-card hover:bg-muted/50 rounded-full" asChild>
            <Link to="/journal"><BookOpen className="w-4 h-4 mr-2" /> New Entry</Link>
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ArchViz Focus */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Code className="w-4 h-4" /> 
              What to build today
            </h2>
          </div>
          <Card className="glass-card p-6 flex flex-col justify-between min-h-[200px] hover-glow transition-all duration-300">
            <div>
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border mb-4">
                Active Project
              </div>
              <h3 className="text-xl font-medium mb-2 text-foreground">FounderOS Core</h3>
              <p className="text-muted-foreground/80 text-sm line-clamp-2">
                Implementing dashboard analytics and GitHub activity tracking.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="w-4 h-4 text-primary" /> 
                <span>In Progress</span>
              </div>
              <Button variant="outline" size="sm" className="bg-muted/50 border-border hover:bg-muted rounded-lg group transition-all" asChild>
                <Link to="/archviz">
                  Go to ArchViz <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* AI Learning Focus */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> 
              What to learn today
            </h2>
          </div>
          <Card className="glass-card p-6 flex flex-col justify-between min-h-[200px] hover-glow transition-all duration-300">
            <div>
              {activeModule ? (
                <>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-4">
                    Up Next
                  </div>
                  <h3 className="text-xl font-medium mb-2 text-foreground">{activeModule.title}</h3>
                  <p className="text-muted-foreground/80 text-sm line-clamp-2">
                    {activeModule.description}
                  </p>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border mb-4">
                    No active topic
                  </div>
                  <h3 className="text-xl font-medium mb-2 text-muted-foreground">Roadmap empty...</h3>
                  <p className="text-muted-foreground/50 text-sm line-clamp-2">
                    Start adding topics in the Learning section to track your progress here.
                  </p>
                </>
              )}
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> 
                <span>{modules.filter(m => m.status === 'completed').length} completed</span>
              </div>
              <Button variant="outline" size="sm" className="bg-muted/50 border-border hover:bg-muted rounded-lg group transition-all" asChild>
                <Link to="/learning">
                  Go to Learning <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Unfinished / Progress */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-4 md:col-span-2">
           <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Zap className="w-4 h-4" /> 
              Progress Pulse
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="glass-card p-4 flex flex-col justify-center items-center text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Activity className="w-5 h-5 text-primary mb-2 opacity-70" />
              <span className="text-3xl font-light mb-1">{focusHours}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Hrs Focus (Week)</span>
            </Card>
            <Card className="glass-card p-4 flex flex-col justify-center items-center text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Flame className="w-5 h-5 text-orange-500 mb-2 opacity-70" />
              <span className="text-3xl font-light mb-1">{dayStreak}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Day Streak</span>
            </Card>
            <Card className="glass-card p-4 flex flex-col justify-center items-center text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <BookOpen className="w-5 h-5 text-blue-500 mb-2 opacity-70" />
              <span className="text-3xl font-light mb-1">{modules.filter(m => m.status === 'completed').length}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Modules Done</span>
            </Card>
            <Card className="glass-card p-4 flex flex-col justify-center items-center text-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CheckCircle2 className="w-5 h-5 text-green-500 mb-2 opacity-70" />
              <span className="text-3xl font-light mb-1 text-foreground">100%</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Commitment</span>
            </Card>
          </div>
        </motion.div>
        
        {/* GitHub Graph */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-4 md:col-span-2">
           <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Code className="w-4 h-4" /> 
              GitHub Contributions
            </h2>
            <a href="https://github.com/imkrish0011" target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              @imkrish0011
            </a>
          </div>
          <Card className="glass-card p-6 flex justify-center items-center overflow-x-auto">
            <div className="min-w-[700px]">
              <GitHubCalendar 
                username="imkrish0011" 
                colorScheme="dark"
                fontSize={12}
                blockSize={12}
                blockMargin={4}
              />
            </div>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
