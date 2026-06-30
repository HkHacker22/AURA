'use client';

import { motion } from 'framer-motion';
import { cn, getPriorityBadgeColor, formatDuration, formatTime } from '@/lib/utils';
import { Task } from '@/types';
import { ProbabilityBar } from './probability-bar';

interface TaskCardProps {
  task: Task;
  onStatusChange?: (taskId: string, status: string) => void;
}

export function TaskCard({ task, onStatusChange }: TaskCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="glass rounded-xl p-4 space-y-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-base line-clamp-2">{task.content}</h3>
          <div className="flex items-center gap-2 mt-2">
            <span className={cn('text-xs px-2 py-1 rounded-full capitalize', getPriorityBadgeColor(task.priority))}>
              P{task.priority}
            </span>
            <span className="text-xs text-muted-foreground capitalize">{task.type}</span>
          </div>
        </div>
        <button
          onClick={() => onStatusChange?.(task.taskId, task.status === 'in_progress' ? 'pending' : 'in_progress')}
          className="shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
        >
          <div className="w-5 h-5 rounded-full border-2 border-primary" />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Estimated</span>
          <span className="font-medium">{formatDuration(task.estimatedMinutes)}</span>
        </div>
        
        {task.scheduledSlots.length > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Scheduled</span>
            <span className="font-medium">
              {formatTime(task.scheduledSlots[0].start)} - {formatTime(task.scheduledSlots[0].end)}
            </span>
          </div>
        )}
      </div>

      <ProbabilityBar probability={task.failureProbability * 100} size="sm" />
    </motion.div>
  );
}