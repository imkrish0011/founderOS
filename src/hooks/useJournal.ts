import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/store/useAuth';

export interface JournalEntry {
  accomplished?: string;
  learned?: string;
  plan?: string;
  content?: string;
  date: string;
}

export function useJournal() {
  const { user } = useAuth();
  
  // Use YYYY-MM-DD for simple unique daily IDs
  const today = new Date().toLocaleDateString('en-CA'); // e.g., '2023-10-25'
  
  const [entry, setEntry] = useState<JournalEntry>({
    accomplished: '',
    learned: '',
    plan: '',
    date: today,
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    // We store daily entries as documents under a journal subcollection
    const journalRef = doc(db, 'users', user.uid, 'journal', today);
    
    const unsubscribe = onSnapshot(journalRef, (docSnap) => {
      if (docSnap.exists()) {
        setEntry(docSnap.data() as JournalEntry);
      } else {
        setEntry({
          accomplished: '',
          learned: '',
          plan: '',
          date: today,
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, today]);

  const saveEntry = async (updates: Partial<JournalEntry>) => {
    if (!user) return;
    setSaving(true);
    
    const newEntry = { ...entry, ...updates };
    setEntry(newEntry);
    
    try {
      const journalRef = doc(db, 'users', user.uid, 'journal', today);
      await setDoc(journalRef, newEntry, { merge: true });
    } catch (error) {
      console.error("Error saving journal:", error);
    } finally {
      setSaving(false);
    }
  };

  return { entry, saveEntry, loading, saving, today };
}
