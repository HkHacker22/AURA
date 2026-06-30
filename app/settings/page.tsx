'use client';

import { motion } from 'framer-motion';
import { TopAppBar } from '@/components/ui/top-app-bar';
import { GlassCard } from '@/components/ui/glass-card';
import { BottomTabs } from '@/components/ui/bottom-tabs';
import { Switch } from '@/components/ui/switch';

export default function Settings() {
  const settings = [
    { label: 'Dark Mode', enabled: true },
    { label: 'Proactive Alerts', enabled: true },
    { label: 'Voice Input', enabled: true },
    { label: 'Calendar Sync', enabled: true },
    { label: 'Weekly Reports', enabled: true },
  ];

  const personality = [
    { label: 'Directness', value: 80 },
    { label: 'Empathy', value: 60 },
    { label: 'Humour', value: 30 },
    { label: 'Challenge Level', value: 90 },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopAppBar title="Settings" subtitle="Customize AURA" showNotifications={false} />

      <div className="p-4 space-y-6">
        <GlassCard>
          <h3 className="font-semibold mb-4">Preferences</h3>
          <div className="space-y-4">
            {settings.map((setting, i) => (
              <motion.div
                key={setting.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between"
              >
                <span className="text-sm">{setting.label}</span>
                <Switch checked={setting.enabled} />
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="font-semibold mb-4">AI Personality</h3>
          <div className="space-y-4">
            {personality.map((trait, i) => (
              <motion.div
                key={trait.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">{trait.label}</span>
                  <span className="text-sm text-primary">{trait.value}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${trait.value}%` }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-primary rounded-full h-2"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      <BottomTabs />
    </div>
  );
}