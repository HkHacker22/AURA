'use client';

import { motion } from 'framer-motion';
import { TopAppBar } from '@/components/ui/top-app-bar';
import { GlassCard } from '@/components/ui/glass-card';
import { BottomTabs } from '@/components/ui/bottom-tabs';
import { CheckCircle2, Circle, Target } from 'lucide-react';

const timelineEvents = [
  { id: 1, type: 'goal', title: 'Launch AURA MVP', date: '2026 Q3', progress: 65 },
  { id: 2, type: 'milestone', title: 'Complete Product Design', date: 'Jun 15, 2026', progress: 100 },
  { id: 3, type: 'achievement', title: '100 Focus Hours', date: 'Jun 20, 2026', progress: 100 },
  { id: 4, type: 'goal', title: 'Build User Base', date: '2026 Q4', progress: 42 },
  { id: 5, type: 'task_completed', title: 'Investor Pitch', date: 'Jun 18, 2026', progress: 100 },
];

export default function Timeline() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <TopAppBar title="Life Timeline" subtitle="Your journey" />

      <div className="p-4">
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-success to-secondary" />
          
          <div className="space-y-6">
            {timelineEvents.map((event, i) => {
              const isCompleted = event.progress === 100;
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative flex items-start gap-4"
                >
                  <div className="absolute left-6 top-3 w-4 h-4 rounded-full bg-background -translate-x-1/2 z-10">
                    {event.type === 'goal' && <Target className="w-4 h-4 text-primary" />}
                    {event.type === 'milestone' && <Circle className="w-4 h-4 text-secondary" />}
                    {event.type === 'achievement' && <CheckCircle2 className="w-4 h-4 text-success" />}
                    {event.type === 'task_completed' && <CheckCircle2 className="w-4 h-4 text-success" />}
                  </div>

                  <div className="ml-12 flex-1">
                    <GlassCard>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{event.title}</h3>
                        <span className="text-xs text-muted-foreground">{event.date}</span>
                      </div>
                      
                      {event.progress < 100 && (
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${event.progress}%` }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-primary rounded-full h-2"
                          />
                        </div>
                      )}
                    </GlassCard>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <BottomTabs />
    </div>
  );
}