'use client';

import { motion } from 'framer-motion';
import { TopAppBar } from '@/components/ui/top-app-bar';
import { GlassCard } from '@/components/ui/glass-card';
import { BottomTabs } from '@/components/ui/bottom-tabs';
import { BackgroundLines } from '@/components/ui/background-lines';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';
import { cn } from '@/lib/utils';
import { Settings, Bell, Shield, CreditCard, LogOut, ChevronRight } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Profile() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      router.push('/auth');
    } catch {
      toast.error('Sign out failed');
    }
  };

  const navigate = (href: string) => () => router.push(href);

  const menuItems = [
    { icon: Settings, label: 'Account Settings', onClick: navigate('/settings') },
    { icon: Bell, label: 'Notifications', onClick: navigate('/notifications') },
    { icon: Shield, label: 'Privacy & Security', onClick: navigate('/settings') },
    { icon: CreditCard, label: 'Subscription', onClick: navigate('/settings'), badge: 'Free Plan' },
    { icon: LogOut, label: 'Sign Out', onClick: handleSignOut, danger: true },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#FBFAFC] pb-32 relative overflow-x-hidden">
      {/* Background animates slowly behind */}
      <div className="fixed inset-0 z-0 h-screen w-screen opacity-30 pointer-events-none">
        <BackgroundGradientAnimation
          gradientBackgroundStart="rgb(12, 8, 20)"
          gradientBackgroundEnd="rgb(22, 10, 28)"
          firstColor="236, 72, 153"
          secondColor="217, 70, 239"
          thirdColor="139, 92, 246"
          fourthColor="99, 102, 241"
          fifthColor="124, 58, 237"
          interactive={false}
          size="60%"
          containerClassName="w-full h-full"
        />
      </div>

      <div className="relative z-10">
        <TopAppBar title="AURA" />

        <div className="max-w-6xl mx-auto px-4 md:px-8 mt-6">
        
        {/* Responsive layout: Side-by-side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Avatar & Header */}
          <div className="lg:col-span-5 bg-white/[0.01] border border-white/5 rounded-[20px] overflow-hidden relative h-[280px] lg:h-[350px]">
            <BackgroundLines className="absolute inset-0 w-full h-full bg-transparent dark:bg-transparent flex flex-col items-center justify-center">
              <div className="relative z-10 flex flex-col items-center text-center mt-6">
                
                {/* AJ Avatar with Neon Glowing Ring */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="relative w-22 h-22 rounded-full bg-[#111827] border-2 border-purple-500/30 flex items-center justify-center text-2xl font-bold text-white shadow-[0_0_24px_rgba(168,85,247,0.25)] animate-pulse"
                >
                  AJ
                  
                  {/* Outer pulsing ring */}
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 rounded-full border border-purple-500/10 -z-10"
                  />
                </motion.div>

                <h2 className="text-xl font-bold mt-4 text-white">Alex Johnson</h2>
                <p className="text-xs text-muted-foreground mt-1">alex@company.com</p>
                
              </div>
            </BackgroundLines>
          </div>

          {/* Right Column: Settings menu options */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-4 px-1">Settings & Preferences</h3>
            
            {menuItems.map((item, i) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                onClick={item.onClick}
                className="w-full glass rounded-2xl p-4.5 flex items-center justify-between group hover:bg-white/[0.06] hover:border-white/10 active:scale-[0.99] transition-all duration-300"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center bg-white/[0.02] border border-white/5 group-hover:bg-white/5 transition-all",
                    item.danger && "bg-danger/5 border-danger/10 group-hover:bg-danger/10"
                  )}>
                    <item.icon className={cn('w-4.5 h-4.5', item.danger ? 'text-danger' : 'text-purple-400')} />
                  </div>
                  <span className={cn('text-sm font-semibold text-white/90', item.danger && 'text-danger')}>{item.label}</span>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  {item.badge && (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
                </div>
              </motion.button>
            ))}
          </div>

        </div>

      </div>

      </div>

      <BottomTabs />
    </div>
  );
}