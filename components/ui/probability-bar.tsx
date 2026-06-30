'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProbabilityBarProps {
  probability: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function ProbabilityBar({ probability, size = 'md', showLabel = true }: ProbabilityBarProps) {
  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const getProbabilityColor = (prob: number) => {
    if (prob >= 80) return 'bg-success';
    if (prob >= 60) return 'bg-yellow-500';
    if (prob >= 40) return 'bg-orange-500';
    return 'bg-danger';
  };

  return (
    <div className="flex items-center gap-3">
      {showLabel && (
        <span className="text-sm font-medium w-12 text-right">{Math.round(probability)}%</span>
      )}
      <div className="flex-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${probability}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={cn('rounded-full', heightClasses[size], getProbabilityColor(probability))}
        />
      </div>
    </div>
  );
}