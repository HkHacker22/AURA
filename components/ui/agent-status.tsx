'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { AgentName } from '@/types';

interface AgentStatusProps {
  agent: AgentName;
  status: 'idle' | 'working' | 'completed' | 'error';
  progress?: number;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  idle: { color: 'bg-muted', label: 'Idle' },
  working: { color: 'bg-primary', label: 'Working' },
  completed: { color: 'bg-success', label: 'Completed' },
  error: { color: 'bg-danger', label: 'Error' },
};

const sizeConfig = {
  sm: { dot: 'w-2 h-2', pulse: 'w-6 h-6' },
  md: { dot: 'w-3 h-3', pulse: 'w-8 h-8' },
  lg: { dot: 'w-4 h-4', pulse: 'w-10 h-10' },
};

export function AgentStatus({ agent, status, progress, size = 'sm' }: AgentStatusProps) {
  const config = statusConfig[status];
  const sizes = sizeConfig[size];

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex items-center justify-center">
        {status === 'working' && (
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={cn('rounded-full absolute', sizes.pulse, 'bg-primary/30')}
          />
        )}
        <div className={cn('rounded-full relative', sizes.dot, config.color)} />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm capitalize font-medium truncate">{agent}</p>
        <p className="text-xs text-muted-foreground">{config.label}</p>
      </div>

      {progress !== undefined && (
        <div className="text-xs font-medium text-muted-foreground">{Math.round(progress)}%</div>
      )}
    </div>
  );
}