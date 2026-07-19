import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface LibraryResource {
  id: string;
  type: 'paper' | 'video' | 'book' | 'article';
  title: string;
  author: string;
  year: string;
  tags: string[];
}

export function useLibrary() {
  const [resources, setResources] = useState<LibraryResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'library'), (snapshot) => {
      const loadedResources = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LibraryResource));
      
      // Sort by Phase Tag logic if needed, or just alphabetical
      loadedResources.sort((a, b) => {
          const phaseA = a.tags[0] || '';
          const phaseB = b.tags[0] || '';
          return phaseA.localeCompare(phaseB);
      });

      setResources(loadedResources);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { resources, loading };
}
