'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TopAppBar } from '@/components/ui/top-app-bar';
import { GlassCard } from '@/components/ui/glass-card';
import { BottomTabs } from '@/components/ui/bottom-tabs';
import { Pause, Play, SkipForward, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

const PHASE_CONFIG = {
  work: { minutes: 25 },
  break: { minutes: 5 },
  longBreak: { minutes: 15 },
};

let sessionsSinceLongBreak = 0;

export default function FocusSession() {
  const [isActive, setIsActive] = useState(false);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [phase, setPhase] = useState<'work' | 'break' | 'longBreak'>('work');
  const secondsRef = useRef(seconds);

  useEffect(() => {
    secondsRef.current = seconds;
  });

  const advancePhase = useCallback(() => {
    if (phase === 'work') {
      sessionsSinceLongBreak++;
      if (sessionsSinceLongBreak % 4 === 0) {
        setPhase('longBreak');
        setMinutes(PHASE_CONFIG.longBreak.minutes);
      } else {
        setPhase('break');
        setMinutes(PHASE_CONFIG.break.minutes);
      }
    } else {
      setPhase('work');
      setMinutes(PHASE_CONFIG.work.minutes);
    }
    setSeconds(0);
  }, [phase]);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      if (secondsRef.current > 0) {
        setSeconds(s => { secondsRef.current = s - 1; return s - 1; });
      } else if (minutes > 0) {
        setMinutes(m => m - 1);
        setSeconds(59);
        secondsRef.current = 59;
      } else {
        setIsActive(false);
        advancePhase();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, minutes, advancePhase]);

  const totalSeconds = minutes * 60 + seconds;
  const initialSeconds = PHASE_CONFIG[phase].minutes * 60;
  const progress = ((initialSeconds - totalSeconds) / initialSeconds) * 100;

  const skipPhase = useCallback(() => {
    setIsActive(false);
    advancePhase();
  }, [advancePhase]);

  const resetTimer = useCallback(() => {
    setMinutes(PHASE_CONFIG[phase].minutes);
    setSeconds(0);
    setIsActive(false);
  }, [phase]);

  const toggleTimer = useCallback(() => {
    if (minutes === 0 && seconds === 0) {
      setMinutes(PHASE_CONFIG[phase].minutes);
    }
    setIsActive(prev => !prev);
  }, [minutes, seconds, phase]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopAppBar title="Focus Session" subtitle="Deep work mode" showNotifications={false} />

      <div className="p-4 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-64 h-64 mb-8"
        >
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="text-primary"
              strokeDasharray="283"
              strokeDashoffset={283 - (progress / 100) * 283}
              animate={{ strokeDashoffset: 283 - (progress / 100) * 283 }}
              transition={{ duration: 0.5 }}
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-mono font-bold">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-sm text-muted-foreground mt-2 capitalize">{phase} mode</span>
          </div>
        </motion.div>

        <GlassCard className="w-full mb-6">
          <h3 className="font-semibold mb-2">Current Task</h3>
          <p className="text-sm">Deep work on product architecture</p>
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Session Goal</span>
              <span>Focus blocks remaining: 2</span>
            </div>
          </div>
        </GlassCard>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTimer}
            className={cn(
              'w-14 h-14 rounded-full flex items-center justify-center',
              isActive ? 'bg-danger' : 'bg-primary',
              'transition-all duration-200'
            )}
          >
            {isActive ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white ml-1" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={skipPhase}
            className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center"
          >
            <SkipForward className="w-5 h-5 text-muted-foreground" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetTimer}
            className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center"
          >
            <RotateCcw className="w-5 h-5 text-muted-foreground" />
          </motion.button>
        </div>
      </div>

      <BottomTabs />
    </div>
  );
}
