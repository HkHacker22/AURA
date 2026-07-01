'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { TopAppBar } from '@/components/ui/top-app-bar';
import { GlassCard } from '@/components/ui/glass-card';
import { BottomTabs } from '@/components/ui/bottom-tabs';
import { Switch } from '@/components/ui/switch';

export default function Settings() {
  const [toggles, setToggles] = useState({
    'Dark Mode': true,
    'Proactive Alerts': true,
    'Voice Input': true,
    'Calendar Sync': true,
    'Weekly Reports': true,
  });

  const settings = [
    { label: 'Dark Mode', key: 'Dark Mode' as const },
    { label: 'Proactive Alerts', key: 'Proactive Alerts' as const },
    { label: 'Voice Input', key: 'Voice Input' as const },
    { label: 'Calendar Sync', key: 'Calendar Sync' as const },
    { label: 'Weekly Reports', key: 'Weekly Reports' as const },
  ];

  const personality = [
    { label: 'Directness', value: 80 },
    { label: 'Empathy', value: 60 },
    { label: 'Humour', value: 30 },
    { label: 'Challenge Level', value: 90 },
  ];

  const handleToggle = (label: string, checked: boolean) => {
    setToggles(prev => ({ ...prev, [label]: checked }));
    toast.success(`${label} ${checked ? 'enabled' : 'disabled'} — saved locally`);
  };

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
                <Switch
                  checked={toggles[setting.key]}
                  onCheckedChange={(checked) => handleToggle(setting.label, checked)}
                />
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