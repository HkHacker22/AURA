'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'dark';
  hover?: boolean;
}

export function GlassCard({ children, className, variant = 'light', hover = true }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -2, scale: 1.005 } : undefined}
      className={cn(
        'rounded-[20px] p-6 backdrop-blur-xl',
        variant === 'light' 
          ? 'bg-white/5 border border-white/8' 
          : 'bg-black/40 border border-white/5',
        'shadow-xl shadow-purple-500/5 hover:shadow-purple-500/10 hover:border-white/12',
        'transition-all duration-300 ease-out',
        className
      )}
    >
      {children}
    </motion.div>
  );
}