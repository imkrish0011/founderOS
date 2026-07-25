import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, BookOpen, Bug, CheckCircle2, Zap, Flame, Clock, Target, Activity, Quote, BatteryCharging, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GitHubCalendar } from 'react-github-calendar';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { useStatsStore } from '@/store/useStatsStore';
import { useTimerStore } from '@/store/useTimerStore';
import { useLearning } from '@/store/useLearning';

const quotes = [
  "The secret of getting ahead is getting started. – Mark Twain",
  "It does not matter how slowly you go as long as you do not stop. – Confucius",
  "Everything you've ever wanted is on the other side of fear. – George Addair",
  "Focus on being productive instead of busy. – Tim Ferriss",
  "Action is the foundational key to all success. – Pablo Picasso",
  "Amateurs sit and wait for inspiration, the rest of us just get up and go to work. – Stephen King"
];

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function Dashboard() {
  const { focusSecondsThisWeek, dayStreak } = useStatsStore();
  const { topics } = useLearning();
  
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 12000);
    return () => clearInterval(quoteTimer);
  }, []);

  const activeTopic = topics.find(t => t.status === 'active') || topics.find(t => t.status === 'locked');
  
  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return "Good Morning, Krish 🌿";
    if (hour < 18) return "Good Afternoon, Krish 🌿";
    return "Good Evening, Krish 🌙";
  };

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
          <h1 className="text-3xl md:text-4xl font-light text-foreground mb-2 tracking-tight flex items-center gap-3">
            {getGreeting()}
          </h1>
          <p className="text-muted-foreground tracking-wide font-mono text-sm">
            {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} • {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* ArchViz Focus - spans 2 cols */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-4 md:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Code className="w-4 h-4" /> 
              What to build today
            </h2>
          </div>
          <Card className="glass-card p-6 flex flex-col justify-between min-h-[200px] hover-glow transition-all duration-300 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border mb-4">
                Active Project
              </div>
              <h3 className="text-2xl font-medium mb-2 text-foreground">FounderOS Core</h3>
              <p className="text-muted-foreground/80 text-sm line-clamp-2 max-w-md">
                Building out professional analytics, interactive widgets, and seamless system integrations without heavy backend requirements.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="w-4 h-4 text-primary animate-pulse" /> 
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

        {/* System Status / Cool Widget */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-4 md:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Cpu className="w-4 h-4" /> 
              System Core
            </h2>
          </div>
          <Card className="glass-card p-6 flex flex-col justify-between min-h-[200px] hover-glow transition-all duration-300 bg-gradient-to-br from-card to-muted/20">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  Online
                </div>
                <BatteryCharging className="w-4 h-4 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2 text-foreground">Peak State</h3>
              <p className="text-muted-foreground/80 text-xs">
                Your environment is primed for deep work. No distractions detected.
              </p>
            </div>
            
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-4">
              <div className="h-full bg-primary w-[85%] rounded-full relative">
                <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
              </div>
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
          <Card className="glass-card p-6 flex flex-col justify-between min-h-[180px] hover-glow transition-all duration-300 relative overflow-hidden">
             <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              {activeTopic ? (
                <>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20 mb-4">
                    Up Next
                  </div>
                  <h3 className="text-xl font-medium mb-2 text-foreground line-clamp-1">{activeTopic.title}</h3>
                  <p className="text-muted-foreground/80 text-sm line-clamp-2">
                    {activeTopic.currentTopic || 'Dive in and learn something new.'}
                  </p>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border mb-4">
                    No active topic
                  </div>
                  <h3 className="text-xl font-medium mb-2 text-muted-foreground">Roadmap empty...</h3>
                  <p className="text-muted-foreground/50 text-sm line-clamp-2">
                    Start adding topics in the Learning section.
                  </p>
                </>
              )}
            </div>
            <div className="mt-6 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-blue-500" /> 
                <span>{topics.filter(t => t.status === 'completed').length} completed</span>
              </div>
              <Button variant="ghost" size="sm" className="hover:bg-muted rounded-lg group" asChild>
                <Link to="/learning">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Daily Inspiration / Quotes */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-4 md:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Quote className="w-4 h-4" /> 
              Inspiration
            </h2>
          </div>
          <Card className="glass-card p-6 flex items-center justify-center min-h-[180px] hover-glow transition-all duration-300 relative overflow-hidden text-center bg-gradient-to-tr from-card to-muted/10">
             <Quote className="absolute -left-4 -top-4 w-32 h-32 text-muted/20 rotate-12" />
             <AnimatePresence mode="wait">
               <motion.p 
                  key={quoteIndex}
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.6 }}
                  className="text-lg md:text-xl font-light text-foreground/90 max-w-lg z-10 italic"
               >
                 "{quotes[quoteIndex].split('–')[0].trim()}"
                 <span className="block mt-4 text-sm text-muted-foreground font-medium not-italic">
                   — {quotes[quoteIndex].split('–')[1].trim()}
                 </span>
               </motion.p>
             </AnimatePresence>
          </Card>
        </motion.div>

        {/* Progress Pulse */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-4 md:col-span-3">
           <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Zap className="w-4 h-4" /> 
              Progress Pulse
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="glass-card p-4 flex flex-col justify-center items-center text-center relative overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Activity className="w-5 h-5 text-primary mb-2 opacity-70 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-3xl font-light mb-1">{focusHours}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Hrs Focus (Week)</span>
            </Card>
            <Card className="glass-card p-4 flex flex-col justify-center items-center text-center relative overflow-hidden group hover:border-orange-500/50 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Flame className="w-5 h-5 text-orange-500 mb-2 opacity-70 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-3xl font-light mb-1">{dayStreak}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Day Streak</span>
            </Card>
            <Card className="glass-card p-4 flex flex-col justify-center items-center text-center relative overflow-hidden group hover:border-blue-500/50 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <BookOpen className="w-5 h-5 text-blue-500 mb-2 opacity-70 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-3xl font-light mb-1">{topics.filter(t => t.status === 'completed').length}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Topics Done</span>
            </Card>
            <Card className="glass-card p-4 flex flex-col justify-center items-center text-center relative overflow-hidden group hover:border-green-500/50 transition-colors">
               <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CheckCircle2 className="w-5 h-5 text-green-500 mb-2 opacity-70 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-3xl font-light mb-1 text-foreground">100%</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Commitment</span>
            </Card>
          </div>
        </motion.div>
        
        {/* GitHub Graph */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-4 md:col-span-3">
           <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Code className="w-4 h-4" /> 
              GitHub Contributions
            </h2>
            <a href="https://github.com/imkrish0011" target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              @imkrish0011 <ArrowRight className="w-3 h-3" />
            </a>
          </div>
          <Card className="glass-card p-6 flex justify-center items-center overflow-x-auto relative group hover:border-primary/30 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl"></div>
            <div className="min-w-[700px] z-10">
              <GitHubCalendar 
                username="imkrish0011" 
                colorScheme="dark"
                fontSize={12}
                blockSize={12}
                blockMargin={4}
                renderBlock={(block, activity) =>
                  React.cloneElement(block as React.ReactElement, {
                    'data-tooltip-id': 'github-tooltip',
                    'data-tooltip-content': `${activity.count} commits on ${activity.date}`,
                  })
                }
              />
              <ReactTooltip 
                id="github-tooltip" 
                place="top" 
                className="!bg-card !text-foreground !border !border-border !rounded-lg !text-xs !px-3 !py-1.5 !shadow-xl !z-50" 
              />
            </div>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
