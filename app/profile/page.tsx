'use client';

import { motion } from 'framer-motion';
import { TopAppBar } from '@/components/ui/top-app-bar';
import { GlassCard } from '@/components/ui/glass-card';
import { BottomTabs } from '@/components/ui/bottom-tabs';
import { cn } from '@/lib/utils';
import { User, Settings, Bell, Shield, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/auth');
  };

  const menuItems = [
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: Bell, label: 'Notifications', href: '/notifications' },
    { icon: Shield, label: 'Privacy & Security', href: '/settings/privacy' },
    { icon: LogOut, label: 'Sign Out', onClick: handleSignOut, danger: true },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopAppBar title="Profile" subtitle="Your account" />

      <div className="p-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Alex Johnson</h2>
            <p className="text-muted-foreground">alex@company.com</p>
          </div>
        </motion.div>

        <GlassCard>
          <h3 className="font-semibold mb-4">Subscription</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Free Plan</p>
              <p className="text-sm text-muted-foreground">Upgrade for premium insights</p>
            </div>
            <button className="px-4 py-2 rounded-full bg-primary text-sm font-medium">
              Upgrade
            </button>
          </div>
        </GlassCard>

        <div className="space-y-3">
          {menuItems.map((item, i) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              onClick={item.onClick}
              className="w-full glass rounded-xl p-4 flex items-center gap-3"
            >
              <item.icon className={cn('w-5 h-5', item.danger ? 'text-danger' : 'text-muted-foreground')} />
              <span className={cn('font-medium', item.danger ? 'text-danger' : '')}>{item.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <BottomTabs />
    </div>
  );
}