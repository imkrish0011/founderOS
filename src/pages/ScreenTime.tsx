import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { MonitorSmartphone, Smartphone, Clock, ArrowLeft, Target, ShieldCheck, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Capacitor } from '@capacitor/core';
import ScreenTimePlugin from '@/lib/ScreenTime';

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

function formatMs(ms: number) {
  if (!ms || ms <= 0) return "0h 0m";
  const totalMins = Math.floor(ms / 60000);
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  return `${hours}h ${mins}m`;
}

export default function ScreenTime() {
  const [totalTimeMs, setTotalTimeMs] = useState(0);
  const [topApps, setTopApps] = useState<{packageName: string, timeMs: number}[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!Capacitor.isNativePlatform()) {
        // Fallback for web view so it doesn't look broken
        setIsLoading(false);
        return;
      }

      try {
        const perm = await ScreenTimePlugin.checkUsagePermission();
        if (!perm.granted) {
          await ScreenTimePlugin.requestUsagePermission();
          // The user will leave the app to grant permission, so we might not get stats immediately.
        }

        const now = Date.now();
        // Today from midnight
        const startOfDay = new Date().setHours(0,0,0,0);
        
        const data = await ScreenTimePlugin.getUsageStats({ startTime: startOfDay, endTime: now });
        setTotalTimeMs(data.totalTimeMs || 0);
        
        // Sort apps by time and take top 3
        const sorted = (data.apps || []).sort((a, b) => b.timeMs - a.timeMs).slice(0, 3);
        setTopApps(sorted);
      } catch (err: any) {
        setError(err.message || "Failed to fetch screen time");
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  const totalTimeFormatted = formatMs(totalTimeMs);

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
            <MonitorSmartphone className="w-8 h-8 text-slate-400" />
            Screen Time
          </h1>
          <p className="text-muted-foreground tracking-wide font-mono text-sm">
            Native device analytics & digital wellbeing
          </p>
        </div>
      </motion.div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm px-4 py-3 rounded-lg flex items-center gap-2 mb-4">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-4 md:col-span-2">
          <Card className="glass-card bg-slate-900/40 p-8 flex flex-col justify-center items-center min-h-[300px] hover:bg-slate-900/60 transition-all duration-300 relative overflow-hidden group border-slate-800">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
            
            <MonitorSmartphone className="w-16 h-16 text-slate-500 mb-6 opacity-70" />
            <h2 className="text-5xl font-light text-foreground mb-2">{isLoading ? "--h --m" : totalTimeFormatted}</h2>
            <p className="text-muted-foreground text-lg mb-6">Total Screen Time Today</p>
            
            <div className="w-full max-w-md space-y-5 mt-4 relative z-10">
              {topApps.length > 0 ? topApps.map((app, i) => (
                <div key={app.packageName} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground truncate max-w-[200px]">
                      <Smartphone className="w-4 h-4 text-slate-400 shrink-0" /> 
                      {app.packageName.split('.').pop()}
                    </span>
                    <span className="text-foreground">{formatMs(app.timeMs)}</span>
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-400 rounded-full" style={{ width: `${Math.min((app.timeMs / totalTimeMs) * 100, 100)}%` }}></div>
                  </div>
                </div>
              )) : (
                <p className="text-center text-sm text-muted-foreground">
                  {!Capacitor.isNativePlatform() ? "App usage stats only available on Android." : "No app usage data found."}
                </p>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6 md:col-span-1">
          <Card className="glass-card bg-slate-900/40 border-slate-800 p-6 flex flex-col min-h-[140px] transition-all duration-300 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
               <ShieldCheck className="w-6 h-6 text-emerald-500" />
               <span className="text-xs font-medium uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">Active</span>
            </div>
            <h3 className="text-xl font-medium mb-1 text-slate-200">Downtime</h3>
            <p className="text-sm text-slate-400">Scheduled 10:00 PM to 7:00 AM</p>
          </Card>

          <Card className="glass-card bg-slate-900/40 border-slate-800 p-6 flex flex-col min-h-[140px] transition-all duration-300 relative overflow-hidden">
             <div className="flex items-center justify-between mb-4">
               <Target className="w-6 h-6 text-slate-500" />
            </div>
            <h3 className="text-xl font-medium mb-1 text-slate-200">App Limits</h3>
            <p className="text-sm text-slate-400">All limits are currently within thresholds.</p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
