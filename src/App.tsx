import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/store/useAuth';
import { Loader2 } from 'lucide-react';

import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import ArchViz from '@/pages/ArchViz';
import Learning from '@/pages/Learning';
import Library from '@/pages/Library';
import Journal from '@/pages/Journal';
import Progress from '@/pages/Progress';
import Focus from '@/pages/Focus';
import AppLayout from '@/components/layout/AppLayout';
import { ThemeProvider } from '@/components/ThemeProvider';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const { user, setUser, setLoading } = useAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [setUser, setLoading]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="founderos-theme">
      <Router>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="archviz" element={<ArchViz />} />
            <Route path="learning" element={<Learning />} />
            <Route path="library" element={<Library />} />
            <Route path="journal" element={<Journal />} />
            <Route path="progress" element={<Progress />} />
            <Route path="focus" element={<Focus />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
