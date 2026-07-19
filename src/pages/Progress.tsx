import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useCurriculum } from '@/hooks/useCurriculum';
import { useGithubCommits } from '@/hooks/useGithubCommits';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Progress() {
  const { phases, progress, loading } = useCurriculum();
  const { commitData, loading: commitsLoading } = useGithubCommits('imkrish0011/archviz');

  const [activeTab, setActiveTab] = useState<string>('Commit Activity');

  // Calculate Metrics
  const totalPhases = phases.length;
  let totalTopics = 0;
  let totalProjects = 0;

  phases.forEach(p => {
    p.modules?.forEach((m: any) => {
      totalTopics += (m.topics?.length || 0);
    });
    totalProjects += (p.projects?.length || 0);
  });

  const completedTopics = progress.completedTopics.length;
  const completedProjects = progress.completedProjects.length;

  const topicCompletionPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  const projectCompletionPercent = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

  // Mock data distributions for missing historical timestamps
  const generateMockData = (total: number, label: string) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    // Simple even distribution for visual effect
    const base = Math.floor(total / 7);
    const remainder = total % 7;
    
    return days.map((day, i) => ({
      name: day,
      [label]: base + (i < remainder ? 1 : 0)
    }));
  };

  const topicsData = generateMockData(completedTopics, 'topics');
  const projectsData = generateMockData(completedProjects, 'projects');

  const renderChart = () => {
    if (activeTab === 'Commit Activity') {
      return (
        <BarChart data={commitData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} itemStyle={{ color: 'hsl(var(--foreground))' }} />
          <Bar dataKey="commits" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      );
    }
    if (activeTab === 'Topics Completed') {
      return (
        <BarChart data={topicsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} itemStyle={{ color: 'hsl(var(--foreground))' }} />
          <Bar dataKey="topics" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      );
    }
    if (activeTab === 'Mini Projects') {
      return (
        <BarChart data={projectsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} itemStyle={{ color: 'hsl(var(--foreground))' }} />
          <Bar dataKey="projects" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      );
    }
    return null;
  };

  const stats = [
    { label: 'Topics Completed', value: `${completedTopics}`, trend: `Out of ${totalTopics}`, isClickable: true },
    { label: 'Mini Projects', value: `${completedProjects}`, trend: `Out of ${totalProjects}`, isClickable: true },
    { label: 'Commit Activity', value: commitData ? `${commitData.reduce((acc, curr) => acc + curr.commits, 0)}` : '0', trend: 'Last 7 Days', isClickable: true },
    { label: 'Curriculum', value: `${topicCompletionPercent}%`, trend: `${totalPhases} Phases Total`, isClickable: false },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-light text-foreground mb-1 tracking-tight">Progress</h1>
        <p className="text-muted-foreground text-sm tracking-wide">Analytics & Consistency</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card 
              onClick={() => stat.isClickable && setActiveTab(stat.label)}
              className={`glass-card p-6 flex flex-col justify-center items-center text-center h-full transition-all 
                ${stat.isClickable ? 'cursor-pointer hover:border-primary/50 hover:bg-muted/50' : ''} 
                ${activeTab === stat.label ? 'border-primary shadow-[0_0_15px_rgba(var(--primary),0.1)]' : ''}
                ${loading || parseInt(stat.value) === 0 ? 'opacity-50' : ''}`}
            >
              <span className="text-4xl font-light mb-2">{stat.value}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</span>
              <span className="text-[10px] text-muted-foreground">{stat.trend}</span>
            </Card>
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <Card className={`glass-card p-6 mt-8 ${commitsLoading ? 'opacity-50' : ''}`}>
            <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-6 flex items-center justify-between">
              <span>{activeTab}</span>
              <span className="text-xs normal-case tracking-normal">Last 7 Days</span>
            </h3>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
