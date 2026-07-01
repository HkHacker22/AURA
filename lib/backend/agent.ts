import type { z } from 'zod';
import type { GenerationRequest, StreamChunk } from './types';
import { llmService } from './llm-service';

export interface AgentMeta {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  examples?: Array<{ role: string; content: string }>;
  outputSchema?: z.ZodType<any>;
}

export abstract class BaseAgent {
  abstract meta: AgentMeta;

  async process<T>(userMessage: string, userId?: string): Promise<T> {
    const req: GenerationRequest = {
      systemPrompt: this.meta.systemPrompt,
      userMessage,
      examples: this.meta.examples,
      schema: this.meta.outputSchema,
    };
    return llmService.generate<T>(req, { userId, agentId: this.meta.id });
  }

  async *streamProcess(userMessage: string, userId?: string): AsyncGenerator<StreamChunk> {
    const req: GenerationRequest = {
      systemPrompt: this.meta.systemPrompt,
      userMessage,
      examples: this.meta.examples,
    };
    yield* llmService.stream(req, { userId, agentId: this.meta.id });
  }
}
