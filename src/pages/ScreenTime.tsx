import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { MonitorSmartphone, Smartphone, Clock, ArrowLeft, Target, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function ScreenTime() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={fadeIn}
        className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-light text-foreground mb-2 tracking-tight flex items-center gap-3">
            <MonitorSmartphone className="w-8 h-8 text-blue-500" />
            Screen Time
          </h1>
          <p className="text-muted-foreground tracking-wide font-mono text-sm">
            Native device analytics & digital wellbeing
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="glass-card hover:bg-muted/50 rounded-full">
            <Target className="w-4 h-4 mr-2" /> Set Limits
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-4 md:col-span-2">
          <Card className="glass-card p-8 flex flex-col justify-center items-center min-h-[300px] hover-glow transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <MonitorSmartphone className="w-16 h-16 text-blue-500 mb-6 opacity-80" />
            <h2 className="text-5xl font-light text-foreground mb-2">3h 45m</h2>
            <p className="text-muted-foreground text-lg mb-6">Total Screen Time Today</p>
            
            <div className="w-full max-w-md space-y-3 mt-4 relative z-10">
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2"><Smartphone className="w-4 h-4 text-primary" /> FounderOS</span>
                <span className="text-foreground">1h 12m</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[30%] rounded-full"></div>
              </div>
              
              <div className="flex justify-between items-center text-sm pt-2">
                <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-orange-400" /> Web Browser</span>
                <span className="text-foreground">45m</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-orange-400 w-[20%] rounded-full"></div>
              </div>

              <div className="flex justify-between items-center text-sm pt-2">
                <span className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-400" /> Social Media</span>
                <span className="text-foreground">1h 48m</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-red-400 w-[45%] rounded-full"></div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6 md:col-span-1">
          <Card className="glass-card p-6 flex flex-col min-h-[140px] hover-glow transition-all duration-300 relative overflow-hidden bg-gradient-to-br from-card to-blue-500/5">
            <div className="flex items-center justify-between mb-4">
               <ShieldCheck className="w-6 h-6 text-green-500" />
               <span className="text-xs font-medium uppercase tracking-wider text-green-500 bg-green-500/10 px-2 py-1 rounded-full">Active</span>
            </div>
            <h3 className="text-xl font-medium mb-1">Downtime</h3>
            <p className="text-sm text-muted-foreground">Scheduled 10:00 PM to 7:00 AM</p>
          </Card>

          <Card className="glass-card p-6 flex flex-col min-h-[140px] hover-glow transition-all duration-300 relative overflow-hidden">
             <div className="flex items-center justify-between mb-4">
               <Target className="w-6 h-6 text-orange-500" />
               <span className="text-xs font-medium uppercase tracking-wider text-orange-500 bg-orange-500/10 px-2 py-1 rounded-full">Warning</span>
            </div>
            <h3 className="text-xl font-medium mb-1">App Limits</h3>
            <p className="text-sm text-muted-foreground">You are 12 mins away from your Instagram limit.</p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
