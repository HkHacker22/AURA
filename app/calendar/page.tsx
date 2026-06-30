'use client';

import { motion } from 'framer-motion';
import { TopAppBar } from '@/components/ui/top-app-bar';
import { GlassCard } from '@/components/ui/glass-card';
import { BottomTabs } from '@/components/ui/bottom-tabs';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({ length: 24 }, (_, i) => i);

export default function Calendar() {
  const today = new Date().getDay();

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopAppBar title="Calendar" subtitle="June 2026" />

      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold">June 2026</h2>
          <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <GlassCard>
          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
            
            {Array.from({ length: 35 }).map((_, i) => {
              const dayNum = i - 6;
              const isToday = dayNum === 27;
              const hasEvents = [12, 15, 22, 27].includes(dayNum);
              
              if (dayNum < 1) return <div key={i} />;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  className={cn(
                    'aspect-square rounded-lg flex items-center justify-center relative cursor-pointer',
                    isToday ? 'bg-primary text-white' : 'bg-white/5 hover:bg-white/10',
                    'transition-all duration-200'
                  )}
                >
                  <span className={cn('text-sm', isToday && 'font-bold')}>{dayNum}</span>
                  {hasEvents && !isToday && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5">
                      <div className="w-1 h-1 bg-primary rounded-full" />
                      <div className="w-1 h-1 bg-secondary rounded-full" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </GlassCard>

        <div className="space-y-3">
          {[{ time: '9:00 - 10:30', title: 'Deep Work Session', type: 'focus' as const }, 
            { time: '14:30 - 15:00', title: 'Investor Meeting Prep', type: 'prep' as const },
            { time: '16:00 - 17:00', title: 'Design Review', type: 'meeting' as const }].map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <GlassCard>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-medium">{event.time.split(' ')[0]}</span>
                  </div>
                  <div>
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{event.type}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      <BottomTabs />
    </div>
  );
}