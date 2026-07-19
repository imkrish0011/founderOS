import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, OWNER_EMAIL } from '@/lib/firebase';
import { useAuth } from '@/store/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) return;

    try {
      setIsLoading(true);
      setError('');
      // The passcode entered by the user acts as the password for the hidden email
      await signInWithEmailAndPassword(auth, OWNER_EMAIL, passcode);
    } catch (err: any) {
      console.error(err);
      setError('Incorrect passcode');
      setPasscode('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light tracking-tight text-foreground mb-2">
            FounderOS
          </h1>
          <p className="text-muted-foreground text-sm tracking-wide">
            Enter passcode to continue
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <Input
              type="password"
              placeholder="Passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="h-12 bg-charcoal-900/50 border-white/10 text-center text-lg tracking-widest focus-visible:ring-1 focus-visible:ring-white/20 transition-all rounded-xl"
              autoFocus
              autoComplete="current-password"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-destructive text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          <Button
            type="submit"
            disabled={isLoading || !passcode}
            className="w-full h-12 rounded-xl bg-white text-black hover:bg-white/90 transition-colors"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enter'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
