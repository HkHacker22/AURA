'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'timeline' | 'agent';
  count?: number;
}

export function LoadingSkeleton({ variant = 'card', count = 3 }: LoadingSkeletonProps) {
  const variants = {
    card: Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: i * 0.1 }}
        className="glass rounded-xl p-6 space-y-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/5 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-white/5 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-white/5 rounded animate-pulse w-1/2" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-2 bg-white/5 rounded animate-pulse" />
          <div className="h-2 bg-white/5 rounded animate-pulse w-2/3" />
        </div>
      </motion.div>
    )),
    list: Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: i * 0.05 }}
        className="glass rounded-lg p-4 flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-white/5 rounded animate-pulse w-3/4" />
          <div className="h-2 bg-white/5 rounded animate-pulse w-1/2" />
        </div>
      </motion.div>
    )),
    timeline: Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: i * 0.05 }}
        className="flex items-start gap-4"
      >
        <div className="w-3 h-3 rounded-full bg-white/5 animate-pulse mt-2" />
        <div className="flex-1 glass rounded-xl p-4 space-y-2">
          <div className="h-4 bg-white/5 rounded animate-pulse w-1/2" />
          <div className="h-3 bg-white/5 rounded animate-pulse w-2/3" />
        </div>
      </motion.div>
    )),
    agent: Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: i * 0.05 }}
        className="glass rounded-xl p-4 flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-full bg-white/5 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/5 rounded animate-pulse w-1/3" />
          <div className="h-3 bg-white/5 rounded animate-pulse w-1/2" />
        </div>
        <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
      </motion.div>
    )),
  };

  return (
    <div className={cn(
      'space-y-3',
      variant === 'timeline' && 'space-y-6'
    )}>
      {variants[variant]}
    </div>
  );
}