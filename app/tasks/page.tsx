'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { TopAppBar } from '@/components/ui/top-app-bar';
import { BottomTabs } from '@/components/ui/bottom-tabs';
import { TaskCard } from '@/components/ui/task-card';
import { tasks as allTasks } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const filters = ['All', 'Pending', 'In Progress', 'Completed'] as const;

export default function Tasks() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredTasks = activeFilter === 'All'
    ? allTasks
    : allTasks.filter(t => {
        if (activeFilter === 'Pending') return t.status === 'pending' || t.status === 'deferred';
        if (activeFilter === 'In Progress') return t.status === 'in_progress';
        if (activeFilter === 'Completed') return t.status === 'completed';
        return true;
      });

  return (
    <div className="min-h-screen bg-background">
      <TopAppBar title="Tasks" subtitle="All your work" />
      
      <div className="flex flex-col h-[calc(100vh-140px)]">
        <div className="flex gap-2 px-4 pt-4 pb-2 overflow-x-auto scrollbar-hide shrink-0">
          {filters.map((filter, i) => (
            <motion.button
              key={filter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                'px-4 py-2 rounded-full text-sm capitalize transition-colors whitespace-nowrap',
                activeFilter === filter
                  ? 'bg-primary text-white'
                  : 'bg-white/5 hover:bg-white/10'
              )}
            >
              {filter}
            </motion.button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-28 scrollbar-hide">
          <div className="space-y-3 pt-2">
            {filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <p className="text-muted-foreground">No tasks found</p>
              </div>
            ) : (
              filteredTasks.map((task, i) => (
                <motion.div
                  key={task.taskId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <TaskCard
                    task={task}
                    onStatusChange={() => toast.success('Coming soon — real sync with Firestore')}
                  />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      <BottomTabs />
    </div>
  );
}
