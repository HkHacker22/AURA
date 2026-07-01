'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TopAppBar } from '@/components/ui/top-app-bar';
import { GlassCard } from '@/components/ui/glass-card';
import { BottomTabs } from '@/components/ui/bottom-tabs';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({ length: 24 }, (_, i) => i);

export default function Calendar() {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());

  const monthName = new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const today = now.getDate();

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else { setCurrentMonth(m => m - 1); }
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else { setCurrentMonth(m => m + 1); }
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0=Sun
  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Mon-start
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  const isToday = (d: number) =>
    d === today && currentMonth === now.getMonth() && currentYear === now.getFullYear();

  const hasEvents = (d: number) => [5, 8, 12, 15, 22, 27].includes(d);

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopAppBar title="Calendar" subtitle={monthName} />

      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold">{monthName}</h2>
          <button
            onClick={nextMonth}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
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
            
            {Array.from({ length: totalCells }).map((_, i) => {
              const dayNum = i - startOffset + 1;
              
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