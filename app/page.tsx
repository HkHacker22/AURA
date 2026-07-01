'use client';

import { motion } from 'framer-motion';
import { TopAppBar } from '@/components/ui/top-app-bar';
import { GlassCard } from '@/components/ui/glass-card';
import { AgentCard } from '@/components/ui/agent-card';
import { BottomTabs } from '@/components/ui/bottom-tabs';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';
import { Calendar, CheckCircle2, Clock, BarChart3, ChevronRight, Activity } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const today = new Date();
  
  // Format current date nicely
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  const scheduledTasks = [
    { time: '9:00 AM', title: 'Team Standup', type: 'meeting', color: 'border-purple-500 text-purple-400' },
    { time: '11:30 AM', title: 'Product Review', type: 'review', color: 'border-cyan-500 text-cyan-400' },
    { time: '2:00 PM', title: 'Deep Work Session', type: 'focus', color: 'border-pink-500 text-pink-400' },
    { time: '4:30 PM', title: 'Client Call', type: 'call', color: 'border-indigo-500 text-indigo-400' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#FBFAFC] pb-32 relative overflow-x-hidden">
      {/* Background animates slowly behind the dashboard */}
      <div className="fixed inset-0 z-0 h-screen w-screen opacity-35 pointer-events-none">
        <BackgroundGradientAnimation
          gradientBackgroundStart="rgb(10, 10, 15)"
          gradientBackgroundEnd="rgb(15, 10, 25)"
          firstColor="124, 58, 237"
          secondColor="99, 102, 241"
          thirdColor="6, 182, 212"
          fourthColor="236, 72, 153"
          fifthColor="79, 70, 229"
          size="60%"
          interactive={false}
          containerClassName="w-full h-full"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <TopAppBar title="AURA" />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* GREETING & PROGRESS RING BLOCK */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-12"
          >
            <GlassCard className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 relative overflow-hidden" hover={false}>
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
              <div>
                <span className="text-xs font-semibold tracking-widest text-purple-400 uppercase">One Mind Ahead</span>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1">
                  Good morning, Alex 👋
                </h2>
                <p className="text-muted-foreground mt-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  {formattedDate}
                </p>
              </div>

              {/* Progress Ring */}
              <div className="flex items-center gap-5 shrink-0 bg-white/[0.02] border border-white/5 rounded-2xl p-4.5 px-6">
                <div className="relative w-18 h-18">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-white/10"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <motion.path
                      initial={{ strokeDasharray: "0 100" }}
                      animate={{ strokeDasharray: "89 100" }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="text-purple-500"
                      strokeWidth="3.2"
                      strokeDasharray="89, 100"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-base text-white">
                    89%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Today's Goal</div>
                  <div className="text-lg font-bold text-white mt-0.5">89% Success</div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* AGENT STATUS GRID */}
          <div className="lg:col-span-12">
            <h3 className="text-lg font-semibold text-white px-1 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              Your Agents
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Planner', 'Research', 'Reflection', 'Focus'].map((name) => (
                <AgentCard key={name} agent={{ name, status: 'online' }} />
              ))}
            </div>
          </div>

          {/* TODAY'S PLAN TIMELINE */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                Today's Plan
              </h3>
              <Link href="/schedule" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 transition-colors">
                View all
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <GlassCard className="flex-1 space-y-5 p-6" hover={false}>
              <div className="relative border-l border-white/10 pl-6 ml-2.5 space-y-6">
                {scheduledTasks.map((task, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative"
                  >
                    {/* timeline bullet */}
                    <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-[#0A0A0F] border border-white/20 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    </span>
                    
                    <div className="flex items-start justify-between bg-white/[0.02] border border-white/5 rounded-xl p-3.5 hover:bg-white/[0.04] transition-all">
                      <div>
                        <span className="text-[11px] font-bold text-muted-foreground">{task.time}</span>
                        <h4 className="text-sm font-semibold text-white mt-0.5">{task.title}</h4>
                      </div>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full border bg-white/[0.02] capitalize font-medium shrink-0 ${task.color}`}>
                        {task.type}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* WEEKLY METRICS CARD & CHART */}
          <div className="lg:col-span-6 flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-4 px-1 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-pink-400" />
              This Week
            </h3>

            <GlassCard className="flex-1 flex flex-col justify-between p-6" hover={false}>
              <div className="grid grid-cols-3 gap-2 border-b border-white/5 pb-5">
                <div className="text-center">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Completed</span>
                  <span className="text-xl font-bold text-white block mt-1">12</span>
                </div>
                <div className="text-center border-x border-white/5">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Focus Min</span>
                  <span className="text-xl font-bold text-white block mt-1">1,240</span>
                </div>
                <div className="text-center">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Productivity</span>
                  <span className="text-xl font-bold text-pink-400 block mt-1">89%</span>
                </div>
              </div>

              {/* Glowing SVG Chart */}
              <div className="mt-6 h-36 w-full relative">
                <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EC4899" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="chart-stroke-grad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#7C3AED" />
                      <stop offset="50%" stopColor="#EC4899" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                  
                  {/* Area fill */}
                  <path
                    d="M 0 100 L 0 80 Q 50 90 100 50 T 200 40 T 300 15 L 300 100 Z"
                    fill="url(#chart-area-grad)"
                  />
                  
                  {/* Stroke path */}
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    d="M 0 80 Q 50 90 100 50 T 200 40 T 300 15"
                    fill="none"
                    stroke="url(#chart-stroke-grad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  
                  {/* Glowing neon background paths */}
                  <path
                    d="M 0 80 Q 50 90 100 50 T 200 40 T 300 15"
                    fill="none"
                    stroke="#EC4899"
                    strokeWidth="5"
                    strokeOpacity="0.15"
                    strokeLinecap="round"
                    className="blur-[2px]"
                  />
                </svg>
              </div>
            </GlassCard>
          </div>

        </div>
      </div>

      <BottomTabs />
    </div>
  );
}
