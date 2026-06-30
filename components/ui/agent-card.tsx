'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface AgentCardProps {
  agent: {
    name: string;
    status: string;
    currentAction?: string;
    progress?: number;
    color: string;
  };
  isActive?: boolean;
}

export function AgentCard({ agent, isActive = false }: AgentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working': return 'bg-primary';
      case 'idle': return 'bg-success';
      default: return 'bg-muted';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        'glass rounded-xl p-4 flex items-center gap-4',
        isActive && 'ring-2 ring-primary/50'
      )}
    >
      <div className="relative">
        <div className={cn('w-12 h-12 rounded-full flex items-center justify-center', agent.color)}>
          <div className="text-white font-bold">
            {agent.name.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className={cn('absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background', getStatusColor(agent.status))} />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold capitalize truncate">{agent.name} Agent</h3>
        {agent.currentAction && (
          <p className="text-sm text-muted-foreground truncate">{agent.currentAction}</p>
        )}
      </div>
      
      {agent.progress !== undefined && (
        <div className="text-sm font-medium">{Math.round(agent.progress)}%</div>
      )}
    </motion.div>
  );
}