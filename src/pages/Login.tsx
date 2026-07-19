import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, OWNER_EMAIL } from '@/lib/firebase';
import { useAuth } from '@/store/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Leaf } from 'lucide-react';
import loginBg from '@/assets/login_bg.png';

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
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-4 relative"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      {/* Dark/Green overlay for readability and cool aesthetic */}
      <div className="absolute inset-0 bg-green-950/40 backdrop-blur-[2px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm relative z-10 p-8 rounded-3xl bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 shadow-2xl"
      >
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center mb-4 border border-green-500/30 shadow-inner">
            <Leaf className="w-6 h-6 text-green-400" />
          </div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 drop-shadow-md">
            FounderOS
          </h1>
          <p className="text-green-100/80 text-sm tracking-wide">
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
              className="h-12 bg-black/20 border-white/20 text-white placeholder:text-white/50 text-center text-lg tracking-widest focus-visible:ring-1 focus-visible:ring-green-400 transition-all rounded-xl backdrop-blur-md"
              autoFocus
              autoComplete="current-password"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm text-center bg-red-900/20 py-2 rounded-lg border border-red-500/20"
            >
              {error}
            </motion.p>
          )}

          <Button
            type="submit"
            disabled={isLoading || !passcode}
            className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20 transition-all font-medium tracking-wide border border-green-500/50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enter OS'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
