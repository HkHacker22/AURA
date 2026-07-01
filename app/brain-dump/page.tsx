'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Loader2, CheckCircle, Calendar, FileText } from 'lucide-react';
import { TopAppBar } from '@/components/ui/top-app-bar';
import { GlassCard } from '@/components/ui/glass-card';
import { GoogleGeminiEffect } from '@/components/ui/google-gemini-effect';
import { BottomTabs } from '@/components/ui/bottom-tabs';
import { cn } from '@/lib/utils';
import { useMotionValue } from 'framer-motion';
import toast from 'react-hot-toast';

interface ExtractedTask {
  title: string;
  priority?: string;
  tags?: string[];
}

interface ExtractedEvent {
  title: string;
  date?: string;
  time?: string;
}

interface ExtractedNote {
  content: string;
}

interface BrainDumpResult {
  tasks: ExtractedTask[];
  events: ExtractedEvent[];
  notes: ExtractedNote[];
}

interface Message {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
  result?: BrainDumpResult;
}

export default function BrainDump() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasProcessedTranscript = useRef(false);
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

  useEffect(() => {
    if (hasProcessedTranscript.current) return;
    const pending = localStorage.getItem('aura_pending_transcript');
    if (pending) {
      hasProcessedTranscript.current = true;
      localStorage.removeItem('aura_pending_transcript');
      addMessage(pending, 'user');
      processWithAI(pending);
    }
  }, []);

  const addMessage = (content: string, type: 'user' | 'ai', result?: BrainDumpResult) => {
    const msg: Message = {
      id: Date.now().toString(),
      content,
      type,
      timestamp: new Date(),
      result,
    };
    setMessages(prev => [...prev, msg]);
  };

  const processWithAI = async (text: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/ai/brain-dump', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: text }),
      });
      if (!res.ok) throw new Error(await res.text());
      const result: BrainDumpResult = await res.json();
      const count = (result.tasks?.length ?? 0) + (result.events?.length ?? 0) + (result.notes?.length ?? 0);
      addMessage(`Processed your brain dump — found ${count} items.`, 'ai', result);
    } catch {
      addMessage("Sorry, I couldn't process that right now. Please try again.", 'ai');
      toast.error('Brain dump processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const text = input;
    setInput('');
    addMessage(text, 'user');
    processWithAI(text);
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
        processWithAI(transcript);
      };
      recognition.onerror = () => { setIsListening(false); };
      recognition.start();
    } else {
      setTimeout(() => {
        setIsListening(false);
        const mock = "I need to prepare for tomorrow's investor meeting and finish the Q3 budget spreadsheet";
        addMessage(mock, 'user');
        processWithAI(mock);
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
                className="space-y-4 pb-28"
              >
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={cn('flex', message.type === 'user' ? 'justify-end' : 'justify-start')}
                  >
                    <GlassCard className={cn('max-w-[80%]', message.type === 'user' ? 'bg-primary/20' : '')}>
                      <p className="text-sm">{message.content}</p>
                      {message.result && (
                        <div className="mt-3 pt-3 border-t border-white/10 space-y-3">
                          {message.result.tasks?.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 text-xs font-medium text-primary mb-2">
                                <CheckCircle className="w-3 h-3" />
                                Tasks ({message.result.tasks.length})
                              </div>
                              <div className="space-y-1">
                                {message.result.tasks.map((t, i) => (
                                  <div key={i} className="flex items-center gap-2 text-xs">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                    <span className="truncate">{t.title}</span>
                                    {t.priority && (
                                      <span className={cn(
                                        'text-[10px] px-1.5 py-0.5 rounded-full shrink-0',
                                        t.priority === 'high' ? 'bg-danger/20 text-danger' :
                                        t.priority === 'medium' ? 'bg-warning/20 text-warning' :
                                        'bg-white/10 text-muted-foreground'
                                      )}>
                                        {t.priority}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {message.result.events?.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 text-xs font-medium text-secondary mb-2">
                                <Calendar className="w-3 h-3" />
                                Events ({message.result.events.length})
                              </div>
                              <div className="space-y-1">
                                {message.result.events.map((e, i) => (
                                  <div key={i} className="text-xs">
                                    <span className="text-muted-foreground">{e.title}</span>
                                    {(e.date || e.time) && (
                                      <span className="text-muted-foreground ml-1">
                                        — {e.date}{e.time ? ` at ${e.time}` : ''}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {message.result.notes?.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                                <FileText className="w-3 h-3" />
                                Notes ({message.result.notes.length})
                              </div>
                              <div className="space-y-1">
                                {message.result.notes.map((n, i) => (
                                  <p key={i} className="text-xs text-muted-foreground">• {n.content}</p>
                                ))}
                              </div>
                            </div>
                          )}
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
