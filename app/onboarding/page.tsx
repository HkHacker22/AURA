'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/glass-card';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';
import { Brain, Calendar, Mic, Sparkles, Shield, ArrowRight } from 'lucide-react';

const steps = [
  {
    title: 'Welcome to AURA',
    subtitle: 'One Mind Ahead',
    description: 'Your AI executive assistant that plans, predicts, researches and adapts.',
    icon: Sparkles,
  },
  {
    title: 'Voice-First Interaction',
    subtitle: 'Just speak your mind',
    description: 'Press the mic and tell AURA about your day. No forms, no fuss.',
    icon: Mic,
  },
  {
    title: 'Autonomous Planning',
    subtitle: 'Schedule manages itself',
    description: 'AURA rearranges your day in real-time based on your energy and priorities.',
    icon: Calendar,
  },
  {
    title: 'AI Agent Team',
    subtitle: 'Five specialists working for you',
    description: 'Planner, Deadline, Research, Reflection, and Focus agents collaborate seamlessly.',
    icon: Brain,
  },
  {
    title: 'Your Privacy, Your Data',
    subtitle: 'Secure by design',
    description: 'Your behavioral data is encrypted and belongs to you. You can delete it anytime.',
    icon: Shield,
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(15, 15, 30)"
      gradientBackgroundEnd="rgb(30, 10, 40)"
      firstColor="139, 92, 246"
      secondColor="59, 130, 246"
      thirdColor="168, 85, 247"
      fourthColor="236, 72, 153"
      fifthColor="99, 102, 241"
      pointerColor="139, 92, 246"
      size="60%"
      blendingValue="soft-light"
      containerClassName="min-h-screen"
    >
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center backdrop-blur-xl">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {(() => {
                        const Icon = steps[currentStep].icon;
                        return <Icon className="w-12 h-12 text-primary" />;
                      })()}
                    </motion.div>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-white">{steps[currentStep].title}</h1>
                <p className="text-primary">{steps[currentStep].subtitle}</p>
              </div>

              <GlassCard className="text-center">
                <p className="text-muted-foreground">{steps[currentStep].description}</p>
              </GlassCard>

              <div className="space-y-4">
                <button
                  onClick={handleNext}
                  className="w-full py-3 rounded-xl bg-primary text-white font-medium flex items-center justify-center gap-2 hover:bg-primary/80 transition-colors"
                >
                  {currentStep < steps.length - 1 ? 'Continue' : 'Get Started'}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex justify-center gap-2">
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentStep(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === currentStep ? 'bg-primary w-6' : 'bg-white/10 w-2'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </BackgroundGradientAnimation>
  );
}
