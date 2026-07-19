import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useCurriculum } from '@/hooks/useCurriculum';
import { useGithubCommits } from '@/hooks/useGithubCommits';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Progress() {
  const { phases, progress, loading } = useCurriculum();
  const { commitData, loading: commitsLoading } = useGithubCommits('imkrish0011/archviz');

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

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-light text-foreground mb-1 tracking-tight">Progress</h1>
        <p className="text-muted-foreground text-sm tracking-wide">Analytics & Consistency</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Topics Completed', value: `${completedTopics}`, trend: `Out of ${totalTopics}` },
          { label: 'Mini Projects', value: `${completedProjects}`, trend: `Out of ${totalProjects}` },
          { label: 'Curriculum', value: `${topicCompletionPercent}%`, trend: `${totalPhases} Phases Total` },
          { label: 'Projects Built', value: `${projectCompletionPercent}%`, trend: 'Hands-on Progress' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className={`glass-card p-6 flex flex-col justify-center items-center text-center h-full ${loading || parseInt(stat.value) === 0 ? 'opacity-50' : ''}`}>
              <span className="text-4xl font-light mb-2">{stat.value}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</span>
              <span className="text-[10px] text-muted-foreground">{stat.trend}</span>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className={`glass-card p-6 mt-8 ${commitsLoading ? 'opacity-50' : ''}`}>
          <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-6 flex items-center justify-between">
            <span>Commit Activity</span>
            <span className="text-xs normal-case tracking-normal">imkrish0011/archviz (Last 7 Days)</span>
          </h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={commitData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="commits" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
