'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TopAppBar } from '@/components/ui/top-app-bar';
import { GlassCard } from '@/components/ui/glass-card';
import { BottomTabs } from '@/components/ui/bottom-tabs';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';
import { AlertTriangle, CheckCircle2, ArrowRightLeft, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface SaveMeResult {
  overloaded: boolean;
  workloadScore: number;
  burnoutPrediction: string;
  suggestedActions: string[];
  priorityAdjustments?: Array<{
    taskId: string;
    from: string;
    to: string;
    reason: string;
  }>;
}

export default function SaveMe() {
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SaveMeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleActivate = async () => {
    setIsActive(true);
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/save-me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskData: {
            taskCount: 12,
            highPriorityCount: 5,
            meetingCount: 4,
            meetingHours: 5,
            estimatedHours: 8,
            availableHours: 6,
          },
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      
      setResult({
        overloaded: data.overloaded ?? true,
        workloadScore: data.workloadScore ?? 89,
        burnoutPrediction: 'Critical Burnout Risk (89%)',
        suggestedActions: data.suggestedActions ?? [
          'Postpone Q3 budget review meeting to tomorrow morning.',
          'De-prioritize design system updates; focus only on the client presentation.',
          'Delegate PRD proofreading to the Reflection agent.',
          'Initiate a 25-minute deep focus breathing block right now.'
        ],
        priorityAdjustments: data.priorityAdjustments ?? [
          { taskId: '1', from: 'High', to: 'Medium', reason: 'PRD Document review can be deferred by 24h without major issues.' },
          { taskId: '2', from: 'High', to: 'Low', reason: 'Design system updates are non-critical for today\'s client meeting.' }
        ]
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to analyze workload';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-[#06040A] text-[#FBFAFC] pb-32 transition-colors duration-1000 overflow-x-hidden relative">
      {/* Background animates slowly behind - Updated to Deep Cosmic Purple/Pink */}
      <div className="fixed inset-0 z-0 h-screen w-screen opacity-40 pointer-events-none">
        <BackgroundGradientAnimation
          gradientBackgroundStart={isActive ? "rgb(20, 5, 25)" : "rgb(10, 5, 20)"}
          gradientBackgroundEnd={isActive ? "rgb(15, 0, 15)" : "rgb(5, 5, 15)"}
          firstColor="147, 51, 234" // Purple
          secondColor={isActive ? "217, 70, 239" : "168, 85, 247"} // Fuchsia / Purple
          thirdColor={isActive ? "236, 72, 153" : "79, 70, 229"} // Pink / Indigo
          fourthColor="192, 38, 211" // Fuchsia
          fifthColor="124, 58, 237" // Violet
          interactive={false}
          size="70%"
          containerClassName="w-full h-full"
        />
      </div>

      {/* Static Star Particles Background */}
      <div className="fixed inset-0 z-0 h-screen w-screen opacity-30 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-[#06040A]">
        {/* We can use a simple CSS pattern for stars, or just leave the gradient. The background gradient handles the vibe well. */}
      </div>

      <div className="relative z-10">
        <TopAppBar title="AURA" showNotifications={false} />

      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-6">
        
        {!isActive ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[65vh]"
          >
            {/* Left Column: Cosmic Glowing Orb */}
            <div className="lg:col-span-6 flex justify-center py-10">
              <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
                
                {/* Outer Ring 1 */}
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute w-full h-full rounded-full border border-purple-500/20"
                >
                  <div className="absolute top-1/4 -left-1 w-2 h-2 bg-purple-300 rounded-full shadow-[0_0_12px_3px_#a855f7]" />
                  <div className="absolute bottom-0 right-10 w-1.5 h-1.5 bg-fuchsia-300 rounded-full shadow-[0_0_8px_2px_#d946ef]" />
                </motion.div>

                {/* Middle Ring 2 (Reverse Spin) */}
                <motion.div 
                  animate={{ rotate: -360 }} 
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute w-4/5 h-4/5 rounded-full border border-fuchsia-500/30"
                >
                   <div className="absolute top-0 right-1/3 w-2.5 h-2.5 bg-pink-200 rounded-full shadow-[0_0_15px_4px_#ec4899]" />
                </motion.div>

                {/* Inner Ring 3 */}
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute w-3/5 h-3/5 rounded-full border border-purple-400/40"
                >
                   <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-purple-200 rounded-full shadow-[0_0_10px_2px_#c026d3]" />
                </motion.div>

                {/* Central Glowing Orb (SAVE ME Button) */}
                <motion.div
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute z-10"
                >
                  <div className="relative flex items-center justify-center">
                    {/* Intense blurred background glow - scaled down for the smaller size */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-600 to-purple-600 rounded-full blur-xl opacity-60" />
                    
                    {/* The Button itself - perfectly sized to hug the text */}
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(217,70,239,0.7)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleActivate}
                      className="relative w-36 h-36 md:w-44 md:h-44 rounded-full bg-gradient-to-br from-pink-400 via-fuchsia-600 to-purple-800 text-white font-bold text-2xl md:text-3xl tracking-widest border border-pink-300/40 shadow-[inset_0_0_20px_rgba(255,255,255,0.3),_0_0_40px_rgba(192,38,211,0.6)] flex flex-col items-center justify-center z-10 transition-all leading-none gap-1"
                    >
                      <span>SAVE</span>
                      <span>ME</span>
                    </motion.button>
                  </div>
                </motion.div>
                
              </div>
            </div>

            {/* Right Column: Title text & Descriptions */}
            <div className="lg:col-span-6 text-center lg:text-left space-y-6">
              <div>
                <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-widest">Emergency Assistance</span>
                <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mt-2 leading-tight">
                  Feeling overwhelmed?
                </h2>
                <p className="text-base text-muted-foreground mt-4 leading-relaxed max-w-md mx-auto lg:mx-0">
                  Tap the emergency trigger. AURA will analyze your current meeting schedule, task deadlines, and energy allocations to compile an optimized workload survival plan.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground bg-white/[0.02] border border-white/5 rounded-full px-4 py-2">
                  <span className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse" />
                  Real-time workload check
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground bg-white/[0.02] border border-white/5 rounded-full px-4 py-2">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  AI deadline resolution
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center min-h-[55vh] text-center"
              >
                <div className="relative w-24 h-24">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    className="w-full h-full rounded-full border-4 border-fuchsia-500/20 border-t-fuchsia-500"
                  />
                  <ShieldAlert className="w-10 h-10 text-fuchsia-400 absolute inset-0 m-auto animate-pulse" />
                </div>
                <p className="mt-6 text-sm font-semibold text-muted-foreground">Running workload optimization diagnostics...</p>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center min-h-[50vh] text-center"
              >
                <AlertTriangle className="w-12 h-12 text-pink-500 mb-4" />
                <p className="text-sm text-muted-foreground mb-6">{error}</p>
                <button
                  onClick={handleActivate}
                  className="px-6 py-2.5 rounded-full bg-fuchsia-600 text-xs font-bold hover:bg-fuchsia-500 transition-colors"
                >
                  Retry Analysis
                </button>
              </motion.div>
            ) : result && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20"
              >
                
                {/* Left Column: Glowing Status & Score Indicators */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Status Card */}
                  <div className="bg-fuchsia-500/5 border border-fuchsia-500/15 rounded-[20px] p-6 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-44 h-44 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
                    <ShieldAlert className="w-10 h-10 text-fuchsia-400 mx-auto" strokeWidth={1.5} />
                    <h2 className="text-xl font-bold text-white mt-3">Emergency Mode Active</h2>
                    <span className="text-xs text-fuchsia-300 font-bold uppercase tracking-wider block mt-1.5">
                      {result.burnoutPrediction}
                    </span>
                  </div>

                  {/* Circular Workload Score */}
                  <GlassCard className="flex flex-col items-center justify-center p-6 text-center" hover={false}>
                    <div className="relative w-36 h-36">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-white/5"
                          strokeWidth="3"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <motion.path
                          initial={{ strokeDasharray: "0 100" }}
                          animate={{ strokeDasharray: `${result.workloadScore} 100` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="text-fuchsia-500"
                          strokeWidth="3"
                          strokeDasharray={`${result.workloadScore}, 100`}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-extrabold text-white">{result.workloadScore}%</span>
                        <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">Score</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-4 leading-relaxed">
                      Your schedule is currently overloaded by <span className="text-fuchsia-400 font-bold">29%</span> relative to your available focus time.
                    </div>
                  </GlassCard>

                  <button
                    onClick={handleReset}
                    className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold border border-white/10 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    De-activate Emergency Mode
                  </button>
                </div>

                {/* Right Column: AI Action Checklist & Priority Tweaks */}
                <div className="lg:col-span-7 space-y-6">
                  {/* AI Recommendations Checklist */}
                  <GlassCard className="p-6 rounded-[20px]" hover={false}>
                    <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-4 flex items-center gap-1.5 border-b border-white/5 pb-3">
                      <Sparkles className="w-4 h-4" />
                      Workload Survival Checklist
                    </h3>
                    <div className="space-y-3">
                      {result.suggestedActions.map((action, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-start gap-3 bg-white/[0.01] border border-white/5 rounded-xl p-4 hover:bg-white/[0.02]"
                        >
                          <CheckCircle2 className="w-4.5 h-4.5 text-fuchsia-400 shrink-0 mt-0.5" />
                          <span className="text-xs leading-relaxed text-white/90">{action}</span>
                        </motion.div>
                      ))}
                    </div>
                  </GlassCard>

                  {/* Priority Adjustments */}
                  {result.priorityAdjustments && result.priorityAdjustments.length > 0 && (
                    <GlassCard className="p-6 rounded-[20px]" hover={false}>
                      <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-1.5 border-b border-white/5 pb-3">
                        <ArrowRightLeft className="w-4 h-4" />
                        AI Priority Adjustments
                      </h3>
                      <div className="space-y-3">
                        {result.priorityAdjustments.map((adj, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white/[0.01] border border-white/5 rounded-xl p-4"
                          >
                            <div className="flex items-center justify-between gap-3 text-xs mb-2">
                              <span className="font-bold text-white">Task {adj.taskId} Adjustment</span>
                              <div className="flex items-center gap-1.5 font-bold text-[10px] uppercase">
                                <span className="text-fuchsia-400">{adj.from}</span>
                                <span className="text-muted-foreground">→</span>
                                <span className="text-cyan-400">{adj.to}</span>
                              </div>
                            </div>
                            <p className="text-[11px] leading-relaxed text-muted-foreground">{adj.reason}</p>
                          </motion.div>
                        ))}
                      </div>
                    </GlassCard>
                  )}
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        )}

      </div>

      </div>

      <BottomTabs />
    </div>
  );
}