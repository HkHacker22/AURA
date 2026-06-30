'use client';

import { motion } from 'framer-motion';
import { TopAppBar } from '@/components/ui/top-app-bar';
import { GlassCard } from '@/components/ui/glass-card';
import { BottomTabs } from '@/components/ui/bottom-tabs';
import { Bell, Brain, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

const notifications = [
  {
    id: 1,
    icon: Calendar,
    title: 'Schedule Updated',
    description: 'Your afternoon has been reorganized. 2 focus blocks added.',
    time: '5 min ago',
    unread: true,
    color: 'text-primary',
  },
  {
    id: 2,
    icon: Brain,
    title: 'Research Complete',
    description: 'Brief ready for tomorrow\'s investor meeting.',
    time: '12 min ago',
    unread: true,
    color: 'text-secondary',
  },
  {
    id: 3,
    icon: AlertTriangle,
    title: 'Deadline Alert',
    description: 'Q3 budget has a 45% failure probability. Consider adjusting.',
    time: '1 hr ago',
    unread: true,
    color: 'text-danger',
  },
  {
    id: 4,
    icon: CheckCircle,
    title: 'Task Completed',
    description: 'Deep work session finished. 3 pomodoros completed.',
    time: '2 hr ago',
    unread: false,
    color: 'text-success',
  },
  {
    id: 5,
    icon: Calendar,
    title: 'Save Me Available',
    description: 'You have a high task load today. Save Me is ready if needed.',
    time: '3 hr ago',
    unread: false,
    color: 'text-primary',
  },
];

export default function Notifications() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <TopAppBar title="Notifications" subtitle="Stay informed" />

      <div className="p-4 space-y-3">
        {notifications.map((notification, i) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard className={notification.unread ? 'ring-1 ring-primary/30' : ''}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <notification.icon className={`w-5 h-5 ${notification.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-sm">{notification.title}</h3>
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">{notification.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <BottomTabs />
    </div>
  );
}