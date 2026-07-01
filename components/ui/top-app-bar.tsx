'use client';

import { motion } from 'framer-motion';
import { Bell, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface TopAppBarProps {
  title: string;
  subtitle?: string;
  showNotifications?: boolean;
}

export function TopAppBar({ title, showNotifications = true }: TopAppBarProps) {
  const router = useRouter();

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between px-6 py-4 bg-transparent sticky top-0 z-40 backdrop-blur-md border-b border-white/[0.04]"
    >
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold tracking-wider text-white bg-clip-text">{title}</h1>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={() => router.push('/tasks')}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/[0.06] active:scale-95 transition-all"
        >
          <Search className="w-[18px] h-[18px] text-muted-foreground hover:text-white" strokeWidth={2} />
        </button>
        
        {showNotifications && (
          <button
            onClick={() => router.push('/notifications')}
            className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/[0.06] active:scale-95 transition-all"
          >
            <Bell className="w-[18px] h-[18px] text-muted-foreground hover:text-white" strokeWidth={2} />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_8px_#EC4899]"
            />
          </button>
        )}
      </div>
    </motion.header>
  );
}