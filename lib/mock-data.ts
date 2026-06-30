import { Task, Schedule, WeeklyReport, Agent } from '@/types';

export const agents: Agent[] = [
  {
    name: 'planner',
    status: 'working',
    currentAction: 'Optimizing daily schedule',
    progress: 75,
    color: 'bg-primary',
  },
  {
    name: 'deadline',
    status: 'working',
    currentAction: 'Scoring task probability',
    progress: 45,
    color: 'bg-danger',
  },
  {
    name: 'research',
    status: 'idle',
    color: 'bg-secondary',
  },
  {
    name: 'reflection',
    status: 'idle',
    color: 'bg-success',
  },
  {
    name: 'focus',
    status: 'idle',
    color: 'bg-purple-400',
  },
];

export const tasks: Task[] = [
  {
    taskId: '1',
    content: 'Design review with investor tomorrow at 3pm',
    type: 'meeting',
    priority: 1,
    status: 'pending',
    deadline: new Date('2026-06-27T15:00:00'),
    estimatedMinutes: 90,
    failureProbability: 0.72,
    energyRequired: 'high',
    location: 'office',
    source: 'brain_dump',
    createdAt: new Date(),
    scheduledSlots: [{
      start: new Date('2026-06-27T14:30:00'),
      end: new Date('2026-06-27T16:00:00'),
      date: new Date('2026-06-27'),
    }],
  },
  {
    taskId: '2',
    content: 'Finish Q3 budget spreadsheet',
    type: 'admin',
    priority: 2,
    status: 'pending',
    estimatedMinutes: 120,
    failureProbability: 0.88,
    energyRequired: 'medium',
    location: 'any',
    source: 'brain_dump',
    createdAt: new Date(),
    scheduledSlots: [{
      start: new Date('2026-06-27T18:00:00'),
      end: new Date('2026-06-27T20:00:00'),
      date: new Date('2026-06-27'),
    }],
  },
  {
    taskId: '3',
    content: 'Deep work on product architecture',
    type: 'coding',
    priority: 1,
    status: 'in_progress',
    estimatedMinutes: 180,
    failureProbability: 0.92,
    energyRequired: 'high',
    location: 'office',
    source: 'manual',
    createdAt: new Date(Date.now() - 86400000),
    scheduledSlots: [{
      start: new Date('2026-06-27T09:00:00'),
      end: new Date('2026-06-27T12:00:00'),
      date: new Date('2026-06-27'),
    }],
  },
];

export const schedule: Schedule = {
  date: new Date('2026-06-27'),
  slots: [
    {
      start: new Date('2026-06-27T09:00:00'),
      end: new Date('2026-06-27T12:00:00'),
      title: 'Deep work on product architecture',
      type: 'task',
      energyLevel: 'high',
      location: 'office',
      locked: false,
    },
    {
      start: new Date('2026-06-27T12:00:00'),
      end: new Date('2026-06-27T13:00:00'),
      title: 'Lunch Break',
      type: 'break',
      energyLevel: 'low',
      location: 'any',
      locked: true,
    },
    {
      start: new Date('2026-06-27T14:30:00'),
      end: new Date('2026-06-27T16:00:00'),
      title: 'Investor Design Review',
      type: 'meeting',
      energyLevel: 'high',
      location: 'office',
      locked: false,
    },
    {
      start: new Date('2026-06-27T18:00:00'),
      end: new Date('2026-06-27T20:00:00'),
      title: 'Q3 Budget Spreadsheet',
      type: 'task',
      energyLevel: 'medium',
      location: 'any',
      locked: false,
    },
  ],
  totalEnergy: 7.5,
  compressed: false,
  version: 1,
};

export const weeklyReport: WeeklyReport = {
  reportId: '2026-W26',
  weekStart: new Date('2026-06-20'),
  weekEnd: new Date('2026-06-26'),
  completedTasks: 28,
  skippedTasks: 4,
  totalFocusMinutes: 1240,
  habitStreaks: {
    exercise: 5,
    meditation: 12,
    reading: 3,
  },
  energyPatterns: {
    morning: 0.8,
    afternoon: 0.6,
    evening: 0.4,
  },
  failureTrends: [],
  productivityScore: 82,
  recommendations: [
    'Consider moving afternoon meetings to morning for better peak energy alignment',
    'Your focus sessions are 15% longer than average - keep this momentum',
  ],
  generatedAt: new Date(),
  deliveredViaFcm: true,
};