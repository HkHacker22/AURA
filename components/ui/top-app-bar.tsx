'use client';

import { motion } from 'framer-motion';
import { Bell, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopAppBarProps {
  title: string;
  subtitle?: string;
  showNotifications?: boolean;
}

export function TopAppBar({ title, subtitle, showNotifications = true }: TopAppBarProps) {
  const notificationCount = 3;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between px-4 py-3 glass-dark sticky top-0 z-40"
    >
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
          <Search className="w-5 h-5 text-muted-foreground" />
        </button>
        
        {showNotifications && (
          <button className="relative w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
            <Bell className="w-5 h-5 text-muted-foreground" />
            {notificationCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-danger rounded-full text-xs flex items-center justify-center text-white font-medium"
              >
                {notificationCount}
              </motion.span>
            )}
          </button>
        )}
      </div>
    </motion.header>
  );
}