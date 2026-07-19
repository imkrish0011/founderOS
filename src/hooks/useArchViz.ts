import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/store/useAuth';

export type TaskStatus = 'Ideas' | 'Planned' | 'Building' | 'Completed';
export type Priority = 'High' | 'Med' | 'Low';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface ArchVizTask {
  id: string;
  title: string;
  status: TaskStatus;
  priority?: Priority;
  dueDate?: string;
  subtasks?: SubTask[];
  description?: string;
}

export interface ArchVizMetrics {
  linkedInFollowers: number;
  liveUsers: number;
  tasks?: ArchVizTask[];
}

export function useArchViz() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<ArchVizMetrics>({
    linkedInFollowers: 0,
    liveUsers: 0,
    tasks: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const metricsRef = doc(db, 'users', user.uid, 'data', 'archviz');
    
    // Initialize if doesn't exist
    getDoc(metricsRef).then(snap => {
      if (!snap.exists()) {
        setDoc(metricsRef, { linkedInFollowers: 0, liveUsers: 0, tasks: [] });
      }
    });

    const unsubscribe = onSnapshot(metricsRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as ArchVizMetrics;
        if (!data.tasks) data.tasks = [];
        setMetrics(data);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const updateMetrics = async (updates: Partial<ArchVizMetrics>) => {
    if (!user) return;
    const metricsRef = doc(db, 'users', user.uid, 'data', 'archviz');
    await updateDoc(metricsRef, updates);
  };

  const saveTasks = async (newTasks: ArchVizTask[]) => {
    if (!user) return;
    const metricsRef = doc(db, 'users', user.uid, 'data', 'archviz');
    await updateDoc(metricsRef, { tasks: newTasks });
  };

  return { metrics, loading, updateMetrics, saveTasks };
}
