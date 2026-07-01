'use client';

import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Brain, 
  Calendar, 
  CheckSquare, 
  User,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/brain-dump', label: 'Brain Dump', icon: Brain },
  { href: '/schedule', label: 'Schedule', icon: Calendar },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/save-me', label: 'Save Me', icon: Sparkles, isSpecial: true },
];

export function BottomTabs() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[90vw] sm:max-w-lg px-2">
      <nav className="glass-dark border border-white/10 rounded-full px-4 py-2.5 flex items-center justify-between shadow-2xl shadow-purple-500/10">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;

          if (tab.isSpecial) {
            return (
              <motion.button
                key={tab.href}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(tab.href)}
                className={cn(
                  "relative flex items-center justify-center p-3 rounded-full overflow-hidden transition-all duration-300",
                  isActive 
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30 ring-2 ring-pink-400"
                    : "bg-white/10 text-pink-400 hover:bg-white/20 hover:text-pink-300 shadow-md shadow-pink-500/5"
                )}
              >
                <Icon className="w-5 h-5" />
                {isActive && (
                  <motion.span 
                    layoutId="glow-ring"
                    className="absolute inset-0 rounded-full border border-pink-400 opacity-60"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          }

          return (
            <motion.button
              key={tab.href}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(tab.href)}
              className={cn(
                "relative flex flex-col items-center justify-center py-2 px-3.5 rounded-full transition-all duration-300",
                isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-white"
              )}
            >
              <Icon className={cn("w-5 h-5 relative z-10", isActive ? "text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" : "")} />
              
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-white/10 rounded-full -z-0 border border-white/5 shadow-inner"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}
