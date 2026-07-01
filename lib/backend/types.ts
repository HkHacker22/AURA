import { z } from 'zod';

export const TaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  priority: z.enum(['high', 'medium', 'low']).optional(),
  estimatedMinutes: z.number().int().positive().optional(),
  tags: z.array(z.string()).optional(),
});

export const EventSchema = z.object({
  title: z.string().min(1).max(200),
  date: z.string().optional(),   // ISO 8601 date; may be absent during clarification
  time: z.string().optional(),
  durationMinutes: z.number().int().positive().optional(),
});

export const NoteSchema = z.object({
  content: z.string().min(1).max(2000),
});

export const BrainDumpResponseSchema = z.object({
  response: z.string(),
  tasks: z.array(TaskSchema),
  events: z.array(EventSchema),
  notes: z.array(NoteSchema),
  // Clarification flow: when true, ask clarificationQuestion before saving
  clarificationNeeded: z.boolean().optional(),
  clarificationQuestion: z.string().optional(),
  // Task deletion: IDs of existing tasks the user wants removed
  deletedTaskIds: z.array(z.string()).optional(),
});

export const PlanItemSchema = z.object({
  time: z.string(),
  title: z.string(),
  duration: z.number(),
  type: z.enum(['focus', 'meeting', 'break', 'admin', 'learning']),
});

export const PlannerResponseSchema = z.object({
  plan: z.array(PlanItemSchema),
  reasoning: z.string().optional(),
});

export const SaveMeResponseSchema = z.object({
  overloaded: z.boolean(),
  workloadScore: z.number().min(0).max(100),
  suggestedActions: z.array(z.string()),
  priorityAdjustments: z.array(z.object({
    taskId: z.string(),
    from: z.enum(['high', 'medium', 'low']),
    to: z.enum(['high', 'medium', 'low']),
    reason: z.string(),
  })).optional(),
});

export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
});

export const ChatResponseSchema = z.object({
  messages: z.array(ChatMessageSchema),
});

export const ResearchResponseSchema = z.object({
  summary: z.string(),
  keyFindings: z.array(z.string()),
  sources: z.array(z.string()).optional(),
});

export interface GenerationRequest {
  systemPrompt: string;
  userMessage: string;
  examples?: Array<{ role: string; content: string }>;
  schema?: z.ZodType<any>;
  temperature?: number;
  maxOutputTokens?: number;
}

export interface StreamChunk {
  text: string;
  done: boolean;
}

export interface ObservabilityLog {
  userId?: string;
  agentId: string;
  promptHash: string;
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  model: string;
  success: boolean;
  error?: string;
}
