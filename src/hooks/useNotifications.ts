import { useEffect, useRef } from 'react';
import { useArchViz } from './useArchViz';

export function useNotifications() {
  const { metrics } = useArchViz();
  const notifiedTasks = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Request permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    // Check for high priority tasks due today
    const checkTasks = () => {
      if (!metrics?.tasks) return;
      
      const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
      
      const dueTodayHighPriority = metrics.tasks.filter(
        (t) => t.dueDate === today && t.priority === 'High' && t.status !== 'Completed'
      );

      dueTodayHighPriority.forEach((task) => {
        if (!notifiedTasks.current.has(task.id)) {
          new Notification('FounderOS Alert', {
            body: `High Priority Task Due Today: ${task.title || 'Untitled Task'}`,
            icon: '/src/assets/logo.png',
          });
          notifiedTasks.current.add(task.id);
        }
      });
    };

    // Check immediately and then every minute
    checkTasks();
    const interval = setInterval(checkTasks, 60 * 1000);

    return () => clearInterval(interval);
  }, [metrics.tasks]);
}
