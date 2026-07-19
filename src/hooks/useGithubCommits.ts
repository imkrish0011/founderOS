import { useState, useEffect } from 'react';

export function useGithubCommits(repoName: string) {
  const [commitData, setCommitData] = useState<{name: string, commits: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        // Get the date 7 days ago
        const date = new Date();
        date.setDate(date.getDate() - 7);
        const since = date.toISOString();

        const response = await fetch(`https://api.github.com/repos/${repoName}/commits?since=${since}&per_page=100`);
        if (!response.ok) {
          throw new Error('Failed to fetch commits');
        }
        
        const commits = await response.json();

        // Initialize array for the last 7 days
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const chartData = [];
        
        // Build the last 7 days starting from 6 days ago up to today
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          chartData.push({
            name: days[d.getDay()],
            commits: 0,
            dateStr: d.toISOString().split('T')[0] // YYYY-MM-DD
          });
        }

        // Count commits per day
        commits.forEach((commit: any) => {
          const commitDate = commit.commit.author.date.split('T')[0];
          const targetDay = chartData.find(d => d.dateStr === commitDate);
          if (targetDay) {
            targetDay.commits += 1;
          }
        });

        // Map to final format without dateStr
        setCommitData(chartData.map(d => ({ name: d.name, commits: d.commits })));
      } catch (error) {
        console.error('Error fetching GitHub commits:', error);
        // Fallback to zeros if it fails (e.g. rate limit)
        setCommitData([
          { name: 'Mon', commits: 0 }, { name: 'Tue', commits: 0 },
          { name: 'Wed', commits: 0 }, { name: 'Thu', commits: 0 },
          { name: 'Fri', commits: 0 }, { name: 'Sat', commits: 0 },
          { name: 'Sun', commits: 0 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCommits();
  }, [repoName]);

  return { commitData, loading };
}
