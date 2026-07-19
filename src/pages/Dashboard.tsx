import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, BookOpen, Bug, CheckCircle2, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function Dashboard() {
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

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Welcome Section */}
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={fadeIn}
        className="mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-light text-foreground mb-2 tracking-tight">
          {getGreeting()}
        </h1>
        <p className="text-muted-foreground tracking-wide">
          {getSubGreeting()}
        </p>
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
          <Card className="glass-card p-6 flex flex-col justify-between min-h-[200px]">
            <div>
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 text-muted-foreground border border-white/10 mb-4">
                No active task
              </div>
              <h3 className="text-xl font-medium mb-2 text-muted-foreground">Waiting for input...</h3>
              <p className="text-muted-foreground/50 text-sm line-clamp-2">
                Set a goal in the ArchViz section to see your current focus here.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground opacity-50">
                <Bug className="w-4 h-4" /> 
                <span>0 bugs remaining</span>
              </div>
              <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-white/10 rounded-lg group" asChild>
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
          <Card className="glass-card p-6 flex flex-col justify-between min-h-[200px]">
            <div>
               <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 text-muted-foreground border border-white/10 mb-4">
                No active topic
              </div>
              <h3 className="text-xl font-medium mb-2 text-muted-foreground">Roadmap empty...</h3>
              <p className="text-muted-foreground/50 text-sm line-clamp-2">
                Start adding topics in the Learning section to track your progress here.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between">
               <div className="flex items-center gap-2 text-sm text-muted-foreground opacity-50">
                <CheckCircle2 className="w-4 h-4" /> 
                <span>0% completed</span>
              </div>
              <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-white/10 rounded-lg group" asChild>
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
            <Card className="glass-card p-4 flex flex-col justify-center items-center text-center opacity-50">
              <span className="text-3xl font-light mb-1">0</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Hrs this week</span>
            </Card>
            <Card className="glass-card p-4 flex flex-col justify-center items-center text-center opacity-50">
              <span className="text-3xl font-light mb-1">0</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">GitHub Commits</span>
            </Card>
            <Card className="glass-card p-4 flex flex-col justify-center items-center text-center opacity-50">
              <span className="text-3xl font-light mb-1">0</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Day Streak</span>
            </Card>
            <Card className="glass-card p-4 flex flex-col justify-center items-center text-center opacity-50">
              <span className="text-3xl font-light mb-1 text-muted-foreground">--</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Vs Yesterday</span>
            </Card>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
