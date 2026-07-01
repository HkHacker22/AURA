'use client';

import { motion } from 'framer-motion';
import { TopAppBar } from '@/components/ui/top-app-bar';
import { GlassCard } from '@/components/ui/glass-card';
import { AgentCard } from '@/components/ui/agent-card';
import { ProbabilityBar } from '@/components/ui/probability-bar';
import { FloatingMicButton } from '@/components/ui/floating-mic-button';
import { BottomTabs } from '@/components/ui/bottom-tabs';
import { BackgroundLines } from '@/components/ui/background-lines';
import { formatDate, formatDuration } from '@/lib/utils';
import { agents, schedule, weeklyReport } from '@/lib/mock-data';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const today = new Date();
  const router = useRouter();

  const handleTranscribe = (text: string) => {
    localStorage.setItem('aura_pending_transcript', text);
    router.push('/brain-dump');
  };

  return (
    <div className="min-h-screen bg-background pb-24 relative">
      <BackgroundLines className="min-h-screen bg-background">
        <TopAppBar 
          title="AURA" 
          subtitle="One Mind Ahead" 
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 space-y-6 relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-6 flex items-center justify-between"
          >
            <div>
              <h2 className="text-2xl font-bold">Good morning</h2>
              <p className="text-muted-foreground">{formatDate(today)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Today&apos;s Success</p>
              <p className="text-3xl font-bold text-primary">89%</p>
            </div>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-lg font-semibold mb-3 px-2">Your Agents</h2>
            <div className="space-y-3">
              {agents.map((agent, i) => (
                <motion.div
                  key={agent.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <AgentCard agent={agent} />
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-3 px-2">
              <h2 className="text-lg font-semibold">Today&apos;s Plan</h2>
              <Link href="/schedule" className="text-sm text-primary">
                See All
              </Link>
            </div>
            <div className="space-y-3">
              {schedule.slots.slice(0, 3).map((slot, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-lg p-4 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-primary font-semibold text-sm">
                      {slot.start.getHours()}:{slot.start.getMinutes().toString().padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{slot.title}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {slot.type} &bull; {formatDuration((slot.end.getTime() - slot.start.getTime()) / 60000)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-lg font-semibold mb-3 px-2">This Week</h2>
            <GlassCard>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tasks Completed</span>
                  <span className="font-semibold">{weeklyReport.completedTasks}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Focus Minutes</span>
                  <span className="font-semibold">{weeklyReport.totalFocusMinutes}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Productivity Score</span>
                  <span className="font-semibold text-primary">{weeklyReport.productivityScore}</span>
                </div>
              </div>
            </GlassCard>
          </motion.section>
        </motion.div>

        <FloatingMicButton onTranscribe={handleTranscribe} />
        <BottomTabs />
      </BackgroundLines>
    </div>
  );
}
