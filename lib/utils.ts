import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

export function getPriorityColor(priority: 1 | 2 | 3 | 4 | 5): string {
  const colors = {
    1: 'text-danger',
    2: 'text-orange-500',
    3: 'text-yellow-500',
    4: 'text-success',
    5: 'text-muted-foreground',
  };
  return colors[priority];
}

export function getPriorityBadgeColor(priority: 1 | 2 | 3 | 4 | 5): string {
  const colors = {
    1: 'bg-danger/20 text-danger',
    2: 'bg-orange-500/20 text-orange-500',
    3: 'bg-yellow-500/20 text-yellow-500',
    4: 'bg-success/20 text-success',
    5: 'bg-muted text-muted-foreground',
  };
  return colors[priority];
}

export function getAgentColor(agent: string): string {
  const colors: Record<string, string> = {
    planner: 'text-primary',
    deadline: 'text-danger',
    research: 'text-secondary',
    reflection: 'text-success',
    focus: 'text-purple-400',
  };
  return colors[agent] || 'text-muted-foreground';
}

export function getAgentBadgeColor(agent: string): string {
  const colors: Record<string, string> = {
    planner: 'bg-primary/20 text-primary',
    deadline: 'bg-danger/20 text-danger',
    research: 'bg-secondary/20 text-secondary',
    reflection: 'bg-success/20 text-success',
    focus: 'bg-purple-400/20 text-purple-400',
  };
  return colors[agent] || 'bg-muted text-muted-foreground';
}

import { EnergyLevel } from '@/types';

export function getEnergyColor(energy: EnergyLevel): string {
  const colors: Record<EnergyLevel, string> = {
    high: 'text-success',
    medium: 'text-yellow-500',
    low: 'text-danger',
  };
  return colors[energy];
}
