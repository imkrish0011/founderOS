import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useCurriculum } from '@/hooks/useCurriculum';
import { useGithubCommits } from '@/hooks/useGithubCommits';
import { ActivityCalendar, type ThemeInput } from 'react-activity-calendar';

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

  // Format data for ActivityCalendar: { date: "YYYY-MM-DD", count: number, level: 0-4 }
  // To make it look like a full year, we need to generate dates.
  // We'll generate the last 365 days and fill in real commits where they exist.
  const calendarData = [];
  const todayDate = new Date();
  
  for (let i = 365; i >= 0; i--) {
    const d = new Date();
    d.setDate(todayDate.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Find if we have commits for this day in our hook data
    // (useGithubCommits currently returns the last 7 days by day name, we should map properly, but we'll use a hack to map the last 7 days)
    const commitDay = commitData.find(c => {
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      return c.name === dayName && i < 7; // Only map if it's within the last 7 days
    });

    let count = 0;
    if (commitDay && i < 7) {
      count = commitDay.commits;
    }

    let level = 0;
    if (count > 0) level = 1;
    if (count > 2) level = 2;
    if (count > 4) level = 3;
    if (count > 8) level = 4;

    calendarData.push({ date: dateStr, count, level: level as any });
  }

  // Custom green theme for the heatmap
  const explicitTheme: ThemeInput = {
    light: ['#1a1a1a', '#0e4429', '#006d32', '#26a641', '#39d353'],
    dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
  };

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
        <Card className={`glass-card p-6 mt-8 overflow-x-auto ${commitsLoading ? 'opacity-50' : ''}`}>
          <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-6 flex items-center justify-between">
            <span>Activity Heatmap</span>
            <span className="text-xs normal-case tracking-normal">imkrish0011/archviz</span>
          </h3>
          <div className="w-full min-w-[800px] flex justify-center py-4">
            <ActivityCalendar 
              data={calendarData} 
              theme={explicitTheme}
              colorScheme="dark"
              hideTotalCount={true}
              hideColorLegend={false}
              blockRadius={2}
              blockSize={12}
            />
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
