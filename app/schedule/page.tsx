'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TopAppBar } from '@/components/ui/top-app-bar';
import { GlassCard } from '@/components/ui/glass-card';
import { BottomTabs } from '@/components/ui/bottom-tabs';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';
import { Clock, Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface Event {
  id: string;
  time: string;
  duration: string;
  title: string;
  type: 'meeting' | 'review' | 'focus' | 'call' | 'other';
  color: string;
  description?: string;
}

export default function Schedule() {
  const [selectedDay, setSelectedDay] = useState(1); // Default to July 1st
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form states
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00');
  const [duration, setDuration] = useState('1h');
  const [type, setType] = useState<'meeting' | 'review' | 'focus' | 'call' | 'other'>('meeting');

  const daysOfWeek = [
    { name: 'Mon', num: 30, month: 'June' },
    { name: 'Tue', num: 1, month: 'July' },
    { name: 'Wed', num: 2, month: 'July' },
    { name: 'Thu', num: 3, month: 'July' },
    { name: 'Fri', num: 4, month: 'July' },
    { name: 'Sat', num: 5, month: 'July' },
    { name: 'Sun', num: 6, month: 'July' },
  ];

  const [events, setEvents] = useState<Event[]>([
    { id: '1', time: '9:00 AM', duration: '1h', title: 'Team Standup', type: 'meeting', color: 'border-purple-500 text-purple-400 bg-purple-500/5' },
    { id: '2', time: '11:30 AM', duration: '1.5h', title: 'Product Review', type: 'review', color: 'border-cyan-500 text-cyan-400 bg-cyan-500/5' },
    { id: '3', time: '2:00 PM', duration: '2h', title: 'Deep Work Session', type: 'focus', color: 'border-pink-500 text-pink-400 bg-pink-500/5' },
    { id: '4', time: '4:30 PM', duration: '1h', title: 'Client Call', type: 'call', color: 'border-indigo-500 text-indigo-400 bg-indigo-500/5' },
  ]);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    const [hrs, mins] = time.split(':');
    const hoursNum = parseInt(hrs);
    const ampm = hoursNum >= 12 ? 'PM' : 'AM';
    const formattedHrs = hoursNum % 12 || 12;
    const time12h = `${formattedHrs}:${mins} ${ampm}`;

    const colorMap = {
      meeting: 'border-purple-500 text-purple-400 bg-purple-500/5',
      review: 'border-cyan-500 text-cyan-400 bg-cyan-500/5',
      focus: 'border-pink-500 text-pink-400 bg-pink-500/5',
      call: 'border-indigo-500 text-indigo-400 bg-indigo-500/5',
      other: 'border-gray-500 text-gray-400 bg-gray-500/5',
    };

    const newEvent: Event = {
      id: Date.now().toString(),
      time: time12h,
      duration,
      title,
      type,
      color: colorMap[type],
    };

    setEvents(prev => [...prev, newEvent].sort((a, b) => a.time.localeCompare(b.time)));
    setTitle('');
    setShowAddModal(false);
    toast.success('Event scheduled successfully');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#FBFAFC] pb-32 relative overflow-x-hidden">
      {/* Background animates slowly behind */}
      <div className="fixed inset-0 z-0 h-screen w-screen opacity-30 pointer-events-none">
        <BackgroundGradientAnimation
          gradientBackgroundStart="rgb(8, 10, 20)"
          gradientBackgroundEnd="rgb(12, 12, 28)"
          firstColor="99, 102, 241"
          secondColor="59, 130, 246"
          thirdColor="6, 182, 212"
          fourthColor="236, 72, 153"
          fifthColor="168, 85, 247"
          interactive={false}
          size="60%"
          containerClassName="w-full h-full"
        />
      </div>

      <div className="relative z-10">
        <TopAppBar title="AURA" />

        <div className="max-w-6xl mx-auto px-4 md:px-8 mt-6">
        
        {/* CALENDAR MONTH HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white">July 2025</h2>
          </div>
          <div className="flex gap-1 bg-white/[0.03] border border-white/5 rounded-full p-1">
            <button className="p-1 rounded-full hover:bg-white/5"><ChevronLeft className="w-4 h-4 text-muted-foreground hover:text-white" /></button>
            <button className="p-1 rounded-full hover:bg-white/5"><ChevronRight className="w-4 h-4 text-muted-foreground hover:text-white" /></button>
          </div>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Calendar selector strip */}
          <div className="lg:col-span-4 bg-white/[0.01] border border-white/5 rounded-[20px] p-4">
            <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-4 px-1">Select Day</h3>
            
            {/* Horizontal strip on mobile, vertical list on desktop! */}
            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-hide">
              {daysOfWeek.map((day) => {
                const isSelected = selectedDay === day.num;
                return (
                  <button
                    key={day.num}
                    onClick={() => setSelectedDay(day.num)}
                    className={cn(
                      "flex-1 lg:flex-initial flex flex-row items-center justify-between min-w-[70px] lg:min-w-0 p-3 rounded-xl transition-all duration-300 border",
                      isSelected 
                        ? "bg-purple-600 text-white font-bold shadow-lg shadow-purple-500/25 border-purple-400"
                        : "text-muted-foreground border-white/5 bg-white/[0.02] hover:text-white hover:bg-white/[0.03]"
                    )}
                  >
                    <div className="flex flex-col lg:flex-row items-center gap-1.5 w-full justify-between">
                      <span className="text-[10px] uppercase font-semibold tracking-wider">{day.name}</span>
                      <span className="text-sm lg:text-base font-bold">{day.num}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Timeline Slot Cards */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between mb-1 px-1">
              <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Schedule List</h3>
              {selectedDay === 1 && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add item
                </button>
              )}
            </div>

            {selectedDay !== 1 ? (
              <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-white/10 rounded-[20px] bg-white/[0.01]">
                <AlertCircle className="w-8 h-8 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">No events scheduled for this day</p>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 px-5 py-2.5 rounded-full bg-purple-600 text-xs font-semibold hover:bg-purple-500 transition-all active:scale-95"
                >
                  Schedule Event
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                <AnimatePresence>
                  {events.map((event, i) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25, delay: i * 0.05 }}
                    >
                      <GlassCard className="p-4.5 rounded-[20px] flex items-center justify-between border-l-4 border-t-0 border-b-0 border-r-0" hover={true}>
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="shrink-0 bg-white/[0.03] rounded-xl p-2.5 border border-white/5 text-center">
                            <Clock className="w-4 h-4 text-purple-400 mx-auto" />
                            <span className="text-[10px] font-semibold text-muted-foreground block mt-1">{event.time}</span>
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-white truncate">{event.title}</h4>
                            <span className="text-[10px] text-muted-foreground block mt-0.5">{event.duration} duration</span>
                          </div>
                        </div>
                        
                        <span className={cn(
                          "text-[9px] px-2.5 py-0.5 rounded-full border uppercase tracking-wider font-semibold",
                          event.color
                        )}>
                          {event.type}
                        </span>
                      </GlassCard>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* ADD SCHEDULE MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", bounce: 0.15 }}
              className="w-full max-w-md bg-[#111827] border-t border-white/10 rounded-t-[28px] p-6 pb-12 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              <h3 className="text-lg font-bold text-white mb-6">New Schedule Entry</h3>
              
              <form onSubmit={handleAddEvent} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase block mb-1">Event Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Sync with team"
                    className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground uppercase block mb-1">Start Time</label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground uppercase block mb-1">Duration</label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="30m">30 min</option>
                      <option value="1h">1 hour</option>
                      <option value="1.5h">1.5 hours</option>
                      <option value="2h">2 hours</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase block mb-1">Category Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['meeting', 'review', 'focus', 'call', 'other'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={cn(
                          "py-2 rounded-lg text-xs capitalize border font-medium transition-all",
                          type === t
                            ? "bg-purple-600 text-white border-purple-500 shadow-md"
                            : "bg-[#0A0A0F] text-muted-foreground border-white/5 hover:border-white/10"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg mt-6 active:scale-95 transition-all text-sm"
                >
                  Create Schedule
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      </div>

      <BottomTabs />
    </div>
  );
}