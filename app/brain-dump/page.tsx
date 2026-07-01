'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Loader2, CheckCircle2, Calendar, FileText, Sparkles, Trash2, Volume2 } from 'lucide-react';
import { TopAppBar } from '@/components/ui/top-app-bar';
import { GlassCard } from '@/components/ui/glass-card';
import { BottomTabs } from '@/components/ui/bottom-tabs';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';
import { getTasks, saveTasks, getEvents, saveEvents, chatKey } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
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
  durationMinutes?: number;
}

interface ExtractedNote {
  content: string;
}

interface BrainDumpResult {
  response: string;
  tasks: ExtractedTask[];
  events: ExtractedEvent[];
  notes: ExtractedNote[];
  clarificationNeeded?: boolean;
  clarificationQuestion?: string;
  deletedTaskIds?: string[];
}

interface Message {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
  result?: BrainDumpResult;
}

// Text-to-speech helper (Web Speech API)
function speak(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  // Prefer a natural-sounding female voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => v.name.includes('Google') || v.name.includes('Natural') || v.lang === 'en-US');
  if (preferred) utterance.voice = preferred;
  window.speechSynthesis.speak(utterance);
}

function serializeMessages(msgs: Message[]): string {
  return JSON.stringify(msgs.map(m => ({
    ...m,
    timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : m.timestamp,
  })));
}

function deserializeMessages(raw: string): Message[] {
  try {
    const parsed = JSON.parse(raw);
    return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
  } catch {
    return [];
  }
}

