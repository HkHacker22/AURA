'use client';

import { motion } from 'framer-motion';
import { TopAppBar } from '@/components/ui/top-app-bar';
import { BottomTabs } from '@/components/ui/bottom-tabs';

export default function WeeklyReport() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <TopAppBar title="Weekly Report" subtitle="Coming this week" />

      <div className="p-4 flex flex-col items-center justify-center h-64 text-center">
        <p className="text-muted-foreground">No report available yet</p>
        <p className="text-sm text-muted-foreground/60 mt-1">Weekly reports will generate automatically after your first week of using AURA</p>
      </div>

      <BottomTabs />
    </div>
  );
}