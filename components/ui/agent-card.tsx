'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface AgentCardProps {
  agent: {
    name: string;
    status: string; // 'online' | 'thinking' | 'idle'
    color?: string; // custom gradient classes
    avatarLetter?: string;
  };
  isActive?: boolean;
}

export function AgentCard({ agent, isActive = false }: AgentCardProps) {
  // Map agent names to specific visual properties
  const getAgentTheme = (name: string) => {
    switch (name.toLowerCase()) {
      case 'planner':
        return {
          bg: 'bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/20',
          text: 'text-purple-400',
          letter: 'P',
        };
      case 'research':
        return {
          bg: 'bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 border-cyan-500/20',
          text: 'text-cyan-400',
          letter: 'R',
        };
      case 'reflection':
        return {
          bg: 'bg-gradient-to-br from-indigo-600/20 to-indigo-800/20 border-indigo-500/20',
          text: 'text-indigo-400',
          letter: 'R',
        };
      case 'focus':
      default:
        return {
          bg: 'bg-gradient-to-br from-pink-600/20 to-pink-800/20 border-pink-500/20',
          text: 'text-pink-400',
          letter: 'F',
        };
    }
  };

  const theme = getAgentTheme(agent.name);

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'rounded-2xl p-4.5 backdrop-blur-xl bg-white/[0.03] border border-white/5 flex items-center gap-4 transition-all duration-300',
        isActive ? 'ring-2 ring-purple-500/50 bg-white/[0.06] border-white/10' : 'hover:bg-white/[0.05] hover:border-white/10'
      )}
    >
      <div className="relative shrink-0">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border border-white/10 shadow-lg', theme.bg, theme.text)}>
          {theme.letter}
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold capitalize text-white">{agent.name}</h4>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
          <span className="text-[11px] text-muted-foreground font-medium">Online</span>
        </div>
      </div>
    </motion.div>
  );
}