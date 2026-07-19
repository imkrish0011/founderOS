import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useJournal } from '@/hooks/useJournal';

export default function Journal() {
  const { entry, saveEntry, loading, saving, today } = useJournal();
  
  // Local state for smooth typing without waiting for Firestore callback
  const [localEntry, setLocalEntry] = useState(entry);

  useEffect(() => {
    setLocalEntry(entry);
  }, [entry]);

  const handleChange = (field: keyof typeof entry, value: string) => {
    setLocalEntry(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    saveEntry(localEntry);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12 pt-8">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-light text-foreground mb-2 tracking-tight">Daily Reflection</h1>
        <p className="text-muted-foreground text-sm tracking-wide">
          {new Date(today).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className={`glass-card p-6 md:p-10 space-y-8 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="space-y-3">
            <label className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
              1. What did I accomplish today?
            </label>
            <textarea 
              value={localEntry.accomplished}
              onChange={(e) => handleChange('accomplished', e.target.value)}
              className="w-full bg-charcoal-900/50 border border-white/10 rounded-xl p-4 min-h-[100px] resize-none focus:outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm"
              placeholder="Built the new canvas feature..."
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
              2. What did I learn today?
            </label>
            <textarea 
              value={localEntry.learned}
              onChange={(e) => handleChange('learned', e.target.value)}
              className="w-full bg-charcoal-900/50 border border-white/10 rounded-xl p-4 min-h-[100px] resize-none focus:outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm"
              placeholder="Learned about Multi-Head Attention..."
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
              3. Tomorrow's plan?
            </label>
            <textarea 
              value={localEntry.plan}
              onChange={(e) => handleChange('plan', e.target.value)}
              className="w-full bg-charcoal-900/50 border border-white/10 rounded-xl p-4 min-h-[100px] resize-none focus:outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm"
              placeholder="Fix the remaining bug and read chapter 3..."
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSave}
              disabled={saving || loading}
              className="bg-white text-black hover:bg-white/90 rounded-lg px-8 transition-all"
            >
              {saving ? 'Saving...' : 'Save Entry'}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
