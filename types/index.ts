export type TaskPriority = 1 | 2 | 3 | 4 | 5;
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'deferred';
export type TaskType = 'coding' | 'writing' | 'meeting' | 'creative' | 'admin' | 'habit' | 'other';
export type EnergyLevel = 'high' | 'medium' | 'low';
export type LocationContext = 'home' | 'office' | 'gym' | 'any';
export type AgentName = 'planner' | 'deadline' | 'research' | 'reflection' | 'focus';
export type AgentStatus = 'idle' | 'working' | 'idle' | 'error';
export type FocusPhase = 'work' | 'break' | 'longBreak';

export interface Task {
  taskId: string;
  content: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  deadline?: Date;
  estimatedMinutes: number;
  actualMinutes?: number;
  failureProbability: number;
  energyRequired: EnergyLevel;
  location: LocationContext;
  source: 'brain_dump' | 'manual' | 'recurring' | 'opportunity';
  parentGoalId?: string;
  recurringRule?: string;
  createdAt: Date;
  completedAt?: Date;
  scheduledSlots: Array<{ start: Date; end: Date; date: Date }>;
}

export interface Agent {
  name: AgentName;
  status: AgentStatus;
  currentAction?: string;
  progress?: number;
  lastActive?: Date;
  color: string;
  icon: string;
}

export interface ScheduleSlot {
  start: Date;
  end: Date;
  taskId?: string;
  title: string;
  type: 'task' | 'focus' | 'meeting' | 'break' | 'deadline';
  energyLevel?: EnergyLevel;
  location?: LocationContext;
  locked: boolean;
}

export interface Schedule {
  date: Date;
  slots: ScheduleSlot[];
  totalEnergy: number;
  compressed: boolean;
  version: number;
}

export interface FocusSession {
  sessionId: string;
  date: Date;
  pomodorosCompleted: number;
  totalMinutes: number;
  taskId?: string;
  interruptions: number;
  energyBefore?: number;
  energyAfter?: number;
  outcome: 'completed' | 'abandoned' | 'interrupted';
}

export interface Opportunity {
  opportunityId: string;
  slotStart: Date;
  slotEnd: Date;
  durationMinutes: number;
  suggestions: Array<{ taskId: string; title: string; type: TaskType; contextScore: number }>;
  status: 'pending' | 'accepted' | 'dismissed';
}

export interface WeeklyReport {
  reportId: string;
  weekStart: Date;
  weekEnd: Date;
  completedTasks: number;
  skippedTasks: number;
  totalFocusMinutes: number;
  habitStreaks: Record<string, number>;
  energyPatterns: Record<string, number>;
  failureTrends: Task[];
  productivityScore: number;
  recommendations: string[];
  generatedAt: Date;
  deliveredViaFcm: boolean;
}

export interface TimelineEvent {
  eventId: string;
  type: 'goal' | 'milestone' | 'achievement' | 'task_completed';
  title: string;
  description: string;
  date: Date;
  targetDate?: Date;
  progress: number;
  parentEventId?: string;
  level: 'life' | 'yearly' | 'quarterly' | 'weekly';
}

export interface User {
  userId: string;
  email: string;
  displayName: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
  onboardingComplete: boolean;
  lastActiveAt: Date;
}

export interface Personality {
  directness: number;
  empathy: number;
  humour: number;
  challengeLevel: number;
  customInstructions?: string;
}

export interface SurvivalChecklist {
  items: Task[];
  successProbability: number;
  pomodoroPlan: Array<{ task: Task; cycles: number }>;
  compressedSchedule: Schedule;
}