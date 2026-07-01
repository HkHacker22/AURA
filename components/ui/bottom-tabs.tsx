'use client';

import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Brain, 
  Calendar as CalendarIcon, 
  CheckSquare, 
  Save,
  User 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/brain-dump', label: 'Brain Dump', icon: Brain },
  { href: '/schedule', label: 'Schedule', icon: CalendarIcon },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/profile', label: 'Profile', icon: User },
];

export function BottomTabs() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-dark border-t border-white/10 z-50">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <motion.button
              key={tab.href}
              whileTap={{ scale: 0.9 }}
              onClick={() => router.push(tab.href)}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-lg relative',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                />
              )}
            </motion.button>
          );
        })}
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ rotate: 12 }}
          onClick={() => router.push('/save-me')}
          className={cn(
            'flex flex-col items-center gap-1 px-2.5 py-2 rounded-xl',
            'bg-danger text-white shadow-lg shadow-danger/25'
          )}
        >
          <Save className="w-5 h-5" />
          <span className="text-[10px] font-medium leading-tight">Save Me</span>
        </motion.button>
      </div>
    </nav>
  );
}
