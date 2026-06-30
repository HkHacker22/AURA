'use client';

import { motion } from 'framer-motion';
import { TopAppBar } from '@/components/ui/top-app-bar';
import { GlassCard } from '@/components/ui/glass-card';
import { BottomTabs } from '@/components/ui/bottom-tabs';
import { weeklyReport } from '@/lib/mock-data';
import { formatDuration, cn } from '@/lib/utils';

export default function WeeklyReport() {
  const insights = [
    { label: 'Completion Rate', value: '78%', change: '+12%', positive: true },
    { label: 'Focus Sessions', value: '15', change: '+3', positive: true },
    { label: 'Peak Energy', value: '9-11 AM', change: 'stable', positive: undefined },
    { label: 'Interruptions', value: '8', change: '-12%', positive: true },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopAppBar title="Weekly Report" subtitle={weeklyReport.reportId} />

      <div className="p-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground mb-2">Productivity Score</p>
          <p className="text-5xl font-bold text-primary">{weeklyReport.productivityScore}</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          {insights.map((insight, i) => (
            <motion.div
              key={insight.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className="text-center">
                <p className="text-2xl font-bold">{insight.value}</p>
                <p className="text-xs text-muted-foreground">{insight.label}</p>
                {insight.positive !== undefined && (
                  <p className={cn(
                    'text-xs mt-1',
                    insight.positive ? 'text-success' : 'text-danger'
                  )}>
                    {insight.change}
                  </p>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <GlassCard>
          <h3 className="font-semibold mb-3">Habit Streaks</h3>
          <div className="space-y-3">
            {Object.entries(weeklyReport.habitStreaks).map(([habit, streak], i) => (
              <motion.div
                key={habit}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between"
              >
                <span className="capitalize text-sm">{habit}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{streak} days</span>
                  <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                    <span className="text-success text-xs">🔥</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="font-semibold mb-3">Recommendations</h3>
          <ul className="space-y-2">
            {weeklyReport.recommendations.map((rec, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="text-sm text-muted-foreground flex items-start gap-2"
              >
                <span className="text-primary mt-1">•</span>
                {rec}
              </motion.li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <BottomTabs />
    </div>
  );
}