export default function BrainDump() {
  const { user } = useAuth();
  const uid = (user as any)?.uid || (user as any)?.id || undefined;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [awaitingClarification, setAwaitingClarification] = useState(false);
  const [pendingContext, setPendingContext] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasProcessedTranscript = useRef(false);
  const messagesLoadedRef = useRef(false);

  const [particles, setParticles] = useState<any[]>([]);

  // Generate particles on mount
  useEffect(() => {
    const generated = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      angle: Math.random() * 360,
      distance: 120 + Math.random() * 80,
      size: Math.random() * 3 + 1,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 2,
    }));
    setParticles(generated);
  }, []);

  // Load persisted chat history
  useEffect(() => {
    if (messagesLoadedRef.current) return;
    messagesLoadedRef.current = true;
    const key = chatKey(uid);
    const saved = localStorage.getItem(key);
    if (saved) {
      const loaded = deserializeMessages(saved);
      if (loaded.length > 0) setMessages(loaded);
    }
  }, [uid]);

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    if (!messagesLoadedRef.current) return;
    const key = chatKey(uid);
    localStorage.setItem(key, serializeMessages(messages));
  }, [messages, uid]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle pending transcript from save-me or other pages
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

  const addMessage = useCallback((content: string, type: 'user' | 'ai', result?: BrainDumpResult) => {
    const msg: Message = {
      id: Date.now().toString(),
      content,
      type,
      timestamp: new Date(),
      result,
    };
    setMessages(prev => [...prev, msg]);
  }, []);

  const processWithAI = useCallback(async (text: string, contextOverride?: string) => {
    setIsProcessing(true);
    try {
      const currentTasks = getTasks(uid);
      const currentEvents = getEvents(uid);

      const res = await fetch('/api/ai/brain-dump', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: text,
          userId: uid,
          currentTasks,
          currentEvents,
          conversationContext: contextOverride || '',
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const result: BrainDumpResult = await res.json();

      // --- CLARIFICATION NEEDED ---
      if (result.clarificationNeeded) {
        setAwaitingClarification(true);
        setPendingContext(`User previously said: "${text}"`);
        const question = result.clarificationQuestion || result.response;
        speak(question);
        addMessage(question, 'ai', result);
        return;
      }

      // Reset clarification state
      setAwaitingClarification(false);
      setPendingContext('');

      // --- DELETE TASKS ---
      if (result.deletedTaskIds && result.deletedTaskIds.length > 0) {
        const current = getTasks(uid);
        const updated = current.filter(t => !result.deletedTaskIds!.includes(t.taskId));
        saveTasks(updated, uid);
      }

      // --- ADD TASKS ---
      if (result.tasks && result.tasks.length > 0) {
        const currentTasks = getTasks(uid);
        const newTasks = result.tasks.map((t, idx) => {
          let priorityNum = 2;
          if (t.priority === 'high') priorityNum = 1;
          if (t.priority === 'low') priorityNum = 3;
          return {
            taskId: (Date.now() + idx + Math.random()).toString(),
            content: t.title,
            type: 'task' as any,
            priority: priorityNum as any,
            status: 'pending' as any,
            estimatedMinutes: 60,
            failureProbability: 0.1,
            energyRequired: 'medium' as any,
            location: 'any' as any,
            source: 'brain_dump' as any,
            createdAt: new Date(),
            scheduledSlots: [],
          };
        });
        saveTasks([...newTasks, ...currentTasks], uid);
      }

      // --- ADD EVENTS (WITH CORRECT DATE) ---
      if (result.events && result.events.length > 0) {
        const currentEvents = getEvents(uid);
        const today = new Date().toISOString().split('T')[0];

        const colorMap: Record<string, string> = {
          meeting: 'border-purple-500 text-purple-400 bg-purple-500/5',
          review: 'border-cyan-500 text-cyan-400 bg-cyan-500/5',
          focus: 'border-pink-500 text-pink-400 bg-pink-500/5',
          call: 'border-indigo-500 text-indigo-400 bg-indigo-500/5',
          other: 'border-gray-500 text-gray-400 bg-gray-500/5',
        };

        const newEvents = result.events.map((e, idx) => {
          // Format time from 24h to 12h
          let formattedTime = '9:00 AM';
          if (e.time) {
            const [h, m] = e.time.split(':');
            const hrs = parseInt(h);
            if (!isNaN(hrs)) {
              const ampm = hrs >= 12 ? 'PM' : 'AM';
              const displayHrs = hrs % 12 || 12;
              formattedTime = `${displayHrs}:${m || '00'} ${ampm}`;
            }
          }

          // Duration from minutes
          const mins = e.durationMinutes;
          let durationStr = '1h';
          if (mins) {
            if (mins < 60) durationStr = `${mins}m`;
            else if (mins % 60 === 0) durationStr = `${mins / 60}h`;
            else durationStr = `${Math.floor(mins / 60)}h ${mins % 60}m`;
          }

          return {
            id: (Date.now() + idx + Math.random()).toString(),
            date: e.date || today,      // USE THE AI-PROVIDED DATE
            time: formattedTime,
            duration: durationStr,
            title: e.title,
            type: 'meeting' as any,
            color: colorMap['meeting'],
          };
        });
        saveEvents([...newEvents, ...currentEvents], uid);
      }

      // Set agent activity flag
      localStorage.setItem('aura_brain_dump_active', 'true');
      setTimeout(() => localStorage.removeItem('aura_brain_dump_active'), 30000);

      // TTS confirmation
      const ttsText = result.response || 'Done! I\'ve saved your items.';
      speak(ttsText);

      addMessage(result.response || 'Processed your brain dump successfully.', 'ai', result);
    } catch {
      addMessage("Sorry, I couldn't process that right now. Please try again.", 'ai');
      toast.error('Brain dump processing failed');
    } finally {
      setIsProcessing(false);
    }
  }, [uid, addMessage]);

  const handleSend = () => {
    if (!input.trim() || isProcessing) return;
    const text = input;
    setInput('');
    addMessage(text, 'user');
    if (awaitingClarification) {
      // Send clarification with the pending context
      processWithAI(text, pendingContext);
    } else {
      processWithAI(text);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) return;
    setIsListening(true);
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        addMessage(transcript, 'user');
        if (awaitingClarification) {
          processWithAI(transcript, pendingContext);
        } else {
          processWithAI(transcript);
        }
      };
      recognition.onerror = () => { setIsListening(false); };
      recognition.onend = () => { setIsListening(false); };
      recognition.start();
    } else {
      setTimeout(() => {
        setIsListening(false);
        const mock = "I need to prepare for tomorrow's investor meeting and finish the Q3 budget spreadsheet";
        addMessage(mock, 'user');
        processWithAI(mock);
      }, 2500);
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
    const key = chatKey(uid);
    localStorage.removeItem(key);
    toast.success('Chat history cleared');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#FBFAFC] pb-32 relative overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 h-screen w-screen opacity-35 pointer-events-none">
        <BackgroundGradientAnimation
          gradientBackgroundStart="rgb(10, 10, 18)"
          gradientBackgroundEnd="rgb(20, 10, 30)"
          firstColor="124, 58, 237"
          secondColor="217, 70, 239"
          thirdColor="6, 182, 212"
          fourthColor="236, 72, 153"
          fifthColor="139, 92, 246"
          interactive={false}
          size="60%"
          containerClassName="w-full h-full"
        />
      </div>

      <div className="relative z-10">
        <TopAppBar title="AURA" />

        <div className="max-w-6xl mx-auto px-4 md:px-8 mt-6">

          {/* If no messages — show large centerpiece */}
          {messages.length === 0 ? (
            <div className="flex flex-col min-h-[70vh] justify-between">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1"
              >
                {/* Left: Big Mic Orb */}
                <div className="lg:col-span-6 flex justify-center py-10">
                  <div className="relative w-96 h-96 flex items-center justify-center">
                    {/* Floating Particles */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      {particles.map((particle) => {
                        const x = Math.cos((particle.angle * Math.PI) / 180) * particle.distance;
                        const y = Math.sin((particle.angle * Math.PI) / 180) * particle.distance;
                        return (
                          <motion.div
                            key={particle.id}
                            className="absolute rounded-full"
                            style={{
                              width: particle.size,
                              height: particle.size,
                              backgroundColor: particle.id % 2 === 0 ? '#ec4899' : '#a855f7',
                              boxShadow: `0 0 ${particle.size * 2}px ${particle.id % 2 === 0 ? '#ec4899' : '#a855f7'}`,
                            }}
                            animate={{
                              x: [x * 0.9, x * 1.1, x * 0.9],
                              y: [y * 0.9, y * 1.1, y * 0.9],
                              opacity: [0.2, 0.8, 0.2],
                              scale: [0.8, 1.2, 0.8],
                            }}
                            transition={{ duration: particle.duration, repeat: Infinity, ease: 'easeInOut', delay: particle.delay }}
                          />
                        );
                      })}
                    </div>

                    <motion.div
                      animate={{ scale: isListening ? [1, 1.05, 1] : [1, 1.02, 1] }}
                      transition={{ duration: isListening ? 1.5 : 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="relative w-72 h-72 rounded-full p-[3px] z-10 shadow-[0_0_60px_rgba(168,85,247,0.35)]"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: isListening ? 3 : 8, repeat: Infinity, ease: 'linear' }}
                        className={cn(
                          'absolute inset-0 rounded-full opacity-90 blur-[3px] transition-colors duration-500',
                          isListening
                            ? 'bg-gradient-to-tr from-pink-500 via-red-500 to-pink-500 shadow-[0_0_30px_#ec4899]'
                            : 'bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-600'
                        )}
                      />
                      <button
                        onClick={handleVoiceInput}
                        className="relative w-full h-full rounded-full bg-[#0d0a14] flex items-center justify-center group overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          {isListening ? (
                            <MicOff className="w-28 h-28 text-pink-500 drop-shadow-[0_0_20px_rgba(236,72,153,0.7)] animate-pulse" strokeWidth={1.5} />
                          ) : (
                            <Mic className="w-28 h-28 text-purple-400 drop-shadow-[0_0_20px_rgba(168,85,247,0.7)] transition-colors group-hover:text-pink-400" strokeWidth={1.5} />
                          )}
                        </motion.div>
                      </button>
                    </motion.div>
                  </div>
                </div>

                {/* Right: Heading */}
                <div className="lg:col-span-6 text-center lg:text-left space-y-6">
                  <div>
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Cognitive Assistant</span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mt-2 leading-tight">
                      What's on your mind?
                    </h2>
                    <p className="text-base text-muted-foreground mt-4 leading-relaxed max-w-md mx-auto lg:mx-0">
                      Speak or type freely. AURA will extract tasks, schedule events on the right date, and organize notes. You can also ask me to delete or update existing items.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground bg-white/[0.02] border border-white/5 rounded-full px-4 py-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                      Context-aware
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground bg-white/[0.02] border border-white/5 rounded-full px-4 py-2">
                      <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                      TTS confirmations
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground bg-white/[0.02] border border-white/5 rounded-full px-4 py-2">
                      <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                      Agent state sync
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Empty state input */}
              <div className="pt-8 pb-12">
                <GlassCard className="p-3 bg-white/[0.02] border border-white/10 rounded-full" hover={false}>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Type or speak..."
                      className="flex-1 bg-transparent border-0 outline-none placeholder:text-muted-foreground text-sm pl-3 text-white"
                    />
                    <button
                      onClick={handleVoiceInput}
                      disabled={isListening || isProcessing}
                      className={cn(
                        'w-9 h-9 rounded-full flex items-center justify-center shrink-0 active:scale-90 transition-all',
                        isListening ? 'bg-pink-500 text-white animate-pulse' : 'bg-white/5 text-muted-foreground hover:text-white'
                      )}
                    >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isProcessing}
                      className={cn(
                        'w-9 h-9 rounded-full flex items-center justify-center shrink-0 active:scale-90 transition-all',
                        !input.trim() || isProcessing ? 'opacity-40 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-500'
                      )}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </GlassCard>
              </div>
            </div>
          ) : (
            /* Active chat state */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start min-h-[70vh]">

              {/* Desktop Left: Mic panel */}
              <div className="hidden lg:flex lg:col-span-5 flex-col items-center justify-center p-6 bg-white/[0.02] border border-white/5 rounded-[20px] sticky top-24">
                <div className="relative w-56 h-56 flex items-center justify-center my-6">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {particles.slice(0, 15).map((particle) => {
                      const x = Math.cos((particle.angle * Math.PI) / 180) * (particle.distance * 0.7);
                      const y = Math.sin((particle.angle * Math.PI) / 180) * (particle.distance * 0.7);
                      return (
                        <motion.div
                          key={`side-${particle.id}`}
                          className="absolute rounded-full"
                          style={{
                            width: particle.size * 0.8,
                            height: particle.size * 0.8,
                            backgroundColor: particle.id % 2 === 0 ? '#ec4899' : '#a855f7',
                          }}
                          animate={{ x: [x * 0.9, x * 1.1, x * 0.9], y: [y * 0.9, y * 1.1, y * 0.9], opacity: [0.2, 0.7, 0.2] }}
                          transition={{ duration: particle.duration, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      );
                    })}
                  </div>

                  <motion.div
                    animate={{ scale: isListening ? [1, 1.05, 1] : 1 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="relative w-40 h-40 rounded-full p-[2px] z-10 shadow-[0_0_40px_rgba(168,85,247,0.3)]"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: isListening ? 2 : 6, repeat: Infinity, ease: 'linear' }}
                      className={cn(
                        'absolute inset-0 rounded-full blur-[2px]',
                        isListening
                          ? 'bg-gradient-to-tr from-pink-500 via-red-500 to-pink-500'
                          : 'bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-600'
                      )}
                    />
                    <button
                      onClick={handleVoiceInput}
                      className="relative w-full h-full rounded-full bg-[#0d0a14] flex items-center justify-center group overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        {isListening ? (
                          <MicOff className="w-14 h-14 text-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)] animate-pulse" strokeWidth={1.5} />
                        ) : (
                          <Mic className="w-14 h-14 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] group-hover:text-pink-400 transition-colors" strokeWidth={1.5} />
                        )}
                      </motion.div>
                    </button>
                  </motion.div>
                </div>

                <h4 className="text-sm font-bold mt-2 text-white">
                  {isListening ? 'AURA is listening...' : awaitingClarification ? 'Waiting for details...' : 'Tap to Speak'}
                </h4>
                <p className="text-xs text-muted-foreground mt-2 text-center max-w-[200px] leading-relaxed">
                  {awaitingClarification
                    ? 'Please answer the question above to continue.'
                    : 'Speak naturally — tasks, events, ideas, or deletions.'}
                </p>

                {/* Clear history button */}
                {messages.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="mt-6 flex items-center gap-2 text-xs text-muted-foreground hover:text-danger transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear history
                  </button>
                )}
              </div>

              {/* Right: Chat messages */}
              <div className="lg:col-span-7 flex flex-col h-[calc(100vh-200px)] justify-between">
                <div className="flex-1 overflow-y-auto pr-1 scrollbar-hide space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn('flex w-full', message.type === 'user' ? 'justify-end' : 'justify-start')}
                    >
                      <GlassCard
                        className={cn(
                          'max-w-[85%] rounded-[20px] p-4',
                          message.type === 'user'
                            ? 'bg-purple-600/10 border-purple-500/20 text-white'
                            : awaitingClarification && message === messages[messages.length - 1]
                              ? 'bg-amber-500/5 border-amber-500/20'
                              : 'bg-white/[0.03] border-white/5'
                        )}
                        hover={false}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>

                        {/* Structured result display */}
                        {message.result && !message.result.clarificationNeeded && (
                          <div className="mt-3.5 pt-3.5 border-t border-white/5 space-y-4">

                            {/* Deleted tasks */}
                            {message.result.deletedTaskIds && message.result.deletedTaskIds.length > 0 && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-danger">
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Deleted ({message.result.deletedTaskIds.length})
                                </div>
                              </div>
                            )}

                            {/* Extracted Tasks */}
                            {message.result.tasks?.length > 0 && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Extracted Tasks ({message.result.tasks.length})
                                </div>
                                <div className="space-y-1.5">
                                  {message.result.tasks.map((t, i) => (
                                    <div key={i} className="flex items-center justify-between gap-3 bg-white/[0.02] border border-white/5 rounded-lg p-2.5">
                                      <span className="text-xs text-white truncate">{t.title}</span>
                                      {t.priority && (
                                        <span className={cn(
                                          'text-[9px] px-2 py-0.5 rounded-full capitalize font-semibold tracking-wider shrink-0',
                                          t.priority === 'high' ? 'bg-danger/10 text-danger border border-danger/20' :
                                          t.priority === 'medium' ? 'bg-warning/10 text-warning border border-warning/20' :
                                          'bg-white/5 text-muted-foreground border border-white/10'
                                        )}>
                                          {t.priority}
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Extracted Events */}
                            {message.result.events?.length > 0 && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                                  <Calendar className="w-3.5 h-3.5" />
                                  Scheduled Events ({message.result.events.length})
                                </div>
                                <div className="space-y-1.5">
                                  {message.result.events.map((e, i) => (
                                    <div key={i} className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5">
                                      <span className="text-xs text-white block truncate">{e.title}</span>
                                      <span className="text-[10px] text-muted-foreground mt-0.5 block">
                                        {e.date && `${e.date} `}{e.time && `at ${e.time}`}
                                        {e.durationMinutes && ` · ${e.durationMinutes}m`}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Extracted Notes */}
                            {message.result.notes?.length > 0 && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                                  <FileText className="w-3.5 h-3.5" />
                                  Saved Notes ({message.result.notes.length})
                                </div>
                                <div className="space-y-1">
                                  {message.result.notes.map((n, i) => (
                                    <p key={i} className="text-xs text-muted-foreground bg-white/[0.01] border border-white/[0.03] rounded-lg p-2 leading-relaxed">• {n.content}</p>
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
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                      <GlassCard className="flex items-center gap-2.5 rounded-full px-4 py-2" hover={false}>
                        <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                        <span className="text-xs font-medium text-muted-foreground">AURA is thinking...</span>
                      </GlassCard>
                    </motion.div>
                  )}

                  {awaitingClarification && !isProcessing && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                      <GlassCard className="flex items-center gap-2.5 rounded-full px-4 py-2 border-amber-500/20" hover={false}>
                        <Volume2 className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-medium text-amber-300">Waiting for your answer...</span>
                      </GlassCard>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input at bottom */}
                <div className="pt-4 pb-8">
                  <GlassCard className={cn(
                    'p-3 rounded-full',
                    awaitingClarification
                      ? 'bg-amber-500/5 border border-amber-500/20'
                      : 'bg-white/[0.02] border border-white/10'
                  )} hover={false}>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={awaitingClarification ? 'Answer AURA\'s question...' : 'Type or speak...'}
                        className="flex-1 bg-transparent border-0 outline-none placeholder:text-muted-foreground text-sm pl-3 text-white"
                      />
                      <button
                        onClick={handleVoiceInput}
                        disabled={isListening || isProcessing}
                        className={cn(
                          'w-9 h-9 rounded-full flex items-center justify-center shrink-0 active:scale-90 transition-all lg:hidden',
                          isListening ? 'bg-pink-500 text-white animate-pulse' : 'bg-white/5 text-muted-foreground hover:text-white'
                        )}
                      >
                        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={handleSend}
                        disabled={!input.trim() || isProcessing}
                        className={cn(
                          'w-9 h-9 rounded-full flex items-center justify-center shrink-0 active:scale-90 transition-all',
                          !input.trim() || isProcessing
                            ? 'opacity-40 cursor-not-allowed'
                            : awaitingClarification
                              ? 'bg-amber-500 text-white hover:bg-amber-400'
                              : 'bg-purple-600 text-white hover:bg-purple-500'
                        )}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </GlassCard>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      <BottomTabs />
    </div>
  );
}