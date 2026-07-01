import { Task, Agent } from '@/types';

// Matching Event interface from app/schedule/page.tsx
export interface CalendarEvent {
  id: string;
  date: string;      // ISO 8601 date string e.g. "2025-07-02"
  time: string;
  duration: string;
  title: string;
  type: 'meeting' | 'review' | 'focus' | 'call' | 'other';
  color: string;
  description?: string;
}

const TODAY = new Date().toISOString().split('T')[0];

const DEFAULT_TASKS: Task[] = [
  {
    taskId: '1',
    content: 'Review PRD Document',
    type: 'coding',
    priority: 1,
    status: 'pending',
    estimatedMinutes: 60,
    failureProbability: 0.1,
    energyRequired: 'medium',
    location: 'office',
    source: 'manual',
    createdAt: new Date(),
    scheduledSlots: [],
  },
  {
    taskId: '2',
    content: 'Design System Updates',
    type: 'creative',
    priority: 2,
    status: 'pending',
    estimatedMinutes: 90,
    failureProbability: 0.2,
    energyRequired: 'medium',
    location: 'office',
    source: 'manual',
    createdAt: new Date(),
    scheduledSlots: [],
  },
  {
    taskId: '3',
    content: 'User Research Session',
    type: 'creative',
    priority: 2,
    status: 'pending',
    estimatedMinutes: 120,
    failureProbability: 0.15,
    energyRequired: 'high',
    location: 'any',
    source: 'manual',
    createdAt: new Date(),
    scheduledSlots: [],
  },
  {
    taskId: '4',
    content: 'Prepare Pitch Deck',
    type: 'writing',
    priority: 1,
    status: 'pending',
    estimatedMinutes: 180,
    failureProbability: 0.3,
    energyRequired: 'high',
    location: 'home',
    source: 'manual',
    createdAt: new Date(),
    scheduledSlots: [],
  },
];

const DEFAULT_EVENTS: CalendarEvent[] = [
  { id: '1', date: TODAY, time: '9:00 AM', duration: '1h', title: 'Team Standup', type: 'meeting', color: 'border-purple-500 text-purple-400 bg-purple-500/5' },
  { id: '2', date: TODAY, time: '11:30 AM', duration: '1.5h', title: 'Product Review', type: 'review', color: 'border-cyan-500 text-cyan-400 bg-cyan-500/5' },
  { id: '3', date: TODAY, time: '2:00 PM', duration: '2h', title: 'Deep Work Session', type: 'focus', color: 'border-pink-500 text-pink-400 bg-pink-500/5' },
  { id: '4', date: TODAY, time: '4:30 PM', duration: '1h', title: 'Client Call', type: 'call', color: 'border-indigo-500 text-indigo-400 bg-indigo-500/5' },
];

const DEFAULT_AGENTS = [
  {
    name: 'planner',
    status: 'working',
    currentAction: 'Optimizing daily schedule',
    progress: 75,
    color: 'bg-primary',
    icon: 'calendar',
  },
  {
    name: 'deadline',
    status: 'working',
    currentAction: 'Scoring task probability',
    progress: 45,
    color: 'bg-danger',
    icon: 'clock',
  },
  {
    name: 'research',
    status: 'idle',
    color: 'bg-secondary',
    icon: 'search',
  },
  {
    name: 'reflection',
    status: 'idle',
    color: 'bg-success',
    icon: 'activity',
  },
  {
    name: 'focus',
    status: 'idle',
    color: 'bg-purple-400',
    icon: 'target',
  },
];

// --- Per-user key helpers ---
function tasksKey(userId?: string) {
  return userId ? `aura_tasks_${userId}` : 'aura_tasks';
}
function eventsKey(userId?: string) {
  return userId ? `aura_events_${userId}` : 'aura_events';
}
function chatKey(userId?: string) {
  return userId ? `aura_chat_${userId}` : 'aura_chat';
}

export { tasksKey, eventsKey, chatKey };

export function getTasks(userId?: string): Task[] {
  if (typeof window === 'undefined') return DEFAULT_TASKS;
  const key = tasksKey(userId);
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(DEFAULT_TASKS));
    return DEFAULT_TASKS;
  }
  try {
    const parsed = JSON.parse(stored);
    // Migration safeguard: reset if old data formats are loaded
    if (!Array.isArray(parsed) || parsed.some((t: any) => !t.taskId)) {
      localStorage.setItem(key, JSON.stringify(DEFAULT_TASKS));
      return DEFAULT_TASKS;
    }
    return parsed;
  } catch {
    return DEFAULT_TASKS;
  }
}

export function saveTasks(tasks: Task[], userId?: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(tasksKey(userId), JSON.stringify(tasks));
}

export function deleteTask(taskId: string, userId?: string): Task[] {
  const tasks = getTasks(userId).filter(t => t.taskId !== taskId);
  saveTasks(tasks, userId);
  return tasks;
}

export function getEvents(userId?: string): CalendarEvent[] {
  if (typeof window === 'undefined') return DEFAULT_EVENTS;
  const key = eventsKey(userId);
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(DEFAULT_EVENTS));
    return DEFAULT_EVENTS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_EVENTS;
  }
}

export function saveEvents(events: CalendarEvent[], userId?: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(eventsKey(userId), JSON.stringify(events));
}

export function deleteEvent(eventId: string, userId?: string): CalendarEvent[] {
  const events = getEvents(userId).filter(e => e.id !== eventId);
  saveEvents(events, userId);
  return events;
}

export function getAgents(): Agent[] {
  if (typeof window === 'undefined') return DEFAULT_AGENTS as unknown as Agent[];
  
  // Dynamically update based on system state
  const saveMeActive = localStorage.getItem('aura_save_me_active') === 'true';
  const brainDumpActive = localStorage.getItem('aura_brain_dump_active') === 'true';
  
  const base = DEFAULT_AGENTS;
  
  if (saveMeActive) {
    return base.map(a => {
      if (a.name === 'planner') return { ...a, status: 'working', currentAction: 'Deferring low priority items', progress: 95 };
      if (a.name === 'deadline') return { ...a, status: 'working', currentAction: 'Recalculating burnout timeline', progress: 90 };
      if (a.name === 'focus') return { ...a, status: 'working', currentAction: 'Crisis cooldown buffer active', progress: 80 };
      return { ...a, status: 'working', currentAction: 'Mitigating stress indicators', progress: 60 };
    }) as unknown as Agent[];
  }
  
  if (brainDumpActive) {
    return base.map(a => {
      if (a.name === 'planner') return { ...a, status: 'working', currentAction: 'Integrating brain dump scheduled items', progress: 85 };
      if (a.name === 'research') return { ...a, status: 'working', currentAction: 'Parsing brain dump content for tasks', progress: 90 };
      if (a.name === 'reflection') return { ...a, status: 'working', currentAction: 'Categorizing extracted action notes', progress: 75 };
      return a;
    }) as unknown as Agent[];
  }
  
  return base as unknown as Agent[];
}
