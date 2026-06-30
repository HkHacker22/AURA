'use client';

import { motion } from 'framer-motion';
import { TopAppBar } from '@/components/ui/top-app-bar';
import { GlassCard } from '@/components/ui/glass-card';
import { BottomTabs } from '@/components/ui/bottom-tabs';
import { schedule } from '@/lib/mock-data';
import { formatTime, formatDuration } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function Schedule() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <TopAppBar title="Schedule" subtitle="Your day at a glance" />

      <div className="p-4">
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10" />
          
          <div className="space-y-6">
            {schedule.slots.map((slot, i) => {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative flex items-start gap-4"
                >
                  <div className="absolute left-6 top-3 w-3 h-3 rounded-full bg-primary -translate-x-1/2 z-10" />
                  
                  <div className="ml-12 flex-1">
                    <GlassCard className={cn(
                      slot.locked && 'ring-2 ring-primary/30'
                    )}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{slot.title}</h3>
                          <p className="text-sm text-muted-foreground capitalize mt-1">
                            {slot.type} • {slot.energyLevel && `${slot.energyLevel} energy`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {formatTime(slot.start)} - {formatTime(slot.end)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDuration((slot.end.getTime() - slot.start.getTime()) / 60000)}
                          </p>
                        </div>
                      </div>
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