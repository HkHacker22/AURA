'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TopAppBar } from '@/components/ui/top-app-bar';
import { GlassCard } from '@/components/ui/glass-card';
import { BottomTabs } from '@/components/ui/bottom-tabs';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';
import { AlertTriangle, CheckCircle, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface SaveMeResult {
  overloaded: boolean;
  workloadScore: number;
  suggestedActions: string[];
  priorityAdjustments?: Array<{
    taskId: string;
    from: string;
    to: string;
    reason: string;
  }>;
}

export default function SaveMe() {
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SaveMeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleActivate = async () => {
    setIsActive(true);
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/save-me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskData: {
            taskCount: 12,
            highPriorityCount: 5,
            meetingCount: 4,
            meetingHours: 5,
            estimatedHours: 8,
            availableHours: 6,
          },
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data: SaveMeResult = await res.json();
      setResult(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to analyze workload';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
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
              Feeling overwhelmed? Tap the button to analyze your workload and get an actionable survival plan.
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {isLoading ? (
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
                <p className="mt-4 text-muted-foreground">Analyzing workload...</p>
              </motion.div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-64 text-center"
              >
                <AlertTriangle className="w-12 h-12 text-danger mb-4" />
                <p className="text-muted-foreground mb-4">{error}</p>
                <button
                  onClick={handleActivate}
                  className="px-6 py-2 rounded-full bg-primary text-sm font-medium"
                >
                  Try Again
                </button>
              </motion.div>
            ) : result && (
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
                  <h2 className="text-2xl font-bold">
                    {result.overloaded ? 'Survival Plan Activated' : 'You\'re Managing Okay'}
                  </h2>
                  <div className="mt-4 flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Workload Score</span>
                      <span className={cn(
                        'text-lg font-bold',
                        result.workloadScore > 65 ? 'text-danger' :
                        result.workloadScore > 40 ? 'text-warning' :
                        'text-success'
                      )}>
                        {result.workloadScore}%
                      </span>
                    </div>
                    <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.workloadScore}%` }}
                        transition={{ duration: 0.5 }}
                        className={cn(
                          'h-full rounded-full',
                          result.workloadScore > 65 ? 'bg-danger' :
                          result.workloadScore > 40 ? 'bg-warning' :
                          'bg-success'
                        )}
                      />
                    </div>
                  </div>
                </motion.div>

                <GlassCard>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Suggested Actions
                  </h3>
                  <div className="space-y-2">
                    {result.suggestedActions.map((action, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-white/5"
                      >
                        <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-sm">{action}</span>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>

                {result.priorityAdjustments && result.priorityAdjustments.length > 0 && (
                  <GlassCard>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <ArrowUpDown className="w-4 h-4 text-warning" />
                      Priority Adjustments
                    </h3>
                    <div className="space-y-2">
                      {result.priorityAdjustments.map((adj, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-3 rounded-lg bg-white/5"
                        >
                          <div className="flex items-center gap-2 text-sm mb-1">
                            <span className="text-muted-foreground">{adj.from}</span>
                            <span className="text-muted-foreground">→</span>
                            <span className={cn(
                              'font-medium',
                              adj.to === 'low' ? 'text-muted-foreground' :
                              adj.to === 'medium' ? 'text-warning' : 'text-danger'
                            )}>
                              {adj.to}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{adj.reason}</p>
                        </motion.div>
                      ))}
                    </div>
                  </GlassCard>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      <BottomTabs />
    </div>
  );
}
