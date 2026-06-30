'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TopAppBar } from '@/components/ui/top-app-bar';
import { GlassCard } from '@/components/ui/glass-card';
import { BottomTabs } from '@/components/ui/bottom-tabs';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';
import { ProbabilityBar } from '@/components/ui/probability-bar';
import { formatDuration } from '@/lib/utils';
import { SurvivalChecklist } from '@/types';
import { schedule, tasks } from '@/lib/mock-data';

export default function SaveMe() {
  const [isActive, setIsActive] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const survivalData: SurvivalChecklist = {
    items: tasks.filter(t => t.priority <= 2),
    successProbability: 0.73,
    pomodoroPlan: tasks.filter(t => t.priority <= 2).map(t => ({ task: t, cycles: 2 })),
    compressedSchedule: { ...schedule, compressed: true },
  };

  const handleActivate = () => {
    setIsActive(true);
    setTimeout(() => setShowResult(true), 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopAppBar title="Save Me" subtitle="Emergency mode" showNotifications={false} />

      <div className="p-4">
        {!isActive ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-[70vh]"
          >
            <BackgroundGradientAnimation
              gradientBackgroundStart="rgb(40, 0, 0)"
              gradientBackgroundEnd="rgb(20, 0, 10)"
              firstColor="220, 38, 38"
              secondColor="239, 68, 68"
              thirdColor="185, 28, 28"
              fourthColor="127, 29, 29"
              fifthColor="220, 38, 38"
              pointerColor="239, 68, 68"
              size="50%"
              blendingValue="hard-light"
              interactive={false}
              containerClassName="!w-72 !h-72 !rounded-full"
              className="flex items-center justify-center w-full h-full"
            >
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleActivate}
                className="relative w-48 h-48 rounded-full bg-danger/80 flex items-center justify-center group overflow-hidden shadow-2xl shadow-danger/40 z-10"
              >
                <span className="text-2xl font-bold text-white">SAVE ME</span>
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-danger/30"
                />
              </motion.button>
            </BackgroundGradientAnimation>
            
            <p className="text-center text-muted-foreground mt-8 max-w-sm">
              Feeling overwhelmed? Tap the button to compress your schedule, cancel low-priority tasks, and get an actionable survival plan.
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {showResult ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <h2 className="text-2xl font-bold">Survival Plan Activated</h2>
                  <div className="mt-4 flex justify-center">
                    <ProbabilityBar probability={survivalData.successProbability * 100} size="lg" />
                  </div>
                </motion.div>

                <GlassCard>
                  <h3 className="font-semibold mb-3">Compressed Schedule</h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-hide">
                    {survivalData.compressedSchedule.slots.slice(0, 4).map((slot, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold">
                            {slot.start.getHours()}:{slot.start.getMinutes().toString().padStart(2, '0')}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{slot.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDuration((slot.end.getTime() - slot.start.getTime()) / 60000)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard>
                  <h3 className="font-semibold mb-3">Pomodoro Survival Plan</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide">
                    {survivalData.pomodoroPlan.map((plan, i) => (
                      <motion.div
                        key={plan.task.taskId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {i + 1}
                          </div>
                          <span className="text-sm truncate">{plan.task.content}</span>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {plan.cycles} cycles
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-64"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 rounded-full border-4 border-danger/30 border-t-danger"
                />
                <p className="mt-4 text-muted-foreground">Compressing schedule...</p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      <BottomTabs />
    </div>
  );
}
