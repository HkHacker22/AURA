'use client';

import { motion } from 'framer-motion';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';

export default function Auth() {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/dashboard');
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-8"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            AURA
          </h1>
          <p className="text-muted-foreground mt-2">One Mind Ahead</p>
        </div>

        <GlassCard>
          <h2 className="text-xl font-semibold mb-4">Welcome Back</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Sign in to access your AI executive assistant
          </p>
          
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.88 7.49-2.41l-3.57-2.77c-.98.66-2.23 1.06-3.75 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4.2 21.18 8.12 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.12c-.22-.66-.35-1.36-.35-2.08 0-.72.13-1.42.35-2.08V7.9h6.37c1.46.92 2.67 2.27 3.58 3.94l-.72 2.27c-.32-.95-.78-1.78-1.37-2.52L12 12.13 5.84 14.12z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 8.12 1 4.2 2.82 2.18 7.9l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-medium">Sign in with Google</span>
          </button>
        </GlassCard>
      </motion.div>
    </div>
  );
}