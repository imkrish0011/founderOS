import { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/store/useAuth';

export interface CurriculumPhase {
  id: string;
  title: string;
  goal: string;
  duration: string;
  difficulty: string;
  modules: any[];
  projects: string[];
  checklist: string[];
}

export interface UserProgress {
  completedTopics: string[]; // PhaseID_ModuleIndex_TopicIndex
  completedProjects: string[]; // PhaseID_ProjectIndex
}

export function useCurriculum() {
  const { user } = useAuth();
  const [phases, setPhases] = useState<CurriculumPhase[]>([]);
  const [progress, setProgress] = useState<UserProgress>({
    completedTopics: [],
    completedProjects: [],
  });
  const [loading, setLoading] = useState(true);

  // Fetch Curriculum
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'curriculum'), (snapshot) => {
      const loadedPhases = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CurriculumPhase));
      // Sort phases correctly (e.g., Phase I, Phase II, ... Phase XIII)
      const romanToInt = (roman: string) => {
          const romanNumerals: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
          let result = 0;
          for (let i = 0; i < roman.length; i++) {
            if (i > 0 && romanNumerals[roman[i]] > romanNumerals[roman[i - 1]]) {
              result += romanNumerals[roman[i]] - 2 * romanNumerals[roman[i - 1]];
            } else {
              result += romanNumerals[roman[i]];
            }
          }
          return result;
      };
      loadedPhases.sort((a, b) => {
        const getRoman = (title: string) => {
            if (!title) return 0;
            const match = title.match(/Phase ([A-Z]+)/);
            return match ? romanToInt(match[1]) : 0;
        }
        return getRoman(a.title) - getRoman(b.title);
      });
      setPhases(loadedPhases);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Progress
  useEffect(() => {
    if (!user) return;
    const progressRef = doc(db, 'users', user.uid, 'data', 'progress');
    
    // Initialize if doesn't exist
    getDoc(progressRef).then(snap => {
      if (!snap.exists()) {
        setDoc(progressRef, { completedTopics: [], completedProjects: [] });
      }
    });

    const unsubscribe = onSnapshot(progressRef, (doc) => {
      if (doc.exists()) {
        setProgress(doc.data() as UserProgress);
      }
    });
    return () => unsubscribe();
  }, [user]);

  const toggleTopic = async (topicId: string) => {
    if (!user) return;
    const progressRef = doc(db, 'users', user.uid, 'data', 'progress');
    const newTopics = progress.completedTopics.includes(topicId)
      ? progress.completedTopics.filter(id => id !== topicId)
      : [...progress.completedTopics, topicId];
    
    await updateDoc(progressRef, { completedTopics: newTopics });
  };

  const toggleProject = async (projectId: string) => {
    if (!user) return;
    const progressRef = doc(db, 'users', user.uid, 'data', 'progress');
    const newProjects = progress.completedProjects.includes(projectId)
      ? progress.completedProjects.filter(id => id !== projectId)
      : [...progress.completedProjects, projectId];
    
    await updateDoc(progressRef, { completedProjects: newProjects });
  };

  return { phases, progress, loading, toggleTopic, toggleProject };
}
