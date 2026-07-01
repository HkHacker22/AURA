'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingMicButtonProps {
  onTranscribe: (text: string) => void;
  disabled?: boolean;
}

export function FloatingMicButton({ onTranscribe, disabled = false }: FloatingMicButtonProps) {
  const [isListening, setIsListening] = useState(false);

  const handleToggle = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    setIsListening(true);
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscribe(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => {
        setIsListening(false);
      };
      recognition.start();
    } else {
      setTimeout(() => {
        onTranscribe("I need to prepare for tomorrow's investor meeting and finish the Q3 budget spreadsheet");
        setIsListening(false);
      }, 2000);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={handleToggle}
      disabled={disabled}
      className={cn(
        'fixed bottom-28 right-6 w-16 h-16 rounded-full flex items-center justify-center',
        'bg-primary text-white shadow-lg shadow-purple-500/25',
        isListening && 'bg-danger animate-pulse',
        disabled && 'opacity-50 cursor-not-allowed',
        'transition-all duration-300 z-50'
      )}
    >
      {isListening ? (
        <MicOff className="w-7 h-7" />
      ) : (
        <Mic className="w-7 h-7" />
      )}
      
      {isListening && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-danger"
        />
      )}
    </motion.button>
  );
}
