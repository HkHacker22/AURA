'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Loader2 } from 'lucide-react';
import { TopAppBar } from '@/components/ui/top-app-bar';
import { GlassCard } from '@/components/ui/glass-card';
import { GoogleGeminiEffect } from '@/components/ui/google-gemini-effect';
import { BottomTabs } from '@/components/ui/bottom-tabs';
import { cn } from '@/lib/utils';
import { useMotionValue } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
  tasksExtracted?: number;
}

const mockAiResponses = [
  "I've extracted 2 tasks from your brain dump. I've scheduled the investor meeting for tomorrow at 3pm with preparation time at 2:30pm. The Q3 budget spreadsheet is estimated for 2 hours.",
  'Got it! I understand you need to work on the presentation deck. Your peak energy window tomorrow morning from 9-11am is perfect for this focused work.',
  'I see you mentioned feeling overwhelmed. Let me prepare a survival plan for you. Starting schedule compression...',
];

export default function BrainDump() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathLengths = [
    useMotionValue(0),
    useMotionValue(0),
    useMotionValue(0),
    useMotionValue(0),
    useMotionValue(0),
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (content: string, type: 'user' | 'ai', tasksExtracted?: number) => {
    const msg: Message = {
      id: Date.now().toString(),
      content,
      type,
      timestamp: new Date(),
      tasksExtracted,
    };
    setMessages(prev => [...prev, msg]);
  };

  const simulateAiResponse = () => {
    setIsProcessing(true);
    setTimeout(() => {
      addMessage(
        mockAiResponses[Math.floor(Math.random() * mockAiResponses.length)],
        'ai',
        Math.floor(Math.random() * 3) + 1
      );
      setIsProcessing(false);
    }, 1500);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    addMessage(input, 'user');
    setInput('');
    simulateAiResponse();
  };

  const handleVoiceInput = () => {
    setIsListening(true);
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        addMessage(transcript, 'user');
        simulateAiResponse();
      };
      recognition.onerror = () => {
        setIsListening(false);
      };
      recognition.start();
    } else {
      setTimeout(() => {
        setIsListening(false);
        addMessage("I need to prepare for tomorrow's investor meeting and finish the Q3 budget spreadsheet", 'user');
        simulateAiResponse();
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <GoogleGeminiEffect
        pathLengths={pathLengths}
        title="Brain Dump"
        description="Speak your mind freely"
        className="hidden"
      />
      <TopAppBar title="Brain Dump" subtitle="Speak your mind freely" />

      <div className="flex flex-col h-[calc(100vh-180px)]">
        <div className="flex-1 overflow-y-auto px-4 pt-4 scrollbar-hide">
          <AnimatePresence mode="wait">
            {messages.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-64 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Mic className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">How are you feeling today?</h3>
                <p className="text-muted-foreground px-4 max-w-sm">
                  Press the microphone and tell AURA about your day, tasks, or anything on your mind.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="messages"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={cn(
                      'flex',
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <GlassCard className={cn(
                      'max-w-[80%]',
                      message.type === 'user' ? 'bg-primary/20' : ''
                    )}>
                      <p className="text-sm">{message.content}</p>
                      {message.tasksExtracted && (
                        <div className="mt-2 pt-2 border-t border-white/10">
                          <span className="text-xs font-medium text-primary">
                            +{message.tasksExtracted} tasks extracted
                          </span>
                        </div>
                      )}
                    </GlassCard>
                  </motion.div>
                ))}
                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <GlassCard className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">AURA is thinking...</span>
                    </GlassCard>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="fixed bottom-24 left-0 right-0 px-4 z-40">
          <GlassCard>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type or speak..."
                className="flex-1 bg-transparent border-0 outline-none placeholder:text-muted-foreground text-sm"
              />
              <button
                onClick={handleVoiceInput}
                disabled={isListening}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                  isListening ? 'bg-danger' : 'bg-white/10 hover:bg-white/20',
                  'transition-all duration-200'
                )}
              >
                {isListening ? (
                  <MicOff className="w-5 h-5 text-white" />
                ) : (
                  <Mic className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isProcessing}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                  !input.trim() || isProcessing ? 'opacity-50' : 'bg-primary hover:bg-primary/80',
                  'transition-all duration-200'
                )}
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </GlassCard>
        </div>
      </div>

      <BottomTabs />
    </div>
  );
}
