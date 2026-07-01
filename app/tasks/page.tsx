'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TopAppBar } from '@/components/ui/top-app-bar';
import { GlassCard } from '@/components/ui/glass-card';
import { BottomTabs } from '@/components/ui/bottom-tabs';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';
import { CheckSquare, Trash2, X, Plus, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export default function Tasks() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'upcoming' | 'completed'>('all');
  const [showAddTask, setShowAddTask] = useState(false);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('Today');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const [taskList, setTaskList] = useState<Task[]>([
    { id: '1', title: 'Review PRD Document', dueDate: 'Today', priority: 'high', completed: false },
    { id: '2', title: 'Design System Updates', dueDate: 'Today', priority: 'medium', completed: false },
    { id: '3', title: 'User Research Session', dueDate: 'Tomorrow', priority: 'medium', completed: false },
    { id: '4', title: 'Prepare Pitch Deck', dueDate: 'Jul 3', priority: 'high', completed: false },
  ]);

  const toggleComplete = (id: string) => {
    setTaskList(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    const task = taskList.find(t => t.id === id);
    if (task && !task.completed) {
      toast.success(`Completed: ${task.title}`);
    }
  };

  const deleteTask = (id: string) => {
    setTaskList(prev => prev.filter(task => task.id !== id));
    toast.success('Task deleted');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Task title is required');
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      dueDate,
      priority,
      completed: false,
    };

    setTaskList(prev => [newTask, ...prev]);
    setTitle('');
    setShowAddTask(false);
    toast.success('Task created successfully');
  };

  const filteredTasks = taskList.filter(task => {
    if (activeFilter === 'completed') return task.completed;
    if (task.completed) return false;
    if (activeFilter === 'today') return task.dueDate.toLowerCase() === 'today';
    if (activeFilter === 'upcoming') return task.dueDate.toLowerCase() !== 'today';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#FBFAFC] pb-32 relative overflow-x-hidden">
      {/* Background animates slowly behind */}
      <div className="fixed inset-0 z-0 h-screen w-screen opacity-30 pointer-events-none">
        <BackgroundGradientAnimation
          gradientBackgroundStart="rgb(10, 8, 20)"
          gradientBackgroundEnd="rgb(16, 12, 26)"
          firstColor="139, 92, 246"
          secondColor="6, 182, 212"
          thirdColor="59, 130, 246"
          fourthColor="236, 72, 153"
          fifthColor="124, 58, 237"
          interactive={false}
          size="60%"
          containerClassName="w-full h-full"
        />
      </div>

      <div className="relative z-10">
        <TopAppBar title="AURA" />

      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Filter Sidebar on Desktop, Horizontal Strip on Mobile */}
          <div className="lg:col-span-4 bg-white/[0.01] border border-white/5 rounded-[20px] p-4">
            <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-4 px-1">Categories</h3>
            
            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-hide">
              {(['all', 'today', 'upcoming', 'completed'] as const).map((filter) => {
                const isActive = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={cn(
                      "flex-1 lg:flex-initial py-2.5 px-4 text-xs font-semibold capitalize rounded-xl transition-all duration-300 border text-center lg:text-left",
                      isActive 
                        ? "bg-purple-600 text-white shadow-lg border-purple-400"
                        : "text-muted-foreground border-white/5 bg-white/[0.02] hover:text-white hover:bg-white/[0.03]"
                    )}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Task List Cards */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between mb-1 px-1">
              <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Checklist</h3>
              <button
                onClick={() => setShowAddTask(true)}
                className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add task
              </button>
            </div>

            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredTasks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-white/10 rounded-[20px] bg-white/[0.01]"
                  >
                    <CheckSquare className="w-8 h-8 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">No tasks in this category</p>
                  </motion.div>
                ) : (
                  filteredTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <GlassCard className="p-4.5 rounded-[20px] flex items-center justify-between" hover={false}>
                        <div className="flex items-center gap-3.5 min-w-0">
                          
                          <button 
                            onClick={() => toggleComplete(task.id)}
                            className="shrink-0 text-muted-foreground hover:text-purple-400 active:scale-95 transition-all"
                          >
                            {task.completed ? (
                              <div className="w-5 h-5 rounded bg-purple-600 border border-purple-500 flex items-center justify-center text-white">
                                <Check className="w-3.5 h-3.5" strokeWidth={3} />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded border border-white/20 hover:border-purple-500 transition-colors" />
                            )}
                          </button>
                          
                          <div className="min-w-0">
                            <span className={cn(
                              "text-sm font-semibold block truncate leading-normal transition-all",
                              task.completed ? "line-through text-muted-foreground" : "text-white"
                            )}>
                              {task.title}
                            </span>
                            
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-muted-foreground font-medium">{task.dueDate}</span>
                              <span className="text-[8px] text-muted-foreground">•</span>
                              <span className={cn(
                                "text-[10px] font-semibold capitalize",
                                task.priority === 'high' ? 'text-danger' :
                                task.priority === 'medium' ? 'text-warning' : 'text-purple-400'
                              )}>
                                {task.priority} Priority
                              </span>
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => deleteTask(task.id)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-danger hover:bg-white/5 active:scale-90 transition-all shrink-0"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </GlassCard>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>

      {/* ADD TASK DIALOG */}
      <AnimatePresence>
        {showAddTask && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", bounce: 0.15 }}
              className="w-full max-w-md bg-[#111827] border-t border-white/10 rounded-t-[28px] p-6 pb-12 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowAddTask(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              <h3 className="text-lg font-bold text-white mb-6">Create New Task</h3>
              
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase block mb-1">Task Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Review designs"
                    className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground uppercase block mb-1">Due Date</label>
                    <select
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="Today">Today</option>
                      <option value="Tomorrow">Tomorrow</option>
                      <option value="Jul 3">July 3rd</option>
                      <option value="Jul 4">July 4th</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground uppercase block mb-1">Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg mt-6 active:scale-95 transition-all text-sm"
                >
                  Create Task
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
