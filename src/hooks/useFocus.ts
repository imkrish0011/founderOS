import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/store/useAuth';

export function useFocus() {
  const { user } = useAuth();

  const logSession = async (minutes: number) => {
    if (!user) return;
    
    // We log to a daily document
    const today = new Date().toLocaleDateString('en-CA');
    const focusRef = doc(db, 'users', user.uid, 'focus', today);
    
    try {
      const snap = await getDoc(focusRef);
      if (snap.exists()) {
        const data = snap.data();
        await updateDoc(focusRef, {
          minutes: (data.minutes || 0) + minutes,
          date: today
        });
      } else {
        await setDoc(focusRef, {
          minutes,
          date: today
        });
      }
    } catch (error) {
      console.error("Error logging focus session:", error);
    }
  };

  return { logSession };
}
