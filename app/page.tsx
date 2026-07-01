'use client';

import { motion } from 'framer-motion';
import { TopAppBar } from '@/components/ui/top-app-bar';
import { GlassCard } from '@/components/ui/glass-card';
import { AgentCard } from '@/components/ui/agent-card';
import { FloatingMicButton } from '@/components/ui/floating-mic-button';
import { BottomTabs } from '@/components/ui/bottom-tabs';
import { BackgroundLines } from '@/components/ui/background-lines';
import { formatDate } from '@/lib/utils';
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
              {['planner', 'research', 'reflection', 'focus'].map((name, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <AgentCard agent={{
                    name,
                    status: 'idle' as const,
                    color: 'bg-secondary',
                  }} />
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
            <div className="glass rounded-lg p-6 text-center text-muted-foreground">
              <p>No items scheduled yet. Use brain-dump or planner to create your day.</p>
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
                  <span className="font-semibold">—</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Focus Minutes</span>
                  <span className="font-semibold">—</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Productivity Score</span>
                  <span className="font-semibold text-primary">—</span>
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
