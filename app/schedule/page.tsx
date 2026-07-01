'use client';

import { motion } from 'framer-motion';
import { TopAppBar } from '@/components/ui/top-app-bar';
import { BottomTabs } from '@/components/ui/bottom-tabs';

export default function Schedule() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <TopAppBar title="Schedule" subtitle="Your day at a glance" />

      <div className="p-4 flex flex-col items-center justify-center h-64 text-center">
        <p className="text-muted-foreground">No schedule yet</p>
        <p className="text-sm text-muted-foreground/60 mt-1">Use planner agent to optimize your day</p>
      </div>

      <BottomTabs />
    </div>
  );
}