'use client';

import { motion } from 'framer-motion';
import { LucideIcon, CheckCircle2, Circle, Target, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineNodeProps {
  type: 'goal' | 'milestone' | 'achievement' | 'task_completed';
  title: string;
  date: string;
  progress: number;
  isLast?: boolean;
}

const nodeIcons: Record<string, LucideIcon> = {
  goal: Target,
  milestone: Circle,
  achievement: Star,
  task_completed: CheckCircle2,
};

const nodeColors: Record<string, string> = {
  goal: 'text-primary border-primary',
  milestone: 'text-secondary border-secondary',
  achievement: 'text-success border-success',
  task_completed: 'text-success border-success',
};

export function TimelineNode({ type, title, date, progress, isLast }: TimelineNodeProps) {
  const Icon = nodeIcons[type];
  const isCompleted = progress === 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative flex items-start gap-4 pb-8"
    >
      {!isLast && (
        <div className="absolute left-[13px] top-8 bottom-0 w-px bg-gradient-to-b from-primary/50 to-transparent" />
      )}
      
      <div className={cn(
        'w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1',
        isCompleted ? 'bg-success/20' : 'bg-white/5'
      )}>
        <Icon className={cn('w-4 h-4', isCompleted ? 'text-success' : 'text-muted-foreground')} />
      </div>

      <div className="flex-1">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-sm">{title}</h3>
            <span className="text-xs text-muted-foreground">{date}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={cn(
                'rounded-full h-1.5',
                isCompleted ? 'bg-success' : 'bg-primary'
              )}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}